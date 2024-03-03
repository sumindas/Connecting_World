from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ChatRoom, Message,Notification
from .serializers import ChatRoomSerializer, MessageSerializer
from user.serializer import NotificationSerializer
from rest_framework.views import APIView
from .utils import get_or_create_chat_room
from rest_framework.decorators import api_view
from user.models import CustomUser
from rest_framework.exceptions import NotFound
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status,viewsets

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user_id1 = self.kwargs['user_id1']
        user_id2 = self.kwargs['user_id2']
        try:
            chat_room = ChatRoom.objects.filter(
            Q(user1_id=user_id1, user2_id=user_id2) |
            Q(user1_id=user_id2, user2_id=user_id1)
        )
            print("------",chat_room)
            if not chat_room:  
                raise NotFound('Room not found')

            
            return Message.objects.filter(chat_room__in=chat_room).order_by('-timestamp') 
        except ChatRoom.DoesNotExist:  
            return Message.objects.none()


class UserNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user_id = self.kwargs['userId']
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        return Notification.objects.filter(user=user).order_by('-timestamp')
    
    
class MarkNotificationAsReadView(APIView):
    def get(self, request,notification_id, format=None):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.read = True
            notification.save()
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
