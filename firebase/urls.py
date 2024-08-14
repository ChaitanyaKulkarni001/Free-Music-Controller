from . import views
from django.urls import path

urlpatterns = [
    path('getSong',views.getSong)
]