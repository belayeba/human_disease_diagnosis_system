from django.conf.urls import url
from .views import *
urlpatterns=[
       url(r'^load_medicine_type_usage_form_data$', load_medicine_type_usage_form_data, name='load_medicine_type_usage_form_data'),
       url(r'^load_saved_medicine_type_usage_data$', load_saved_medicine_type_usage_data, name='load_saved_medicine_type_usage_data'),
       url(r'^save_medicine_type_usage$', save_medicine_type_usage, name='save_medicine_type_usage'),
       url(r'^edit_medicine_type_usage$', edit_medicine_type_usage, name='edit_medicine_type_usage'),
       url(r'^delete_disease_detail$', delete_disease_detail, name='delete_disease_detail'),
       url(r'^add_instruction_for_medicine$', add_instruction_for_medicine, name='add_instruction_for_medicine') ,
       url(r'^remove_factor_from_saved_instruction$', remove_factor_from_saved_instruction, name='remove_factor_from_saved_instruction') ,
       url(r'^add_factor_to_saved_instruction$', add_factor_to_saved_instruction, name='add_factor_to_saved_instruction') ,
       url(r'^delete_instruction$', delete_instruction, name='delete_instruction') ,
       url(r'^update_instruction', update_instruction, name='update_instruction'),

]