from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',medicineTakingWay_datatable.as_view(), name='medicineTakingWay_datatable_link'),
    url(r'^medicineTakingWay_name_browser$',browse_medicineTakingWay_description, name='medicineTakingWay_description_browser'),
    url(r'^save_medicineTakingWay$',save_medicineTakingWay, name='save_medicineTakingWay'),
    url(r'^delete_medicineTakingWay$',delete_medicineTakingWay, name='delete_medicineTakingWay'),
    url(r'^update_medicineTakingWay$',update_medicineTakingWay, name='update_medicineTakingWay'),
]