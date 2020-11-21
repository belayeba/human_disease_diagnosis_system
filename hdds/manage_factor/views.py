from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import Factor
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import traceback


class factor_datatable(BaseDatatableView):
    order_columns = ['name']
    columns = ['name','id']
    def get_initial_queryset(self):
        return Factor.objects.order_by("id")
    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(name__contains=search)
        filter_customer = self.request.GET.get('Factor', None)

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



def browse_factor_name(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=Factor.objects.filter(name__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.name)
        return HttpResponse(html)
    return HttpResponse("invalid access!")



def save_factor(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if not name:
            return HttpResponse("Enter valid name!")
        name=name.strip().replace('"', '')
        if name=="":
            return HttpResponse("Enter valid name!")
        try:
            FactorData=Factor.objects.get(name=name)
            return HttpResponse("This name already registered!");
        except Factor.DoesNotExist:
            try:
                Factor.objects.create(name=name,registralUserName_id=1).save()
                return HttpResponse("yes")
            except Exception as e:
                return HttpResponse("error occurred");
    return HttpResponse("invalid access!")




def update_factor(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        id = request.POST.get('id')
        if not name:
            return HttpResponse("Enter valid name!")
        if not id:
            return HttpResponse("Select valid factor to update!")
        name=name.strip().replace('"', '')

        if name=="":
            return HttpResponse("Enter valid name!")

        try:
            data=Factor.objects.get(pk=id)
            try:
                FactorData = Factor.objects.exclude(pk=id).filter(name=name)[0:10]
                if FactorData.exists():
                    return HttpResponse("This name already exist!");
                try:
                    Factor.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
            except Factor.DoesNotExist:
                try:
                    Factor.objects.filter(pk=id).update(name=name)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
        except Factor.DoesNotExist:
            return HttpResponse("Select valid factor to update!")
    return HttpResponse("invalid access!")




def delete_factor(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        if not id:
            return HttpResponse("Select valid factor to delete!")
        try:
            data=Factor.objects.get(pk=id)
            Factor.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except Factor.DoesNotExist:
            return HttpResponse("Select valid factor to delete!")
    return HttpResponse("invalid access!")
