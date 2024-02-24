import jwt
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.exceptions import AcceptConnection
from rest_framework.authentication import BaseAuthentication
from jwt import ExpiredSignatureError,InvalidTokenError
from django.conf import settings
from datetime import datetime

CustomUser = get_user_model()

class JWTAuthentication(BaseAuthentication):
    
    @database_sync_to_async
    def get_user(self, user_id):
        return CustomUser.objects.get(id=user_id)
    
    
    # def is_token_expired(self,token):
    #     try:
    #         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    #         expiration_time = payload['exp']
    #         current_time = datetime.utcnow().timestamp()
    #         return current_time > expiration_time
    #     except jwt.ExpiredSignatureError:
    #         return True
    #     except jwt.InvalidTokenError:
    #         return False
    
    
    async def authenticate_websocket(self, scope, token):
        try:
            token_bytes = token.encode('utf-8')
            payload = jwt.decode(token_bytes, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload['id']
            user = await self.get_user(user_id)
            return user
        except (jwt.DecodeError,ExpiredSignatureError,InvalidTokenError, CustomUser.DoesNotExist):
            raise AcceptConnection(4000)
    