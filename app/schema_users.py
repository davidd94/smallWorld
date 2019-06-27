import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models import User


class UserLimitedInfoModel(SQLAlchemyObjectType):
    class Meta:
        # 'model' needs to be specified with a SQLAlchemy model
        model = User
        # only return specific fields
        only_fields = ("username", "firstname", "picture")
        # exclude specified fields
        exclude_fields = ("token", "password_hash", "last_seen", "lastname", "email", "bio",
                        "msg_note", "comment_note", "reply_note")

class UserInfoModel(SQLAlchemyObjectType):
    class Meta:
        # 'model' needs to be specified with a SQLAlchemy model
        model = User
        # only return specific fields
        only_fields = ("username", "firstname", "lastname", "email", "bio", "picture",
                        "msg_note", "comment_note", "reply_note")
        # exclude specified fields
        exclude_fields = ("token", "password_hash", "last_seen",)

class UsersBlockedModel(SQLAlchemyObjectType):
    class Meta:
        model = User
        only_fields = ("username", "picture")
        exclude_fields = ()