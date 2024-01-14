from django.urls import path
from .views import SignUpView,Verify_Otp

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
]
