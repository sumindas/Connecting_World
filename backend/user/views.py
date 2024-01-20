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
from urllib.parse import urlencode
from rest_framework import serializers
from rest_framework.views import APIView
from django.conf import settings
from django.shortcuts import redirect
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from .mixins import PublicApiMixin, ApiErrorsMixin
from .utils import google_get_access_token, google_get_user_info






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
        except ValidationError as e:
            print("------------------")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
class Verify_Otp(APIView):
    authentication_classes = [JWTAuthentication]
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

        if not (email and password):
           return Response({'error':'Email and Password required'},status=status.HTTP_400_BAD_REQUEST)

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
            'jwt': token,
            'message': 'Login Success'
        }

        return response
    

def generate_tokens_for_user(user):
    # sourcery skip: inline-variable, move-assign-in-block, use-assigned-variable
    """
    Generate access and refresh tokens for the given user
    """
    serializer = TokenObtainPairSerializer()
    token_data = serializer.get_token(user)
    access_token = token_data.access_token
    refresh_token = token_data
    return access_token, refresh_token


class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{settings.BASE_FRONTEND_URL}'
    
        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/google/'
        access_token = google_get_access_token(code=code, redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        try:
            user = CustomUser.objects.get(email=user_data['email'])
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': GoogleSerializers(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)
        except CustomUser.DoesNotExist:
            username = user_data['email'].split('@')[0]
            full_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')

            user = CustomUser.objects.create(
                username=username,
                email=user_data['email'],
                first_name=full_name,
                phone_no=None,
                is_verified = True
            )
         
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {
                'user': GoogleSerializers(user).data,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
            return Response(response_data)