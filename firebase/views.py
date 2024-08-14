from django.shortcuts import render
from django.http import JsonResponse
import pyrebase

config = {
    'apiKey': "AIzaSyACOjNz4-Oc_OVu_AcviLHKDwyDOcW-Z28",
    'authDomain': "mydemo-8c57c.firebaseapp.com",
    'projectId': "mydemo-8c57c",
    'databaseURL': "https://mydemo-8c57c-default-rtdb.firebaseio.com/",
    'storageBucket': "mydemo-8c57c.appspot.com",
    'messagingSenderId': "868395955544",
    'appId': "1:868395955544:web:767173f15605abc43ce12d",
    'measurementId': "G-PMM60RK2TQ"
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()

def getSong(request):
    day = database.child('Sample').child('Day').get().val()
    id = database.child('Sample').child('id').get().val()
    audio_url = database.child('Sample').child('audio_url').get().val()

    song_data = {
        "day": day,
        "id": id,
        "audio_url": audio_url
    }

    return JsonResponse(song_data)
