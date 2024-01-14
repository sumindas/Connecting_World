from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager,PermissionsMixin
from django.utils import timezone



class CustomUserManager(BaseUserManager):
    def create_user(self,email,password,**extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
    
    
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
    
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='custom_users',
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        related_name='custom_users',
        related_query_name='custom_user',
    )


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def __iter__(self):
        yield self.id 
        

