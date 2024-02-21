from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils import timezone
from .manager import CustomUserManager
from phonenumber_field.modelfields import PhoneNumberField



    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=30, blank=True)
    username = models.CharField(max_length=30, blank=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    ph_no=models.CharField(max_length=15,blank=True)

    
    objects = CustomUserManager()
    
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class OnlineUser(models.Model):
	user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.username


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    phone = PhoneNumberField(unique=False, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', blank=True, null=True)

    
    def __str__(self):
        return self.user.username
    
class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_deleted = models.BooleanField(default=False)
    

    def __str__(self):
        return f'{self.user.username} - {self.created_at}'

class PostImage(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    images_url = models.ImageField(upload_to='post_images/')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.images_url}'
    


class PostVideo(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    video_url = models.FileField(upload_to='post_videos/')
    is_deleted = models.BooleanField(default=False)
    
    
    def __str__(self):
        return f'{self.video_url}'
    

class Like(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} likes {self.post}'
    
class Dislike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} dislikes {self.post}'

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} commented on {self.post}'

class Reply(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} replied to {self.comment}'



class Following(models.Model):
    """
    Model representing the "following" relationship between two users.
    """
    follower = models.ForeignKey(
        CustomUser,
        related_name='following',
        on_delete=models.CASCADE,
        verbose_name='Follower'
    )
    followed = models.ForeignKey(
        CustomUser,
        related_name='followers',
        on_delete=models.CASCADE,
        verbose_name='Followed'
    )
    is_active = models.BooleanField(default=False, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed',)
        verbose_name = 'Following'
        verbose_name_plural = 'Followings'

    def __str__(self):
        return f'{self.follower.username} is following {self.followed.username}'
    
    
