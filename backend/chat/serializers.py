from rest_framework import serializers
from .models import ChatRoom, Message,Notification
from user.serializer import CustomUserSerializer
from user.models import Post
from user.serializer import PostSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id','user1','user2'] 

class MessageSerializer(serializers.ModelSerializer):
    chat_room = ChatRoomSerializer(read_only=True)  

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'user', 'content','timestamp']


