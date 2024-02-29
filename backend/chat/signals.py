from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification
from user.models import Like,Comment,Following




@receiver(post_save, sender=Like)
def create_notification_for_like(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.post.user, 
            follower=instance.user,
            post=instance.post,
            content=f"{instance.user.username} liked your post."
        )


@receiver(post_save, sender=Following)
def create_notification_for_following(sender, instance, created, **kwargs):
    print(f"Signal triggered for Following instance {instance.id}, created: {created}, is_active: {instance.is_active}")
    if created and instance.is_active:
        Notification.objects.create(
            user=instance.followed,
            follower=instance.follower,
            content=f"{instance.follower.username} started following you."
        )

@receiver(post_save, sender=Comment)
def create_notification_for_comment(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.post.user, 
            follower=instance.user,
            post=instance.post,
            content=f"{instance.user.username} commented on your post."
        )
