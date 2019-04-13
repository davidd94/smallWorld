from flask import request
from flask_wtf import FlaskForm
from flask_login import current_user
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, IntegerField, DecimalField
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, Length, NumberRange
from app.models import User, Projects


class EditProfileForm(FlaskForm):
    username = StringField('User Name')
    firstname = StringField('First Name')
    lastname = StringField('Last Name')
    email = StringField('Email', validators=[DataRequired(), Email(), Length(max=50, message='An email is required with a maximum of 50 characters.')])
    password = PasswordField('Password')
    repassword = PasswordField('Retype Password', validators=[EqualTo('password')])
    picture = StringField('Avatar Picture')
    randomavatar = BooleanField('Get randomized Gravatar?')
    bio = TextAreaField('Bio', validators=[Length(min=0, max=400)])
    submit = SubmitField('Save')

    
    def __init__(self, original_email, *args, **kwargs):
        super(EditProfileForm, self).__init__(*args, **kwargs)
        self.original_email = original_email
    
    def validate_firstname(self, firstname):
        if len(firstname.data) == 0:
            raise ValidationError('You must enter a first name')
    
    def validate_lastname(self, lastname):
        if len(lastname.data) == 0:
            raise ValidationError('You must enter a last name')

    def validate_email(self, email):
        if email.data != self.original_email:
            user = User.query.filter_by(email=self.email.data).first()
            if user is not None:
                raise ValidationError('That email is already taken')
    
    def validate_password(self, password):
        if 0 < len(password.data) < 5:
            raise ValidationError('Password must be 5-30 characters long with one lowercase, uppercase, and number')

class MessageForm(FlaskForm):
    recipient = StringField('User Name', validators=[DataRequired(), Length(min=5, message="User name must be a minimum of 5 characters long")])
    subject = StringField('Subject', validators=[Length(min=3, max=50, message="Subject must be 5-50 characters long")])
    body = TextAreaField('Message', validators=[Length(max=499, message='Message: max of 500 characters long')])
    submit = SubmitField('Send')

    
    def validate_recipient(self, recipient):
        user = User.query.filter_by(username=recipient.data).first()
        if user is None:
            raise ValidationError('That user does not exist')
        if current_user.username == user.username:
            raise ValidationError('You cannot message yourself')

class SearchForm(FlaskForm):
    q = StringField('Search', validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        if 'formdata' not in kwargs:
            kwargs['formdata'] = request.args
        if 'csrf_enabled' not in kwargs:
            kwargs['csrf_enabled'] = False
        super(SearchForm, self).__init__(*args, **kwargs)