from django.urls import path,include
from .views import *
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter







urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('verify_otp/',Verify_Otp.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOtpView.as_view(),name='resend_otp'),
    path('login/',LoginView.as_view(),name='login'),
    path('userdata/',userView.as_view(),name='userdata'),
    path('logout/',UserLogout.as_view(),name='logout'),
    path('google/', GoogleLogin.as_view(),name='google_login'),
    path('userupdate/<int:user_id>/',UserProfileUpdate.as_view(),name='userupdate'),
    path('addpost/<int:id>/',PostCreateAPIView.as_view(),name='postadd'),
    path('posts/<int:user_id>/',UserPostListAPIView.as_view(),name='posts'),
    path('updatepost/<int:post_id>/', PostUpdateAPIView.as_view(), name='postupdate'),
    path('likes/', LikeAPIView.as_view(), name='like'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
