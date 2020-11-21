from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import DiseaseCategory
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import traceback


class disease_category_datatable(BaseDatatableView):
    order_columns = ['name']
    columns = ['name','id']
    def get_initial_queryset(self):
        return DiseaseCategory.objects.order_by("id")
    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(name__contains=search)
        filter_customer = self.request.GET.get('DiseaseCategory', None)

        if filter_customer:
            customer_parts = filter_customer.split(' ')
            qs_params = None
            for part in customer_parts:
                q = Q(customer_firstname__contains=part)|Q(customer_lastname__contains=part)
                qs_params = qs_params | q if qs_params else q
            qs = qs.filter(qs_params)
        return qs

    def prepare_results(self, qs):

        json_data = []
        for item in qs:
            json_data.append([
                escape(item.name),
                item.id
            ])
        return json_data



def browse_disease_category_name(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=DiseaseCategory.objects.filter(name__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.name)
        return HttpResponse(html)
    return HttpResponse("invalid access!")



def save_disease_category(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if not name:
            return HttpResponse("Enter valid name!")
        name=name.strip().replace('"', '')
        if name=="":
            return HttpResponse("Enter valid name!")
        try:
            DiseaseCategoryData=DiseaseCategory.objects.get(name=name)
            return HttpResponse("This name already registered!");
        except DiseaseCategory.DoesNotExist:
            try:
                DiseaseCategory.objects.create(name=name,registralUserName_id=1).save()
                return HttpResponse("yes")
            except Exception as e:
                return HttpResponse("error occurred");
    return HttpResponse("invalid access!")




def update_disease_category(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        id = request.POST.get('id')
        if not name:
            return HttpResponse("Enter valid name!")
        if not id:
            return HttpResponse("Select valid disease category to update!")
        name=name.strip().replace('"', '')

        if name=="":
            return HttpResponse("Enter valid name!")

        try:
            data=DiseaseCategory.objects.get(pk=id)
            try:
                DiseaseCategoryData = DiseaseCategory.objects.exclude(pk=id).filter(name=name)[0:10]
                if DiseaseCategoryData.exists():
                    return HttpResponse("This name already exist!");
                try:
                    DiseaseCategory.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
            except DiseaseCategory.DoesNotExist:
                try:
                    DiseaseCategory.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
        except DiseaseCategory.DoesNotExist:
            return HttpResponse("Select valid disease category to update!")
    return HttpResponse("invalid access!")




def delete_disease_category(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        if not id:
            return HttpResponse("Select valid disease category to delete!")
        try:
            data=DiseaseCategory.objects.get(pk=id)
            DiseaseCategory.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except DiseaseCategory.DoesNotExist:
            return HttpResponse("Select valid disease category to delete!")
    return HttpResponse("invalid access!")
