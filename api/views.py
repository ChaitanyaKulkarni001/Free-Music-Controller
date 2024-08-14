from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse




class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


# class GetRoom(APIView):
#     serializer_class = RoomSerializer
#     lookup_url_kwarg = 'code'

#     def get(self, request, format=None):
#         code = request.GET.get(self.lookup_url_kwarg)
#         if code != None:
#             room = Room.objects.filter(code=code)
#             if len(room) > 0:
#                 data = RoomSerializer(room[0]).data
#                 data['is_host'] = self.request.session.session_key == room[0].host
#                 data['host'] = self.request.session.session_key == room[0].host
#                 print("GETROOM HOST : ",room[0].host)
#                 return Response(data, status=status.HTTP_200_OK)
#             return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

#         return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code =  request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                data['host'] = room[0].host
                print(f"Session key: {self.request.session.session_key}, Room host: {room[0].host}")
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            room = Room.objects.filter(code=code).first()
            if room is not None:
                is_paused = request.data.get('is_paused')
                print("Is paused is", is_paused)
                if is_paused is not None:
                    room.is_paused = is_paused
                    room.save()
                
                data = RoomSerializer(room).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

            
        
        

# class JoinRoom(APIView):
#     lookup_url_kwarg = 'code'

#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         code = request.data.get(self.lookup_url_kwarg)
#         if code != None:
#             room_result = Room.objects.filter(code=code)
#             if len(room_result) > 0:
#                 room = room_result[0]
#                 self.request.session['room_code'] = code
#                 self.request.session['host'] = room.host
#                 print("JOIN ROOM HOST : ",room.host)
#                 return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

#             return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

#         return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


# class CreateRoomView(APIView):
#     serializer_class = CreateRoomSerializer

#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             guest_can_pause = serializer.data.get('guest_can_pause')
#             votes_to_skip = serializer.data.get('votes_to_skip')
#             host = self.request.session.session_key
#             print("Host at create - ",host)
#             queryset = Room.objects.filter(host=host)
#             if queryset.exists():
#                 room = queryset[0]
#                 room.guest_can_pause = guest_can_pause
#                 room.votes_to_skip = votes_to_skip
#                 room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
#                 self.request.session['room_code'] = room.code
#                 return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
#             else:
#                 room = Room(host=host, guest_can_pause=guest_can_pause,
#                             votes_to_skip=votes_to_skip)
#                 room.save()
#                 self.request.session['room_code'] = room.code
#                 return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

#         return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        print(f"Session created with key: {self.request.session.session_key}")

        code = request.data.get(self.lookup_url_kwarg)
        if code is not None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                self.request.session['host'] = room.host
                print(f"Joined room: {code}, host: {room.host}")
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        print(f"Session created with key: {self.request.session.session_key}")

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                self.request.session['host'] = room.host
                print(f"Room updated: {room.code}, host: {room.host}")
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                self.request.session['host'] = room.host
                print(f"New room created: {room.code}, host: {room.host}")
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data.get('guest_can_pause')
            votes_to_skip = serializer.validated_data.get('votes_to_skip')
            code = serializer.validated_data.get('code')
            is_paused = serializer.validated_data.get('is_paused')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip

            if is_paused is not None:
                room.is_paused = is_paused
            print(f"is_paused: {is_paused}")


            room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'is_paused'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)