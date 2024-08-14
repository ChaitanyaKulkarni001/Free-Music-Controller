import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import music_controller.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_controller.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            music_controller.routing.websocket_urlpatterns
        )
    ),
})
