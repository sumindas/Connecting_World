from rest_framework import serializers
from .models import *
from rest_framework.validators import UniqueValidator


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
    required = True,
    validators = [UniqueValidator(queryset=CustomUser.objects.all(),message="Email Already Exists")]
    )
    
    class Meta:
        model = CustomUser
        fields = ['id','username','full_name','email','ph_no','is_verified']
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance