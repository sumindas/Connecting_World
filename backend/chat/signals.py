# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from .models import Notification
# from user.models import Like, Comment, Following

# @receiver(post_save, sender=Like)
# def create_notification_for_like(sender, instance, created, **kwargs):
#     if created and instance.user != instance.post.user:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.send)(
#             "notifications",
#             {
#                 "type": "create_notification",
#                 "user_id": instance.post.user.id,
#                 "follower_id": instance.user.id,
#                 "post_id": instance.post.id,
#                 "content": f"{instance.user.username} liked your post.",
#                 "notification_type": "like"
#             }
#         )
#         print("Sending SIgnals to Channels")
        

# @receiver(post_save, sender=Following)
# def create_notification_for_following(sender, instance, created, **kwargs):
#     if created and instance.follower != instance.followed:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.send)(
#             "notifications",
#             {
#                 "type": "create_notification",
#                 "user_id": instance.followed.id,
#                 "follower_id": instance.follower.id,
#                 "content": f"{instance.follower.username} started following you.",
#                 "notification_type": "follow"
#             }
#         )

# @receiver(post_save, sender=Comment)
# def create_notification_for_comment(sender, instance, created, **kwargs):
#     if created and instance.user != instance.post.user:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.send)(
#             "notifications",
#             {
#                 "type": "create_notification",
#                 "user_id": instance.post.user.id,
#                 "follower_id": instance.user.id,
#                 "post_id": instance.post.id,
#                 "content": f"{instance.user.username} commented on your post.",
#                 "notification_type": "comment"
#             }
#         )




from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification,Message
from user.models import Like,Comment,Following

channel_layer = get_channel_layer()

@receiver(post_save, sender=Like)
def create_notification_for_like(sender, instance, created, **kwargs):
    if created and instance.user != instance.post.user:
        Notification.objects.create(
            user=instance.post.user,
            follower=instance.user,
            post=instance.post,
            content=f"{instance.user.username} liked your post."
        )
        send_notification(instance.post.user.id)


@receiver(post_save, sender=Following)
def create_notification_for_following(sender, instance, created, **kwargs):
    print(f"Signal triggered for Following instance {instance.id}, created: {created}, is_active: {instance.is_active}")
    if created and instance.follower != instance.followed:
        print("creating Notification")
        try:
            Notification.objects.create(
                user=instance.followed,
                follower=instance.follower,
                content=f"{instance.follower.username} started following you."
            )
            send_notification(instance.followed.id)
        except Exception as e:
            print(f"Error creating notification: {e}")

@receiver(post_save, sender=Comment)
def create_notification_for_comment(sender, instance, created, **kwargs):
    if created and instance.user != instance.post.user:
        Notification.objects.create(
            user=instance.post.user, 
            follower=instance.user,
            post=instance.post,
            content=f"{instance.user.username} commented on your post."
        )
        send_notification(instance.post.user.id)

# @receiver(post_save, sender=Message)
# def create_notification_for_message(sender, instance, created, **kwargs):
#     if created:
#         other_user = instance.chat_room.user1 if instance.user == instance.chat_room.user2 else instance.chat_room.user2
#         Notification.objects.create(
#             user=other_user,
#             follower=instance.user,
#             content=f"{instance.user.username} sent you a message."
#         )
#         send_notification(other_user.id)

def send_notification(user_id):
    print("Sending Notification.......")
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            'type': 'send_notification',
            'message': 'New notification!',
            'user_id': user_id,
        }
    )

# @receiver(post_save, sender=Like)
# def create_notification_for_like(sender, instance, created, **kwargs):
#     if created and instance.user != instance.post.user:
#         Notification.objects.create(
#             user=instance.post.user, 
#             follower=instance.user,
#             post=instance.post,
#             content=f"{instance.user.username} liked your post."
#         )


# @receiver(post_save, sender=Following)
# def create_notification_for_following(sender, instance, created, **kwargs):
#     print(f"Signal triggered for Following instance {instance.id}, created: {created}, is_active: {instance.is_active}")
#     if created and instance.follower != instance.followed:
#         print("creating Notification")
#         try:
#             Notification.objects.create(
#             user=instance.followed,
#             follower=instance.follower,
#             content=f"{instance.follower.username} started following you."
#         )
#         except Exception as e:
#             print(f"Error creating notification: {e}")


# @receiver(post_save, sender=Comment)
# def create_notification_for_comment(sender, instance, created, **kwargs):
#     if created and instance.user != instance.post.user:
#         Notification.objects.create(
#             user=instance.post.user, 
#             follower=instance.user,
#             post=instance.post,
#             content=f"{instance.user.username} commented on your post."
#         )
        
# @receiver(post_save, sender=Message)
# def create_notification_for_message(sender, instance, created, **kwargs):
#     if created:
#         other_user = instance.chat_room.user1 if instance.user == instance.chat_room.user2 else instance.chat_room.user2
#         Notification.objects.create(
#             user=other_user,
#             follower=instance.user,
#             content=f"{instance.user.username} sent you a message."
#         )