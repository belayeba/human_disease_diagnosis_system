from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import Disease
from register_disease_data.models import DiseaseCategory
from register_disease_data.models import Pathogen
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import traceback


class disease_datatable(BaseDatatableView):
    order_columns = ['name',"DiseaseCategory","pathogen"]
    columns = ['name',"id","DiseaseCategory","pathogen"]
    def get_initial_queryset(self):
        return Disease.objects.order_by("id")

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(name__contains=search)|Q(DiseaseCategory__name__contains=search)|Q(pathogen__name__contains=search))

        filter_customer = self.request.GET.get('Disease', None)
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
                escape(item.DiseaseCategory.name),# escape HTML for security reasons
                escape(item.pathogen.name),
                item.id,
                escape(item.DiseaseCategory_id),
                escape(item.pathogen_id),
            ])
        return json_data


def load_disease_category(request):
    filtered_data = DiseaseCategory.objects.all()
    key =request.POST.get('id')
    mydata = None
    try:
        mydata = DiseaseCategory.objects.get(pk=key);
    except DiseaseCategory.DoesNotExist:
        pass
    html = '<option value="">Select option</option>';

    for data in filtered_data:
        if mydata and mydata==data:
            html = html.__add__('<option value=%s selected>%s</option>' % (data.id, data.name))
        html = html.__add__('<option value=%s>%s</option>' % (data.id,data.name))
    return HttpResponse(html)

def load_pathogen(request):
    filtered_data = Pathogen.objects.all()
    key =request.POST.get('id')
    mydata = None
    try:
        mydata = Pathogen.objects.get(pk=key);
    except Pathogen.DoesNotExist:
        pass
    html = '<option value="">Select option</option>';

    for data in filtered_data:
        if mydata and mydata==data:
            html = html.__add__('<option value=%s selected>%s</option>' % (data.id, data.name))
        html = html.__add__('<option value=%s>%s</option>' % (data.id,data.name))
    return HttpResponse(html)

def browse_disease_name(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=Disease.objects.filter(name__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.name)

        return HttpResponse(html)

    return HttpResponse("")


def save_disease(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if not name:
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        name=name.strip().replace('"', '')
        if name=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        try:
            DiseaseData=Disease.objects.filter(name=name)
            if DiseaseData.exists():
                return JsonResponse({"code": 1, "message": "This name registered before!"})
        except Disease.DoesNotExist:
            pass


        category=request.POST.get('disease_category')
        try:
            DiseaseCategory.objects.get(pk=category)
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid category!"})


        pathogen = request.POST.get('pathogen')
        try:
            Pathogen.objects.get(pk=pathogen)
        except Exception as e:
            return JsonResponse({"code": 3, "message": "Select valid pathogen!"})


        try:
            Disease.objects.create(name=name,DiseaseCategory_id=category,pathogen_id=pathogen,registralUserName_id=1).save()
            return JsonResponse({"code": 0, "message": ""})
        except Exception as e:
            return JsonResponse({"code": 4, "message": "error occurred!"})

    return JsonResponse({"code": 4, "message": "invalid access!"})



def update_disease(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data=None
        try:
            data = Disease.objects.get(pk=id)
        except:
            return JsonResponse({"code": 4, "message": "Select valid disease!"})

        name = request.POST.get('name')
        if not name:
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        name=name.strip().replace('"', '')
        if name=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        try:
            DiseaseData=Disease.objects.exclude(pk=id).filter(name=name)[0:10]
            if DiseaseData.exists():
                return JsonResponse({"code": 1, "message": "This name registered before!"})
        except Exception as a:
            pass
        category=request.POST.get('disease_category')
        try:
            DiseaseCategory.objects.get(pk=category)
            pathogen = request.POST.get('pathogen')
            try:
                Pathogen.objects.get(pk=pathogen)
                try :
                    Disease.objects.filter(pk=id).update(name=name,DiseaseCategory_id=category,pathogen_id=pathogen)
                    return JsonResponse({"code": 0, "message": ""})
                except Exception as d:
                    return JsonResponse({"code": 4, "message": "error occurred!"})
            except Exception as e:
                return JsonResponse({"code": 3, "message": "Select valid pathogen!"})
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid category!"})
    return JsonResponse({"code": 4, "message": "invalid access!"})


def delete_disease(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data = None
        try:
            data = Disease.objects.get(pk=id)
            Disease.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except:
            return JsonResponse("Select valid disease!")
    return HttpResponse("invalid access!")
