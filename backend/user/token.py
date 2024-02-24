from tokenize import TokenError
from rest_framework_simplejwt.tokens import RefreshToken



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def verify_and_update_token(token):
    """
    Function to verify Refresh token validity and optionally 
    return new tokens if specified
    """
    try:
        RefreshToken(token).verify()
        return None  
    except TokenError as e:
        new_tokens = get_tokens_for_user(user)
        return new_tokens