from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',measurement_datatable.as_view(), name='measurement_datatable_link'),
    url(r'^measurement_name_browser$',browse_measurement_name, name='measurement_name_browser'),
    url(r'^save_measurement$',save_measurement, name='save_measurement'),
    url(r'^delete_measurement$',delete_measurement, name='delete_measurement'),
    url(r'^update_measurement$',update_measurement, name='update_measurement'),
]