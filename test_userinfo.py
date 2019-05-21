from config import Config
from datetime import datetime, timedelta
from app import create_app, db
from app.models import User, Projects, ProjectComments, CommentReplies
import unittest

# NEED TO COMMENT OUT FLASK SOCKETIO IN INIT FILE PRIOR RUNNING TEST

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'

class UserModelCase(unittest.TestCase):
    def setUp(self):
        print('setting up..')
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        print('tearing down...')
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_password_hashing(self):
        u = User(username='Davie')
        u.create_password('mouse')
        self.assertFalse(u.check_password('cat'))
        self.assertTrue(u.check_password('mouse'))

    def test_avatar(self):
        u = User(username='Avatarname', email='john@example.com')
        self.assertEqual(u.avatar(128), ('https://www.gravatar.com/avatar/'
                                         'd4c74594d841139328695756648b6bd6'
                                         '?d=identicon&s=128'))

    def test_follow(self):
        u1 = User(username='Davie', email='anyemail@example.com')
        u2 = User(username='Davie2', email='anyemail2@example.com')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()
        self.assertEqual(u1.followed.all(), [])
        self.assertEqual(u1.followers.all(), [])

        u1.follow(u2)
        db.session.commit()
        self.assertTrue(u1.is_following(u2))
        self.assertEqual(u1.followed.count(), 1)
        self.assertEqual(u1.followed.first().username, 'Davie2')
        self.assertEqual(u2.followers.count(), 1)
        self.assertEqual(u2.followers.first().username, 'Davie')

        u1.unfollow(u2)
        db.session.commit()
        self.assertFalse(u1.is_following(u2))
        self.assertEqual(u1.followed.count(), 0)
        self.assertEqual(u2.followers.count(), 0)

    def test_block(self):
        u1 = User(username='blocker', email='blocker@example.com')
        u2 = User(username='blocked', email='blocked@example.com')
        db.session.add(u1)
        db.session.add(u2)
        db.session.commit()
        self.assertEqual(u1.blocked.all(), [])

        u1.block(u2)
        db.session.commit()
        self.assertTrue(u1.is_blocking(u2))
        self.assertEqual(u1.blocked.count(), 1)
        self.assertEqual(u1.blocked.first().username, 'blocked')
        self.assertEqual(u2.blocker.count(), 1)
        self.assertEqual(u2.blocker.first().username, 'blocker')

        u1.unblock(u2)
        db.session.commit()
        self.assertFalse(u1.is_blocking(u2))
        self.assertEqual(u1.blocked.count(), 0)
        self.assertEqual(u2.blocker.count(), 0)

    def test_likeproject(self):
        u = User(username='projectliker', email='projectliker@example.com')
        p = Projects(title='testingproject')
        db.session.add(u)
        db.session.add(p)
        db.session.commit()
        self.assertEqual(u.projects_liked.all(), [])

        u.like_project(p)
        db.session.commit()
        self.assertTrue(u.is_liking_project(p))
        self.assertEqual(u.projects_liked.count(), 1)
        self.assertEqual(u.projects_liked.first().title, 'testingproject')

        u.unlike_project(p)
        db.session.commit()
        self.assertFalse(u.is_liking_project(p))
        self.assertEqual(u.projects_liked.count(), 0)

    def test_likecomment(self):
        u = User(username='commentliker', email='commentliker@example.com')
        c = ProjectComments(title='testingcomment')
        db.session.add(u)
        db.session.add(c)
        db.session.commit()
        self.assertEqual(u.comments_liked.all(), [])

        u.like_comment(c)
        db.session.commit()
        self.assertTrue(u.is_liking_comment(c))
        self.assertEqual(u.comments_liked.count(), 1)
        self.assertEqual(u.comments_liked.first().title, 'testingcomment')

        u.unlike_comment(c)
        db.session.commit()
        self.assertFalse(u.is_liking_comment(c))
        self.assertEqual(u.comments_liked.count(), 0)

    def test_likereply(self):
        u = User(username='replyliker', email='replyliker@example.com')
        r = CommentReplies(title='testingreply')
        db.session.add(u)
        db.session.add(r)
        db.session.commit()
        self.assertEqual(u.replies_liked.all(), [])

        u.like_reply(r)
        db.session.commit()
        self.assertTrue(u.is_liking_reply(r))
        self.assertEqual(u.replies_liked.count(), 1)
        self.assertEqual(u.replies_liked.first().title, 'testingreply')

        u.unlike_reply(r)
        db.session.commit()
        self.assertFalse(u.is_liking_reply(r))
        self.assertEqual(u.replies_liked.count(), 0)

if __name__ == '__main__':
    unittest.main(verbosity=2)