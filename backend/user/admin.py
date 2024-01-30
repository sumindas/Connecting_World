from django.contrib import admin
from .models import *
from .views import *



# Register your models here.

admin.site.register(CustomUser)
admin.site.register(UserProfile)
