from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^load_symptoms_for_diagonising$',load_symptoms_for_diagonising, name='load_symptoms_for_diagonising'),
]