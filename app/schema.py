from flask import jsonify, request
from flask_login import current_user
import graphene
from app.schema_users import UserLimitedInfoModel, UserInfoModel, UsersBlockedModel
from app.models import User
from datetime import datetime

class Query(graphene.ObjectType):
    UserLimitedInfo = graphene.List(UserLimitedInfoModel)
    UserInfo = graphene.List(UserInfoModel)
    UsersBlocked = graphene.List(UsersBlockedModel)
    
    def resolve_UserLimitedInfo(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token)
            if user:
                query = UserLimitedInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
        return None

    def resolve_UserInfo(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token)
            if user:
                query = UserInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
        return None

    def resolve_UsersBlocked(self, info):
        query = current_user.blocked.all()
        return query

schema = graphene.Schema(query=Query)