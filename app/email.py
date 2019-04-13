from flask import current_app, render_template
from flask_mail import Message
from app import mail
from threading import Thread


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, sender, recipients, html_body, text_body, attachments=None, sync=False):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.html = html_body
    msg.text = text_body
    if attachments:
        for attachment in attachments:
            msg.attach(*attachment)
    if sync:
        mail.send(msg)
    else:
        Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()

def send_confirmation_email(user):
    token = user.get_confirmation_token()
    send_email('smallWorld - New Account Verification', sender=current_app.config['ADMIN'], recipients=[user.email],
                html_body=render_template('email/confirm_acct.html', user=user, token=token),
                text_body=None)

def send_password_reset_email(user):
    token = user.get_reset_password_token()
    send_email('smallWorld - Password Reset', sender=current_app.config['ADMIN'], recipients=[user.email],
                html_body=render_template('email/reset_password.html', user=user, token=token),
                text_body=None)

def send_notification_email(sendinguser, recip, note_type, title, content):
    if note_type == 'message':
        template = render_template('email/message_notification.html', sender=sendinguser, recip=recip, title=title, content=content)
    elif note_type == 'comment':
        template = render_template('email/comment_notification.html', sender=sendinguser, recip=recip, title=title, content=content)
    else:
        template = render_template('email/reply_notification.html', sender=sendinguser, recip=recip, title=title, content=content)
    
    send_email('smallWorld - New ' + note_type + ' Notification',
                sender=current_app.config['ADMIN'],
                recipients=[recip.email],
                html_body=template,
                text_body=None)