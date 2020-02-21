from app import db, cache
from app.api_user import bp
from app.models import User, followers
from app.api_user.errors import bad_request
from app.schema import schema
from flask import Response, stream_with_context, jsonify, g
from random import randint
from time import sleep
import json


# helper functions
@cache.memoize(timeout=540)
def validate_user(token):
    user = User.query.filter_by(token=token).first()
    if user:
        user = User.check_token(token)
        if user:
            return user
        else:
            return False
    print('VALIDATING USER FOR SSE...')
    return False


@bp.route('/chat/list_retrieval/<token>')
def chatlist_retrieval(token):
    sleep(1.5)
    user = User.check_token(token)
    print('streaming contents...........')
    if user and user.online != 'offline':
        @stream_with_context
        def stream_chatlist():
            print('streaming contents INSIDE GENERATOR FUNCTION...............')
            
            # ACQUIRE USER FRIEND LIST
            all_followers = db.session.query(User) \
                .join(followers, User.id == followers.c.follower_id) \
                .filter(followers.c.followed_id == user.id) \
                .all()
            all_followed = user.followed.all()
            all_favorites = user.favored.all()
            
            approved_users = list(set.intersection(set(all_followers), set(all_followed)))
            approved_users_status = []
            for eachuser in approved_users:
                # USER INFO
                userlist = {}
                userlist['username'] = eachuser.username
                userlist['picture'] = eachuser.avatar(70)
                userlist['status'] = eachuser.online if eachuser.online == 'online' else 'offline'
                userlist['id'] = eachuser.id
                userlist['favorite'] = False
                for eachfav in all_favorites:
                    if eachfav.id == eachuser.id:
                        userlist['favorite'] = True
                approved_users_status.append(userlist)
            
            yield "data: " + json.dumps(approved_users_status) + "\n\n"

        return Response(stream_chatlist(), mimetype='text/event-stream')
    else:
        return jsonify('SSE Disconnecting....')

