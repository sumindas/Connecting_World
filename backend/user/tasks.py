from celery import shared_task
from user.models import CustomUser
from django.core.mail  import EmailMessage
from django.conf import settings

@shared_task(bind=True)
def send_mail_func(self):
    print("task Started")
    users = CustomUser.objects.filter(is_superuser=False).order_by('-id').first()
    print(users)
    if users:
        Subject = "Welcome to Connecting World"
        message = f"Hii {users.username} thanks for signing up on Connecting World "
        from_email = settings.EMAIL_HOST_USER
        
        d_mail = EmailMessage(subject=Subject, body= message, from_email=from_email, to=[users.email])
        d_mail.send(fail_silently=False)
    return 'done'