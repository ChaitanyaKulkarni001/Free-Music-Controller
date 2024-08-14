from django.db import models
import random
# Create your models here.
def unique_generate_code():
    # length = 8
    # digits = "1234567890"
    while True:
        code = random.randint(0,9999999)
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

class Room(models.Model):
    code = models.CharField(default=unique_generate_code,max_length=8,unique=True)
    host = models.CharField(unique=True,max_length=70)
    is_paused = models.BooleanField(default=True)
    guest_can_pause = models.BooleanField(null=False,default=False)
    votes_to_skip = models.IntegerField(null=False,default=2)
    created_at = models.DateTimeField(auto_now_add=True)

