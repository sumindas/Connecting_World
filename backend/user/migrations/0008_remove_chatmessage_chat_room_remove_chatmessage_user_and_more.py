# Generated by Django 5.0.1 on 2024-02-20 05:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_chatroom_like_is_deleted_chatmessage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatmessage',
            name='chat_room',
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='user',
        ),
        migrations.DeleteModel(
            name='ChatRoom',
        ),
        migrations.DeleteModel(
            name='ChatMessage',
        ),
    ]