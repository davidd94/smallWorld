from flask import jsonify, request
from flask_login import current_user
import graphene
from graphql import GraphQLError
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
            user = User.check_token(auth_token) if User.check_token(auth_token) else User.token_renewal(auth_token)
            if user:
                query = UserLimitedInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')

    def resolve_UserInfo(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token) if User.check_token(auth_token) else User.token_renewal(auth_token)
            if user:
                query = UserInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')

    def resolve_UsersBlocked(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token) if User.check_token(auth_token) else User.token_renewal(auth_token)
            if user:
                query = user.blocked.all()
                return query
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')

schema = graphene.Schema(query=Query)