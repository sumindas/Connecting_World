from rest_framework import serializers
from .models import *
from rest_framework.validators import UniqueValidator
from rest_framework.authentication import BaseAuthentication


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
    required = True,
    validators = [UniqueValidator(queryset=CustomUser.objects.all(),message="Email Already Exists")]
    )
    
    class Meta:
        model = CustomUser
        fields = ['id','username','password','full_name','email','ph_no','is_verified']
        extra_kwargs = {
            'password': {'write_only':True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    
class VerifyUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    
    
class GoogleSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'email']
        
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'bio',  'date_of_birth', 'location','profile_image','cover_photo']


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ('image',)
        

class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True)
    
    
    class Meta:
        model = Post
        fields = ['user','content','created_at','likes','images']
        
        def create(self,validated_data):
            images_data = validated_data.pop('images')
            
            post = Post.objects.create(**validated_data)
            
            for image_data in images_data:
                PostImage.objects.create(post=post,**image_data)
                
            return post