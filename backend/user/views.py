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
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client




# Create your views here.

@permission_classes([AllowAny])
class SignUpView(APIView):
    def post(self,request):
        data = request.data
        email = data.get('email')
        username = data.get('username')
        full_name = data.get('full_name')
        password = data.get('password')
        if not email or not username or not full_name or not password:
            return Response({'error':'Please Fill required Fields'},status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            print('Email Already Exists')
            return Response({'error':'Email Already Exists'},status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            print('Username Already Exists')
            return Response({'error':'Username Already Exists'},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CustomUserSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            send_otp_email(serializer.data['email'])
            return Response({
                'status' : 200,
                'message' : 'Registration Succesfull, Check Email For Verification',
                'data' : serializer.data
            })
        except ValidationError as e:
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class Verify_Otp(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            data = request.data
            print("Request.Data:",request.data)
            email = data.get('email')
            otp = data.get('otp')
            print("Otp:",otp,"---------","email:",email)
            serializer = VerifyUserSerializer(data=data)
            print(serializer)
            if serializer.is_valid():

                user = CustomUser.objects.get(email = email)
                if not user:
                    return Response({
                        'status':400,
                        'message':"Something went Wrong",
                        'data' : "invalid Email"
                    })

                if user.otp != otp:
                    return Response({
                        'status':400,
                        'message':"Something went Wrong",
                        'data' : "invalid Otp"
                    })

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

        if not (email and password):
            return Response({
                'error': 'Email and Password is required'
            })

        user = CustomUser.objects.filter(email=email).first()
        print(user,"--",user.is_verified)
        
        
        if not user.is_verified:
            raise AuthenticationFailed({
                'error':'User is not Verified'
            })
            
        if user is None:
            raise AuthenticationFailed({
                'error':'User is not found'
            })
        if not user.check_password(password):
            raise AuthenticationFailed({'error':'Incorrrect Password'})

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.now(datetime.timezone.utc),
        }
        token = jwt.encode(payload, 'secret', algorithm="HS256")
        response = Response()

        response.data = {
            'jwt': token,
            'message': 'Login Success'
        }

        return response
    

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    serializer_class = CustomUserSerializer
