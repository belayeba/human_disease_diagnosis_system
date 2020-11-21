from django.conf.urls import url
from . import views
urlpatterns=[
    url(r'^$',views.home,name='home'),
    url(r'^$', views.about, name='about'),
    url(r'^feedData$', views.feedData, name='data_feed'),
]