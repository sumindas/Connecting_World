# Generated by Django 5.0.1 on 2024-02-21 18:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_rename_user_message_sender'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='sender',
            new_name='user',
        ),
    ]