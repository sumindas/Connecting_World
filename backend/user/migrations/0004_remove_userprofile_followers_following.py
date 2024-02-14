# Generated by Django 5.0.1 on 2024-02-13 20:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_rename_image_postimage_images_url_remove_post_images_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='followers',
        ),
        migrations.CreateModel(
            name='Following',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('followed', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='followers', to=settings.AUTH_USER_MODEL, verbose_name='Followed')),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to=settings.AUTH_USER_MODEL, verbose_name='Follower')),
            ],
            options={
                'verbose_name': 'Following',
                'verbose_name_plural': 'Followings',
                'unique_together': {('follower', 'followed')},
            },
        ),
    ]
