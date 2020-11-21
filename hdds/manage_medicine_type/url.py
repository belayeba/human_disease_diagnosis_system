from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',medicineType_datatable.as_view(), name='medicineType_datatable_link'),
    url(r'^medicineType_name_browser$',browse_medicineType_name, name='medicineType_name_browser'),
    url(r'^save_medicineType$',save_medicineType, name='save_medicineType'),
    url(r'^delete_medicineType$',delete_medicineType, name='delete_medicineType'),
    url(r'^update_medicineType$',update_medicineType, name='update_medicineType'),
]