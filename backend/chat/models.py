from django.db import models
import uuid
from user.models import CustomUser

# Create your models here.


class ChatRoom(models.Model):
    user1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chatrooms_as_user1')
    user2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chatrooms_as_user2')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2')

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        
        
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications_received')
    follower = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications_sent')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.content}"


