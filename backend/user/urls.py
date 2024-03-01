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
    path('test/',SimpleView.as_view(),name='simple'),
    path('forget-password/', ForgotPasswordView.as_view(), name='forgot_pass'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('userdata/',userView.as_view(),name='userdata'),
    path('logout/<int:user_id>/',UserLogout.as_view(),name='logout'),
    path('userprofile/<int:user_id>/', UserProfileDetailView.as_view(), name='userprofile-detail'),
    path('userupdate/<int:user_id>/',UserProfileUpdate.as_view(),name='userupdate'),
    path('addpost/<int:id>/',PostCreateAPIView.as_view(),name='postadd'),
    path('posts/<int:user_id>/',UserPostListAPIView.as_view(),name='posts'),
    path('updatepost/<int:post_id>/', PostUpdateAPIView.as_view(), name='postupdate'),
    path('likes/', LikeAPIView.as_view(), name='like'),
    path('comment/',CommentCreateAPIView.as_view(),name='comment'),
    path('comments/<int:commentId>/replies/create/<int:userId>/', ReplyCreateAPIView.as_view(), name='reply-create'),
    path('posts/<int:post_id>/comments/', CommentListAPIView.as_view(), name='comment-list'),
    path('posts/<int:post_id>/comments/create/<int:user_id>/', CommentListAPIView.as_view(), name='comment-create'),
    path('users/search/',UserSearchAPIView.as_view(),name='user-search'),
    path('following/<int:user_id>/',FollowingAPIView.as_view(),name='following'),
    path('following/check/<int:follower_id>/<int:followed_id>/', IsFollowingAPIView.as_view(), name='is_following'),
    path('followed-posts/<int:user_id>/', FollowedUsersPostsView.as_view(), name='followed-posts'),
    path('followed_users/<int:user_id>/',FollowedUsersView.as_view(),name='followed_users'),
    path('user_suggestions/<int:user_id>/',RandomUserSuggestionsView.as_view(),name='user_suggestions'),
    path('report_post/<int:post_id>/<int:user_id>/', ReportPostAPIView.as_view(), name='report_post_api'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
