from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import FactorOptions
from register_disease_data.models import Factor
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import traceback



class factor_options_datatable(BaseDatatableView):
    order_columns = ['description',"factor"]
    columns = ['description',"id","factor"]
    def get_initial_queryset(self):
        return FactorOptions.objects.order_by("id")

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(description__contains=search)|Q(factor__name__contains=search))

        filter_customer = self.request.GET.get('FactorOptions', None)
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
                escape(item.description),
                escape(item.factor.name),# escape HTML for security reasons
                item.id,
                escape(item.factor_id)
            ])
        return json_data
def load_factor(request):
    filtered_data = Factor.objects.all()
    key =request.POST.get('id')
    mydata = None
    try:
        mydata = Factor.objects.get(pk=key);
    except Factor.DoesNotExist:
        pass
    html = '<option value="">Select option</option>';

    for data in filtered_data:
        if mydata and mydata==data:
            html = html.__add__('<option value=%s selected>%s</option>' % (data.id, data.name))
        html = html.__add__('<option value=%s>%s</option>' % (data.id,data.name))
    return HttpResponse(html)

def browse_factor_options_description(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=FactorOptions.objects.filter(description__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.description)

        return HttpResponse(html)

    return HttpResponse("")


def save_factor_options(request):
    if request.method == 'POST':
        description = request.POST.get('description')
        if not description:
            return JsonResponse({"code": 1 ,"message":"Enter valid description!"})

        description=description.strip().replace('"', '')
        if description=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid description!"})

        try:
            FactorOptionsData=FactorOptions.objects.filter(description=description)
            if FactorOptionsData.exists():
                return JsonResponse({"code": 1, "message": "This description registered before!"})
        except FactorOptions.DoesNotExist:
            pass


        factor=request.POST.get('factor')
        try:
            Factor.objects.get(pk=factor)
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid factor!"})


        try:
            FactorOptions.objects.create(description=description,factor_id=factor,registralUserName_id=1).save()
            return JsonResponse({"code": 0, "message": ""})
        except Exception as e:
            print(e)
            return JsonResponse({"code": 3, "message": "error occurred!"})

    return JsonResponse({"code": 3, "message": "invalid access!"})



def update_factor_options(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data=None
        try:
            data = FactorOptions.objects.get(pk=id)
        except:
            return JsonResponse({"code": 3, "message": "Select valid factor_options!"})

        description = request.POST.get('description')
        if not description:
            return JsonResponse({"code": 1 ,"message":"Enter valid description!"})

        description=description.strip().replace('"', '')
        if description=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid description!"})

        try:
            FactorOptionsData=FactorOptions.objects.exclude(pk=id).filter(description=description)[0:10]
            if FactorOptionsData.exists():
                return JsonResponse({"code": 1, "message": "This description registered before!"})
        except Exception as a:
            pass
        factor=request.POST.get('factor')
        try:
            Factor.objects.get(pk=factor)
            try :
                FactorOptions.objects.filter(pk=id).update(description=description,factor_id=factor)
                return JsonResponse({"code": 0, "message": ""})
            except Exception as d:
                return JsonResponse({"code": 3, "message": "error occurred!"})
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid factor!"})
    return JsonResponse({"code": 3, "message": "invalid access!"})


def delete_factor_options(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data = None
        try:
            data = FactorOptions.objects.get(pk=id)
            FactorOptions.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except:
            return JsonResponse("Select valid factor_options!")
    return HttpResponse("invalid access!")
