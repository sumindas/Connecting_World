from . import views
from django.urls import path
from .views import *

urlpatterns = [
    path('chat/create/', ChatRoomCreateView.as_view(), name='chat-create'),
    path('chat/<int:chat_room_id>/messages/', MessageListView.as_view(), name='chat-messages'),
]
