import jwt
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from channels.exceptions import AcceptConnection
from rest_framework.authentication import BaseAuthentication

CustomUser = get_user_model()

class JWTAuthentication(BaseAuthentication):
    
    @database_sync_to_async
    def get_user(self, user_id):
        return CustomUser.objects.get(id=user_id)
    
    async def authenticate_websocket(self, scope, token):
        try:
            token_bytes = token.encode('utf-8')
            payload = jwt.decode(token_bytes, 'secret', algorithms=["HS256"])
            user_id = payload['id']
            user = await self.get_user(user_id)
            return user
        except (jwt.DecodeError, CustomUser.DoesNotExist):
            raise AcceptConnection(4000)