from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from app.models import User

class LoginForm(FlaskForm):
    username = StringField('User Name', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Log in')

class RegistrationForm(FlaskForm):
    username = StringField('User Name', validators=[DataRequired(), Length(min=5, max=20, message='User name must be a 5-20 characters long.')])
    firstname = StringField('First Name', validators=[DataRequired()])
    lastname = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email(), Length(max=50, message='Maximum of 50 characters is allowed for your email address.')])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=5, max=30, message='Password must be 5-30 characters long with one lowercase, uppercase, and number.')])
    repassword = PasswordField('Retype Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Submit')
    
    #CUSTOM VALIDATORS: MUST HAVE METHODS NAMED AS "validate_<field name>"
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('That user name has already been taken.')

    def validate_email(self, email):
        email = User.query.filter_by(email=email.data).first()
        if email is not None:
            raise ValidationError('That email has already been taken.')

class PasswordResetRequestForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Submit')

class PasswordResetForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired(), Length(min=5, max=30, message='Password must be 5-30 characters long with one lowercase, uppercase, and number.')])
    repassword = PasswordField('Retype Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Submit')
