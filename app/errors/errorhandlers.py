from flask import render_template, current_app, request
from app import db, email
from app.errors import bp
from app.api.errors import error_response as api_error_response


def wants_json_response():
    return request.accept_mimetypes['application/json'] >= \
        request.accept_mimetypes['text/html']


@bp.app_errorhandler(404)
def not_found_error(error):
    # API ERROR RESPONSE
    if wants_json_response():
        return api_error_response(404)
    
    # FLASK MAIL FEATURE HERE
    if not current_app.debug:
        msg = email.send_email
        if current_app.config['MAIL_USERNAME'] and current_app.config['MAIL_PASSWORD']:
                subject = "smallWorld Internal Error (404)"
                html = 'there has been an error........ :('
                body = 'there has been an error........ :('
                msg(subject, sender='no-reply@' + current_app.config['MAIL_SERVER'],
                recipients=['smallWorld949@gmail.com'], text_body=body, html_body=html)
        
    return render_template('errors/404.html'), 404

@bp.app_errorhandler(500)
def internal_error(error):
    # FLASK MAIL FEATURE HERE
    if not current_app.debug:
        msg = email.send_email
        if current_app.config['MAIL_USERNAME'] and current_app.config['MAIL_PASSWORD']:
                subject = "smallWorld Database Error (500)"
                html = 'there has been an error........ :('
                body = 'there has been an error........ :('
                msg(subject, sender='no-reply@' + current_app.config['MAIL_SERVER'],
                recipients=['smallWorld949@gmail.com'], text_body=body, html_body=html)

    db.session.rollback()
    if wants_json_response():
        return api_error_response(500)
    return render_template('errors/500.html'), 500