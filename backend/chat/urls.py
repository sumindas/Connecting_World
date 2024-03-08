from . import views
from django.urls import path
from .views import *

urlpatterns = [
    # path('chat/create/', ChatRoomCreateView.as_view(), name='chat-create'),
    path('user/<int:user_id1>/<int:user_id2>/messages/', MessageListView.as_view(), name='chat-messages'),
    path('user/<int:userId>/notifications/',UserNotificationsView.as_view(),name='notifications'),
    path('user/notifications/<int:notification_id>/mark-as-read/', MarkNotificationAsReadView.as_view(), name='mark_notification_as_read'),
    path('mark_messages_as_read/<int:user_id>/', MarkMessagesAsReadView.as_view(), name='mark_messages_as_read'),
]
