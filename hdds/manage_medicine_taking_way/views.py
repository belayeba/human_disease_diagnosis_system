from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import MedicineTakingWay
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import traceback


class medicineTakingWay_datatable(BaseDatatableView):
    order_columns = ['description']
    columns = ['description','id']
    def get_initial_queryset(self):
        return MedicineTakingWay.objects.order_by("id")
    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(description__contains=search)
        filter_customer = self.request.GET.get('MedicineTakingWay', None)

        if filter_customer:
            customer_parts = filter_customer.split(' ')
            qs_params = None
            for part in customer_parts:
                q = Q(customer_firstdescription__contains=part)|Q(customer_lastdescription__contains=part)
                qs_params = qs_params | q if qs_params else q
            qs = qs.filter(qs_params)
        return qs

    def prepare_results(self, qs):

        json_data = []
        for item in qs:
            json_data.append([
                escape(item.description),
                item.id
            ])
        return json_data



def browse_medicineTakingWay_description(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=MedicineTakingWay.objects.filter(description__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.description)
        return HttpResponse(html)
    return HttpResponse("invalid access!")



def save_medicineTakingWay(request):
    if request.method == 'POST':
        description = request.POST.get('description')
        if not description:
            return HttpResponse("Enter valdid description!")
        description=description.strip().replace('"', '')
        if description=="":
            return HttpResponse("Enter valid description!")
        try:
            MedicineTakingWayData=MedicineTakingWay.objects.get(description=description)
            return HttpResponse("This description already registered!");
        except MedicineTakingWay.DoesNotExist:
            try:
                MedicineTakingWay.objects.create(description=description,registralUserName_id=1).save()
                return HttpResponse("yes")
            except Exception as e:
                return HttpResponse("error occurred");
    return HttpResponse("invalid access!")




def update_medicineTakingWay(request):
    if request.method == 'POST':
        description = request.POST.get('description')
        id = request.POST.get('id')
        print(id)
        if not description:
            return HttpResponse("Enter valid description!")
        if not id:
            return HttpResponse("Select valid medicine taking way to update!")
        description=description.strip().replace('"', '')

        if description=="":
            return HttpResponse("Enter valid description!")

        try:
            data=MedicineTakingWay.objects.get(pk=id)
            try:
                MedicineTakingWayData = MedicineTakingWay.objects.exclude(pk=id).filter(description=description)[0:10]
                if MedicineTakingWayData.exists():
                    return HttpResponse("This description already exist!");
                try:
                    MedicineTakingWay.objects.filter(pk=id).update(description=description)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
            except MedicineTakingWay.DoesNotExist:
                try:
                    MedicineTakingWay.objects.filter(pk=id).update(description=description)
                    return HttpResponse("yes")
                except Exception as e:
                    return HttpResponse("error occurred");
        except MedicineTakingWay.DoesNotExist:
            return HttpResponse("Select valid medicine takng way to update!")
    return HttpResponse("invalid access!")




def delete_medicineTakingWay(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        if not id:
            return HttpResponse("Select valid medicine takng way to delete!")
        try:
            data=MedicineTakingWay.objects.get(pk=id)
            MedicineTakingWay.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except MedicineTakingWay.DoesNotExist:
            return HttpResponse("Select valid medicine takng way to delete!")
    return HttpResponse("invalid access!")
