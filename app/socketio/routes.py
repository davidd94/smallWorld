from flask import url_for, request, flash, g, current_app, jsonify, session
from flask_login import current_user, login_required, logout_user
from flask_socketio import send, emit, disconnect, join_room, leave_room
from app import db, socketio
from app.tasks import chatlist_updates
from app.socketio import bp
from app.models import User, Messages, ChatMessages, Projects, PhotoGallery, Notifications, project_visitors, followers, deleted_messages, chatlist_favorites
from datetime import datetime as dt
import os, functools
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

        if not current_user.is_authenticated:
            print('disconnecting user..........................')
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped

# HELPER FUNCTION TO VERIFY USERS HANDSHAKE AND GENERATE ROOM
def room_generator(recipient):
    recipient_user = User.query.filter_by(username=recipient).first()
    # SECURITY LAYER TO PREVENT UNWANTED USER TO JOIN ROOMS
    if current_user.is_authenticated:
        user = current_user
    elif g.current_user:
        user = g.current_user
    else:
        return False
    # JOIN ROOM AFTER VERIFYING USERS FOLLOWING EACH OTHER
    if user.is_mutually_following(recipient_user):
        # RETURNS A ROOM NUMBER
        return str(user.id) + '-' + str(recipient_user.id) if user.id < recipient_user.id else str(recipient_user.id) + '-' + str(user.id)
    return False

# WEB SOCKETIO FUNCTIONS
@socketio.on('connect')
@authenticated_only
def connect():
    # USERS ON SESSIONS/COOKIES
    status = 'none'
    print('trying to connect...................')
    if current_user.is_authenticated:
        session_chatlist_status = session.get('chat_status')
        status = current_user.online
        if status != session_chatlist_status:
            current_user.online = status
            db.session.commit()
            emit('connect', status)
        else:
            emit('connect', status)
    
    # STATELESS USERS (API)
    try:
        if g.current_user:
            prev_status = g.current_user.prev_online
            status = g.current_user.online

            if prev_status != status:
                g.current_user.online = prev_status
                db.session.commit()
            print('API SOCKET CONNECTION SUCCESSFUL............')
            emit('connect', prev_status)
    except:
        emit('connect', 'websocket connection failed...')
        

"""@socketio.on('chatlist')
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
"""

@socketio.on('favorite')
@authenticated_only
def favorite(userinfo):
    print('trying to fav..')
    if current_user.is_authenticated:
        user = User.query.get(int(user))
        current_user.favor(user)
        db.session.commit()
        emit('favorite', user.id)
    try:
        if g.current_user:
            user = User.query.filter_by(username=user).first()
            g.current_user.unfavor(user)
            db.session.commit()
    except:
        emit('favorite', 'Failed to fav..')

@socketio.on('unfavorite')
@authenticated_only
def unfavorite(userinfo):
    print('trying to unfav..')
    if current_user.is_authenticated:
        user = User.query.get(int(userinfo))
        current_user.unfavor(user)
        db.session.commit()
        emit('unfavorite', user.id)
    try:
        if g.current_user:
            user = User.query.filter_by(username=user).first()
            g.current_user.unfavor(user)
            db.session.commit()
    except:
        emit('unfavorite', 'Failed to unfav..')

@socketio.on('join')
@authenticated_only
def on_join(data):
    recipient = data['username']
    room = room_generator(recipient)
    # JOIN ROOM AFTER VERIFYING USERS FOLLOWING EACH OTHER
    if room:
        print(room)
        # CLEARS CHAT MSG NOTIFICATION UPON OPENING CHAT
        chat_note = Notifications.query \
                                .filter_by(username=recipient) \
                                .filter_by(notification_type='chat message') \
                                .all()
        for eachnote in chat_note:
            db.session.delete(eachnote)
            # GOIN TO COMMIT FROM CHAT NOTIFICATIONS BELOW SINCE YOU NEED BOTH TO OCCUR

        base_chatlogs = ChatMessages.query \
                                .filter_by(room=room)
        # MARKS THE OTHER USER'S MSG AS READ WHEN OPENING CHAT BOX
        unread_chatlogs = base_chatlogs.filter_by(username=recipient) \
                                    .filter_by(message_read=False) \
                                    .all()
        for unread_chat in unread_chatlogs:
            unread_chat.message_read = True
        db.session.commit()

        # ORGANIZES ALL CHAT LOG HISTORY TO BE LOADED FOR BOTH USERS
        chat_logs = base_chatlogs.order_by(ChatMessages.timestamp.asc()).all()
        chat_data = []
        for eachmsg in chat_logs:
            eachlog = {}
            eachlog['username'] = eachmsg.username
            eachlog['avatar'] = eachmsg.avatar
            eachlog['message'] = eachmsg.message
            eachlog['timestamp'] = str(eachmsg.timestamp)
            chat_data.append(eachlog)
        
        join_room(room)
        emit('join', chat_data)
    else:
        emit('join', 'Not authorized to chat with ' + recipient)
    
@socketio.on('leave')
@authenticated_only
def on_leave(data):
    recipient = data['username']
    room = room_generator(recipient)
    # JOIN ROOM AFTER VERIFYING USERS FOLLOWING EACH OTHER
    if room:
        unread_msg_ct = ChatMessages.query \
                                    .filter_by(room=room) \
                                    .filter_by(message_read=False) \
                                    .filter_by(username=recipient) \
                                    .all()
        
        # CLEARS CHAT MSG NOTIFICATION UPON OPENING CHAT
        chat_note = Notifications.query \
                                .filter_by(username=recipient) \
                                .filter_by(notification_type='chat message') \
                                .all()
        for eachnote in chat_note:
            db.session.delete(eachnote)
        
        # MARK ALL UNREAD MSGS AS READ UPON CLOSING CHATBOX
        for eachmsg in unread_msg_ct:
            eachmsg.message_read = True
            db.session.commit()
        leave_room(room)
        emit('leave', 'You have left the chatroom with ' + recipient)
    else:
        emit('leave', 'Error leaving the room...')

@socketio.on('message')
@authenticated_only
def message(message_data):
    recipient = message_data['username']
    room = room_generator(recipient)
    # JOIN ROOM AFTER VERIFYING USERS FOLLOWING EACH OTHER
    if room:
        message = message_data['message']
        user = User.query.filter_by(username=recipient).first()
        new_msg = ChatMessages(username=(current_user.username if current_user.is_authenticated else g.current_user.username),
                                avatar=(current_user.avatar(70) if current_user.is_authenticated else g.current_user.avatar(70)),
                                message=message,
                                room=room)
        new_note = Notifications(notification_type='chat message',
                                username=(current_user.username if current_user.is_authenticated else g.current_user.username),
                                title='Chat Message from ' + (current_user.username if current_user.is_authenticated else g.current_user.username),
                                data=message,
                                user_id=user.id,
                                user=user)
        
        db.session.add(new_msg)
        db.session.commit()
        timestamp = str(new_msg.timestamp)
        return_msg_data = {'username': (current_user.username if current_user.is_authenticated else g.current_user.username),
                            'avatar': (current_user.avatar(70) if current_user.is_authenticated else g.current_user.avatar(70)),
                            'message': message,
                            'timestamp': timestamp}
        emit('message', return_msg_data, room=room)
    else:
        emit('message', 'Failed to send message...')

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
    if current_user.is_authenticated:
        session_chatlist_status = session.get('chat_status')
        status = current_user.online

        if status != session_chatlist_status: 
            session['chat_status'] = 'online'
            current_user.online = 'online'
            db.session.commit()
            emit('online', 'online')
        else:
            emit('online', 'online')
    
    try:
        if g.current_user:
            g.current_user.online = 'online'
            db.session.commit()
            emit('online', 'online')
    except:
        pass
        disconnect()

@socketio.on('offline')
@authenticated_only
def offline():
    if current_user.is_authenticated:
        session_chatlist_status = session.get('chat_status')
        status = current_user.online

        if status != session_chatlist_status: 
            session['chat_status'] = 'offline'
            current_user.online = 'offline'
            db.session.commit()
    
    try:
        if g.current_user:
            g.current_user.online = 'offline'
            db.session.commit()
            emit('offline', 'offline')
    except:
        pass
    
    emit('offline', 'offline')
    disconnect()

@socketio.on('invisible')
@authenticated_only
def invisible():
    if current_user.is_authenticated:
        session_chatlist_status = session.get('chat_status')
        status = current_user.online

        if status != session_chatlist_status: 
            session['chat_status'] = 'invisible'
            current_user.online = 'invisible'
            db.session.commit()
            emit('invisible', 'invisible')
        else:
            emit('invisible', 'invisible')
    
    try:
        if g.current_user:
            g.current_user.online = 'invisible'
            db.session.commit()
            emit('invisible', 'invisible')
    except:
        pass
        disconnect()

@socketio.on('logout')
@authenticated_only
def logout():
    disconnect()

@socketio.on('disconnect')
def disconnect_user():
    print('DISCONNECTING WEBSOCKET FROM SERVER.....')
    # WEBSOCKET CONNECTION CLOSES AUTOMATICALLY WHEN CLOSING BROWSER
    if current_user.is_authenticated:
        current_user.prev_online = session['chat_status']
        session['chat_status'] = 'offline'
        current_user.online = 'offline'
        db.session.commit()

        # ADD THIS IF YOU WANT USERS TO FULLY LOGOUT OF SESSION AND SOCKETIO UPON CLOSING BROWSER
        #logout_user()
    
    try:
        if g.current_user:
            g.current_user.prev_online = g.current_user.online
            g.current_user.online = 'offline'
            db.session.commit()
    except:
        pass
        #emit('disconnect', 'Please log in.')