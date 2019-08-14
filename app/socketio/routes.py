from flask import url_for, request, flash, g, current_app, jsonify, session
from flask_login import current_user, login_required, logout_user
from flask_socketio import send, emit, disconnect, join_room, leave_room
from app import db, socketio
from app.socketio import bp
from app.models import User, Messages, ChatMessages, Projects, PhotoGallery, Notifications, project_visitors, followers, deleted_messages, chatlist_favorites
from datetime import datetime as dt
import os, time, random, functools
import json


# SOCKETIO HELPER FUNCTION TO VERIFY IF USER IS LOGGED IN
def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        token = request.args.get('token')
        if token:
            user = User.check_token(token) if User.check_token(token) else User.token_renewal(token)
            if user:
                g.current_user = user
                return f(*args, **kwargs)
            # removed disconnect() to allow session users to be verified as well
            # disconnect()

        if not current_user.is_authenticated:
            print('disconnecting user..........................')
            disconnect() 
        else:
            return f(*args, **kwargs)
    return wrapped


# WEB SOCKETIO FUNCTIONS
@socketio.on('connect')
@authenticated_only
def connect():
    session_chatlist_status = session.get('chat_status')
    status = 'none'
    print(session_chatlist_status)
    if session_chatlist_status:
        status = session['chat_status']
    
    try:
        if g.current_user and not session_chatlist_status:
            if g.current_user.online == True:
                status = 'online'
            elif g.current_user.online == False:
                status = 'offline'
            elif g.current_user.online == 'invisible':
                status = 'invisible'
            else:
                status = None
    except:
        pass
        
    print(status)
    if status == ['offline', 'invisible']:
        emit('connect', status)
    elif status == 'online':
        current_user.online = True
        db.session.commit()
        emit('connect', status)

@socketio.on('chatlist')
@authenticated_only
def chatlist(userlist):
    # ROOM NUMBER GENERATOR
    def room_number(x, y):
                return str(x) + '-' + str(y) if y > x else str(y) + '-' + str(x)
    # ***WARNING*** QUERYING CONSTANTLY FOR USER ONLINE STATUS IS NOT IDEAL FOR LARGE SCALE PRODUCTION
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
            # USER INFO
            userinfo = {}
            userinfo['username'] = user.username
            userinfo['avatar'] = user.avatar(70)
            userinfo['id'] = user.id
            approved_usernames.append(userinfo)
            # USER ONLINE STATUS
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

            # FAVORITED USERS QUERY
            chatlist_fav = db.session.query(chatlist_favorites.c.user_id) \
                                    .filter(chatlist_favorites.c.fav_id == current_user.id) \
                                    .all()
            filtered_favs = []
            for eachtuple in chatlist_fav:
                for eachid in eachtuple:
                    filtered_favs.append(eachid)

            # FINALIZING UPDATED LIST
            for eachuser in updated_list:
                # APPENDING USER ONLINE STATUS TO USER INFO
                for eachstatus in online_status:
                    if eachuser['username'] == eachstatus['username']:
                        eachuser['online'] = eachstatus['online']
                # APPENDING USER UNREAD MSG CT TO USER INFO
                approved_room = room_number(current_user.id, eachuser['id'])
                unread_msg_ct = ChatMessages.query \
                                            .filter_by(room=approved_room) \
                                            .filter_by(message_read=False) \
                                            .filter_by(username=eachuser['username']) \
                                            .count()
                # APPENDING USER UNREAD MSG CTs
                if unread_msg_ct > 0:
                    eachuser['unread_msg_ct'] = unread_msg_ct
                # APPENDING FAVORITED USER STATUS
                for eachid in filtered_favs:
                    if eachuser['id'] == eachid:
                        eachuser['favorite'] = True
            
            #print(updated_list)
            emit('chatlist', updated_list)
        elif set_userlist == set_sessionlist:
            # FAVORITED USERS QUERY
            chatlist_fav = db.session.query(chatlist_favorites.c.user_id) \
                                    .filter(chatlist_favorites.c.fav_id == current_user.id) \
                                    .all()
            filtered_favs = []
            for eachtuple in chatlist_fav:
                for eachid in eachtuple:
                    filtered_favs.append(eachid)
            
            # IF CLIENT LIST IS SAME AS SERVER SESSION LIST, SET CONDITION TO 'NONE'
            current_list = approved_usernames
            for eachuser in current_list:
                eachuser['condition'] = 'none'
                # APPENDING USER ONLINE STATUS TO USER INFO
                for eachonline in online_status:
                    if eachonline['username'] == eachuser['username']:
                        eachuser['online'] = eachonline['online']
                # APPENDING USER UNREAD MSG CT TO USER INFO
                approved_room = room_number(current_user.id, eachuser['id'])
                unread_msg_ct = ChatMessages.query \
                                            .filter_by(room=approved_room) \
                                            .filter_by(message_read=False) \
                                            .filter_by(username=eachuser['username']) \
                                            .count()
                # APPENDING USER UNREAD MSG CTs
                if unread_msg_ct > 0:
                    eachuser['unread_msg_ct'] = unread_msg_ct
                # APPENDING FAVORITED USER STATUS
                for eachid in filtered_favs:
                    if eachuser['id'] == eachid:
                        eachuser['favorite'] = True

            #print(current_list)
            emit('chatlist', current_list)
        
        session['chatlist'] = approved_usernames

@socketio.on('favorite')
@authenticated_only
def favorite(userid):
    user = User.query.get(int(userid))
    current_user.favor(user)
    db.session.commit()
    emit('favorite', user.id)

@socketio.on('unfavorite')
@authenticated_only
def unfavorite(userid):
    user = User.query.get(int(userid))
    current_user.unfavor(user)
    db.session.commit()
    emit('unfavorite', user.id)

@socketio.on('join')
@authenticated_only
def on_join(data):
    username = data['username']
    room = data['room']

    # CLEARS CHAT MSG NOTIFICATION UPON OPENING CHAT
    chat_note = Notifications.query \
                            .filter_by(username=username) \
                            .filter_by(notification_type='chat message') \
                            .all()
    for eachnote in chat_note:
        db.session.delete(eachnote)
        # GOIN TO COMMIT FROM CHAT NOTIFICATIONS BELOW SINCE YOU NEED BOTH TO OCCUR

    base_chatlogs = ChatMessages.query \
                            .filter_by(room=room)
    # MARKS THE OTHER USER'S MSG AS READ WHEN OPENING CHAT BOX
    unread_chatlogs = base_chatlogs.filter_by(username=username) \
                                .filter_by(message_read=False) \
                                .all()
    for unread_chat in unread_chatlogs:
        unread_chat.message_read = True
    db.session.commit()

    # ORGANIZES ALL CHAT LOG HISTORY TO BE LOADED FOR BOTH USERS
    chat_logs = base_chatlogs.order_by(ChatMessages.timestamp.desc()).all()
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
    unread_msg_ct = ChatMessages.query \
                                .filter_by(room=room) \
                                .filter_by(message_read=False) \
                                .filter_by(username=username) \
                                .all()
    
    # CLEARS CHAT MSG NOTIFICATION UPON OPENING CHAT
    chat_note = Notifications.query \
                            .filter_by(username=username) \
                            .filter_by(notification_type='chat message') \
                            .all()
    for eachnote in chat_note:
        db.session.delete(eachnote)
    
    # MARK ALL UNREAD MSGS AS READ UPON CLOSING CHATBOX
    for eachmsg in unread_msg_ct:
        eachmsg.message_read = True
        db.session.commit()
    leave_room(room)

@socketio.on('message')
@authenticated_only
def message(message_data):
    message = message_data['message']
    room = message_data['room']
    userid = message_data['userid']
    user = User.query.get(int(userid))
    new_msg = ChatMessages(username=current_user.username,
                            avatar=current_user.avatar(70),
                            message=message,
                            room=room)
    new_note = Notifications(notification_type='chat message',
                            username=current_user.username,
                            title='Chat Message from ' + current_user.username,
                            data=message,
                            user_id=user.id,
                            user=user)
    
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

@socketio.on('online')
@authenticated_only
def online():
    session['chat_status'] = 'online'
    connect()

@socketio.on('offline')
@authenticated_only
def offline():
    session['chat_status'] = 'offline'
    current_user.online = False
    db.session.commit()
    disconnect()

@socketio.on('invisible')
@authenticated_only
def invisible():
    session['chat_status'] = 'invisible'
    current_user.online = False
    db.session.commit()

@socketio.on('disconnect')
def disconnect():
    # WEBSOCKET CONNECTION CLOSES WHEN CLOSING BROWSER
    current_user.online = False
    db.session.commit()
    # ADD THIS IF YOU WANT USERS TO FULLY LOGOUT OF SESSION AND SOCKETIO UPON CLOSING BROWSER
    #logout_user()