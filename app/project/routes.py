from flask import render_template, redirect, url_for, request, flash, g, current_app, jsonify, Response, send_from_directory
from flask_login import current_user, login_required
from flask_babel import get_locale, _
from flask_moment import Moment
from datetime import datetime
from sqlalchemy import update
from app import db, moment
from app.email import send_notification_email
from app.models import User, Projects, PhotoGallery, Itemlist, ProjectComments, CommentReplies, Notifications, FAQs, comment_likers, reply_likers, project_likers
from app.project import bp
from app.project.forms import ProjectForm, EditProjectForm, FAQForm
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
import os, shutil


@bp.route('/new_project', methods=['GET', 'POST'])
@login_required
def new_project():
    form = ProjectForm()
    #VALIDATE ON SUBMIT CHECKS IF AN EXISTING TITLE NAME EXIST
    if form.validate_on_submit():
        file_path = current_app.config['PHOTO_UPLOAD_DIR']
        projectname = form.title.data
        username = current_user.username
        user_path = file_path + '/' + username
        full_file_path = file_path + '/' + username + '/' + projectname

        if not os.path.isdir(user_path):
            os.mkdir(user_path)
            os.mkdir(full_file_path)
        if os.path.isdir(user_path) and not os.path.isdir(full_file_path):
            os.mkdir(full_file_path)
        
        try:
            file_upload = request.files['file']
            if file_upload and allowed_file(file_upload.filename):
                file_name = secure_filename(file_upload.filename)
                file_upload.save(os.path.join(full_file_path, file_name))
        except:
            file_upload = None
            file_name = ''
        
        new_project = Projects(title=form.title.data,
                                description=form.description.data,
                                difficulty=form.difficulty.data,
                                cost=form.cost.data,
                                duration=form.duration.data,
                                video=form.video.data,
                                private=form.privacy.data,
                                author=current_user,
                                username=current_user.username)
        new_photo_gallery = PhotoGallery(title=form.title.data,
                                        photoOne=str(file_name),
                                        projects=new_project)
        new_faqs = FAQs(username=current_user.username,
                        title=form.title.data,
                        projects=new_project)
        
        # IF TAGS CHECKED, SAVE TO DB AS 'TRUE'
        all_tags = request.form.getlist('tags')
        if all_tags:
            for eachtag in all_tags:
                print(eachtag)
                # USES PYTHON BUILT-IN FEATURE 'SETATTR' TO SET DB TABLE VALUES USING DYNAMIC VARIABLES
                setattr(new_project, eachtag, True)

        db.session.add(new_project)
        db.session.add(new_photo_gallery)
        db.session.commit()

        return redirect(url_for('project.project', username=current_user.username, title=form.title.data))
    
    return render_template('/projects/new-project.html', form=form)

@bp.route('/project/<username>/<title>')
def project(username, title):
    user = User.single_user(username=username)
    project = Projects.single_project(user_id=user.id, title=title)
    if user and project:
        # CHECKS IF THE PROJECT PROFILE IS PRIVATE AND REDIRECTS ACCORDINGLY
        if project.private == True and current_user != user:
            return redirect(url_for('project.privacy'))
        project_gallery = project.photo_gallery \
                                    .filter_by(project_id=project.id) \
                                    .first()
        project_itemlist = Itemlist.query.filter_by(projects=project).all()
        project_faqs = FAQs.query.filter_by(project_id=project.id).first()

        # LOADS CERTAIN FEATURES FOR LOGGED IN USERS, SPECIFICALLY COMMENT/REPLY SYSTEM
        if current_user.is_authenticated:
            project_likes = Projects.query \
                                    .join(project_likers) \
                                    .join(User) \
                                    .filter(project_likers.c.project_id == project.id) \
                                    .filter(project_likers.c.user_id == current_user.id) \
                                    .first()
            project_comments = ProjectComments.singleProj_allCommentsDesc(project_id=project.id)
            project_comment_likes = ProjectComments \
                                    .query \
                                    .join(comment_likers) \
                                    .join(User) \
                                    .filter(ProjectComments.title == title) \
                                    .filter(comment_likers.c.user_id == current_user.id) \
                                    .all()
            # 'User.query.' is the same as 'db.session.query(User).'
            project_replies = CommentReplies.allRepliesAsc(title=title, project_id=project.id)
            project_reply_likes = CommentReplies.query \
                                .join(reply_likers) \
                                .join(User) \
                                .filter(CommentReplies.title == title) \
                                .filter(reply_likers.c.user_id == current_user.id) \
                                .all()
            
            # SETS THE USER'S LAST VISIT DATE
            if current_user != user:
                current_user.project_visits(project)
            
            return render_template('/projects/project-page.html', 
                                    user=user, 
                                    project=project,
                                    project_gallery=project_gallery,
                                    itemlist=project_itemlist,
                                    project_likes=project_likes,
                                    project_comments=project_comments,
                                    project_comment_likes=project_comment_likes,
                                    project_replies=project_replies, 
                                    project_reply_likes=project_reply_likes,
                                    tutorial_text=project.tutorial,
                                    maintenance_text=project.maintenance,
                                    project_faqs=project_faqs)
        return render_template('/projects/project-page.html',
                                user=user,
                                project=project,
                                project_gallery=project_gallery,
                                itemlist=project_itemlist,
                                tutorial_text=project.tutorial,
                                maintenance_text=project.maintenance,
                                project_faqs=project_faqs)
    return redirect(url_for('auth.homepage'))

@bp.route('/project_bar/<title>', methods=['GET', 'POST'])
@login_required
def edit_bar(title):
    form = EditProjectForm()
    existing_project = Projects.single_project(user_id=current_user.id, title=title)
    if existing_project:
        if form.validate_on_submit():
            # THIS SECTION ONLY UPDATES EVERYTHING RELATED TO TITLE CHANGE
            if form.title.data != existing_project.title:
                existing_title = Projects.single_project(user_id=current_user.id, title=form.title.data)
                if existing_title:
                    flash('You already have an existing project with that name. Please select a different title name.')
                    return redirect(url_for('project.edit_bar', title=existing_project.title))
                # UPDATES PROJECT TITLE
                existing_project.title = form.title.data
                # UPDATES PROJECT DIRECTORY FOLDER
                existing_directory = current_app.config['PHOTO_UPLOAD_DIR'] + '/' + current_user.username + '/' + title
                new_directory = current_app.config['PHOTO_UPLOAD_DIR'] + '/' + current_user.username + '/' + form.title.data
                os.rename(existing_directory, new_directory)
                # UPDATES PHOTO GALLERY TITLE
                photogallery = PhotoGallery.single_gallery(project_id=existing_project.id)
                photogallery.title = form.title.data
                # UPDATES COMMENTS' TITLE
                all_comments = ProjectComments.singleProj_allCommentsDesc(project_id=existing_project.id)
                for eachcomment in all_comments:
                    eachcomment.title = form.title.data
                # UPDATES COMMENT REPLIES' TITLE
                all_replies = CommentReplies.allRepliesAsc(title=title, project_id=existing_project.id)
                for eachreply in all_replies:
                    eachreply.title = form.title.data

            existing_project.description = form.description.data
            existing_project.difficulty = form.difficulty.data
            existing_project.cost = form.cost.data
            existing_project.duration = form.duration.data
            existing_project.private = form.privacy.data
            
            # UPDATES PROJECT LAST EDIT TIMER
            existing_project.last_edit = datetime.utcnow()

            flash('Your changes have been saved!')
            db.session.commit()

            return redirect(url_for('project.edit_bar', title=existing_project.title))
        if request.method == 'GET':
            form.title.data = existing_project.title
            form.description.data = existing_project.description
            form.difficulty.data = existing_project.difficulty
            form.cost.data = existing_project.cost
            form.duration.data = existing_project.duration
            form.privacy.data = existing_project.private
        return render_template('/projects/project-bar-edit.html', form=form, project=existing_project)
    return redirect(url_for('auth.homepage'))


@bp.route('/project/edit_tutorial/<title>')
@login_required
def edit_tutorial(title):
    project = Projects.single_project(user_id=current_user.id, title=title)
    if project:
        return render_template('/projects/edit_tutorial.html', project=project)
    return redirect(url_for('auth.homepage'))

@bp.route('/project/edit_tutorial_photo/<title>', methods=['POST'])
@login_required
def edit_tutorial_photo(title):
    pictures = request.files
    uploaded_photos = []
    num_pics_uploading = len(request.files)

    # IF TUTORIAL PICTURE DIRECTORY DOESN'T EXIST, CREATE ONE.
    file_path = current_app.config['PHOTO_UPLOAD_DIR']
    if not os.path.isdir(file_path + '/' + current_user.username + '/' + title + '/' + 'tutorialpics'):
        os.mkdir(file_path + '/' + current_user.username + '/' + title + '/' + 'tutorialpics')

    # TEMPORARILY CREATES EACH PHOTO IN DIRECTORY
    for n in range(num_pics_uploading):
        each_pic = pictures[str(n)]
        if each_pic and allowed_file(each_pic.filename):
            file_name = secure_filename(each_pic.filename)
            full_file_path = file_path + '/' + current_user.username + '/' + title + '/' + 'tutorialpics'

            each_pic.save(os.path.join(full_file_path, file_name))

            uploaded_photos.append(file_name)

    
    return jsonify(uploaded_photos)

@bp.route('/project/edit_tutorial/<title>/save_tutorial', methods=['POST'])
@login_required
def edit_tutorial_save(title):
    html_content = request.data.decode('utf-8')
    project = Projects.single_project(current_user.id, title)
    if project:
        project.tutorial = html_content
        project.last_edit = datetime.utcnow()
        project.last_update_type = 'Updated tutorial contents'
        db.session.commit()
        return jsonify(html_content)
    return jsonify('tutorial did not save!')

@bp.route('/project/edit_tutorial/<title>/load_tutorial', methods=['GET'])
@login_required
def load_tutorial(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        tutorial = project.tutorial
        return jsonify(tutorial)
    return jsonify('Failed to retrieve tutorial')

@bp.route('/project/edit_tutorial_toggle/<title>', methods=['POST'])
@login_required
def edit_tutorial_toggle(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        data = request.json
        if data == 'true':
            project.tutorial_enabled = True
        elif data == 'false':
            project.tutorial_enabled = False
        db.session.commit()
        return jsonify('toggle saved')
    return redirect(url_for('project.project', username=current_user.username, title=project.title))


@bp.route('/project/edit_maintenance/<title>')
@login_required
def edit_maintenance(title):
    project = Projects.single_project(user_id=current_user.id, title=title)
    if project:
        return render_template('/projects/edit_maintenance.html', project=project)
    return redirect(url_for('auth.homepage'))

@bp.route('/project/edit_maintenance_photo/<title>', methods=['POST'])
@login_required
def edit_maintenance_photo(title):
    pictures = request.files
    uploaded_photos = []
    num_pics_uploading = len(request.files)

    # IF MAINTENANCE PICTURE DIRECTORY DOESN'T EXIST, CREATE ONE.
    file_path = current_app.config['PHOTO_UPLOAD_DIR']
    if not os.path.isdir(file_path + '/' + current_user.username + '/' + title + '/' + 'maintenancepics'):
        os.mkdir(file_path + '/' + current_user.username + '/' + title + '/' + 'maintenancepics')

    # TEMPORARILY CREATES EACH PHOTO IN DIRECTORY
    for n in range(num_pics_uploading):
        each_pic = pictures[str(n)]
        if each_pic and allowed_file(each_pic.filename):
            file_name = secure_filename(each_pic.filename)
            full_file_path = file_path + '/' + current_user.username + '/' + title + '/' + 'maintenancepics'

            each_pic.save(os.path.join(full_file_path, file_name))

            uploaded_photos.append(file_name)

    
    return jsonify(uploaded_photos)

@bp.route('/project/edit_maintenance/<title>/save_maintenance', methods=['POST'])
@login_required
def edit_maintenance_save(title):
    html_content = request.data.decode('utf-8')
    print(html_content)
    project = Projects.single_project(current_user.id, title)
    if project:
        project.maintenance = html_content
        project.last_edit = datetime.utcnow()
        project.last_update_type = 'Updated maintenance guide'
        db.session.commit()
        return jsonify(html_content)
    return jsonify('maintenance did not save!')

@bp.route('/project/edit_maintenance/<title>/load_maintenance', methods=['GET'])
@login_required
def load_maintenance(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        maintenance = project.maintenance
        return jsonify(maintenance)
    return jsonify('Failed to retrieve maintenance')

@bp.route('/project/edit_maintenance_toggle/<title>', methods=['POST'])
@login_required
def edit_maintenance_toggle(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        data = request.json
        if data == 'true':
            project.maintenance_enabled = True
        elif data == 'false':
            project.maintenance_enabled = False
        db.session.commit()
        return jsonify('toggle saved')
    return redirect(url_for('project.project', username=current_user.username, title=project.title))


@bp.route('/project/edit_itemslist/<title>', methods=['GET', 'POST'])
@login_required
def edit_itemslist(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        if request.method == 'POST':
            # TO QUERY AND DELETE ANY EXISTING ITEMS
            existingitems = Itemlist.query.filter_by(project_id=project.id).all()
            if existingitems:
                for eachitem in existingitems:
                    db.session.delete(eachitem)
                db.session.commit()
            
            # FOR NEW ITEM SUBMISSION TO BE SAVED TO DB
            allitems = request.json
            if allitems:
                project.last_update_type = 'Updated item list'
                for eachitem in allitems:
                    newitem = Itemlist(username=current_user.username,
                                        title=project.title,
                                        itemname=eachitem['name'],
                                        itemlink=eachitem['link'],
                                        itembrand=eachitem['brand'],
                                        quantity=eachitem['qty'],
                                        notes=eachitem['notes'],
                                        projects=project)
                    db.session.add(newitem)
                    db.session.commit()
                return jsonify('Items saved!')
        if request.method == 'GET':
            existingitems = Itemlist.query.filter_by(project_id=project.id).all()
            return render_template('/projects/edit_itemslist.html', project=project, existingitems=existingitems)
        return render_template('/projects/edit_itemslist.html', project=project)
    return redirect(url_for('project.project', username=current_user.username, title=project.title))

@bp.route('/project/edit_itemslist_toggle/<title>', methods=['POST'])
@login_required
def edit_itemslist_toggle(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        data = request.json
        if data == 'true':
            project.itemlist_enabled = True
        elif data == 'false':
            project.itemlist_enabled = False
        db.session.commit()
        return jsonify('toggle saved')
    return redirect(url_for('project.project', username=current_user.username, title=project.title))

@bp.route('/project/edit_photos/<title>', methods=['GET', 'POST'])
@login_required
def edit_photos(title):
    project = Projects.single_project(user_id=current_user.id, title=title)
    # CAN QUERT DB AGAIN TO OBTAIN THE PHOTO GALLERY OR USE RELATIONSHIP AND LOOP THROUGH ALL GALLERY
    # photo_gallery = PhotoGallery.query.filter_by(title=title).filter_by(project_id=project.id).first()
    photo_gallery = project.photo_gallery \
                            .filter_by(project_id=project.id) \
                            .first()
                   
    if photo_gallery:
        rows = photo_gallery.__dict__
        empty_pic_slot = []
        for row in rows:
            if rows[row] == None or rows[row] == '':
                empty_pic_slot.append(row)
    
    """ FIND OUT EACH COLUMN NAME OR TYPE
    for x in PhotoGallery.__table__.columns:
        print (x.name)
    """

    # CREATES PROJECT DIRECTORY FOLDER IF IT DOESN'T EXIST
    if project and request.files and request.method == 'POST':
        projectname = project.title
        username = current_user.username
        
        num_pics_allowed = len(empty_pic_slot)
        num_pics_uploading = len(request.files)
        # CHECKS IF USER REACHED FILE UPLOAD LIMIT
        if (len(empty_pic_slot) == 0):
            return jsonify('You have reached your maximum file limit of 10!')
        # CHECK IF USERS UPLOADED MORE THAN 10 FILES AT ONCE
        if (num_pics_uploading > 10):
            return jsonify('You can only upload a maximum of 10 files at once!')
        
        # UPDATES THE LAST EDITED DATE FOR PROJECT
        project.last_edit = datetime.utcnow()
        project.last_update_type = 'Added new photos in gallery'
        
        pictures = request.files
        uploaded_pics = []
        for n in range(min(num_pics_allowed,num_pics_uploading)):
            each_pic = pictures[str(n)]
            if each_pic and allowed_file(each_pic.filename):
                file_name = secure_filename(each_pic.filename)
                file_path = current_app.config['PHOTO_UPLOAD_DIR']
                file_path = file_path + '/' + username + '/' + projectname
                full_file_path = file_path + '/' + file_name
                
                # CHECKING IF USER HAS DUPLICATE FILE NAMES
                if os.path.isfile(full_file_path):
                    return jsonify('You already have a file with that name! Please use a different name.')
                
                each_pic.save(os.path.join(file_path, file_name))
                photo_db = empty_pic_slot[n]

                # USES PYTHON BUILT-IN FEATURE 'SETATTR' TO SET DB TABLE VALUES USING DYNAMIC VARIABLES
                setattr(photo_gallery, photo_db, file_name)
                uploaded_pics.append(file_name)
                db.session.commit()

        return jsonify(uploaded_pics)
    return render_template('projects/edit_photos.html', title=title,
                                                        user=current_user,
                                                        project=project,
                                                        project_gallery=photo_gallery)

@bp.route('/project/delete_photos/<title>/<img_name>')
@login_required
def delete_photos(title, img_name):
    project = Projects.query.filter_by(title=title).filter_by(user_id=current_user.id).first()
    photo_gallery = project.photo_gallery.filter_by(project_id=project.id).first()
    
    if project and photo_gallery:
        rows = photo_gallery.__dict__
        found_pic_row = ""
        # UPDATES THE PROJECT LAST EDIT DATE
        Projects.last_edit = datetime.utcnow()
        for row in rows:
            if rows[row] == img_name:
                found_pic_row = row
                print(found_pic_row)
                setattr(photo_gallery, found_pic_row, None)

                full_file_path = current_app.config['PHOTO_UPLOAD_DIR'] + '/' + current_user.username + '/' + title + '/' + img_name
                os.remove(full_file_path)        
                db.session.commit()
                return jsonify('successfully deleted db image!')
    return jsonify('An error occurred...')

@bp.route('/project/new_comment/<username>/<project_id>', methods=['POST'])
@login_required
def new_comment(username, project_id):
    user = User.query.filter_by(username=username).first_or_404()
    project = Projects.query.get(project_id)
    comment = request.json
    if project and comment:
        # ADD NEW COMMENT TO PROJECT
        new_comment = ProjectComments(title=project.title,
                                    username=current_user.username,
                                    comment=comment,
                                    projects=project,
                                    author=current_user)
        db.session.add(new_comment)
        # ADD TO PROJECT OWNER'S NOTIFICATIONS
        if current_user != user:
            notification = Notifications(notification_type='comment',
                                        username=current_user.username,
                                        title=project.title,
                                        data=comment,
                                        user=user)
            db.session.add(notification)
            # SENDING EMAIL NOTIFICATION TO PROJECT CREATOR
            if user.comment_note == True:
                send_notification_email(sendinguser=current_user,
                                        recip=user, 
                                        note_type='comment',
                                        title=project.title,
                                        content=comment)
        
        db.session.commit()
        return_data = {'author': project.author.username,
                        'avatar': current_user.avatar(60),
                        'comment_id': new_comment.id,
                        'timestamp': '1 second ago',
                        'likes': 0}
        return jsonify(return_data)
    return jsonify('Comment did not save...')

@bp.route('/project/new_reply/<username>/<project_id>/<comment_id>', methods=['POST'])
@login_required
def new_reply(username, project_id, comment_id):
    user = User.query.filter_by(username=username).first_or_404()
    project = Projects.query.get(project_id)
    project_comment = project.project_comments \
                            .filter_by(id=comment_id) \
                            .first()
    reply = request.json

    if project and reply:
        # ADD NEW REPLY TO PROJECT
        new_reply = CommentReplies(title=project.title,
                                    username=current_user.username,
                                    reply=reply,
                                    projects=project,
                                    author=current_user,
                                    projectcomments=project_comment)
        db.session.add(new_reply)
        # ADD TO PROJECT OWNER'S NOTIFICATIONS
        if current_user != user:
            notification = Notifications(notification_type='comment reply',
                                        username=current_user.username,
                                        title=project.title,
                                        data=reply,
                                        user=user)
            db.session.add(notification)
            # SENDING EMAIL NOTIFICATION TO PROJECT CREATOR
            if user.reply_note == True:
                send_notification_email(sendinguser=current_user,
                                        recip=user, 
                                        note_type='reply',
                                        title=project.title,
                                        content=reply)
        
        db.session.commit()
        return_data = {'reply_id': new_reply.id,
                        'author': project.author.username,
                        'avatar': current_user.avatar(60),
                        'timestamp': '1 second ago',
                        'likes': 0}
        return jsonify(return_data)
    return jsonify('Reply did not save...')

@bp.route('/project/project_like/<project_id>', methods=['GET'])
@login_required
def project_like(project_id):
    project = Projects.query.get(int(project_id))
    if project:
        current_user.like_project(project)
        project.likes += 1
        
        db.session.commit()
        return jsonify('Project liked!')
    return redirect(url_for('project.project', username=project.username, title=project.title))

@bp.route('/project/project_unlike/<project_id>', methods=['GET'])
@login_required
def project_unlike(project_id):
    project = Projects.query.get(int(project_id))
    if project:
        current_user.unlike_project(project)
        project.likes -= 1
        
        db.session.commit()
        return jsonify('Project unliked!')
    return redirect(url_for('project.project', username=project.username, title=project.title))

@bp.route('/project/comment_like/<project_id>/<comment_id>', methods=['GET'])
@login_required
def comment_like(project_id, comment_id):
    project = Projects.query.get(project_id)
    # FASTER/BETTER WAY TO GET THE DATA
    # project_comment = ProjectComments.query.get(project_id)
    # ANOTHER WAY OF OBTAINING DATA THROUGH PROJECT TABLE
    project_comment = project.project_comments.filter_by(id=comment_id).first()
    if project and project_comment:
        current_user.like_comment(project_comment)
        project_comment.likes += 1
        
        db.session.commit()
        return jsonify('Comment liked!')
    return redirect(url_for('project.project', username=username, title=title))

@bp.route('/project/comment_unlike/<project_id>/<comment_id>', methods=['GET'])
@login_required
def comment_unlike(project_id, comment_id):
    project = Projects.query.get(project_id)
    project_comment = ProjectComments.query.get(comment_id)
    if project and project_comment:
        current_user.unlike_comment(project_comment)
        project_comment.likes -= 1
        
        db.session.commit()
        return jsonify('Comment unliked!')
    return redirect(url_for('project.project', username=username, title=title))

@bp.route('/project/reply_like/<project_id>/<reply_id>', methods=['GET'])
@login_required
def reply_like(project_id, reply_id):
    project_reply = CommentReplies.query.get(reply_id)
    if project_reply:
        current_user.like_reply(project_reply)
        project_reply.likes += 1
        
        db.session.commit()
        return jsonify('Reply liked!')
    return redirect(url_for('project.project', username=username, title=title))

@bp.route('/project/reply_unlike/<project_id>/<reply_id>', methods=['GET'])
@login_required
def reply_unlike(project_id, reply_id):
    project_reply = CommentReplies.query.get(reply_id)
    if project_reply:
        current_user.unlike_reply(project_reply)
        project_reply.likes -= 1
        
        db.session.commit()
        return jsonify('Reply unliked!')
    return redirect(url_for('project.project', username=username, title=title))

@bp.route('/project/show_user_commentlikes/<username>/<title>/<comment_id>/', methods=['GET'])
@login_required
def show_user_commentlikes(username, title, comment_id):
    project = Projects.query.filter_by(username=username).filter_by(title=title).first()
    all_user_likes = db.session.query(comment_likers, User) \
                    .filter(comment_likers.c.comment_id == comment_id) \
                    .join(User, User.id == comment_likers.c.user_id) \
                    .all()
    users = []
    for eachuser in all_user_likes:
        username = eachuser[2].username
        users.append(username)
    return jsonify(users)

@bp.route('/project/show_user_replylikes/<username>/<title>/<reply_id>/', methods=['GET'])
@login_required
def show_user_replylikes(username, title, reply_id):
    project = Projects.query.filter_by(username=username).filter_by(title=title).first()
    all_user_likes = db.session.query(reply_likers, User) \
                    .filter(reply_likers.c.reply_id == reply_id) \
                    .join(User, User.id == reply_likers.c.user_id) \
                    .all()
    users = []
    for eachuser in all_user_likes:
        username = eachuser[2].username
        users.append(username)
    return jsonify(users)

@bp.route('/project/update_notifications/<username>/<project_id>')
@login_required
def update_notifications(username, project_id):
    if username == current_user.username:
        now = datetime.utcnow()
        project = Projects.query.get(int(project_id))
        project.commentsAndReplies_last_read = now

        read_comments = Notifications.query \
                                    .filter_by(user_id=current_user.id) \
                                    .filter((Notifications.notification_type == 'comment') | (Notifications.notification_type == 'comment reply')) \
                                    .delete()
        db.session.commit()
    return jsonify('Comments read updated!')


@bp.route('/project/edit_faq/<title>', methods=['GET', 'POST'])
@login_required
def edit_faq(title):
    project = Projects.single_project(current_user.id, title)
    form = FAQForm()
    if project:
        faqs = FAQs.query.filter_by(project_id=project.id).first()
        if form.validate_on_submit():
            faqs.faqenabled = form.faqenabled.data
            faqs.question1 = form.question1.data
            faqs.answer1 = form.answer1.data
            faqs.enabled1 = form.enabled1.data
            faqs.question2 = form.question2.data
            faqs.answer2 = form.answer2.data
            faqs.enabled2 = form.enabled2.data
            faqs.question3 = form.question3.data
            faqs.answer3 = form.answer3.data
            faqs.enabled3 = form.enabled3.data
            faqs.question4 = form.question4.data
            faqs.answer4 = form.answer4.data
            faqs.enabled4 = form.enabled4.data
            faqs.question5 = form.question5.data
            faqs.answer5 = form.answer5.data
            faqs.enabled5 = form.enabled5.data
            faqs.question6 = form.question6.data
            faqs.answer6 = form.answer6.data
            faqs.enabled6 = form.enabled6.data
            faqs.question7 = form.question7.data
            faqs.answer7 = form.answer7.data
            faqs.enabled7 = form.enabled7.data
            faqs.question8 = form.question8.data
            faqs.answer8 = form.answer8.data
            faqs.enabled8 = form.enabled8.data
            faqs.question9 = form.question9.data
            faqs.answer9 = form.answer9.data
            faqs.enabled9 = form.enabled9.data
            faqs.question10 = form.question10.data
            faqs.answer10 = form.answer10.data
            faqs.enabled10 = form.enabled10.data

            # UPDATES THE LAST EDITED DATE FOR PROJECT
            project.last_edit = datetime.utcnow()
            project.last_update_type = 'Updated the FAQs section'
            
            flash('Questions Saved!')
            db.session.commit()

            return redirect(url_for('project.edit_faq', title=project.title))
        if request.method == 'GET':
            form.faqenabled.data = faqs.faqenabled
            form.question1.data = faqs.question1
            form.answer1.data = faqs.answer1
            form.enabled1.data = faqs.enabled1
            form.question2.data = faqs.question2
            form.answer2.data = faqs.answer2
            form.enabled2.data = faqs.enabled2
            form.question3.data = faqs.question3
            form.answer3.data = faqs.answer3
            form.enabled3.data = faqs.enabled3
            form.question4.data = faqs.question4
            form.answer4.data = faqs.answer4
            form.enabled4.data = faqs.enabled4
            form.question5.data = faqs.question5
            form.answer5.data = faqs.answer5
            form.enabled5.data = faqs.enabled5
            form.question6.data = faqs.question6
            form.answer6.data = faqs.answer6
            form.enabled6.data = faqs.enabled6
            form.question7.data = faqs.question7
            form.answer7.data = faqs.answer7
            form.enabled7.data = faqs.enabled7
            form.question8.data = faqs.question8
            form.answer8.data = faqs.answer8
            form.enabled8.data = faqs.enabled8
            form.question9.data = faqs.question9
            form.answer9.data = faqs.answer9
            form.enabled9.data = faqs.enabled9
            form.question10.data = faqs.question10
            form.answer10.data = faqs.answer10
            form.enabled10.data = faqs.enabled10
        return render_template('/projects/edit_faq.html', project=project, form=form)
    return redirect(url_for('project.project', username=current_user.username, title=title))

@bp.route('/project/delete_project/<title>')
@login_required
def delete_project(title):
    project = Projects.single_project(current_user.id, title)
    if project:
        photo_gallery = project.photo_gallery.first()
        project_faqs = project.faqs.first()
        project_itemlist = project.item_list.all()
        project_comments = project.project_comments.all()
        project_replies = project.comment_replies.all()
        project_note_comments = Notifications.query \
                                            .filter_by(notification_type='comment') \
                                            .filter_by(title=title) \
                                            .all()
        project_note_replies = Notifications.query \
                                            .filter_by(notification_type='comment reply') \
                                            .filter_by(title=title) \
                                            .all()
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
        if project_note_comments:
            for each_note in project_note_comments:
                db.session.delete(each_note)
        if project_note_replies:
            for each_note in project_note_replies:
                db.session.delete(each_note)
        # REMOVING MAIN PROJECT DIRECTORY WITH ALL IMAGES
        file_path = current_app.config['PHOTO_UPLOAD_DIR']
        username = current_user.username
        if os.path.isdir(file_path + '/' + username + '/' + title):
            # shutil IS REQUIRED TO REMOVE ALL FILES AND SUBDIRECTORIES WITHIN A DIRECTORY. rmdir only removes when empty
            shutil.rmtree(file_path + '/' + username + '/' + title)
        db.session.commit()
        return jsonify('Successfully deleted!')
    return jsonify('Was unable to delete')

@bp.route('/project/tagsearch', methods=['GET', 'POST'])
def tagsearch():
    if request.args and request.method == 'GET':
        tag = request.args.get('tag')
        search = ''
        # IF INITIAL QUERY STRING IS 'DIFFICULTY'
        if tag == 'difficulty':
            difficultylevel = request.args.get('value')
            if difficultylevel == 'easy':
                projects = Projects.query \
                                .filter_by(private=False) \
                                .filter(Projects.difficulty < 4) \
                                .all()
                search = 'Easy'
            elif difficultylevel == 'medium':
                projects = Projects.query \
                                .filter_by(private=False) \
                                .filter(Projects.difficulty < 8) \
                                .filter(Projects.difficulty > 3) \
                                .all()
                search = 'Medium'
            elif difficultylevel == 'hard':
                projects = Projects.query \
                                .filter_by(private=False) \
                                .filter(Projects.difficulty > 7) \
                                .all()
                search = 'Hard'
        # IF INITIAL QUERY STRING IS 'COST'
        if tag == 'cost':
            costvalue = request.args.get('value')
            if costvalue == '$':
                projects = Projects.query \
                                    .filter_by(private=False) \
                                    .filter(Projects.cost <= 100) \
                                    .all()
                search = '$'
            if costvalue == '$$':
                projects = Projects.query \
                                    .filter_by(private=False) \
                                    .filter(Projects.cost > 100) \
                                    .filter(Projects.cost < 300) \
                                    .all()
                search = '$$'
            if costvalue == '$$$':
                projects = Projects.query \
                                    .filter_by(private=False) \
                                    .filter(Projects.cost >= 300) \
                                    .filter(Projects.cost < 600) \
                                    .all()
                search = '$$$'
            if costvalue == '$$$$':
                projects = Projects.query \
                                    .filter_by(private=False) \
                                    .filter(Projects.cost >= 600) \
                                    .filter(Projects.cost < limit4) \
                                    .all()
                search = '$$$$'
            if costvalue == '$$$$$':
                projects = Projects.query \
                                    .filter_by(private=False) \
                                    .filter(Projects.cost >= 1000) \
                                    .all()
                search = '$$$$$'
        # IF INITIAL QUERY STRING IS ALL OTHERS
        if (tag != 'difficulty') and (tag != 'cost'):
            # NEED TO SET 'kwargs' INTO A DICT IN ORDER TO PASS THE VARIABLE 'tag' AS A KEY IN FILTER_BY
            kwargs = {tag : True}
            projects = Projects.query \
                                .filter_by(**kwargs) \
                                .filter_by(private=False) \
                                .all()
            search = tag
        return render_template('/projects/tags.html', projects=projects, search=search)
    
    if request.method == 'POST':
        all_tags = request.form.getlist('tags')
        all_cost = request.form.getlist('cost')
        all_difficulty = request.form.getlist('difficulty')
        saved_tags = all_tags + all_cost + all_difficulty
        print(saved_tags)
        kwargs = {}

        # IF USER'S FILTER CONTAINS ANY TYPES.... APPEND TO A QUERY OBJECT
        for tag in all_tags:
            kwargs[tag] = True
        if kwargs:
            projectsby_tags = Projects.query \
                            .filter_by(private=False) \
                            .filter_by(**kwargs) \
                            .all()
        else:
            projectsby_tags = Projects.query \
                                .filter_by(private=False) \
                                .all()
        
        # IF USER'S FILTER CONTAINS COST.... RUN THROUGH ALL OPTIONS
        if all_cost:
            limit1 = 100    # '$'
            limit2 = 300    # '$$
            limit3 = 600    # '$$$'
            limit4 = 1000   # '$$$$' or '$$$$$' if > limit4

            if all_cost == ['$']:
                projectsby_cost = Projects.query.filter(Projects.cost < limit1).all()
            elif all_cost == ['$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit2).all()
            elif all_cost == ['$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit2).filter(Projects.cost < limit3).all()
            elif all_cost == ['$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit3).filter(Projects.cost < limit4).all()
            elif all_cost == ['$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit4).all()

            elif all_cost == ['$', '$$']:
                projectsby_cost = Projects.query.filter(Projects.cost < limit2).all()
            elif all_cost == ['$', '$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit3).filter(Projects.cost > limit2)
                projects2 = Projects.query.filter(Projects.cost < limit3).filter(Projects.cost > limit2)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit4).filter(Projects.cost > limit3)
                projects2 = Projects.query.filter(Projects.cost < limit1)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit1)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$', '$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost < limit3).filter(Projects.cost > limit1).all()
            elif all_cost == ['$$', '$$$$']:
                projects1 = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit3).filter(Projects.cost < limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$', '$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$$', '$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit2).filter(Projects.cost < limit4).all()
            elif all_cost == ['$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost > limit2).filter(Projects.cost < limit3)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$$$', '$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit3).all()

            elif all_cost == ['$', '$$', '$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost < limit3).all()
            elif all_cost == ['$', '$$', '$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit3).filter(Projects.cost < limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$$', '$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit1)
                projects2 = Projects.query.filter(Projects.cost < limit4).filter(Projects.cost > limit2)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit1)
                projects2 = Projects.query.filter(Projects.cost > limit2).filter(Projects.cost < limit3)
                projects3 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2, projects3).all()
            elif all_cost == ['$', '$$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit1)
                projects2 = Projects.query.filter(Projects.cost > limit3)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$', '$$$', '$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit4).all()
            elif all_cost == ['$$', '$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit3)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$', '$$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost > limit1).filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit3)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$$', '$$$$', '$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit2).all()

            elif all_cost == ['$', '$$', '$$$', '$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost < limit4).all()
            elif all_cost == ['$', '$$', '$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit3)
                projects2 = Projects.query.filter(Projects.cost > limit4)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$', '$$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit2)
                projects2 = Projects.query.filter(Projects.cost > limit3)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$', '$$$', '$$$$', '$$$$$']:
                projects1 = Projects.query.filter(Projects.cost < limit1)
                projects2 = Projects.query.filter(Projects.cost > limit2)
                projectsby_cost = projects1.union(projects2).all()
            elif all_cost == ['$$', '$$$', '$$$$', '$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > limit1).all()

            elif all_cost == ['$', '$$', '$$$', '$$$$', '$$$$$']:
                projectsby_cost = Projects.query.filter(Projects.cost > 1).all()

        
        # IF USER'S FILTER CONTAINS DIFFICULTY.... RUN THROUGH ALL OPTIONS
        if all_difficulty:
            if all_difficulty == ['easy']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty < 4).all()
            elif all_difficulty == ['medium']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty > 3).filter(Projects.difficulty < 8).all()
            elif all_difficulty == ['hard']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty > 7).all()
            elif all_difficulty == ['easy', 'medium']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty < 8).all()
            elif all_difficulty == ['easy', 'hard']:
                projects1 = Projects.query.filter(Projects.difficulty < 4)
                projects2 = Projects.query.filter(Projects.difficulty > 7)
                projectsby_difficulty = projects1.union(projects2).all()
            elif all_difficulty == ['medium', 'hard']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty > 3).all()
            elif all_difficulty == ['easy', 'medium', 'hard']:
                projectsby_difficulty = Projects.query.filter(Projects.difficulty > 0).all()
            

        if all_tags and all_cost and all_difficulty:
            # MERGING LIST RESULTS INTO SETS (REMOVES DUPLICATES)
            projectsby_tags = set(projectsby_tags)
            projectsby_cost = set(projectsby_cost)
            projectsby_difficulty = set(projectsby_difficulty)
            # INTERSECT SETS (EXTRACTS COMMON DATA BETWEEN ALL SETS)
            project_intersection = set.intersection(projectsby_tags, projectsby_cost, projectsby_difficulty)
        elif all_tags and all_cost:
            projectsby_tags = set(projectsby_tags)
            projectsby_cost = set(projectsby_cost)
            project_intersection = set.intersection(projectsby_tags, projectsby_cost)
        elif all_tags and all_difficulty:
            projectsby_tags = set(projectsby_tags)
            projectsby_difficulty = set(projectsby_difficulty)
            project_intersection = set.intersection(projectsby_tags, projectsby_difficulty)
        elif all_cost and all_difficulty:
            projectsby_cost = set(projectsby_cost)
            projectsby_difficulty = set(projectsby_difficulty)
            project_intersection = set.intersection(projectsby_cost, projectsby_difficulty)
        elif all_tags:
            # DONT NEED MERGE/INTERSECT IF ONLY ONE CATEGORY SEARCH
            projects = projectsby_tags
        elif all_cost:
            projects = projectsby_cost
        elif all_difficulty:
            projects = projectsby_difficulty
        
        # CONVERT SET BACK TO LIST
        try:
            projects = list(project_intersection)
        except:
            pass

        return render_template('/projects/tags.html', projects=projects, search='Custom', checked=saved_tags)
    return render_template('/projects/tags.html')



def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']