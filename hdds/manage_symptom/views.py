from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import Symptom
from register_disease_data.models import SymptomCategory
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import traceback



class symptom_datatable(BaseDatatableView):
    order_columns = ['name',"symptomCategory"]
    columns = ['name',"id","symptomCategory"]
    def get_initial_queryset(self):
        return Symptom.objects.order_by("id")

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(name__contains=search)|Q(symptomCategory__name__contains=search))

        filter_customer = self.request.GET.get('Symptom', None)
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
                escape(item.symptomCategory.name),# escape HTML for security reasons
                item.id,
                escape(item.symptomCategory_id)
            ])
        return json_data
def load_symptom_category(request):
    filtered_data = SymptomCategory.objects.all()
    key =request.POST.get('id')
    mydata = None
    try:
        mydata = SymptomCategory.objects.get(pk=key);
    except SymptomCategory.DoesNotExist:
        pass
    html = '<option value="">Select category</option>';

    for data in filtered_data:
        if mydata and mydata==data:
            html = html.__add__('<option value=%s selected>%s</option>' % (data.id, data.name))
        html = html.__add__('<option value=%s>%s</option>' % (data.id,data.name))
    return HttpResponse(html)

def browse_symptom_name(request):
    if request.method == 'POST':
        key = request.POST.get('key')
        if not key:
            return HttpResponse("")
        filtered_data=Symptom.objects.filter(name__contains=key)[0:10]
        html='';
        for data in filtered_data:
            html=html.__add__('<option value="%s">' % data.name)

        return HttpResponse(html)

    return HttpResponse("")


def save_symptom(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if not name:
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        name=name.strip().replace('"', '')
        if name=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        try:
            SymptomData=Symptom.objects.filter(name=name)
            if SymptomData.exists():
                return JsonResponse({"code": 1, "message": "This name registered before!"})
        except Symptom.DoesNotExist:
            pass


        category=request.POST.get('symptom_category')
        try:
            SymptomCategory.objects.get(pk=category)
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid category!"})


        try:
            Symptom.objects.create(name=name,symptomCategory_id=category,registralUserName_id=1).save()
            return JsonResponse({"code": 0, "message": ""})
        except Exception as e:
            return JsonResponse({"code": 3, "message": "error occurred!"})

    return JsonResponse({"code": 3, "message": "invalid access!"})



def update_symptom(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data=None
        try:
            data = Symptom.objects.get(pk=id)
        except:
            return JsonResponse({"code": 3, "message": "Select valid symptom!"})

        name = request.POST.get('name')
        if not name:
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        name=name.strip().replace('"', '')
        if name=="":
            return JsonResponse({"code": 1 ,"message":"Enter valid name!"})

        try:
            SymptomData=Symptom.objects.exclude(pk=id).filter(name=name)[0:10]
            if SymptomData.exists():
                return JsonResponse({"code": 1, "message": "This name registered before!"})
        except Exception as a:
            pass
        category=request.POST.get('symptom_category')
        try:
            SymptomCategory.objects.get(pk=category)
            try :
                Symptom.objects.filter(pk=id).update(name=name,symptomCategory_id=category)
                return JsonResponse({"code": 0, "message": ""})
            except Exception as d:
                return JsonResponse({"code": 3, "message": "error occurred!"})
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid category!"})
    return JsonResponse({"code": 3, "message": "invalid access!"})


def delete_symptom(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data = None
        try:
            data = Symptom.objects.get(pk=id)
            Symptom.objects.filter(pk=id).delete()
            return HttpResponse("yes")
        except:
            return JsonResponse("Select valid symptom!")
    return HttpResponse("invalid access!")
