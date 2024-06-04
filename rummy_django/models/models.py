from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=100, unique=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.name

def reset_points():
    Player.objects.all().update(points=0)
def clean_database():
    Player.objects.all().delete()

