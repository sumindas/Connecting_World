from django.urls import path,include
from .views import *


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOtpView.as_view(),name='resend_otp'),
    path('login/',LoginView.as_view(),name='login'),
    path('userdata/',userView.as_view(),name='userdata'),
    path('logout/',UserLogout.as_view(),name='logout'),
    path('google/', GoogleLogin.as_view(),name='google_login'),
    path('userupdate/<int:user_id>/',UserProfileUpdate.as_view(),name='userupdate'),
    path('addpost/',PostCreateAPIView.as_view(),name='postadd')
]
