from django.urls import path
from .views import *


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
    path('login/',LoginView.as_view(),name='login'),
    path("auth/login/google/", GoogleLoginApi.as_view(), name="login-with-google"),
    path('userprofile/',UserProfileCreateView.as_view(),name='userprofile'),
    path('userdata/<int:user_id>/',userView.as_view(),name='userdata')
]
