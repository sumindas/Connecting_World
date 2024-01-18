from django.urls import path
from .views import SignUpView,Verify_Otp,LoginView,GoogleLogin


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
    path('login/',LoginView.as_view(),name='login'),
    path('google/',GoogleLogin.as_view(),name='google'),
]
