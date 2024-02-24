# utils.py
from chat.models import ChatRoom, Message
from user.models import CustomUser

def get_or_create_chat_room(user1, user2):
    user_ids = sorted([user1.id, user2.id])
    user1, user2 = CustomUser.objects.filter(id__in=user_ids)
    return ChatRoom.objects.get_or_create(user1=user1, user2=user2)
