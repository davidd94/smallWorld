from flask import jsonify, request
from flask_login import current_user
from sqlalchemy import and_
import graphene
from graphql import GraphQLError
from app.schema_users import UserTokenModel, UserLimitedInfoModel, UserInfoModel, UsersBlockedModel, ProjectLimitedInfoModel
from app.models import User, Projects, project_visitors
from datetime import datetime, timedelta


class Query(graphene.ObjectType):
    UserTokenRefresh = graphene.List(UserTokenModel)
    UserLimitedInfo = graphene.List(UserLimitedInfoModel)
    UserInfo = graphene.List(UserInfoModel)
    UsersBlocked = graphene.List(UsersBlockedModel)
    ProjectLimitedInfo = PopularProjects = TrendingProjects = NewProjects = graphene.List(ProjectLimitedInfoModel)

    def resolve_UserTokenRefresh(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token) if User.check_token(auth_token) else User.token_renewal(auth_token)
            if user:
                query = UserTokenModel.get_query(info) # SQLAlchemy query
                return query.filter(User.token == auth_token).all()
        return None

    def resolve_UserLimitedInfo(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token)
            if user:
                query = UserLimitedInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')

    def resolve_UserInfo(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token)
            if user:
                query = UserInfoModel.get_query(info) # SQLAlchemy query
                return query.filter(User.username == user.username).all()
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')

    def resolve_UsersBlocked(self, info):
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(' ')[1]
            user = User.check_token(auth_token)
            if user:
                query = user.blocked.all()
                return query
            raise GraphQLError('User session expired! Please relog in.')
        raise GraphQLError('Unauthorized!')
    
    def resolve_ProjectLimitedInfo(self, info):
        # token not required to access limited public project data
        query = ProjectLimitedInfoModel.get_query(info) # SQLAlchemy query
        if query:
            return query.filter(Projects.private != True).all()
        raise GraphQLError('A server error occurred!')

    def resolve_PopularProjects(self, info):
        # MOST POPULAR PROJECTS QUERY/DATA
        all_likes = []
        all_projects = Projects.query.all()
        for eachproject in all_projects:
            all_likes.append(eachproject.likes)
        
        # 'MOST POPULAR PROJECT' SIMPLE ALGORITHM
        popular_likes = round(sum(all_likes) / len(all_likes) if all_likes else 0.1)
        popular_last_edit = datetime.utcnow() - timedelta(days=14)
        popular_last_visit = datetime.utcnow() - timedelta(days=7)
        
        query = ProjectLimitedInfoModel.get_query(info) # SQLAlchemy query
        if query:
            return query.join(project_visitors) \
                        .join(User) \
                            .filter(Projects.likes >= popular_likes) \
                            .filter(Projects.last_edit > popular_last_edit) \
                            .filter(Projects.private != 1) \
                            .order_by(Projects.last_edit.desc()) \
                            .filter(project_visitors.c.last_visit_date > popular_last_visit) \
                            .limit(10)
        raise GraphQLError('A server error occurred!')
    
    def resolve_TrendingProjects(self, info):
        # MOST POPULAR PROJECTS QUERY/DATA
        all_likes = []
        all_projects = Projects.query.all()
        for eachproject in all_projects:
            all_likes.append(eachproject.likes)
        
        # 'TRENDING PROJECT' ALGORITHM
        trending_project_date = datetime.utcnow() - timedelta(days=7)
        trending_visit_date = datetime.utcnow() - timedelta(days=3)

        query = ProjectLimitedInfoModel.get_query(info) # SQLAlchemy query
        if query:
            return query.join(project_visitors) \
                        .join(User) \
                            .filter(Projects.created_date > trending_project_date) \
                            .filter(and_(Projects.likes > 1, Projects.likes < 10)) \
                            .filter(Projects.private != 1) \
                            .order_by(Projects.created_date.desc()) \
                            .filter(project_visitors.c.last_visit_date > trending_visit_date) \
                            .limit(10)
        raise GraphQLError('A server error occurred!')
    
    def resolve_NewProjects(self, info):
        # 'NEW PROJECT' ALGORITHM
        new_project_date = datetime.utcnow() - timedelta(days=3)

        query = ProjectLimitedInfoModel.get_query(info) # SQLAlchemy query
        if query:
            return query.filter(Projects.created_date > new_project_date) \
                        .filter(Projects.private != 1) \
                        .order_by(Projects.created_date.desc()) \
                        .limit(10)
        raise GraphQLError('A server error occurred!')

schema = graphene.Schema(query=Query)