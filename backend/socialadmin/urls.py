from django.urls import path
from .views import *



urlpatterns = [
    path('',AdminLogin.as_view(),name='adminlogin'),
    path('adminlogout/',AdminLogout.as_view,name='adminlogout'),
    path('users/',AdminUsersList.as_view(),name='adminusers'),
    path('block_unblock_user/<int:user_id>/',AdminUsersList.as_view(),name='block_unblock_user'),
    path('admin/posts/', AdminPostsList.as_view(), name='admin-posts'),
    path('posts/<int:post_id>/', AdminPostsList.as_view(), name='post-delete'),
]
