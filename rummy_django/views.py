
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PIL import Image

from rummy_django.models.models import Player, reset_points, clean_database
from rummy_django.serializers import UserSerializer
from rummy_django.testing.test_image import process_image


@api_view(['GET'])
def index(request):
    return render(request, 'index.html')


@api_view(['GET'])
def get_users(request):
    users = Player.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_user(request):
    print("request", request.data)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def new_game(request):
    clean_database()
    return JsonResponse({"message": "New game started"})


@api_view(['POST'])
def upload_image(request):
    user_name = request.POST.get('name')
    if not user_name:
        return JsonResponse({"error": "No user name provided"}, status=400)

    if 'image' not in request.FILES:
        return JsonResponse({"error": "No image provided"}, status=400)

    file = request.FILES['image']
    if file.name == '':
        return JsonResponse({"error": "No image selected"}, status=400)
    print("username", user_name)
    try:

        image = Image.open(file).convert("RGB")
        points = process_image(image)
        user = Player.objects.filter(name=user_name).first()
        if user:
            user.points += points
            user.save()
            return JsonResponse({"name": user.name, "points": user.points})
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
