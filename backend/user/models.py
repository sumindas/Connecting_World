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



class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    phone = PhoneNumberField(unique=True, blank=True)
    followers = models.ManyToManyField(CustomUser, related_name='following', blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', blank=True, null=True)

    
    def __str__(self):
        return self.user.username
    
class Post(models.Model):
    user = models.ForeignKey(CustomUser,on_delete = models.CASCADE)
    content = models.TextField()
    tags = models.TextField()
    location = models.CharField(max_length=100)
    created_at = models.DateTimeField(default = timezone.now)
    
    
class Post_Images(models.Model):
    post = models.ForeignKey(Post,on_delete = models.CASCADE)
    image_url = models.ImageField(upload_to='post_imgs/')


