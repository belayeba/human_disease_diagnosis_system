from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',symptom_category_datatable.as_view(), name='symptom_category_datatable_link'),
    url(r'^symptom_category_name_browser$',browse_symptom_category_name, name='symptom_category_name_browser'),
    url(r'^save_symptom_category$',save_symptom_category, name='save_symptom_category'),
    url(r'^delete_symptom_category$',delete_symptom_category, name='delete_symptom_category'),
    url(r'^update_symptom_category$',update_symptom_category, name='update_symptom_category'),
]