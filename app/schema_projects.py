import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType
from app.models import Projects


class ProjectLimitedInfoModel(SQLAlchemyObjectType):
    class Meta:
        model = Projects
        only_fields = ("username", "title", "description", "created_date", "likes",
                        "aquariums", "saltwater", "freshwater", "terrariums", "enclosedtropical",
                        "opentropical", "carnivorous", "desert", "reptiles", "vivariumpaludarium",
                        "plantsonly" )
        exclude_fields = ()