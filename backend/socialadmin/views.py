from django.shortcuts import get_object_or_404, render
from user.models import CustomUser
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt,datetime
from rest_framework import status
from user.serializer import *
from django.shortcuts import get_list_or_404
from rest_framework import generics
from django.db.models import Count, F, Sum, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone

# Create your views here.
class AdminLogin(APIView):
    def post(self,request):
        email = request.data['email']
        password = request.data['password']
        print(email,"",password)
        
        if not(email and password):
            raise AuthenticationFailed({
                'error':'Both email and password is required'
            })
        
        user = CustomUser.objects.filter(email=email,is_staff=True).first()
        if user is None:
            raise AuthenticationFailed({'error':'Admin Access is required'})

        if not user.check_password(password):
            raise AuthenticationFailed({"error":'Incorrect Password'})
        
        payload = {
            'id':user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat':datetime.datetime.utcnow()
        }
        token = jwt.encode(payload,'secret',algorithm="HS256")
        response = Response()
        
        response.data = {
            'jwt' : token
        }
        
        return response
    
class AdminLogout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        
        return response
    
class AdminUsersList(APIView):
    def get(self, request):
        obj = CustomUser.objects.filter(is_staff=False)
        print(obj)
        serializer = AdminCustomSerializers(obj, many=True)
        return Response(serializer.data)
    
    def post(self,request,user_id):
        user = CustomUser.objects.get(id=user_id)
        
        if not user:
            return Response({'error':"User Not Found"},status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_active:
            user.is_active = False
        else:
            user.is_active = True
            
        user.save()
        serializer = AdminCustomSerializers(user)
        return Response(serializer.data)
    
    

class AdminPostsList(APIView):

    def get(self, request):
        posts = Post.objects.filter(is_deleted=False).annotate(like_count = Count('like'),comment_count = Count('comment')).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        print("p:",post_id)
        post = get_object_or_404(Post, id=post_id)
        print(post)

        post.is_deleted = not post.is_deleted
        post.save()
        print(post.is_deleted,"--")
        serializer = PostSerializer(post)
        
        return Response(serializer.data)
    
def get_dashboard_data():
    total_users = CustomUser.objects.count()
    posts_by_month = Post.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')

    total_posts = Post.objects.count()

    return {
        'total_users': total_users,
        'posts_by_month': posts_by_month,
        'total_posts': total_posts,
    }


class AdminDashboardView(APIView):
    def get(self, request):
        data = get_dashboard_data()
        return Response(data)
    

class GetPostsView(APIView):
    def get(self, request):
        posts = Post.objects.all().annotate(report_count=Count('reports')).prefetch_related('reports').order_by('-created_at')
        
        post_list = [
            {
                'id': post.id,
                'user__username': post.user.username, 
                'created_at': post.created_at,
                'report_count': post.report_count,
                'is_deleted' : post.is_deleted,
                'reports': [
                    {
                        'id': report.id,
                        'reason': report.content, 
                        'created_at': report.created_at,
                    } for report in post.reports.all()
                ]
            } for post in posts
        ]
        
        return Response(post_list)