import os
import click

def register(app):
    @app.cli.group()
    def translate():
        """Translation and localization commands."""
        pass

    @translate.command()
    def update():
        """Update all languages."""
        if os.system('pybabel extract -F babel.cfg -k _l -o messages.pot .'):
            raise RuntimeError('extract command failed')
        if os.system('pybabel update -i messages.pot -d app/translations'):
            raise RuntimeError('update command failed')
        os.remove('messages.pot')

    @translate.command()
    def compile():
        """Compile all languages."""
        if os.system('pybabel compile -d app/translations'):
            raise RuntimeError('compile command failed')

    @translate.command()
    @click.argument('lang')
    def init(lang):
        """Initialize a new language."""
        if os.system('pybabel extract -F babel.cfg -k _l -o messages.pot .'):
            raise RuntimeError('extract command failed')
        if os.system('pybabel init -i messages.pot -d app/translations -l ' + lang):
            raise RuntimeError('init command failed')
        os.remove('messages.pot')
    
    
    @app.cli.command()
    def dbtest():
        """FOR TESTING DB! Delete me!!!"""
        from app import db
        from app.models import User, ProjectComments, comment_likers

        # Get the first ProjectComments model and use its ID
        # p = ProjectComments.query.first()
        # id = p.id
        id = 4

        # Give me all the users that liked a specific commenmt
        rv = db.session.query(comment_likers, User) \
            .filter(comment_likers.c.comment_id == id) \
            .join(User, User.id == comment_likers.c.user_id) \
            .all()
        for row in rv:
            print(row)