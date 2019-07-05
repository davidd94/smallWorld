import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models import User, Projects


class UserTokenModel(SQLAlchemyObjectType):
    class Meta:
        # 'model' needs to be specified with a SQLAlchemy model
        model = User
        # only return specific fields
        only_fields = ("token")
        # exclude specified fields
        exclude_fields = ("username", "firstname", "picture", "password_hash", "last_seen",
                        "lastname", "email", "bio", "msg_note", "comment_note", "reply_note")

class UserLimitedInfoModel(SQLAlchemyObjectType):
    class Meta:
        # 'model' needs to be specified with a SQLAlchemy model
        model = User
        # only return specific fields
        only_fields = ("username", "firstname", "picture", "token")
        # exclude specified fields
        exclude_fields = ("password_hash", "last_seen", "lastname", "email", "bio",
                        "msg_note", "comment_note", "reply_note")

class UserInfoModel(SQLAlchemyObjectType):
    class Meta:
        # 'model' needs to be specified with a SQLAlchemy model
        model = User
        # only return specific fields
        only_fields = ("username", "firstname", "lastname", "email", "bio", "picture",
                        "msg_note", "comment_note", "reply_note", "token")
        # exclude specified fields
        exclude_fields = ("password_hash", "last_seen",)

class UsersBlockedModel(SQLAlchemyObjectType):
    class Meta:
        model = User
        only_fields = ("username", "picture")
        exclude_fields = ()

class ProjectLimitedInfoModel(SQLAlchemyObjectType):
    class Meta:
        model = Projects
        only_fields = ("username", "title", "description", "created_date", "likes",
                        "aquariums", "saltwater", "freshwater", "terrariums", "enclosedtropical",
                        "opentropical", "carnivorous", "desert", "reptiles", "vivariumpaludarium",
                        "plantsonly" )
        exclude_fields = ()