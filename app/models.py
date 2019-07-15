from flask import current_app, url_for
from flask_login import UserMixin, current_user
from sqlalchemy import update
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from hashlib import md5
from datetime import datetime, timedelta
from time import time
from app import db, login
from app.search import add_to_index, remove_from_index, query_index
import jwt, base64, json
import redis
import celery
import os


followers = db.Table('followers',
db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

project_likers = db.Table('project_likers',
db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True)
)

comment_likers = db.Table('comment_likers',
db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
db.Column('comment_id', db.Integer, db.ForeignKey('project_comments.id'), primary_key=True)
)

reply_likers = db.Table('reply_likers',
db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
db.Column('reply_id', db.Integer, db.ForeignKey('comment_replies.id'), primary_key=True)
)

project_visitors = db.Table('project_visitors',
db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
db.Column('last_visit_date', db.DateTime, default=datetime.utcnow),
db.Column('initial_visit_date', db.DateTime, default=datetime.utcnow)
)

blocked_users = db.Table('blocked_users',
db.Column('blocker_id', db.Integer, db.ForeignKey('user.id')),
db.Column('blocked_id', db.Integer, db.ForeignKey('user.id'))
)

deleted_messages = db.Table('deleted_messages',
db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
db.Column('message_id', db.Integer, db.ForeignKey('messages.id'))
)

chatlist_favorites = db.Table('chatlist_favorites',
db.Column('fav_id', db.Integer, db.ForeignKey('user.id')),
db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

class SearchableMixin(object):
    @classmethod
    def search(cls, expression, page, per_page):
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = []
        for i in range(len(ids)):
            when.append((ids[i], i))
        return cls.query.filter(cls.id.in_(ids)).order_by(
            db.case(when, value=cls.id)), total
    
    @classmethod
    def before_commit(cls, session):
        session._changes = {
            'add': list(session.new),
            'update': list(session.dirty),
            'delete': list(session.deleted)
        }
    
    @classmethod
    def after_commit(cls, session):
        for obj in session._changes['add']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes['update']:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes['delete']:
            if isinstance(obj, SearchableMixin):
                remove_from_index(obj.__tablename__, obj)
        session._changes = None

    @classmethod
    def reindex(cls):
        for obj in cls.query:
            add_to_index(cls.__tablename__, obj)

# LISTENS TO SQLALCHEMY CHANGES TO INVOKE ELASTICSEARCH INDEX CHANGES ACCORDINGLY
db.event.listen(db.session, 'before_commit', SearchableMixin.before_commit)
db.event.listen(db.session, 'after_commit', SearchableMixin.after_commit)


class PaginatedAPIMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }
        return data

class User(PaginatedAPIMixin, UserMixin, db.Model):
    __tablename__ = 'user'
    __searchable__ = ['bio']
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    firstname = db.Column(db.String(30))
    lastname = db.Column(db.String(30))
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(130))
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    bio = db.Column(db.Text(400))
    picture = db.Column(db.Text(500), default=None)
    verified = db.Column(db.Boolean, default=False)
    max_failed_login = db.Column(db.Integer)
    subscription = db.Column(db.String(20), default='free')
    auto_pay = db.Column(db.Boolean, default=False)
    # EMAIL NOTIFICATION SETTINGS
    msg_note = db.Column(db.Boolean, default=False)
    comment_note = db.Column(db.Boolean, default=False)
    reply_note = db.Column(db.Boolean, default=False)
    # TOKEN VARIABLES FOR API USE ONLY
    token = db.Column(db.String(50), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)
    # FOR CHAT FEATURE
    online = db.Column(db.Boolean, default=False)

    # ASSOCIATION TABLES
    followed = db.relationship('User', secondary=followers,
                                        primaryjoin=(followers.c.follower_id == id),
                                        secondaryjoin=(followers.c.followed_id == id),
                                        backref=db.backref('followers', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)
    projects_liked = db.relationship('Projects', secondary=project_likers,
                                            primaryjoin=(project_likers.c.user_id == id),
                                            backref=db.backref('likers', lazy='dynamic'),
                                            lazy='dynamic',
                                            passive_deletes=True)
    comments_liked = db.relationship('ProjectComments', secondary=comment_likers,
                                            primaryjoin=(comment_likers.c.user_id == id),
                                            backref=db.backref('likers', lazy='dynamic'),
                                            lazy='dynamic',
                                            passive_deletes=True)
    replies_liked = db.relationship('CommentReplies', secondary=reply_likers,
                                            primaryjoin=(reply_likers.c.user_id == id),
                                            backref=db.backref('likers', lazy='dynamic'),
                                            lazy='dynamic',
                                            passive_deletes=True)
    project_visited = db.relationship('Projects', secondary=project_visitors,
                                            primaryjoin=(project_visitors.c.user_id == id),
                                            backref=db.backref('visitor', lazy='dynamic'),
                                            lazy='dynamic',
                                            passive_deletes=True)
    blocked = db.relationship('User', secondary=blocked_users,
                                        primaryjoin=(blocked_users.c.blocker_id == id),
                                        secondaryjoin=(blocked_users.c.blocked_id == id),
                                        backref=db.backref('blocker', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)
    deleted_msgs = db.relationship('Messages', secondary=deleted_messages,
                                        primaryjoin=(deleted_messages.c.user_id == id),
                                        backref=db.backref('deleter', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)
    favored = db.relationship('User', secondary=chatlist_favorites,
                                        primaryjoin=(chatlist_favorites.c.fav_id == id),
                                        secondaryjoin=(chatlist_favorites.c.user_id == id),
                                        backref=db.backref('favorer', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)
    
    # RELATIONSHIPS TABLES
    message_sent = db.relationship('Messages',
                                    foreign_keys='Messages.sender_id',
                                    backref='author',
                                    lazy='dynamic')
    message_received = db.relationship('Messages',
                                        foreign_keys='Messages.recipient_id',
                                        backref='recipient', lazy='dynamic')
    all_projects = db.relationship('Projects',
                                    foreign_keys='Projects.user_id',
                                    backref='author', lazy='dynamic')
    all_comments = db.relationship('ProjectComments',
                                    foreign_keys='ProjectComments.user_id',
                                    backref='author', lazy='dynamic')
    all_replies = db.relationship('CommentReplies',
                                    foreign_keys='CommentReplies.user_id',
                                    backref='author', lazy='dynamic')
    notifications = db.relationship('Notifications', backref='user',
                                    lazy='dynamic')
    blog_posts = db.relationship('AdminBlogPosts',
                                    foreign_keys='AdminBlogPosts.user_id',
                                    backref='user',
                                    lazy='dynamic')

    # USER METHODS
    def create_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def verify_acct(self):
        self.verified = True

    def failed_login_counter(self):
        if self.max_failed_login is None:
            self.max_failed_login = 0
        self.max_failed_login += 1
        db.session.commit()

    def avatar(self, size):
        if (self.picture == None or self.picture == ''):
            digest = md5(self.email.lower().encode('utf-8')).hexdigest()
            return 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, size)
        return self.picture.format(size)

    def get_confirmation_token(self, expires_in=1209600):
        return jwt.encode({'secret_token': self.id, 'exp': time() + expires_in},
        current_app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
    
    def get_reset_password_token(self, expires_in=10800):
        return jwt.encode({'secret_token': self.id, 'exp': time() + expires_in},
        current_app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
    
    # FOR API USAGE
    def get_token(self, expires_in=300):
        now = datetime.utcnow()
        if self.token and self.token_expiration >= now:
            return self.token
        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        print('TOKEN REFRESHED!!!!!!!!!!!')
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    # GENERAL FEATURES
    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).count() > 0

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
    
    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_blocking(self, user):
        return self.blocked.filter(blocked_users.c.blocked_id == user.id).count() > 0

    def block(self, user):
        if not self.is_blocking(user):
            self.blocked.append(user)
    
    def unblock(self, user):
        if self.is_blocking(user):
            self.blocked.remove(user)

    def is_liking_project(self, project):
        return Projects.query.join(project_likers).join(User).filter(project_likers.c.user_id == self.id).filter(project_likers.c.project_id == project.id).count() > 0

    def like_project(self, project):
        if not self.is_liking_project(project):
            self.projects_liked.append(project)
    
    def unlike_project(self, project):
        if self.is_liking_project(project):
            self.projects_liked.remove(project)

    def is_liking_comment(self, project_comment):
        return ProjectComments.query.join(comment_likers).join(User).filter(comment_likers.c.user_id == self.id).filter(comment_likers.c.comment_id == project_comment.id).count() > 0

    def like_comment(self, project_comment):
        if not self.is_liking_comment(project_comment):
            self.comments_liked.append(project_comment)
    
    def unlike_comment(self, project_comment):
        if self.is_liking_comment(project_comment):
            self.comments_liked.remove(project_comment)

    def is_liking_reply(self, project_reply):
        return CommentReplies.query.join(reply_likers).join(User).filter(reply_likers.c.user_id == self.id).filter(reply_likers.c.reply_id == project_reply.id).count() > 0

    def like_reply(self, project_reply):
        if not self.is_liking_reply(project_reply):
            self.replies_liked.append(project_reply)
    
    def unlike_reply(self, project_reply):
        if self.is_liking_reply(project_reply):
            self.replies_liked.remove(project_reply)

    def is_deleted(self, msg):
        return Messages.query \
                        .join(deleted_messages) \
                        .join(User) \
                        .filter(deleted_messages.c.user_id == self.id) \
                        .filter(deleted_messages.c.message_id == msg.id) \
                        .count() > 0

    def delete_msg(self, msg):
        if not self.is_deleted(msg):
            self.deleted_msgs.append(msg)
    
    def undelete_msg(self, msg):
        if self.is_deleted(msg):
            self.deleted_msgs.remove(msg)

    def is_favoring(self, user):
        return self.favored.filter(chatlist_favorites.c.user_id == user.id).count() > 0

    def favor(self, user):
        if not self.is_favoring(user):
            self.favored.append(user)
    
    def unfavor(self, user):
        if self.is_favoring(user):
            self.favored.remove(user)

    def project_visits(self, project):
        if not (Projects.query.join(project_visitors).join(User).filter(project_visitors.c.user_id == self.id).filter(project_visitors.c.project_id == project.id).count() > 0):
            self.project_visited.append(project)
            db.session.commit()
            return
        update_last_visit = update(project_visitors, project_visitors.c.project_id == project.id)
        # DO NOT NEED TO MANUALLY CREATE ENGINE AND CONNECT TO DB WHEN 'db' HAS BEEN INITIALIZED ALREADY
        # connection = db.engine.connect()
        # connection.execute(u, {'last_visit_date': now1})

        now = datetime.utcnow()
        db.session.execute(update_last_visit, {
            'last_visit_date': now
            })
        db.session.commit()

    def add_notification(self, notification_type, data):
        self.notifications.filter_by(notification_type=notification_type).delete()
        n = Notifications(notification_type=notification_type,
                            payload_json=json.dumps(data),
                            user=self)
        db.session.add(n)
        return n

    # FOR API PURPOSES ONLY
    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username,
            'last_seen': self.last_seen.isoformat() + 'Z',
            'bio': self.bio,
            'online': self.online,
            'follower_count': self.followers.count(),
            '_links': {
                'self': url_for('api.get_user', id=self.id),
                'followers': url_for('api.get_followers', id=self.id),
                'avatar': self.avatar(70)
            }
        }
        if include_email:
            data['email'] = self.email
        return data
    
    def from_dict(self, data, new_user=False):
        for field in ['username', 'email', 'bio', 'firstname', 'lastname', 'picture']:
            if field in data:
                setattr(self, field, data[field])
                # SAME AS 'data[field] = field'
        
        if new_user and 'password' in data:
            self.create_password(data['password'])


    def __repr__(self):
        return '<User {}>'.format(self.username)

    @classmethod
    def single_user(cls, username):
        return cls.query \
                    .filter_by(username=username) \
                    .first_or_404()

    # EXTRACTING THE UNIQUE USER'S ID FROM THE EMAIL TOKEN'S PAYLOAD FOR EMAIL CONFIRMATION USAGE
    @staticmethod
    def verify_email_token(token):
        try:
            id = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])['secret_token']
        except:
            return
        return User.query.get(id)
    
    # CHECK IF TOKEN STORED IN DB IS STILL VALID FOR API USAGE
    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user

    @staticmethod
    def token_renewal(token):
        user = User.query.filter_by(token=token).first()
        if user:
            now = datetime.utcnow()
            token_expiration = user.token_expiration
            grace_period = timedelta(minutes=10)
            print('attempting to renew token..')
            if (abs(token_expiration - now) <= grace_period):
                print('renewed token!!')
                user.get_token()
                db.session.commit()
                return user
        return None

class Messages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    subject = db.Column(db.String(50), index=True)
    body = db.Column(db.String(1500))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    message_read = db.Column(db.Boolean, index=True, default=False)
    
    # ASSOCIATION TABLE
    deleted_msgs = db.relationship('User', secondary=deleted_messages,
                                    primaryjoin=(deleted_messages.c.message_id == id),
                                    backref=db.backref('message', lazy='dynamic'),
                                    lazy='dynamic',
                                    passive_deletes=True)

    def __repr__(self):
        return '<Message {}>'.format(self.subject)


class ChatMessages(db.Model):
    __tablename__ = 'chat_history'
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(10), index=True)
    username = db.Column(db.String(64), index=True)
    avatar = db.Column(db.String(200))
    message = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    message_read = db.Column(db.Boolean, index=True, default=False)

    def __repr__(self):
        return '<Chat Message {}>'.format(self.message)

class Projects(SearchableMixin, db.Model):
    __searchable__ = ['title', 'description', 'tutorial']
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True)
    title = db.Column(db.String(40), index=True, default='Untitled World')
    description = db.Column(db.String(300), index=True)
    itemlist_enabled = db.Column(db.Boolean, default=False)
    difficulty = db.Column(db.Integer)
    cost = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    tutorial = db.Column(db.Text(100000))
    tutorial_enabled = db.Column(db.Boolean, default=False)
    maintenance = db.Column(db.Text(100000))
    maintenance_enabled = db.Column(db.Boolean, default=False)
    video = db.Column(db.String(220))
    created_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    last_edit = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    last_update_type = db.Column(db.String, index=True)
    likes = db.Column(db.Integer, default=0)
    private = db.Column(db.Boolean, index=True, default=False)
    # TAGS
    aquariums = db.Column(db.Boolean, index=True, default=False)
    saltwater = db.Column(db.Boolean, index=True, default=False)
    freshwater = db.Column(db.Boolean, index=True, default=False)
    terrariums = db.Column(db.Boolean, index=True, default=False)
    enclosedtropical = db.Column(db.Boolean, index=True, default=False)
    opentropical = db.Column(db.Boolean, index=True, default=False)
    carnivorous = db.Column(db.Boolean, index=True, default=False)
    desert = db.Column(db.Boolean, index=True, default=False)
    reptiles = db.Column(db.Boolean, index=True, default=False)
    vivariumpaludarium = db.Column(db.Boolean, index=True, default=False)
    waterreptiles = db.Column(db.Boolean, index=True, default=False)
    plantsonly = db.Column(db.Boolean, index=True, default=False)
    # NOTIFICATION PURPOSES ONLY
    commentsAndReplies_last_read = db.Column(db.DateTime, index=True, default=(datetime(1900, 1, 1)))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # TABLE RELATIONSHIPS
    photo_gallery = db.relationship('PhotoGallery',
                                    foreign_keys='PhotoGallery.project_id',
                                    backref='projects',
                                    lazy='dynamic')
    item_list = db.relationship('Itemlist',
                                    foreign_keys='Itemlist.project_id',
                                    backref='projects',
                                    lazy='dynamic')
    project_comments = db.relationship('ProjectComments',
                                    foreign_keys='ProjectComments.project_id',
                                    backref='projects',
                                    lazy='dynamic')
    comment_replies = db.relationship('CommentReplies',
                                    foreign_keys='CommentReplies.project_id',
                                    backref='projects',
                                    lazy='dynamic')
    faqs = db.relationship('FAQs',
                            foreign_keys='FAQs.project_id',
                            backref='projects',
                            lazy='dynamic')
    # ASSOCIATION RELATIONSHIPS
    users_liked = db.relationship('User', secondary=project_likers,
                                        primaryjoin=(project_likers.c.project_id == id),
                                        backref=db.backref('projects', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)
    users_visited = db.relationship('User', secondary=project_visitors,
                                        primaryjoin=(project_visitors.c.project_id == id),
                                        backref=db.backref('projectvisited', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)


    # FOR API PURPOSES ONLY
    def to_dict(self, include_project_profile=False, include_project_feed=False):
        data = {
            'username': self.username,
            'title': self.title,
            'description': self.description,
            'difficulty': self.difficulty,
            'cost': self.cost,
            'duration': self.duration,
            'likes': self.likes,
            'tags': {
                'aquariums': self.aquariums,
                'saltwater': self.saltwater,
                'freshwater': self.freshwater,
                'terrariums': self.terrariums,
                'enclosedtropical': self.enclosedtropical,
                'opentropical': self.opentropical,
                'carnivorous': self.carnivorous,
                'desert': self.desert,
                'reptiles': self.reptiles,
                'vivariumpaludarium': self.vivariumpaludarium,
                'waterreptiles': self.waterreptiles,
                'plantsonly': self.plantsonly
            },
            '_links': {
                'self': url_for('api_user.get_project', id=self.id),
            }
        }
        if include_project_profile:
            data['tutorial'] = self.tutorial
            data['tutorial_enabled'] = self.tutorial_enabled
            data['maintenance'] = self.maintenance
            data['maintenance_enabled'] = self.maintenance_enabled
            data['item_list'] = self.item_list
            data['itemlist_enabled'] = self.itemlist_enabled
            data['last_edit'] = self.last_edit
            data['video'] = self.video
        if include_project_feed:
            data['last_update'] = self.last_update_type
        return data
    
    def from_dict(self, data, new_project=False):
        for field in ['username', 'title', 'description', 'difficulty', 'cost', 'duration', 'likes']:
            if field in data:
                setattr(self, field, data[field])
                # SAME AS 'data[field] = field'
        
        if new_project:
            self.created_date = datetime.utcnow()


    def __repr__(self):
        return '<Project {}>'.format(self.title)

    # QUERY METHODS
    @classmethod
    def single_project(cls, user_id, title):
        return cls.query \
                    .filter_by(user_id= user_id) \
                    .filter_by(title=title) \
                    .first()


class Itemlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True)
    title = db.Column(db.String(40), index=True)
    itemname = db.Column(db.String(100))
    itemlink = db.Column(db.String(1500))
    itembrand = db.Column(db.String(30))
    quantity = db.Column(db.Integer)
    notes = db.Column(db.String(250))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))


class PhotoGallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, index=True)
    photoOne = db.Column(db.String(500))
    photoTwo = db.Column(db.String(500))
    photoThree = db.Column(db.String(500))
    photoFour = db.Column(db.String(500))
    photoFive = db.Column(db.String(500))
    photoSix = db.Column(db.String(500))
    photoSeven = db.Column(db.String(500))
    photoEight = db.Column(db.String(500))
    photoNine = db.Column(db.String(500))
    photoTen = db.Column(db.String(500))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    def __repr__(self):
        return '<Photo Gallery for {}>'.format(self.title)

    @classmethod
    def single_gallery(cls, project_id):
        return cls.query \
                    .filter_by(project_id=project_id) \
                    .first()


class ProjectComments(db.Model):
    __tablename__ = 'project_comments'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, index=True)
    username = db.Column(db.String(64), index=True)
    comment = db.Column(db.String(400))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    # RELATIONSHIP TABLE
    comment_replies = db.relationship('CommentReplies',
                                    foreign_keys='CommentReplies.project_comment_id',
                                    backref='projectcomments',
                                    lazy='dynamic')
    # ASSOCIATION TABLE
    users_liked = db.relationship('User', secondary=comment_likers,
                                        primaryjoin=(comment_likers.c.comment_id == id),
                                        backref=db.backref('projectcomments', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)

    def __repr__(self):
        return '<Project Comment for {}>'.format(self.title)

    @classmethod
    def singleProj_allCommentsDesc(cls, project_id):
        return cls.query \
                    .filter_by(project_id=project_id) \
                    .order_by(cls.timestamp.desc()) \
                    .all()


class CommentReplies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, index=True)
    username = db.Column(db.String(64), index=True)
    reply = db.Column(db.String(400))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    # WHEN CREATING FOREIGN KEYS, YOU MUST USE '_' BETWEEN EACH CAPITALIZED LETTER FOR MULTIWORD TABLES
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project_comment_id = db.Column(db.Integer, db.ForeignKey('project_comments.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # ASSOCIATION TABLE
    users_liked = db.relationship('User', secondary=reply_likers,
                                        primaryjoin=(reply_likers.c.reply_id == id),
                                        backref=db.backref('projectreplies', lazy='dynamic'),
                                        lazy='dynamic',
                                        passive_deletes=True)

    def __repr__(self):
        return '<Comment Reply for {}>'.format(self.title)

    @classmethod
    def allRepliesAsc(cls, title=title, project_id=project_id):
        return cls.query \
                    .filter_by(project_id=project_id) \
                    .filter_by(title=title) \
                    .order_by(cls.timestamp.asc()) \
                    .all()


class FAQs(db.Model):
    __tablename__ = 'FAQs'
    __searchable__ = ['question1', 'answer1',
                    'question2', 'answer2',
                    'question3', 'answer3',
                    'question4', 'answer4',
                    'question5', 'answer5',
                    'question6', 'answer6',
                    'question7', 'answer7',
                    'question8', 'answer8',
                    'question9', 'answer9',
                    'question10', 'answer10']
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True)
    title = db.Column(db.String(100), index=True)
    faqenabled = db.Column(db.Boolean, index=True, default=False)

    question1 = db.Column(db.String(200), index=True, default=None)
    answer1 = db.Column(db.String(500), index=True, default=None)
    enabled1 = db.Column(db.Boolean, default=False)
    question2 = db.Column(db.String(200), index=True, default=None)
    answer2 = db.Column(db.String(500), index=True, default=None)
    enabled2 = db.Column(db.Boolean, default=False)
    question3 = db.Column(db.String(200), index=True, default=None)
    answer3 = db.Column(db.String(500), index=True, default=None)
    enabled3 = db.Column(db.Boolean, default=False)
    question4 = db.Column(db.String(200), index=True, default=None)
    answer4 = db.Column(db.String(500), index=True, default=None)
    enabled4 = db.Column(db.Boolean, default=False)
    question5 = db.Column(db.String(200), index=True, default=None)
    answer5 = db.Column(db.String(500), index=True, default=None)
    enabled5 = db.Column(db.Boolean, default=False)
    question6 = db.Column(db.String(200), index=True, default=None)
    answer6 = db.Column(db.String(500), index=True, default=None)
    enabled6 = db.Column(db.Boolean, default=False)
    question7 = db.Column(db.String(200), index=True, default=None)
    answer7 = db.Column(db.String(500), index=True, default=None)
    enabled7 = db.Column(db.Boolean, default=False)
    question8 = db.Column(db.String(200), index=True, default=None)
    answer8 = db.Column(db.String(500), index=True, default=None)
    enabled8 = db.Column(db.Boolean, default=False)
    question9 = db.Column(db.String(200), index=True, default=None)
    answer9 = db.Column(db.String(500), index=True, default=None)
    enabled9 = db.Column(db.Boolean, default=False)
    question10 = db.Column(db.String(200), index=True, default=None)
    answer10 = db.Column(db.String(500), index=True, default=None)
    enabled10 = db.Column(db.Boolean, default=False)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    def __repr__(self):
        return '<FAQ for {}'.format(self.title)


class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    notification_type = db.Column(db.String(128), index=True)
    username = db.Column(db.String(64), index=True)
    title = db.Column(db.String(100), index=True)
    data = db.Column(db.String(150))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Notification type: {} from {}>'.format(self.notification_type, self.username)
    
    @classmethod
    def get_notification_number(cls):
        return cls.query.filter_by(user=current_user).count()


class AdminBlogPosts(db.Model):
    id = db.Column(db.Integer, primary_key=True, index=True)
    username = db.Column(db.String(64), index=True)
    title = db.Column(db.String(500), index=True)
    body = db.Column(db.String(5000), index=True)
    url = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Blog Post: {}'.format(self.title)


#FLASK-LOGIN LOADS EACH USER INTO ITS SESSION
@login.user_loader
def load_user(id):
    return User.query.get(int(id))