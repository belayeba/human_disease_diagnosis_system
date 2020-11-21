from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',medicine_datatable.as_view(), name='medicine_datatable_link'),
    url(r'^medicine_name_browser$',browse_medicine_name, name='medicine_name_browser'),
    url(r'^save_medicine$',save_medicine, name='save_medicine'),
    url(r'^delete_medicine$',delete_medicine, name='delete_medicine'),
    url(r'^update_medicine$',update_medicine, name='update_medicine'),
]