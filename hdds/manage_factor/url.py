from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',factor_datatable.as_view(), name='factor_datatable_link'),
    url(r'^factor_name_browser$',browse_factor_name, name='factor_name_browser'),
    url(r'^save_factor$',save_factor, name='save_factor'),
    url(r'^delete_factor$',delete_factor, name='delete_factor'),
    url(r'^update_factor$',update_factor, name='update_factor'),
]