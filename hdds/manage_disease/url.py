from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',disease_datatable.as_view(), name='disease_datatable_link'),
    url(r'^disease_name_browser$',browse_disease_name, name='disease_name_browser'),
    url(r'^save_disease$',save_disease, name='save_disease'),
    url(r'^delete_disease$',delete_disease, name='delete_disease'),
    url(r'^update_disease$',update_disease, name='update_disease'),
    url(r'^load_disease_category$',load_disease_category, name='load_disease_category'),
    url(r'^load_pathogen$',load_pathogen, name='load_pathogen')
]