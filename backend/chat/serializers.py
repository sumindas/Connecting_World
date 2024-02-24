from rest_framework import serializers
from .models import ChatRoom, Message,Notification
from user.serializer import CustomUserSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id','user1','user2'] 

class MessageSerializer(serializers.ModelSerializer):
    chat_room = ChatRoomSerializer(read_only=True)  
    user =  CustomUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'user', 'content','timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['user', 'follower', 'content', 'timestamp', 'read']