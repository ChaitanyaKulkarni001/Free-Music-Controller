# from .import views
from .views import index
from django.urls import path

app_name = 'frontend'
urlpatterns = [
    
    path('', index, name=''),  # Ensure your home path has a name
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index),
    # path('room/<str:roomCode>',views.index),
    # path('',views.index,name = ''),
    # # path('join/1',views.index,name = 'index.html'), 
    # path('join',views.index), 
    # path('create',views.index),
    # path('update',views.index,name = 'index.html'),
]
