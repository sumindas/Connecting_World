from rest_framework import serializers
from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id','user1','user2'] 

class MessageSerializer(serializers.ModelSerializer):
    room = ChatRoomSerializer(read_only=True)  
    sender = serializers.CharField(source='sender.username')  

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'user', 'message', 'timestamp']
