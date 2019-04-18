import time
import celery
from flask_mail import Message
import random


# WORKER FUNCTIONS
@celery.task
def send_async_email(recipient):
    with current_app.app_context():
        """ NEEDED TO PASS VALUES TO WORKER FUNCTIONS TO CREATE Message INSTANCE 
        IN TASK. CANNOT CREATE PRIOR DUE TO CELERY4.0+ SWITCHED TO JSON AND CANNOT 
        SERIALIZE Message OBJECT in JSON FORMAT """
        msg = Message('Hello from Flask',
                    recipients=[recipient])
        msg.body = 'This is a test email sent from a background Celery task.'
        mail.send(msg)

@celery.task(bind=True)
def long_task(self):
    """Background task that runs a long function with progress reports."""
    verb = ['Starting up', 'Booting', 'Repairing', 'Loading', 'Checking']
    adjective = ['master', 'radiant', 'silent', 'harmonic', 'fast']
    noun = ['solar array', 'particle reshaper', 'cosmic ray', 'orbiter', 'bit']
    message = ''
    total = random.randint(10, 50)
    for i in range(total):
        if not message or random.random() < 0.25:
            message = '{0} {1} {2}...'.format(random.choice(verb),
                                              random.choice(adjective),
                                              random.choice(noun))
        self.update_state(state='PROGRESS',
                          meta={'current': i, 'total': total,
                                'status': message})
        time.sleep(1)
    return {'current': 100, 'total': 100, 'status': 'Task completed!',
            'result': 42}

@celery.task(bind=True)
def test_export(self):
    random_increments = random.randint(4, 10)
    for i in range(random_increments):
        self.update_state(state='PROGRESS',
                            meta={'current': i,
                                    'total': random_increments,
                                    'status': '{} / {}'.format(i, random_increments)})
        time.sleep(2)
    return {'current': 100,
            'total': 100,
            'status': 'Successfully exported!',
            'results': 'Insert pdf file here??'}