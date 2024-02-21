import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Message, ChatRoom
from user.models import CustomUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        request_user = self.scope['user']
        print("user",request_user,request_user.id)
        self.chat_with_user = self.scope['url_route']['kwargs']['id']
        print("chat",self.chat_with_user)
        user_ids = [int(request_user.id), int(self.chat_with_user)]
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
        data = json.loads(text_data)
        message_content = data['message']

        await self.save_message(message_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message_content,
            }
        )

    @database_sync_to_async
    def save_message(self, message_content):
        Message.objects.create(
            chat_room=self.chat_room,
            user=self.user,
            content=message_content
        )

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))










