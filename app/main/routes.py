from flask import render_template, redirect, url_for, request, flash, g, current_app, jsonify, Response, send_from_directory, session
from flask_login import current_user, login_required, logout_user
from flask_babel import get_locale, _
from flask_wtf.csrf import generate_csrf
from datetime import datetime as dt, timedelta
from urllib.parse import urlparse
from math import sqrt
from hashlib import md5
from app import db, mail, socketio, csrf
from app.models import User, Messages, ChatMessages, Projects, PhotoGallery, Notifications, project_visitors, followers, deleted_messages
from app.main import bp
from app.main.forms import EditProfileForm, MessageForm, SearchForm
from app.project.forms import ProjectForm
from app.email import send_notification_email, send_email
from app.schema import schema
from sqlalchemy import and_, desc
from werkzeug.urls import url_parse
from werkzeug.datastructures import MultiDict
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from flask_mail import Message
from flask_socketio import send, emit, disconnect, join_room, leave_room
import os, shutil, time, random, functools
import json
import celery
import stripe


@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = dt.utcnow()
        db.session.commit()
    g.search_form = SearchForm()
    g.locale = str(get_locale())



@bp.route('/testingreact')
def testingreact():
    return render_template('react-index.html')

@bp.route('/testingtemp')
def testingtemp():
    return render_template('index2.html')


@bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = User.query.filter_by(username=username).first()
    if user:
        form = MessageForm()
        project_list = user.all_projects \
                        .order_by(Projects.last_edit.desc()) \
                        .all()
        # CAN USE BACKREF IN 'FOLLOWED' TO FIND ALL FOLLOWERS
        all_followers = user.followers.all()
        return render_template('profile.html',
                                form=form,
                                user=user,
                                projects=project_list,
                                followers=all_followers)
    return redirect(url_for('auth.homepage'))

@bp.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(original_email=current_user.email)
    form.username.data = current_user.username
    if form.validate_on_submit():
        current_user.firstname = form.firstname.data
        current_user.lastname = form.lastname.data
        current_user.email = form.email.data
        current_user.bio = form.bio.data
        
        if len(form.password.data) >= 5:
            current_user.create_password(form.password.data)
        if form.picture.data:
            # CHECKS IF LINK IS REAL
            check_link = urlparse(form.picture.data)
            if check_link.scheme and check_link.netloc:
                current_user.picture = form.picture.data
        if form.randomavatar.data == True:
            i=0
            randomWords=""
            while i<100:
                i+=1    
                liste = [random.randint(97, 122) for i in range(8)]
                osman=''.join(chr(x) for x in liste)
                randomWords+=osman+" "
            digest = md5(randomWords.lower().encode('utf-8')).hexdigest()
            current_user.picture = 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, 70)
        elif form.picture.data == '':
            current_user.picture = ''

        db.session.commit()
        flash('You new account changes have been updated!')
        return redirect(url_for('main.edit_profile'))
    elif request.method == 'GET':
        form.firstname.data = current_user.firstname
        form.lastname.data = current_user.lastname
        form.email.data = current_user.email
        form.bio.data = current_user.bio
        form.picture.data = current_user.picture
    return render_template('profile-edit.html', form=form)

@bp.route('/project_preview/<project_id>')
def project_preview(project_id):
    project = Projects.query.filter_by(id=project_id).first()
    if project:
        # ADD INTERACTIVE PHOTO LATER TO PROJECT_DETAILS
        project_details = {'description': project.description, 'difficulty': project.difficulty, 'cost': project.cost, 'duration': project.duration}
    return jsonify(project_details)

@bp.route('/privacy')
@login_required
def privacy():
    # REMOVED - REACTJS & GRAPHQL REPLACED JINJA2 HERE
    #blocked_users = current_user.blocked.all()
    
    return render_template('privacy.html')

@bp.route('/delete_acct', methods=['POST'])
@login_required
def delete_acct():
    user = User.query.get(current_user.id)
    approval = request.json['confirmation']
    print(approval)
    if approval:
        projects = Projects.query.filter_by(user_id=user.id).all()
        if projects:
            for project in projects:
                photo_gallery = project.photo_gallery.first()
                project_faqs = project.faqs.first()
                project_itemlist = project.item_list.all()
                project_comments = project.project_comments.all()
                project_replies = project.comment_replies.all()
                
                # REMOVING PROJECT AND ALL RELATED TABLES
                db.session.delete(project)
                db.session.delete(photo_gallery)
                db.session.delete(project_faqs)
                if project_itemlist:
                    for eachitem in project_itemlist:
                        db.session.delete(eachitem)
                if project_comments:
                    for eachcomment in project_comments:
                        db.session.delete(eachcomment)
                if project_replies:
                    for eachreply in project_replies:
                        db.session.delete(eachreply)
        
        messages = Messages.query.filter_by(recipient_id=user.id).all()
        if messages:
            for message in messages:
                db.session.delete(message)
        
        notifications = Notifications.query.filter_by(user_id=user.id).all()
        if notifications:
            for eachnote in notifications:
                db.session.delete(eachnote)
        
        # REMOVING MAIN USER DIRECTORY WITH ALL PROJECTS AND IMAGES
        file_path = current_app.config['PHOTO_UPLOAD_DIR']
        if os.path.isdir(file_path + '/' + user.username):
            # shutil IS REQUIRED TO REMOVE ALL FILES AND SUBDIRECTORIES WITHIN A DIRECTORY. rmdir only removes when empty
            shutil.rmtree(file_path + '/' + user.username)
        logout_user()
        db.session.delete(user)
        db.session.commit()
        return jsonify('Account successfully deleted!')
    return jsonify('something failed')

@bp.route('/email_notifications', methods=['POST'])
@login_required
def email_notifications():
    settings = request.json
    user = current_user
    if settings:
        user.msg_note = settings['msg']
        user.comment_note = settings['comment']
        user.reply_note = settings['reply']

        db.session.commit()

        return jsonify(settings)
    
    return jsonify('Unable to save email notification settings')

"""
@bp.route('/view_followers/<username>', methods=['GET'])
def view_followers(username):
    user = User.single_user(username)
    if user:
        all_followers = User.query \
                            .join(followers, followers.c.followed_id == user.id) \
                            .filter(followers.c.follower_id == User.id) \
                            .all()
        data = []
        for follower in all_followers:
            data.append(follower.username)
        return jsonify(data)
    return redirect(url_for('auth.homepage'))
"""

@bp.route('/message_inbox')
@login_required
def message_inbox():
    form = MessageForm()
    page = request.args.get('page', 1, type=int)
    messages = Messages.query \
                    .filter(Messages.recipient_id == current_user.id) \
                    .group_by(Messages.subject) \
                    .order_by(Messages.timestamp.desc()) \
                    .paginate(page, current_app.config['MESSAGES_PER_PAGE'], False)
    next_url = url_for('main.message_inbox_list', page=messages.next_num) if messages.has_next else None
    prev_url = url_for('main.message_inbox_list', page=messages.prev_num) if messages.has_prev else None

    del_messages = Messages.query \
                        .join(deleted_messages) \
                        .filter((Messages.recipient_id == current_user.id) | (Messages.sender_id == current_user.id)) \
                        .filter(deleted_messages.c.user_id == current_user.id) \
                        .filter(deleted_messages.c.message_id == Messages.id)
    # GROUPING AND ORGANIZING DELETED MSGS
    del_messages_group = del_messages.group_by(Messages.subject) \
                        .order_by(Messages.timestamp.desc()) \
                        .all()
    
    # EXTRACTING DELETED MSG'S ID TO USE TO FILTER ALL MSGS
    deleted_msgs_id = []
    for eachmsg in del_messages:
        deleted_msgs_id.append(eachmsg.id)
    
    # FIRST FILTER - REMOVING ALL DELETED MESSAGES FROM LIST
    all_messages = messages.items
    for del_id in deleted_msgs_id:
        all_messages[:] = [msg for msg in all_messages if not del_id == msg.id]

    # SECOND FILTER - REMOVING ALL BLOCKED USERS' MESSAGES
    blocked_users = current_user.blocked.all()
    if blocked_users and all_messages:
        for blocked_user in blocked_users:
            # NEED TO SLICE PYTHON LIST TO ITERATE AND REMOVE ITEMS. CANNOT 'REMOVE' DURING ITERATION AS IT MUTATES LIST DURING
            all_messages[:] = [msg for msg in all_messages if not msg.sender_id == blocked_user.id]      

    return render_template('message-center.html', form=form,
                            messages=all_messages,
                            del_messages=del_messages_group,
                            next_url=next_url,
                            prev_url=prev_url)

@bp.route('/view_message/<sender_username>/<msg_id>', methods=['GET', 'POST'])
@login_required
def view_message(sender_username, msg_id):
    msg_sender = User.query.filter_by(username=sender_username).first()
    msg_from_id = Messages.query.filter_by(id=msg_id).first()
    msg_sender_id = msg_sender.id
    msg_subj = msg_from_id.subject
    
    all_msg_received = Messages.query \
                    .filter(Messages.subject == msg_subj) \
                    .filter((Messages.sender_id == msg_sender_id) | (Messages.recipient_id == current_user.id))
    all_msg_sent = Messages.query \
                            .filter(Messages.subject == msg_subj) \
                            .filter((Messages.sender_id == current_user.id) | (Messages.recipient_id == msg_sender_id))
    all_msgs = all_msg_received.union(all_msg_sent) \
                                .order_by(Messages.timestamp.desc()) \
                                .all()
    
    if all_msgs:
        other_user = User.query.get(int(msg_sender_id))
        other_user_avatar = other_user.avatar(50)
        form = MessageForm()
        page = request.args.get('page', 1, type=int)

        # 'messages' IS TO POPULATE THE MESSAGE LIST UPON RENDERING NEW PAGE
        messages = current_user.message_received.group_by(Messages.subject).order_by(
                Messages.timestamp.desc()).paginate(
                    page, current_app.config['MESSAGES_PER_PAGE'], False)
        next_url = url_for('main.message_inbox_list', page=messages.next_num) if messages.has_next else None
        prev_url = url_for('main.message_inbox_list', page=messages.prev_num) if messages.has_prev else None
        
        # THIS MARKS THE MESSAGES AS READ WHEN CLICKED ON
        unmarked_msgs = all_msg_received.all()
        for unmarked_msg in unmarked_msgs:
            if unmarked_msg.message_read != True:
                unmarked_msg.message_read = True
                db.session.commit()

        # UPDATES NOTIFICATIONS
        read_msgs = Notifications.query \
                                .filter_by(user_id=current_user.id) \
                                .filter((Notifications.notification_type == 'message') | (Notifications.notification_type == 'message reply')) \
                                .filter(Notifications.title == msg_subj) \
                                .delete()
        if read_msgs:
            db.session.commit()

        msgs_json = []
        for each_subj_msg in all_msgs:
            msgs_json.append({'username': each_subj_msg.author.username, 'other_avatar': other_user_avatar, 'body': each_subj_msg.body, 'time': each_subj_msg.timestamp})
        
        return jsonify(msgs_json)
    return redirect(url_for('main.message_inbox'))

@bp.route('/send_message', methods=['GET', 'POST'])
@login_required
def send_message():
    # NEED TO ADD NOTES HERE TO EXPLAIN MULTIDICT
    data = MultiDict(mapping=request.json)
    form = MessageForm(data)
    if form.validate():
        user = User.query.filter_by(username=form.recipient.data).first()
        if current_user != user:
            msg = Messages(author=current_user, recipient=user, subject=form.subject.data,
                            body=form.body.data)
            db.session.add(msg)
            notification = Notifications(notification_type='message',
                                        username=current_user.username,
                                        title=form.subject.data,
                                        data=form.body.data,
                                        user=user)
            db.session.add(notification)
            db.session.commit()

            # SENDING EMAIL NOTIFICATION TO RECIPIENT
            if user.msg_note == True:
                send_notification_email(sendinguser=current_user,
                                        recip=user, 
                                        note_type='message',
                                        title=form.subject.data,
                                        content=form.body.data)

            return "Message successfully sent!"

    #ERROR MSG TO USERS
    if form.recipient.errors:
        for error in form.recipient.errors:
            return error
    if form.subject.errors:
        for error in form.subject.errors:
            return error
    if form.body.errors:
        for error in form.body.errors:
            return error
    return redirect(url_for('main.message_inbox'))

@bp.route('/reply_message/<subject>/<recip_name>', methods=['POST'])
@login_required
def reply_message(subject, recip_name):
    reply_msg = request.json
    user = User.query.filter_by(username=recip_name).first()
    if user and (current_user != user):
        msg = Messages(author=current_user, recipient=user, subject=subject,
                        body=reply_msg)
        db.session.add(msg)

        notification = Notifications(notification_type='message reply',
                                    username=current_user.username,
                                    title=subject,
                                    data=reply_msg,
                                    user=user)
        db.session.add(notification)
        db.session.commit()

        #Need to implement websocket in the future...
        return 'Message successfully sent!'
    
    return redirect(url_for('main.message_inbox'))

@bp.route('/delete_message/<subject>/<sender_name>', methods=['GET'])
@login_required
def delete_message(subject, sender_name):
    sender = User.query.filter_by(username=sender_name).first()
    all_msg = Messages.query \
                    .filter_by(subject=subject) \
                    .filter((Messages.recipient_id == current_user.id) | (Messages.recipient_id == sender.id)) \
                    .filter((Messages.sender_id == current_user.id) | (Messages.sender_id == sender.id)) \
                    .all()
    if sender and all_msg:
        for msg in all_msg:
            current_user.delete_msg(msg)

            db.session.commit()
        return jsonify('Message successfully deleted!')
    return 

@bp.route('/restore_message/<subject>/<sender_name>', methods=['GET'])
@login_required
def restore_message(subject, sender_name):
    sender = User.query.filter_by(username=sender_name).first()
    all_msg = Messages.query \
                    .filter_by(subject=subject) \
                    .filter((Messages.recipient_id == current_user.id) | (Messages.recipient_id == sender.id)) \
                    .filter((Messages.sender_id == current_user.id) | (Messages.sender_id == sender.id)) \
                    .all()
    if sender and all_msg:
        for msg in all_msg:
            current_user.undelete_msg(msg)

            db.session.commit()
        return jsonify('Message successfully restored!')
    return 

@bp.route('/explore')
def explore():
    # MOST POPULAR PROJECTS QUERY/DATA
    all_likes = []
    all_projects = Projects.query.all()
    for eachproject in all_projects:
        all_likes.append(eachproject.likes)

    # 'MOST POPULAR PROJECT' ALGORITHM
    popular_likes = round(sum(all_likes) / len(all_likes) if all_likes else 0.1)
    popular_last_edit = dt.utcnow() - timedelta(days=14)
    popular_last_visit = dt.utcnow() - timedelta(days=7)
    most_popular_projects = Projects.query \
                                    .join(project_visitors) \
                                    .join(User) \
                                        .filter(Projects.likes >= popular_likes) \
                                        .filter(Projects.last_edit > popular_last_edit) \
                                        .filter(Projects.private != 1) \
                                        .order_by(Projects.last_edit.desc()) \
                                        .filter(project_visitors.c.last_visit_date > popular_last_visit) \
                                        .limit(10)
    # 'TRENDING PROJECT' ALGORITHM
    trending_project_date = dt.utcnow() - timedelta(days=7)
    trending_visit_date = dt.utcnow() - timedelta(days=3)
    trending_projects = Projects.query \
                            .join(project_visitors) \
                            .join(User) \
                                .filter(Projects.created_date > trending_project_date) \
                                .filter(and_(Projects.likes > 1, Projects.likes < 10)) \
                                .filter(Projects.private != 1) \
                                .order_by(Projects.created_date.desc()) \
                                .filter(project_visitors.c.last_visit_date > trending_visit_date) \
                                .limit(10)
    # 'NEW PROJECT' ALGORITHM
    new_project_date = dt.utcnow() - timedelta(days=3)
    new_projects = Projects.query \
                            .filter(Projects.created_date > new_project_date) \
                            .filter(Projects.private != 1) \
                            .order_by(Projects.created_date.desc()) \
                            .limit(10)

    return render_template('explore.html', most_popular_projects=most_popular_projects,
                                            trending_projects=trending_projects,
                                            new_projects=new_projects)

@bp.route('/about')
def about():
    return render_template('about.html')


@bp.route('/get_notifications')
@login_required
def get_notifications():
    all_new_notifications = Notifications.query \
                                    .filter_by(user_id=current_user.id) \
                                    .order_by(Notifications.timestamp.asc()) \
                                    .all()
    
    # FILTERING ALL NOTIFICATIONS FROM ALL BLOCKED USERS'
    blocked_users = current_user.blocked.all()
    if blocked_users and all_new_notifications:
        for blocked_user in blocked_users:
            for note in all_new_notifications:
                # NEED TO SLICE PYTHON LIST TO ITERATE AND REMOVE ITEMS. CANNOT 'REMOVE' DURING ITERATION AS IT MUTATES LIST DURING
                all_new_notifications[:] = [note for note in all_new_notifications if not note.username == blocked_user.username]

    # IF ZERO NOTIFICATIONS INITIALLY OR EXISTING ONES REMOVED
    if len(all_new_notifications) == 0:
        return jsonify(0)

    # FOR INITIAL AND NEWER NOTIFICATIONS
    compiled_data = []
    for notification in all_new_notifications:
        data = {'Type': notification.notification_type,
                'User': notification.username,
                'Title': notification.title,
                'Data': notification.data,
                'Timestamp': notification.timestamp
                }
        compiled_data.append(data)
    return jsonify(compiled_data)

@bp.route('/delete_notifications')
@login_required
def delete_notifications():
    all_notifications = Notifications.query \
                                    .filter_by(user_id=current_user.id) \
                                    .delete()
    db.session.commit()
    return jsonify('Notifications cleared')

@bp.route('/search')
def search():
    if not g.search_form.validate():
        return redirect(url_for('auth.homepage'))
    page = request.args.get('page', 1, type=int)
    projects, total = Projects.search(g.search_form.q.data,
                                        page,
                                        current_app.config['PROJECTS_PER_PAGE'])
    next_url = url_for('main.search', q=g.search_form.q.data, page=page + 1) \
        if total > page * current_app.config['PROJECTS_PER_PAGE'] else None
    prev_url = url_for('main.search', q=g.search_form.q.data, page=page - 1) \
        if page > 1 else None
    
    return render_template('search.html', projects=projects.all(),
                                        next_url=next_url,
                                        prev_url=prev_url)
    
@bp.route('/report_feed/<project_id>')
@login_required
def report_feed(project_id):
    project = Projects.query.get(project_id)
    if project:
        send_email(subject='Feed Report - ' + project.title,
                    sender=current_app.config['ADMIN'],
                    recipients=[current_app.config['ADMIN']],
                    html_body='Report submission for username: ' + project.username + ' with project title: ' + project.title,
                    text_body='Report submission for username: ' + project.username + ' with project title: ' + project.title)
                    
        return jsonify('Report submitted')
    return jsonify('Failed submission')


@bp.route('/follow/<username>')
@login_required
def follow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot follow yourself!')
        return redirect(url_for('main.profile', username=username))
    
    current_user.follow(user)
    db.session.commit()

    # ADD USER INFO INTO SESSION CHATLIST BUT NEED TO CHECK IF OTHER USER IS FOLLOWING BACK BEFORE ADDING
    check_follower = user.is_following(current_user)
    if check_follower:
        chatlist = session['chatlist']
        new_follower = {'username': user.username, 'avatar': user.avatar(70), 'id': user.id}
        chatlist.append(new_follower)

    if request.args:
        args = request.args.get('redirect')
        if args == 'homepage':
            return redirect(url_for('auth.homepage'))
        elif args == 'project-page':
            title = request.args.get('title')
            return redirect(url_for('project.project', username=username, title=title))

    flash('You are now following {}'.format(username))
    return redirect(url_for('main.profile', username=username))

@bp.route('/unfollow/<username>')
@login_required
def unfollow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot unfollow yourself!')
        return redirect(url_for('main.profile', username=username))
    
    current_user.unfollow(user)
    db.session.commit()

    # REMOVING USER INFO FROM SESSION CHATLIST
    chatlist = session['chatlist']
    chatlist_length = len(chatlist)
    for i in range(chatlist_length):
        if chatlist[i]['username'] == user.username:
            chatlist[i].pop('username')
            chatlist[i].pop('avatar')
            chatlist[i].pop('id')

    if request.args:
        args = request.args.get('redirect')
        if args == 'homepage':
            return redirect(url_for('auth.homepage'))
        elif args == 'project-page':
            title = request.args.get('title')
            return redirect(url_for('project.project', username=username, title=title))
    
    flash('You have unfollowed {}'.format(username))
    return redirect(url_for('main.profile', username=username))

@bp.route('/block/<username>', methods=['GET', 'POST'])
@login_required
def block(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot block yourself!')
        return redirect(url_for('auth.homepage'))
    
    current_user.unfollow(user)
    current_user.block(user)
    db.session.commit()

    if request.args:
        args = request.args.get('redirect')
        if args == 'user-profile':
            return redirect(url_for('main.profile', username=username))

    # FOR AJAX REQUEST - BETTER USER EXPERIENCE
    if request.json:
        return jsonify('Successfully unblocked user!')

    return redirect(url_for('auth.homepage'))

@bp.route('/unblock/<username>', methods=['GET', 'POST'])
@login_required
def unblock(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot unfollow yourself!')
        return redirect(url_for('auth.homepage'))
    
    current_user.unblock(user)
    db.session.commit()

    if request.args:
        args = request.args.get('redirect')
        if args == 'user-profile':
            return redirect(url_for('main.profile', username=username))
        elif args == 'privacy-settings':
            return jsonify('Successfully unblocked user!')
    
    # FOR AJAX REQUEST - BETTER USER EXPERIENCE
    if request.json:
        return jsonify('Successfully unblocked user!')

    return redirect(url_for('auth.homepage'))

@bp.route('/get_avatar/<username>', methods=['GET'])
def get_avatar(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify(user.avatar(70))
    return jsonify('none')


# WORKER VIEW FUNCTIONS
@bp.route('/longtask', methods=['POST'])
def longtask():
    task = long_task.apply_async()
    return jsonify({}), 202, {'Location': url_for('taskstatus', task_id=task.id)}

@bp.route('/status/<task_id>')
def taskstatus(task_id):
    task = long_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)


@bp.route('/subscription/preload')
def subscription_preload():
    CSRFToken = generate_csrf()
    stripe_pub_key = current_app.config['STRIPE_PUB_KEY']
    user_sub = current_user.subscription if current_user.is_authenticated else 'free'
    data = {'csrf_token': CSRFToken,
            'stripe_key': stripe_pub_key,
            'user_sub': user_sub}
    return jsonify(data)

@bp.route('/subscriptions')
def subscriptions():
    return render_template('subscriptions.html')

@bp.route('/subscription/pay', methods=['POST'])
def subscription_pay():
    email = request.json['stripeEmail']
    stripe_token = request.json['stripeToken']
    amount = request.json['amount']
    subtype = request.json['subtype']
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

    # THIS IS FOR TESTING PURPOSE ONLY. WILL REQUIRE USERS TO LOGIN PRIOR SUBSCRIBING IN FUTURE
    user = current_user
    if user:
        if user.subscription == subtype:
            return jsonify('You are already subscribed for that tier!')
        email = current_user.email
        user.subscription = subtype
        db.session.commit()
        return jsonify('You have successfully subscribed!')
    
    customer = stripe.Customer.create(email=email, source=stripe_token)

    charge = stripe.Charge.create(
        customer=customer.id,
        amount=amount,
        currency='usd',
        description=subtype
    )

    return jsonify('You have successfully subscribed!')

@bp.route('/subscription/thankyou')
def subscription_thankyou():
    return render_template('subscription_thankyou.html')

@bp.route('/subscription/modify')
def subscription_modify():
    user = current_user
    if user:
        user.subscription = 'free'
        db.session.commit()
        return jsonify('Subscription changes saved!')
    return jsonify('You must be logged in.')


def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']