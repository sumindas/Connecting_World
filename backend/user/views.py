from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from user.models import *
from django.contrib.auth import authenticate
from .serializer import *
from rest_framework.permissions import AllowAny
from .email import send_otp_email
import jwt, datetime
from rest_framework.authtoken.models import Token
from rest_framework.authentication import BaseAuthentication


# Create your views here.

@permission_classes([AllowAny])
class SignUpView(APIView):
    def post(self,request):
        data = request.data
        email = data.get('email')
        username = data.get('username')
        full_name = data.get('fullname')
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
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            data = request.data
            serializer = VerifyUserSerializer(data=data)
            
            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['otp']
                
                user = CustomUser.objects.get(email = email)
                if not user:
                    return Response({
                        'status':400,
                        'message':"Something went Wrong",
                        'data' : "invalid Email"
                    })
                
                if not user.otp == otp:
                    return Response({
                        'status':400,
                        'message':"Something went Wrong",
                        'data' : "invalid Otp"
                    })
                
                user.is_verified = True
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