from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections
from user.tokenauthentication import JWTAuthentication



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
            user = await authentication.authenticate_websocket(scope,token)
            if user is not None:
                scope['user'] = user
            else:
                await send({
                    "type": "websocket.close",
                    "code" : 4000
                })

            return await super().__call__(scope,receive,send)
        except AuthenticationFailed:
            await send({
                    "type": "websocket.close",
                    "code" : 4002
                })


