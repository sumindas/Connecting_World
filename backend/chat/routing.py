from django.urls import path
from .consumers import ChatConsumer,NotificationConsumer,VideoConsumer


websocket_urlpatterns = [
    path('ws/chat/<int:id>/',ChatConsumer.as_asgi()),
    path('ws/notifications/<int:user_id>/',NotificationConsumer.as_asgi()),
    path('ws/video/', VideoConsumer.as_asgi()), 
]