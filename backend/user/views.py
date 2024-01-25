from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from user.models import *
from .serializer import *
from rest_framework.permissions import AllowAny
from .email import send_otp_email
import jwt, datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import urlencode
from rest_framework import serializers
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .mixins import PublicApiMixin, ApiErrorsMixin
from .utils import google_get_access_token, google_get_user_info
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client






# Create your views here.

@permission_classes([AllowAny])
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
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            data = request.data
            print("Request.Data:",request.data)
            email = data.get('email')
            otp = data.get('otp')
            if not email or not otp:
                return Response({'error':'Please enter otp'},status=status.HTTP_400_BAD_REQUEST)
            print("Otp:",otp,"---------","email:",email)
            serializer = VerifyUserSerializer(data=data)
            print(serializer)
            if serializer.is_valid():

                user = CustomUser.objects.get(email = email)
                if not user:
                    return Response({'error':'User Not Found '},status=status.HTTP_400_BAD_REQUEST)

                if user.otp != otp:
                    return Response({'error':'Invalid  otp'},status=status.HTTP_400_BAD_REQUEST)

                user.is_verified = True
                user.otp = None
                user.save()

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
            

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        email = request.data['email']
        password = request.data['password']

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
        
        if not user.check_password(password):
            return Response({'error': 'Password Incorrect'},status=status.HTTP_400_BAD_REQUEST)    

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.now(datetime.timezone.utc),
        }
        token = jwt.encode(payload, 'secret', algorithm="HS256")
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
    




class GoogleLoginApi(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            user_data = response.data.get('user', {})
            user, created = CustomUser.objects.get_or_create(email=user_data.get('email'))
            
            if created:
                user.full_name = user_data.get('full_name', '')
                user.username = user_data.get('username', '')
                user.is_verified = True  
                user.save()
            
            user_serializer = CustomUserSerializer(user)
            serialized_user = user_serializer.data
            
            return Response({"detail": "Google login successful", "user": serialized_user}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Google login failed"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class UserProfileCreateView(APIView):
    def post(self, request):
        bio = request.data.get['bio']
        avatar = request.data.get['avatar']
        date_of_birth = request.data.get['dateOfBirth']
        location = request.data.get['location']
        phone = request.data.get['phone']
        user = request.user.id
        
        if not user:
            return Response({'error': 'User Not Found'},status=status.HTTP_400_BAD_REQUEST)

        serializer = UserProfile(data=request.data)
        
        if serializer.is_valid():
            UserProfile.objects.create(
                user=user,
                bio = bio,
                avatar = avatar,
                date_of_birth = date_of_birth,
                location = location,
                phone = phone
                )
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class userView(APIView):
    def get(self,request):
        auth_header = request.headers.get('Authorization')
        print("Auth Header:",auth_header)

        if not auth_header or 'Bearer ' not in auth_header:
            raise AuthenticationFailed("Not authorized")

        token = auth_header.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, 'secret', algorithms=["HS256"])
            user = CustomUser.objects.filter(id=payload['id']).first()
            serializer = CustomUserSerializer(user)
            return Response(serializer.data)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Not authorized")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")