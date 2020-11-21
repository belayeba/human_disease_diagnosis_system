from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.views.generic import RedirectView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('register_disease_data/', include('register_disease_data.url')),
    path('manage_symptom_category/', include('manage_symptom_category.url')),
    path('manage_symptom/', include('manage_symptom.url')),
    path('manage_pathogen/', include('manage_pathogen.url')),
    path('manage_disease_category/', include('manage_disease_category.url')),
    path('manage_disease/', include('manage_disease.url')),
    path('manage_factor/', include('manage_factor.url')),
    path('manage_measurement/', include('manage_measurement.url')),
    path('manage_medicine/', include('manage_medicine.url')),
    path('manage_medicine_type/', include('manage_medicine_type.url')),
    path('manage_medicine_taking_way/', include('manage_medicine_taking_way.url')),
    path('manage_disease_detail/', include('manage_disease_detail.url')),
    path('manage_factor_options/', include('manage_factor_options.url')),
    path('manage_medicine_type_usage/', include('manage_medicine_type_usage.url')),
    path('diagonising_disease/', include('diagonising_disease.url')),
    url(r'^favicon\.ico$',RedirectView.as_view(url='/static/django.jpg')),
]

#from django.contrib import admin
#from django.urls import path

#urlpatterns = [
  #  path('admin/', admin.site.urls),
#]
