from app import create_app, cli, db
from app.models import User, Messages, Projects, PhotoGallery, ProjectComments, CommentReplies, Notifications


app = create_app()
cli.register(app)


# THIS IS USED TO AUTOMATICALLY IMPORT THE CLASS/MODULES WHEN RUNNING 'FLASK SHELL'
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Messages': Messages, 'Projects': Projects,
            'ProjectComments': ProjectComments, 'CommentReplies': CommentReplies,
            'Notifications': Notifications}


if __name__ == "__main__":
    app.run(debug=True)