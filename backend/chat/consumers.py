import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Message, ChatRoom
from user.models import CustomUser
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer



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

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))


# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user = self.scope['user']
#         if self.user.is_authenticated:
#             await self.channel_layer.group_add(
#                 f'notifications_{self.user.id}',
#                 self.channel_name
#             )
#             await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             f'notifications_{self.user.id}',
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         await self.send(text_data=json.dumps({
#             'message': message
#         }))
        
        
 

#     async def notification_event(self, event):
#         notification = event['notification']
#         message = f"{notification['content']} - {notification['timestamp']}"

#         await self.send(text_data=json.dumps({
#             'message': message
#         }))

