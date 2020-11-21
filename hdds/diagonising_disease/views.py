from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import *
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import render
from django.template.loader import render_to_string
def search_symptom(key):
    return (DiseaseSymptom.objects.filter(Q(symptom__name__contains=key)|Q(symptom__symptomCategory__name__contains=key))
                    .values("symptom__symptomCategory")
                    .annotate(total=Count('symptom__symptomCategory'))
                    .order_by("-total")[0:10])\
        .values_list("symptom__symptomCategory", flat=True)

def load_symptoms_for_diagonising(request):
    if request.method == 'POST':
        key = request.POST.get('key')

        searched_symptom_ids=search_symptom(key)
        data=[]
        for item in searched_symptom_ids:
            try:
                data.append({"category": SymptomCategory.objects.get(pk=item), "options": Symptom.objects.filter(symptomCategory_id=item)})
            except Symptom.DoesNotExist:
                pass
        if len(data) < 1:
            return HttpResponse("")
        return HttpResponse(render_to_string('diagonising_disease/search_symptom.html', {'data': data}))
    return HttpResponse("")