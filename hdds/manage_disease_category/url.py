from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',disease_category_datatable.as_view(), name='disease_category_datatable_link'),
    url(r'^disease_category_name_browser$',browse_disease_category_name, name='disease_category_name_browser'),
    url(r'^save_disease_category$',save_disease_category, name='save_disease_category'),
    url(r'^delete_disease_category$',delete_disease_category, name='delete_disease_category'),
    url(r'^update_disease_category$',update_disease_category, name='update_disease_category'),
]