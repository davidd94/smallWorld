from app import create_app, cli, db, socketio
from app.models import User, Messages, Projects, PhotoGallery, ProjectComments, CommentReplies, Notifications, ChatMessages, Itemlist, FAQs


app = create_app()
cli.register(app)


# THIS IS USED TO AUTOMATICALLY IMPORT THE CLASS/MODULES WHEN RUNNING 'FLASK SHELL'
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Messages': Messages, 'Projects': Projects,
            'ProjectComments': ProjectComments, 'CommentReplies': CommentReplies,
            'Notifications': Notifications, 'ChatMessages': ChatMessages,
            'ItemList': Itemlist, 'FAQs': FAQs}


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=8050, debug=True)