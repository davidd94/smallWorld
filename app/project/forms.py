from flask import request
from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, IntegerField, DecimalField, SelectMultipleField
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, Length, NumberRange
from app.models import User, Projects


class ProjectForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(min=3, max=40, message="Your awesome creation must have a title! (3-50 characters)")])
    description = TextAreaField('Description')
    difficulty = IntegerField('Difficulty Level (1-10)', validators=[DataRequired(message="Difficulty level missing"), NumberRange(min=1, max=10, message="You must select a value between 1-10")])
    cost = IntegerField('Cost ($ - USD)', validators=[DataRequired(message="Cost missing")])
    duration = IntegerField('Hours', validators=[DataRequired(message="Duration missing")])
    video = StringField('External Video link')
    privacy = BooleanField('Keep Private?')
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

class FAQForm(FlaskForm):
    faqenabled = BooleanField('FAQ?')
    question1 = StringField('Question 1: ', validators=[Length(max=195, message='There was an error...')])
    answer1 = StringField('Answer 1: ', validators=[Length(max=495, message='There was an error...')])
    enabled1 = BooleanField('Enabled?')
    question2 = StringField('Question 2: ', validators=[Length(max=195, message='There was an error...')])
    answer2 = StringField('Answer 2: ', validators=[Length(max=495, message='There was an error...')])
    enabled2 = BooleanField('Enabled?')
    question3 = StringField('Question 3: ', validators=[Length(max=195, message='There was an error...')])
    answer3 = StringField('Answer 3: ', validators=[Length(max=495, message='There was an error...')])
    enabled3 = BooleanField('Enabled?')
    question4 = StringField('Question 4: ', validators=[Length(max=195, message='There was an error...')])
    answer4 = StringField('Answer 4: ', validators=[Length(max=495, message='There was an error...')])
    enabled4 = BooleanField('Enabled?')
    question5 = StringField('Question 5: ', validators=[Length(max=195, message='There was an error...')])
    answer5 = StringField('Answer 5: ', validators=[Length(max=495, message='There was an error...')])
    enabled5 = BooleanField('Enabled?')
    question6 = StringField('Question 6: ', validators=[Length(max=195, message='There was an error...')])
    answer6 = StringField('Answer 6: ', validators=[Length(max=495, message='There was an error...')])
    enabled6 = BooleanField('Enabled?')
    question7 = StringField('Question 7: ', validators=[Length(max=195, message='There was an error...')])
    answer7 = StringField('Answer 7: ', validators=[Length(max=495, message='There was an error...')])
    enabled7 = BooleanField('Enabled?')
    question8 = StringField('Question 8: ', validators=[Length(max=195, message='There was an error...')])
    answer8 = StringField('Answer 8: ', validators=[Length(max=495, message='There was an error...')])
    enabled8 = BooleanField('Enabled?')
    question9 = StringField('Question 9: ', validators=[Length(max=195, message='There was an error...')])
    answer9 = StringField('Answer 9: ', validators=[Length(max=495, message='There was an error...')])
    enabled9 = BooleanField('Enabled?')
    question10 = StringField('Question 10: ', validators=[Length(max=195, message='There was an error...')])
    answer10 = StringField('Answer 10: ', validators=[Length(max=495, message='There was an error...')])
    enabled10 = BooleanField('Enabled?')
    submit = SubmitField('Save')