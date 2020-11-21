from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',pathogen_datatable.as_view(), name='pathogen_datatable_link'),
    url(r'^pathogen_name_browser$',browse_pathogen_name, name='pathogen_name_browser'),
    url(r'^save_pathogen$',save_pathogen, name='save_pathogen'),
    url(r'^delete_pathogen$',delete_pathogen, name='delete_pathogen'),
    url(r'^update_pathogen$',update_pathogen, name='update_pathogen'),
]