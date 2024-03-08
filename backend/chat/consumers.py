import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Message, ChatRoom
from user.models import CustomUser, Post,Comment
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from chat.models import Notification
from django.db import transaction



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'] is None:
            await self.close()
            return
        if 'id' not in self.scope['url_route']['kwargs']:
            await self.close()
            return
        
        if self.scope['user'].is_authenticated:
            self.chat_with_user = self.scope['url_route']['kwargs']['id']
            user_ids = [int(self.scope['user'].id), int(self.chat_with_user)]
            user_ids = sorted(user_ids)
            self.room_group_name = f"chat_{user_ids[0]}-{user_ids[1]}"

            self.chat_room, created = await self.get_or_create_chat_room()

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    @database_sync_to_async
    def get_or_create_chat_room(self):
        user1 = self.scope['user']
        user2 = CustomUser.objects.get(id=self.chat_with_user)
        user_ids = sorted([user1.id, user2.id])
        user1, user2 = CustomUser.objects.filter(id__in=user_ids)
        return ChatRoom.objects.get_or_create(user1=user1, user2=user2)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        print(f"Received text_data: {text_data}")  
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")  
            return

        message_content = data['message']
        await self.save_message(message_content)

        event = {
            'type': 'send_message',
            'message': message_content,
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            event
        )


    @database_sync_to_async
    def save_message(self, message_content):
        Message.objects.create(
            chat_room=self.chat_room,
            user=self.scope['user'],
            content=message_content
        )
        
    @database_sync_to_async
    def get_message_object(self, message_content):
        try:
            message = Message.objects.filter(content=message_content).first()
            message_obj = {
                'id': message.id,
                'chat_room': message.chat_room.id, 
                'user': message.user.id, 
                'content': message.content,
                'timestamp': message.timestamp.isoformat(), 
            }
            return message_obj
        except Message.DoesNotExist:
            return None
    
    async def send_message(self, event):
        message_content = event['message']
        message_obj = await self.get_message_object(message_content)
        await self.send(text_data=json.dumps(message_obj))
        
        

#Video Call


class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.channel_layer.group_add(
            f"video_{self.user_id}",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f"video_{self.user_id}",
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        if message_type == 'offer':
            await self.handle_offer(text_data_json)
        elif message_type == 'answer':
            await self.handle_answer(text_data_json)
        elif message_type == 'candidate':
            await self.handle_candidate(text_data_json)
        else:
            print("Unknown message type:", message_type)

    async def handle_offer(self, message):
        # Here, you would typically store the offer and send it to the other user
        # For simplicity, we'll just broadcast it to the group
        await self.channel_layer.group_send(
            f"video_{self.user_id}",
            {
                'type': 'video_message',
                'message': message
            }
        )

    async def handle_answer(self, message):
        # Similar to handle_offer, you would handle the answer here
        await self.channel_layer.group_send(
            f"video_{self.user_id}",
            {
                'type': 'video_message',
                'message': message
            }
        )

    async def handle_candidate(self, message):
        # Handle ICE candidates similarly
        await self.channel_layer.group_send(
            f"video_{self.user_id}",
            {
                'type': 'video_message',
                'message': message
            }
        )

    async def video_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


#Notifications

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'] is None:
            await self.close()
            return
        if 'user_id' not in self.scope['url_route']['kwargs']:
            await self.close()
            return
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.user_group_name = f'user_{self.user_id}'
        
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        print("text:",text_data)
        data = json.loads(text_data)
        user_id = data['user_id']
        notifications = Notification.objects.filter(user_id=user_id, read=False)

        await self.send(text_data=json.dumps({
            'notifications': [{'content': notification.content, 'timestamp': str(notification.timestamp)}
                              for notification in notifications]
        }))

    async def send_notification(self, event):
        print("------shshjhs------")
        await self.send(text_data=json.dumps({
            'message': 'Notification received!'
        }))
