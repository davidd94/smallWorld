from flask import url_for, request, flash, g, current_app, jsonify, session
from flask_login import current_user, login_required, logout_user
from flask_socketio import send, emit, disconnect, join_room, leave_room
from app import db, socketio
from app.socketio import bp
from app.models import User, Messages, ChatMessages, Projects, PhotoGallery, Notifications, project_visitors, followers, deleted_messages
import os, time, random, functools
import json


# SOCKETIO HELPER FUNCTION TO VERIFY IF USER IS LOGGED IN
def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped


# WEB SOCKETIO FUNCTIONS
@socketio.on('connect')
def connect():
    if session['chat_status'] == 'offline':
        emit('connect', 'offline')
    else:
        current_user.online = True
        db.session.commit()
        emit('connect', 'online')

@socketio.on('chatlist')
@authenticated_only
def chatlist(userlist):
    # ***WARNING*** QUERYING CONSTANTLY FOR UPDATED SESSION LIST IS NOT IDEAL FOR LARGE SCALE PRODUCTION
    all_followers = db.session.query(User) \
                .join(followers, User.id == followers.c.follower_id) \
                .filter(followers.c.followed_id == current_user.id) \
                .all()
    if all_followers:
        all_followed = current_user.followed.all()
        approved_users = list(set.intersection(set(all_followers), set(all_followed)))
        approved_usernames = []
        online_status = []
        for user in approved_users:
            userinfo = {}
            userinfo['username'] = user.username
            userinfo['avatar'] = user.avatar(70)
            userinfo['id'] = user.id
            approved_usernames.append(userinfo)

            user_status = {}
            user_status['username'] = user.username
            user_status['online'] = user.online
            online_status.append(user_status)
    
    # NEED DICT TO BE IN SET FORMAT IN ORDER TO COMPARE VALUES
    set_userlist = set(tuple(sorted(d.items())) for d in userlist)
    set_sessionlist = set(tuple(sorted(d.items())) for d in approved_usernames)
    if set_userlist != set_sessionlist:
        # NEED TO SET MUTABLE DICT INTO IMMUTABLE TUPLES FOR SET TO WORK
        unique_userlist = set(tuple((d.items())) for d in userlist)
        unique_sessionlist = set(tuple((d.items())) for d in approved_usernames)
        # USING SET DIFFERENCE TO OBTAIN THE DIFFERENCE BETWEEN TWO LISTS
        changed_user = set.symmetric_difference(unique_sessionlist, unique_userlist)
        
        diff_users = []
        # ADDING EXISTING USERS TO THE OVERALL LIST FIRST BEFORE ULTIMATELY CHANGING TO REMOVE/ADD
        existing_list = userlist
        for eachuser in existing_list:
            eachuser['condition'] = 'none'
        updated_list = existing_list
        # CONVERTING SET BACK TO DICT
        for eachtuple in changed_user:
            user_info = dict((x, y) for x, y in eachtuple)
            diff_users.append(user_info)
        # ADD CONDITION TYPE: USER WAS ADDED TO SESSION LIST
        if (len(approved_usernames) - len(userlist)) > 0:
            for eachuser in diff_users:
                eachuser['condition'] = 'add'
                updated_list.append(eachuser)
        # ADDED CONDITION TYPE: USER WAS REMOVED FROM SESSION LIST
        elif (len(approved_usernames) - len(userlist)) < 0:
            for eachuser in diff_users:
                eachuser['condition'] = 'remove'
                for eachexistinguser in updated_list:
                    if eachexistinguser['username'] == eachuser['username']:
                        eachexistinguser['condition'] = 'remove'
        
        
        for eachuser in updated_list:
            for eachstatus in online_status:
                if eachuser['username'] == eachstatus['username']:
                    eachuser['online'] = eachstatus['online']
        emit('chatlist', updated_list)
    elif set_userlist == set_sessionlist:
        # IF CLIENT LIST IS SAME AS SERVER SESSION LIST, SET CONDITION TO 'NONE'
        current_list = approved_usernames
        for eachuser in current_list:
            eachuser['condition'] = 'none'
            for eachonline in online_status:
                if eachonline['username'] == eachuser['username']:
                    eachuser['online'] = eachonline['online']
        print(current_list)
        emit('chatlist', current_list)


    session['chatlist'] = approved_usernames


@socketio.on('join')
@authenticated_only
def on_join(data):
    username = data['username']
    room = data['room']
    chat_logs = ChatMessages.query \
                            .filter_by(room=room) \
                            .order_by(ChatMessages \
                            .timestamp.desc()) \
                            .all()
    chat_data = []
    for eachmsg in chat_logs:
        eachlog = {}
        eachlog['username'] = eachmsg.username
        eachlog['avatar'] = eachmsg.avatar
        eachlog['message'] = eachmsg.message
        eachlog['timestamp'] = str(eachmsg.timestamp)
        chat_data.append(eachlog)
    join_room(room)
    emit('join', chat_data, room=room)
    

@socketio.on('leave')
@authenticated_only
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)

@socketio.on('message')
@authenticated_only
def message(message_data):
    print(message_data)
    message = message_data['message']
    room = message_data['room']
    new_msg = ChatMessages(username=current_user.username,
                            avatar=current_user.avatar(70),
                            message=message,
                            room=room)
    db.session.add(new_msg)
    db.session.commit()
    timestamp = str(new_msg.timestamp)
    return_msg_data = {'username': current_user.username,
                        'avatar': current_user.avatar(70),
                        'message': message,
                        'timestamp': timestamp}
    emit('message', return_msg_data, room=room)

@socketio.on('chat_typing')
@authenticated_only
def chat_typing(data):
    username = current_user.username
    room = data['room']
    notification = '{} is typing...'.format(username)
    data = {'username': username, 'note': notification}
    emit('chat_typing', data, room=room)

@socketio.on('offline')
@authenticated_only
def offline():
    current_user.online = False
    db.session.commit()
    disconnect()

@socketio.on('disconnect')
def disconnect():
    # WEBSOCKET CONNECTION CLOSES WHEN CLOSING BROWSER
    current_user.online = False
    db.session.commit()
    # ADD THIS IF YOU WANT USERS TO FULLY LOGOUT OF SESSION AND SOCKETIO UPON CLOSING BROWSER
    #logout_user()