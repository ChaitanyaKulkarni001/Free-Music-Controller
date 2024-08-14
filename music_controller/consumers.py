import json
from channels.generic.websocket import WebsocketConsumer

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'room_{self.room_name}'

        self.accept()

        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        action = data['action']

        self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'room_action',
                'action': action
            }
        )

    def room_action(self, event):
        action = event['action']
        self.send(text_data=json.dumps({
            'action': action
        }))
