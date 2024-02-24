from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import  Notification
from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from user.models import Following

channel_layer = get_channel_layer()

@receiver(post_save, sender=Following)
def create_and_send_notification(sender, instance, created, **kwargs):
    if created and instance.is_active:
        follower = instance.follower
        followed = instance.followed
        notification = Notification.objects.create(
            user=followed,  
            follower=follower,
            content=f"{follower.username} started following you"
        )

        async_to_sync(channel_layer.group_send)(
            f'notifications_{followed.id}',
            {
                'type': 'notification_event',
                'notification': {  
                    'id': notification.id,
                    'content': notification.content,
                    'timestamp': notification.timestamp.isoformat(),
                }
            }
        )
