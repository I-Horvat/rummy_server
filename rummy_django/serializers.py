from rest_framework import serializers

from rummy_django.models.models import Player


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['name', 'points']
