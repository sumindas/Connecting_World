from django.urls import path
from .views import *


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
    path('login/',LoginView.as_view(),name='login'),
    path('userdata/',userView.as_view(),name='userdata'),
    path('profileupdate/',UpdateUserProfileView.as_view(),name='profileupdate')
]
