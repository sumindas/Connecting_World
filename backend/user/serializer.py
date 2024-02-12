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
        fields = ['images_url']
        
        
class PostVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostVideo
        fields = ['video_url']

class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(source = 'postimage_set', many=True, read_only = True,required=False)
    videos = PostVideoSerializer(source='postvideo_set',many=True,read_only = True,required=False)

    class Meta:
        model = Post
        fields = ['id','user','content', 'is_deleted','created_at', 'images','videos']

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        videos_data = validated_data.pop('videos',[])

        
        post = Post.objects.create(**validated_data)
        for image_data in images_data:
            try:
                image_url = image_data['images_url']
                PostImage.objects.create(post=post, images_url=image_url)
            except Exception as e:
                print(f"Error Creating PostImage: {e}")
                
        for video_data in videos_data:
            try:
                video_url = video_data['video_url']
                PostVideo.objects.create(post=post,video_url = video_url)
            except Exception as e:
                print(f"Error Creating video {e}")
        return post
    


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['user', 'post', 'created_at']

class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = ['user', 'post', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'post', 'content', 'created_at']

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['user', 'comment', 'content', 'created_at']
