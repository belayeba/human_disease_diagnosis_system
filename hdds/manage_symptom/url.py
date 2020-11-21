from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',symptom_datatable.as_view(), name='symptom_datatable_link'),
    url(r'^symptom_name_browser$',browse_symptom_name, name='symptom_name_browser'),
    url(r'^save_symptom$',save_symptom, name='save_symptom'),
    url(r'^delete_symptom$',delete_symptom, name='delete_symptom'),
    url(r'^update_symptom$',update_symptom, name='update_symptom'),
    url(r'^load_symptom_category$',load_symptom_category, name='load_symptom_category')
]