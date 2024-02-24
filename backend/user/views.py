from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status,viewsets
from user.models import *
from .serializer import *
from rest_framework.permissions import AllowAny
from .email import send_otp_email
import jwt, datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.parsers import JSONParser
from django.core.exceptions import ValidationError
from django.db.models import Prefetch,Q
from django.shortcuts import get_object_or_404
from django.db.models import Count
from .tasks import send_mail_func
from django.http import Http404






# Create your views here.


class SignUpView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        username = data.get('username')
        full_name = data.get('full_name')
        password = data.get('password')

    

        if not email and not full_name and not username and not password:
            return Response({'error': 'Please Fill Required Fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not username or not username.strip(): 
            return Response({'error': 'Username cannot be blank or contain only spaces'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not full_name or not full_name.strip():
            return Response({'error': 'Full Name cannot be blank or contain only spaces '},status=status.HTTP_400_BAD_REQUEST)

        elif not (len(password) >= 8 and any(c.isupper() for c in password) and any(c.islower() for c in password) and any(c.isdigit() for c in password)):
            return Response({'error': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'},status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email Already Exists'}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username Already Exists'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CustomUserSerializer(data=data)
        try:
            print("------------------tryblock-------------")
            serializer.is_valid(raise_exception=True)
            serializer.save()
            send_otp_email(serializer.data['email'])
            return Response({
                'status': 200,
                'message': 'Registration Successful, Check Email For Verification',
                'data': serializer.data
            })
        except Exception as e:
            print("------------------")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class Verify_Otp(APIView):
    def post(self,request):
        try:
            data = request.data
            print("Request.Data:",request.data)
            email = data.get('email')
            otp = data.get('otp')
            if not email:
                return Response({'error':'Email Not Found Please Register Again'},status=status.HTTP_400_BAD_REQUEST)
            if not otp:
                return Response({'error':'Please enter otp'},status=status.HTTP_400_BAD_REQUEST)
            serializer = VerifyUserSerializer(data=data)
            print(serializer)
            if serializer.is_valid():

                user = CustomUser.objects.get(email = email)
                print("Otp:",user.otp)
                if not user:
                    return Response({'error':'User Not Found '},status=status.HTTP_400_BAD_REQUEST)

                if user.otp != otp:
                    return Response({'error':'Invalid  otp'},status=status.HTTP_400_BAD_REQUEST)

                user.is_verified = True
                user.otp = None
                user.save()
                send_mail_func.delay()
                return Response({
                'status' : 200,
                'message' : 'Account Verified'

                })
            return Response({
                'status': 400,
                'message': 'Validation Error',
                'errors': serializer.errors
            })


        except Exception as e:
            print(e)
            return Response({
                'status': 500,
                'message': 'Internal Server Error'
            })


class ResendOtpView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')

            if email:
                user = CustomUser.objects.filter(email__iexact=email)

                if user.exists():
                    user = user.first()
                    new_otp = send_otp_email(email)
                    user.otp = new_otp
                    user.save()


                    return Response({
                        'message': 'New OTP sent successfully',
                        'status': status.HTTP_200_OK,
                    })

                else:
                    return Response({
                        'message': 'User not found ! Please register',
                        'status': status.HTTP_404_NOT_FOUND,
                    })

            else:
                return Response({
                    'message': 'Email is required',
                    'status': status.HTTP_400_BAD_REQUEST,
                })

        except Exception as e:
            return Response({
                'message': str(e),
                'status': status.HTTP_400_BAD_REQUEST,
            })      

class LoginView(APIView):
    
    def post(self,request):
        email = request.data['email']
        password = request.data['password']
        provider = request.data.get('provider')

        if not email:
           return Response({'error':'Email is Required'},status=status.HTTP_400_BAD_REQUEST)
        if not password:
           return Response({'error':'Password is Required'},status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(email=email).first()
        print(user)

        if user is None:
            return Response({'error':'User Not found'},status=status.HTTP_400_BAD_REQUEST)

        if not user.is_verified:
            return Response({'error': 'User Is not verified'},status=status.HTTP_400_BAD_REQUEST)
        
        if user.is_superuser == True:
            return Response({'error': 'Admin Cannot access'},status=status.HTTP_400_BAD_REQUEST)    


        if provider != 'google':
            if not user.check_password(password):
                return Response({'error': 'Password Incorrect'},status=status.HTTP_400_BAD_REQUEST)    

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.now(datetime.timezone.utc),
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        response = Response()

        response.data = {
            'user':{
                'id':user.id,
                'email':user.email,
            },
            'jwt': token,
            'message': 'Login Success'
        }
        return response
    

            
            
            

    

class userView(APIView):
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        print("====",request.user)

        if not auth_header or 'Bearer ' not in auth_header:
            raise AuthenticationFailed("Not authorized")
        token = auth_header.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print("Decoded Payload:", payload)
            user = CustomUser.objects.filter(id=payload['id']).first()
            user_serializer = CustomUserSerializer(user)
            
            user_profile = UserProfile.objects.filter(user=user).first()
            user_profile_serializer = UserProfileSerializer(user_profile)
            
            response_data = {
                'user':user_serializer.data,
                'user_profile' :user_profile_serializer.data
            }
            
            return Response(response_data)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Not authorized")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")



    
    
    
class UserLogout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        
        return response
    
    
class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileUpdate(APIView):
    def post(self, request, user_id):  # sourcery skip: extract-duplicate-method
        username = request.data.get('username')
        location = request.data.get('location')
        bio = request.data.get('bio')
        profile_photo = request.FILES.get('profile_photo')
        cover_photo = request.FILES.get('cover_photo')
        date_of_birth = request.data.get('date_of_birth')

        print("given data--", username, bio, location, date_of_birth)
        print("Given Photos", profile_photo, "---------", cover_photo)

        user = CustomUser.objects.filter(id=user_id).first()

        if user:
            user.username = username
            user.save()

            user_profile = UserProfile.objects.filter(user=user).first()

            if user_profile:
                user_profile.location = location
                user_profile.date_of_birth = date_of_birth
                user_profile.bio = bio

                if "profile_photo" in request.FILES:
                    user_profile.profile_image = profile_photo

                if "cover_photo" in request.FILES:
                    user_profile.cover_photo = cover_photo

                user_profile.save()

                return Response({"message": "User Updated Successfully"})


            else:
                new_user_profile = UserProfile.objects.create(
                    user=user,
                    location=location,
                    date_of_birth=date_of_birth,
                    bio=bio,
                )

                if "profile_photo" in request.FILES:
                    new_user_profile.profile_image = profile_photo

                if "cover_photo" in request.FILES:
                    new_user_profile.cover_photo = cover_photo

                new_user_profile.save()

                return Response({"message": "New User Created Successfully"}, status=status.HTTP_201_CREATED)

        else:
            return Response({"Error": "User Not Found"})
           



class PostCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, id, *args, **kwargs):
        print("Adding Post")
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PostSerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            validated_data = serializer.validated_data
            print("Validated_data:",validated_data)
            validated_data['user'] = user
            post = serializer.save(**validated_data)
            print("----",request.data)
            try:
                images_data = request.FILES.getlist('images[0]')
                for image in images_data:
                    PostImage.objects.create(post=post, images_url=image)

                videos_data = request.FILES.getlist('videos[0]')
                for video in videos_data:
                    PostVideo.objects.create(post=post, video_url=video)

                post_serialized = PostSerializer(post)
                print("Received files:", request.FILES)
                print("post new",post_serialized)
                return Response(post_serialized.data, status=status.HTTP_201_CREATED)
            except ValidationError as ve:
                print("Validation Error:", ve)
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Unexpected Error:", e)
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print("Error:",serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class UserPostListAPIView(APIView):
    """
    API View to list all posts created by a specific user.
    """
    def get(self, request, user_id, format=None):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        posts = Post.objects.filter(user=user, is_deleted=False).prefetch_related('postimage_set', 'postvideo_set', 'like_set', 'comment_set')\
            .order_by('-created_at')
        print("Posts:",posts)
        serializer = PostSerializer(posts, many=True)
        print(serializer.data)
        return Response(serializer.data)
    
    




class LikeAPIView(APIView):
    serializer_class = LikeSerializer
    

    def get(self, request, *args, **kwargs):
        """
        Overridden to return only the count of likes for a specific post.
        """
        return self.liked_by_current_user(request, *args, **kwargs)

    def liked_by_current_user(self, request):
        """
        Custom action to check if the current user has liked a post.
        """
        post_id = request.query_params.get('postId')
        user_id = request.query_params.get('userId')
        print("user",user_id,"---","Post",post_id)
        post = None
        user = None

        if post_id is not None:
            try:
                post = get_object_or_404(Post, id=post_id)
            except Http404:
                return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if user_id is not None:
            try:
                user = get_object_or_404(CustomUser, id=user_id)
            except Http404:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if post is None or user is None:
            return Response({'detail': 'Missing parameters: postId and userId'}, status=status.HTTP_400_BAD_REQUEST)

        queryset = Like.objects.filter(post=post, user=user)
        likedByUser = queryset.exists()

        return Response({
            'count': Like.objects.filter(post=post).count(),
            'likedByUser': likedByUser,
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Override the create method to handle like creation.
        """
        user_id = request.data.get('userId')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        post_id = request.data.get('postId')
        if post_id is not None:
            post = Post.objects.get(id=post_id)
            like, created = Like.objects.get_or_create(user=user, post=post)
            if created:
                return Response({'message': 'Like created.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Like already exists.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Missing parameter: postId'}, status=status.HTTP_400_BAD_REQUEST)     
        



class PostUpdateAPIView(APIView):
    
    print("------------")
    
    def process_files(self, post, images_data, videos_data):
        for image in images_data:
            PostImage.objects.create(post=post, images_url=image)

        for video in videos_data:
            PostVideo.objects.create(post=post, video_url=video)

    def put(self, request, post_id, *args, **kwargs):
        print(request.data)
        post = get_object_or_404(Post, id=post_id, *args, **kwargs)
        serializer = PostSerializer(post, data=request.data)
        
        print(serializer.is_valid())

        if serializer.is_valid():
            try:
                images_data = request.FILES.getlist('images[0]')
                videos_data = request.FILES.getlist('videos[0]')
                if images_data:
                    for image in images_data:
                        PostImage.objects.create(post=post, images_url=image)
                if videos_data:
                    for video in videos_data:
                        PostVideo.objects.create(post=post, video_url=video)
                print("Received Files:",request.FILES)

                # Save the updated content
                serializer.save()

                post_serialized = PostSerializer(post)
                return Response(post_serialized.data, status=status.HTTP_200_OK)
            except ValidationError as ve:
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
    def delete(self, request, post_id, *args, **kwargs):
        post = get_object_or_404(Post, id=post_id, *args, **kwargs)
        post.is_deleted = True
        post.save()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    


class CommentCreateAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        post_id = self.request.query_params.get('postId')
        user_id = self.request.query_params.get('userId')

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        comment_data = {'user': user.id, 'post': post.id, **request.data}
        serializer = CommentSerializer(data=comment_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentListAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post=post_id)
    
    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        print("user:",user_id)
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)  
        serializer.save(post=post, user=user)
    


class FollowingAPIView(APIView):

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        following = Following.objects.filter(Q(follower=user) | Q(followed=user))
        serializer = FollowingSerializer(following, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        print("------ffff----------")
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            followed_user_id = request.data.get('followed')
            followed_user = CustomUser.objects.get(id=followed_user_id)

       
            if user == followed_user:
                return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        
            following_relationship, created = Following.objects.get_or_create(
            follower=user,
            followed=followed_user,
            defaults={'is_active': False}  
        )

        
            following_relationship.is_active = not following_relationship.is_active
            following_relationship.save()
            print("Relation:",following_relationship.is_active)

        
            message = "You are now following this user." if following_relationship.is_active else "You have unfollowed this user."

            return Response({"message": message}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User to follow not found."}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({"error": "'followed' field is required."}, status=status.HTTP_400_BAD_REQUEST)

class IsFollowingAPIView(APIView):
    def get(self, request, follower_id, followed_id):
        try:
            follower = CustomUser.objects.get(id=follower_id)
            followed = CustomUser.objects.get(id=followed_id)
        except CustomUser.DoesNotExist:
            return Response({'error': "User Not Found"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the follower is following the followed user
        is_following = Following.objects.filter(follower=follower, followed=followed, is_active=True).exists()

        return Response({'isFollowing': is_following}, status=status.HTTP_200_OK)
    
class UserSearchAPIView(generics.GenericAPIView):
    serializer_class = CustomUserSerializer
    
    def get(self,request,*args,**kwargs):
        queryset = CustomUser.objects.all()
        username = request.query_params.get('username','')
        print(username)
        
        if username:
            queryset = queryset.filter(Q(username__icontains=username))
            
        serializer = self.get_serializer(queryset,many=True)
        
        return Response(serializer.data)
    
class FollowedUsersPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = CustomUser.objects.get(id=user_id)
        followed_users = user.following.values_list('followed', flat=True)
        queryset = Post.objects.exclude(user=user).filter(user__in=followed_users,is_deleted=False).order_by('-created_at')
        return queryset


class FollowedUsersView(generics.ListAPIView):
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = CustomUser.objects.get(id=user_id)
        followed_users = user.following.values_list('followed', flat=True)
        queryset = CustomUser.objects.filter(id__in=followed_users)
        return queryset

class RandomUserSuggestionsView(APIView):
    
    def get(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        users = CustomUser.objects.filter(is_active=True, is_superuser=False).exclude(id=user_id).exclude(
            followers__follower__id=user_id
        ).order_by('?')[:6]
        
        user_serializer = CustomUserSerializer(users, many=True)
        return Response(user_serializer.data)
    
class ReplyCreateAPIView(APIView):
    """
    API View to create a new reply to a comment.
    """

    def post(self, request, *args, **kwargs):
        userId = self.kwargs['userId']
        user = CustomUser.objects.get(id=userId)
        serializer = ReplySerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)