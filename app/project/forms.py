from flask import request
from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, IntegerField, DecimalField
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, Length, NumberRange
from app.models import User, Projects


class ProjectForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=3, max=40, message="Your awesome creation must have a title! (3-50 characters)")])
    description = TextAreaField('Description')
    difficulty = IntegerField('Difficulty Level (1-10)', validators=[DataRequired(), NumberRange(min=1, max=10, message="You must select a value between 1-10")])
    cost = IntegerField('Cost ($ - USD)', validators=[DataRequired()])
    duration = IntegerField('Hours', validators=[DataRequired()])
    tutorial = TextAreaField('Tutorial Instructions')
    video = StringField('External Video link')
    item_list = TextAreaField('List of Items')
    privacy = BooleanField('Keep Private')
    submit = SubmitField('Submit')
    
    def validate_title(self, title):
        existing_project_title = Projects.query.filter_by(title=title.data).filter_by(user_id=current_user.id).all()
        if existing_project_title:
            raise ValidationError('You have created that title already. Please choose a different title.')

class EditProjectForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=3, max=40, message="Your awesome creation must have a title! (3-50 characters)")])
    description = TextAreaField('Description')
    difficulty = IntegerField('Difficulty Level (1-10)', validators=[DataRequired(), NumberRange(min=1, max=10, message="You must select a value between 1-10")])
    cost = IntegerField('Cost ($ - USD)', validators=[DataRequired()])
    duration = IntegerField('Hours', validators=[DataRequired()])
    privacy = BooleanField('Keep Private')
    submit = SubmitField('Save Changes')