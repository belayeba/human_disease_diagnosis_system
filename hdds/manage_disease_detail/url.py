from django.conf.urls import url
from .views import *
urlpatterns=[
    url(r'^datatable$',disease_datatable.as_view(), name='disease_detail_datatable_link'),
    url(r'^load_disease_symptom_and_factor$', load_disease_symptom_and_factor, name='load_disease_symptom_and_factor'),
    url(r'^load_symptom_for_disease_detail$', load_symptom, name='load_symptom_for_disease_detail'),
    url(r'^load_symptom_to_disease_prescription$', load_symptom_to_disease_prescription, name='load_symptom_to_disease_prescription'),
    url(r'^load_factor_option_for_disease_detail$', load_factor_option, name='load_factor_option_for_disease_detail'),
    url(r'^add_symptom_to_disease$', add_symptom_to_disease, name='add_symptom_to_disease'),
    url(r'^remove_symptom_from_disease$', remove_symptom_from_disease, name='remove_symptom_from_disease'),
    url(r'^add_factor_option_to_disease$', add_factor_option_to_disease, name='add_factor_option_to_disease'),
    url(r'^remove_factor_option_from_disease$', remove_factor_option_from_disease, name='remove_factor_option_from_disease'),
    url(r'^remove_prescription_from_disease', remove_prescription_from_disease, name='remove_prescription_from_disease'),
    url(r'^remove_factor_from_prescribed_medicine', remove_factor_from_prescribed_medicine, name='remove_factor_from_prescribed_medicine'),
    url(r'^load_disease_prescription', load_disease_prescription, name='load_disease_prescription'),
    url(r'^load_medicine_type_to_disease_prescription', load_medicine_type_to_disease_prescription, name='load_medicine_type_to_disease_prescription'),
    url(r'^load_medicine_to_disease_prescription', load_medicine_to_disease_prescription, name='load_medicine_to_disease_prescription'),
    url(r'^add_disease_prescription', add_disease_prescription,name='add_disease_prescription'),
    url(r'^add_factor_to_prescribed_medicine', add_factor_to_prescribed_medicine, name='add_factor_to_prescribed_medicine')
]