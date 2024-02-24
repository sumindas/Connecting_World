from . import views
from django.urls import path
from .views import *

urlpatterns = [
    # path('chat/create/', ChatRoomCreateView.as_view(), name='chat-create'),
    path('user/<int:user_id1>/<int:user_id2>/messages/', MessageListView.as_view(), name='chat-messages'),
    path('user/<int:userId>/notifications/',UserNotificationsView.as_view(),name='notifications'),
]
