from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections
from user.tokenauthentication import JWTAuthentication
from user.token import verify_and_update_token
from channels.exceptions import AcceptConnection
from jwt.exceptions import ExpiredSignatureError
from tokenize import TokenError


class JWTWebsocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        query_string = scope.get("query_string",b"").decode("utf-8")
        query_parameters = {}
        for qp in query_string.split("&"):
            key_value = qp.split('=',  1)  
            if len(key_value) ==  2:
                query_parameters[key_value[0]] = key_value[1]
        token = query_parameters.get("token",None)

        if token is None:
            await send({
                "type":"websocket.close",
                "code":4000
            })
        

        authentication = JWTAuthentication()

        try:
            user = await authentication.authenticate_websocket(scope, token)
            scope['user'] = user

        except ExpiredSignatureError:
            try:
                new_tokens = verify_and_update_token(token)
                if new_tokens:
                    token = new_tokens['access']
                    user = await authentication.authenticate_websocket(scope, token)
                    scope['user'] = user 
                else:
                    raise AcceptConnection(4001) 

            except TokenError: 
                raise AcceptConnection(4001)  

        except AuthenticationFailed:
            await send({
                "type": "websocket.close",
                "code": 4000
            })

        return await super().__call__(scope, receive, send)
