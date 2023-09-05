from django.urls import path

from . import views

urlpatterns = [
    path("talk", views.talk, name="talk")
]