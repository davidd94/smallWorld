from threading import Thread, Event
from flask_socketio import send, emit


thread = Thread()
thread_stop_event = Event()


class RandomThread(Thread):
    def __init__(self):
        self.delay = 3
        super(RandomThread, self).__init__()
    
    def randomNumGenerator(self):
        print('Making random numbers')
        while not thread_stop_event.isSet():
            number = round(random()*10, 3)
            print(number)
            emit('chatlist', number)
            sleep(self.delay)

    def run(self):
        self.randomNumGenerator()