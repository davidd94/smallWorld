import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models import AdminBlogPosts


class BlogInfoModel(SQLAlchemyObjectType):
    class Meta:
        model = AdminBlogPosts
        only_fields = ("id", "username", "title", "body", "url", "timestamp")
        exclude_fields = ()