from flask import jsonify
from flask_login import current_user
import graphene
from app.schema_users import UserInfoModel, UsersBlockedModel
from app.models import User


class Query(graphene.ObjectType):
    UserInfo = graphene.List(UserInfoModel)
    UsersBlocked = graphene.List(UsersBlockedModel)

    def resolve_UserInfo(self, info):
        query = UserInfoModel.get_query(info) # SQLAlchemy query
        return query.filter(User.username == current_user.username).all()

    def resolve_UsersBlocked(self, info):
        query = current_user.blocked.all()
        return query

schema = graphene.Schema(query=Query)