from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import Medicine
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import traceback


class medicine_datatable(BaseDatatableView):
    order_columns = ['name']
    columns = ['name','id']
    def get_initial_queryset(self):
        return Medicine.objects.order_by("id")
    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(name__contains=search)
        filter_customer = self.request.GET.get('Medicine', None)

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



def browse_medicine_name(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=Medicine.objects.filter(name__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.name)
        return HttpResponse(html)
    return HttpResponse("invalid access!")



def save_medicine(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if not name:
            return HttpResponse("Enter valid name!")
        name=name.strip().replace('"', '')
        if name=="":
            return HttpResponse("Enter valid name!")
        try:
            MedicineData=Medicine.objects.get(name=name)
            return HttpResponse("This name already registered!");
        except Medicine.DoesNotExist:
            try:
                Medicine.objects.create(name=name,registralUserName_id=1).save()
                return HttpResponse("yes")
            except Exception as e:
                return HttpResponse("error occurred");
    return HttpResponse("invalid access!")




def update_medicine(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        id = request.POST.get('id')
        if not name:
            return HttpResponse("Enter valid name!")
        if not id:
            return HttpResponse("Select valid symptom category to update!")
        name=name.strip().replace('"', '')

        if name=="":
            return HttpResponse("Enter valid name!")

        try:
            data=Medicine.objects.get(pk=id)
            try:
                MedicineData = Medicine.objects.exclude(pk=id).filter(name=name)[0:10]
                if MedicineData.exists():
                    return HttpResponse("This name already exist!");
                try:
                    Medicine.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
            except Medicine.DoesNotExist:
                try:
                    Medicine.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
        except Medicine.DoesNotExist:
            return HttpResponse("Select valid medicine to update!")
    return HttpResponse("invalid access!")




def delete_medicine(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        if not id:
            return HttpResponse("Select valid medicine to delete!")
        try:
            data=Medicine.objects.get(pk=id)
            Medicine.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except Medicine.DoesNotExist:
            return HttpResponse("Select valid medicine to delete!")
    return HttpResponse("invalid access!")
