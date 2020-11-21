from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',factor_options_datatable.as_view(), name='factor_options_datatable_link'),
    url(r'^factor_options_name_browser$',browse_factor_options_description, name='factor_options_description_browser'),
    url(r'^save_factor_options$',save_factor_options, name='save_factor_options'),
    url(r'^delete_factor_options$',delete_factor_options, name='delete_factor_options'),
    url(r'^update_factor_options$',update_factor_options, name='update_factor_options'),
    url(r'^load_factor_options_category$',load_factor, name='load_factor')
]