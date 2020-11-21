from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import Medicine, Disease, DiseaseSymptom, DiseaseFactor, Symptom, FactorOptions, Medicine_Type_Usage, Prescription, PrescriptionFactors
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import traceback


class disease_datatable(BaseDatatableView):
    order_columns = ['name']
    columns = ['name',"id"]
    def get_initial_queryset(self):
        return Disease.objects.order_by("id")

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(name__contains=search))

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
                item.id
            ])
        return json_data

def load_disease_symptom_and_factor(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        data=None
        try:
            data = Disease.objects.get(pk=id)
        except:
            return JsonResponse({"code": 0, "message": "Select valid disease!"})

        matched1=DiseaseSymptom.objects.filter(disease=id);
        symptomHTML=""
        ind=1
        for part in matched1:
            if symptomHTML == "" :
                symptomHTML="<table class='table table-sm'><tr><th>No</th><th>Symptom</th><th></th></tr>"
            symptomHTML=symptomHTML.__add__(
                ("<tr><td>%s</td><td>%s</td><td><a style='color:brown' href='#' onclick='display_delete_symptom_from_disease_confirmation(%s)' ><ins>delete</ins></a></td></tr>"
                "<tr style='display: none;' id='delete_symptom_from_disease_confirmation_%s'><td colspan='3'>"
                "<table style='width:100%s'>"
                       "<tr style='background-color:whitesmoke;color:red'>"
                            "<td>Are you sure to delete this symptom?</td>"
                            "<td><button class='btn btn-sm btn-warning' onclick='hidden_delete_symptom_from_disease_confirmation(%s)'>no</button></td>"
                            "<td><button class='btn btn-sm btn-primary' onclick='remove_symptom_from_disease(%s)'>yes</button></td>"
                       "<tr>"
                "</table></td>"
                "</tr>")%(ind,part.symptom.name,part.id,part.id,"%",part.id,part.symptom_id));
            ind=ind+1
        if symptomHTML == "" :
            symptomHTML='<span style="color:brown">No symptom added for this disease!</span>'
        else:
            symptomHTML.__add__("</table>")


        matched2 = DiseaseFactor.objects.filter(disease=id);
        factorHTML = ""
        ind = 1


        for part in matched2:
            if factorHTML == "":
                factorHTML = "<table class='table table-sm'><tr><th>No</th><th>Factor Description</th><th>status</th><th></th></tr>"
            status="include"
            if part.factorStatus == 0:
                status = "exclude"
            factorHTML = factorHTML.__add__(
                (
                    "<tr><td>%s</td><td>%s</td><td>%s</td><td><a style='color:brown' href='#' onclick='display_delete_factor_option_from_disease_confirmation(%s)' ><ins>delete</ins></a></td></tr>"
                    "<tr style='display: none;' id='delete_factor_option_from_disease_confirmation_%s'><td colspan='3'>"
                    "<table style='width:100%s'>"
                    "<tr style='background-color:whitesmoke;color:red'>"
                    "<td>Are you sure to delete this factor_option?</td>"
                    "<td><button class='btn btn-sm btn-warning' onclick='hidden_delete_factor_option_from_disease_confirmation(%s)'>no</button></td>"
                    "<td><button class='btn btn-sm btn-primary' onclick='remove_factor_option_from_disease(%s)'>yes</button></td>"
                    "<tr>"
                    "</table></td>"
                    "</tr>") % (ind, part.factor.description,status, part.id, part.id, "%", part.id, part.factor_id));
            ind = ind + 1

        if factorHTML == "":
            factorHTML = '<span style="color:brown">No factor added for this disease!</span>'
        else:
            factorHTML.__add__("</table>")
        return JsonResponse({"symptom": symptomHTML,"factor":factorHTML, "code":1})

    return JsonResponse({"code": 0, "message": "invalid access!"})

def load_symptom(request):
    if request.method == 'POST':
        category = request.POST.get('category')
        filtered_data=None
        if not category:
            filtered_data=Symptom.objects.all()
        else:
            filtered_data=Symptom.objects.filter(symptomCategory_id=category)
        html='<option value="">select symptom</option>';
        for data in filtered_data:
            html=html.__add__('<option value="%s">%s</option>' % (data.id,data.name))

        return HttpResponse(html)

    return HttpResponse("")



def load_symptom_to_disease_prescription(request):
    if request.method == 'POST':
        filtered_data=Symptom.objects.all()
        html='<option value="">select symptom</option>';
        for data in filtered_data:
            html=html.__add__('<option value="%s">%s</option>' % (data.id,data.name))

        return HttpResponse(html)

    return HttpResponse("")



def load_factor_option(request):
    if request.method == 'POST':
        factor = request.POST.get('factor')
        filtered_data=None
        if not factor:
            filtered_data=FactorOptions.objects.all()
        else:
            filtered_data=FactorOptions.objects.filter(factor_id=factor)
        html='<option value="">select factor options</option>';
        for data in filtered_data:
            html=html.__add__('<option value="%s">%s</option>' % (data.id,data.description))

        return HttpResponse(html)

    return HttpResponse("")


def add_symptom_to_disease(request):
    if request.method == 'POST':
        symptom = request.POST.get('symptom')
        disease = request.POST.get('disease')
        isMust  = int(request.POST.get('isMust'))
        if not symptom:
            return HttpResponse("Invalid symptom!")
        if not disease:
            return HttpResponse("Invalid disease!")
        if isMust != 0 and isMust != 1:
            return HttpResponse("Invalid status!")
        symptomOBJ=None
        try:
            symptomOBJ=Symptom.objects.get(pk=symptom)
        except Symptom.DoesNotExist:
            return HttpResponse("Invalid symptom!")
        diseaseData=None
        try:
            diseaseData=Disease.objects.get(pk=disease)
        except Disease.DoesNotExist:
            return HttpResponse("Invalid disease!")
        matchedData=DiseaseSymptom.objects.filter(symptom=symptomOBJ,disease=diseaseData)
        if matchedData.exists():
            return HttpResponse("This symptom already added!")
        DiseaseSymptom.objects.create(symptom=symptomOBJ,disease=diseaseData,registralUserName_id=1,isMust=isMust).save()
        return HttpResponse("yes")

    return HttpResponse("")



def remove_symptom_from_disease(request):
    if request.method == 'POST':
        symptom = request.POST.get('symptom')
        disease = request.POST.get('disease')
        if not symptom:
            return HttpResponse("Invalid symptom!")
        if not disease:
            return HttpResponse("Invalid disease!")
        matchedData=DiseaseSymptom.objects.filter(symptom_id=symptom,disease_id=disease)
        if matchedData.exists():
            DiseaseSymptom.objects.filter(symptom_id=symptom,disease_id=disease).delete()
            return HttpResponse("yes")
        else:
            return HttpResponse("This symptom not added to this disease!")
    return HttpResponse("")



def add_factor_option_to_disease(request):
    if request.method == 'POST':
        factor_option = request.POST.get('factor_option')
        disease = request.POST.get('disease')
        status  = int(request.POST.get('status'))
        if not factor_option:
            return HttpResponse("Invalid factor option!")
        if not disease:
            return HttpResponse("Invalid disease!")
        if status != 0 and status != 1:
            return HttpResponse("Invalid status!")
        factorOptionOBJ=None
        try:
            factorOptionOBJ=FactorOptions.objects.get(pk=factor_option)
        except FactorOptions.DoesNotExist:
            return HttpResponse("Invalid factor option!")
        diseaseData=None
        try:
            diseaseData=Disease.objects.get(pk=disease)
        except Disease.DoesNotExist:
            return HttpResponse("Invalid disease!")
        matchedData=DiseaseFactor.objects.filter(factor=factorOptionOBJ,disease=diseaseData)
        if matchedData.exists():
            return HttpResponse("This factor options already added!")
        DiseaseFactor.objects.create(factor=factorOptionOBJ,disease=diseaseData,registralUserName_id=1,factorStatus=status).save()
        return HttpResponse("yes")

    return HttpResponse("")



def remove_factor_option_from_disease(request):
    if request.method == 'POST':
        factor_option = request.POST.get('factor_option')
        disease = request.POST.get('disease')
        if not factor_option:
            return HttpResponse("Invalid factor option!")
        if not disease:
            return HttpResponse("Invalid disease!")
        matchedData=DiseaseFactor.objects.filter(factor_id=factor_option,disease_id=disease)
        if matchedData.exists():
            DiseaseFactor.objects.filter(factor_id=factor_option,disease_id=disease).delete()
            return HttpResponse("yes")
        else:
            return HttpResponse("This symptom not added to this disease!")
    return HttpResponse("")



def remove_prescription_from_disease(request):
    if request.method == 'POST':
        prescription_id = request.POST.get('prescription_id')
        disease = request.POST.get('disease')
        if not disease:
            return HttpResponse("Invalid disease!")
        if not prescription_id:
            return HttpResponse("Invalid prescription!")

        diseaseData = None
        try:
            diseaseData = Disease.objects.get(pk=disease)
        except Disease.DoesNotExist:
            return HttpResponse("Invalid disease!")

        prescriptionData = None
        try:
            prescriptionData = Prescription.objects.get(pk=prescription_id)
        except Prescription.DoesNotExist:
            return HttpResponse("Invalid prescription!")
        try:
            Prescription.objects.get(pk=prescription_id).delete()
            return HttpResponse("yes")
        except Prescription.DoesNotExist:
            return HttpResponse("error occurred!")
    return HttpResponse("")

prescription_factors_item_template='<div  id="deletable_factor_from_prescribed_%s_%s" class="container factor-template"  style="margin-bottom: 5px">' \
                                      '<div class="row" style="margin-left: 1px;">' \
                                        '<div class="col col-md-auto col1" id="single_selected_factor_first_part_idd" style="border:1px solid lightgrey;background-color: aliceblue;border-top-left-radius: 10px;border-bottom-left-radius: 10px ">' \
                                             '%s' \
                                        '</div>' \
                                        '<div onclick="$(\'.delete_prescribed_factor_delete_confirm\').hide();$(\'#delete_prescribed_factor_delete_confirm_%s_%s\').slideToggle();" class="col-md-auto" style="cursor:pointer;border:1px solid lightgrey;background-color: aliceblue;border-top-right-radius: 10px;border-bottom-right-radius: 10px;color: brown"  id="single_selected_factor_second_part_idd">' \
                                          'x' \
                                        '</div>' \
                                      '</div>' \
                                 '</div><div class="delete_prescribed_factor_delete_confirm" id="delete_prescribed_factor_delete_confirm_%s_%s" style="border-radius:10px;display:none;padding:5px;background-color:whitesmoke;color:red;margin-bottom:5px">are_you_sure?<span style="color:whitesmoke;">___</span><span style="color:brown;cursor:pointer" onclick="$(\'.delete_prescribed_factor_delete_confirm\').hide();"><ins>No</ins></span>  <span style="color:whitesmoke;">___</span>  <span style="color:blue;cursor:pointer" onclick="delete_factor_from_prescribed_medicine(%s,%s);"><ins>Yes</ins></span></div></div>';






def load_disease_prescription(request):
    if request.method == 'POST':
        disease = request.POST.get('disease')
        if not disease:
            return HttpResponse("Invalid disease!")
        diseaseObj = None
        try:
            diseaseObj=Disease.objects.get(pk=disease)
        except Disease.DoesNotExist:
            return HttpResponse("Invalid disease!")
        prescriptionData=Prescription.objects.filter(disease=diseaseObj)
        html=""
        count=1;
        for item in prescriptionData:

            if html == "":
                html="<style> .lrb{border-left:1px solid lightgray;border-right:1px solid lightgray;border-bottom:1px solid lightgray;}</style><table style='width:100%'><tr><th class='lrb'>No</th><th class='lrb'>Medicine</th><th class='lrb'>type</th><th colspan='2' style='text-align:center;border-right:1px solid lightgray;border-left:1px solid lightgray;' >factors</th><th class='lrb'></th></tr>"

            factor_item_list=""
            for _factor in item.factor.all():
                factor_item_list = factor_item_list.__add__(prescription_factors_item_template%(item.id,_factor.id,_factor.description,item.id,_factor.id,item.id,_factor.id,item.id,_factor.id))
            if factor_item_list== "" :
                factor_item_list="<span style='color:gray'>No factor added!</span>"
            factor_item_list = ('<div id="add_factor_to_prescribed_mess_%s" style="align-text:left;color:red;padding:5px"></div><div class="adding_factor_drop_down_div" id="factor_dropdown_for_add_to_prescribed_medicine_%s" style="display:none;padding:5px;background-color:whitesmoke"><select onchange="add_factor_to_this_prescription(%s,$(this).val())" class="factor_drop_downselect2 right-align" ></select></div><div id="factor_list_display_%s">'%(item.id,item.id,item.id,item.id)).__add__(factor_item_list).__add__("</div>")
            html= html + "<tr><td class='lrb' >%s</td><td class='lrb'>%s</td><td class='lrb'>%s</td><td  style='border-left:1px solid lightgray;border-bottom:1px solid lightgray;'>" \
                         "%s" \
                         "</td><td style='border-right:1px solid lightgray;border-bottom:1px solid lightgray;'><i class='fa fa-plus-square' onclick='$(\"#factor_dropdown_for_add_to_prescribed_medicine_%s\").slideToggle();'></i></td><td class='lrb'><ins style='color:brown;cursor:pointer' onclick='$(\"#delete_prescription_confirmation_block_%s\").slideToggle();'>delete</ins></td>" \
                         "</tr>" \
                         "<tr style='display:none' id='delete_prescription_confirmation_block_%s'><td colspan='6'>   <div class='row'> <div class='col-8'><span style='color:red'>Are you sure to delete this prescription?</span>" \
                         "</div> <div class='col-1'>   <button class='btn btn-sm btn-warning' onclick='$(\"#delete_prescription_confirmation_block_%s\").slideToggle();'>No</button> </div>  <div class='col-1'>  <button class='btn btn-sm btn-info' onclick='delete_prescription_from_disease(%s,%s)'>Yes</button>  </div>  </td>" \
                         "</tr>"%(count,item.medicine_type.medicine.name,item.medicine_type.type.name,factor_item_list,item.id,item.id,item.id,item.id,disease,item.id)
            count=count+1
        if html == "":
            html="<span style='color:red'>No prescribed medicine for this disease!</span>"
        else:
            html=html+"</table"
        return HttpResponse(html)
    return HttpResponse("")






def load_medicine_to_disease_prescription(request):
    if request.method == 'POST':
        medicine=Medicine.objects.all()
        html=""
        for parts in medicine:
            if html == "":
                html="<option value=0>select medicine name</option>"
            html=html.__add__("<option value=%s>%s</option>"%(parts.id,parts.name))
        if html == "" :
            return HttpResponse("<option value=0>No registered medicine!</option>")
        return HttpResponse(html)
    return HttpResponse("")






def load_medicine_type_to_disease_prescription(request):
    if request.method == 'POST':
        medicine = request.POST.get('medicine')
        if not medicine or medicine == 0:
            return HttpResponse("<option value=0>Select medicine first!</option>")
        medicine=int(medicine)
        if medicine == 0:
            return HttpResponse("<option value=0>Select medicine first!</option>")
        print(medicine);
        medicine_type=Medicine_Type_Usage.objects.filter(medicine_id=medicine)
        html=""
        for parts in medicine_type:
            html=html.__add__("<option value=%s>%s</option>"%(parts.type.id,parts.type.name))
        if html == "" :
            return HttpResponse("<option value=0>No type registered for this medicine!</option>")
        return HttpResponse(html)
    return HttpResponse("")





def add_disease_prescription(request):
    if request.method == "POST":
        disease = request.POST.get('disease')
        medicine=request.POST.get('medicine')
        type=request.POST.get('type')

        diseaseObj = None
        medicineObj=None
        medicineTypeObj=None

        try:
            diseaseObj=Disease.objects.get(pk=disease)
        except Disease.DoesNotExist:
            return JsonResponse({"code":4,"message":"Select valid disease!"})

        try:
            medicineObj=Medicine.objects.get(pk=medicine)
        except Medicine.DoesNotExist:
            return JsonResponse({"code":1,"message":"Select valid medicine!"})

        medicineTypeObj=Medicine_Type_Usage.objects.filter(medicine_id=medicine, type_id=type)
        if not medicineTypeObj.exists():
            return JsonResponse({"code": 2, "message": "Select valid type for this medicine!"})
        medicineTypeObj=medicineTypeObj.first()
        factor_ids = [val for key, val in request.POST.items() if "factor" in key]
        list_of_factors=[]
        for item in factor_ids:
            try:
                list_of_factors.append(FactorOptions.objects.get(pk=item))
            except FactorOptions.DoesNotExist:
                return JsonResponse({"code": 3, "id":item, "message": "Select valid factors!"})
        if Prescription.objects.filter(disease=diseaseObj,medicine_type=medicineTypeObj).exists():
            return JsonResponse({"code": 4, "message": "duplicated prescription!"})
        try:
            prescription=Prescription.objects.create(disease=diseaseObj,medicine_type=medicineTypeObj,registralUserName_id=1)
            prescription.save()
            for factor in list_of_factors :
                PrescriptionFactors.objects.create(factor=factor,prescription=prescription,status=True).save()
            return JsonResponse({"code": 0})
        except Exception  as e:
            print(e)
            return JsonResponse({"code": 4, "message": "error occurred!"})

    return HttpResponse("Invalid access!")


def remove_factor_from_prescribed_medicine(request):
    if request.method == 'POST':
        prescription_id = request.POST.get('prescription_id')
        factor_id = request.POST.get('factor_id')

        if not factor_id:
            return HttpResponse("Invalid factors!")

        if not prescription_id:
            return HttpResponse("Invalid prescription!")

        factorData = None
        try:
            factorData = FactorOptions.objects.get(pk=factor_id)
        except FactorOptions.DoesNotExist:
            return HttpResponse("Invalid factor!")

        prescriptionData = None
        try:
            prescriptionData = Prescription.objects.get(pk=prescription_id)
        except Prescription.DoesNotExist:
            return HttpResponse("Invalid prescription!")


        try:
            PrescriptionFactors.objects.filter(prescription=prescriptionData,factor=factorData).delete()
            return HttpResponse("yes")
        except Prescription.DoesNotExist:
            return HttpResponse("error occurred!")
    return HttpResponse("")




def add_factor_to_prescribed_medicine(request):
    if request.method == 'POST':
        prescription_id = request.POST.get('prescription_id')
        factor_id = request.POST.get('factor_id')

        if not factor_id:
            return JsonResponse({"code":1,"message":"Invalid factors!"})

        if not prescription_id:
            return JsonResponse({"code":1,"message":"Invalid prescription!"})

        factorData = None
        try:
            factorData = FactorOptions.objects.get(pk=factor_id)
        except FactorOptions.DoesNotExist:
            return JsonResponse({"code": 1, "message": "Invalid factor!"})

        prescriptionData = None
        try:
            prescriptionData = Prescription.objects.get(pk=prescription_id)
        except Prescription.DoesNotExist:
            return JsonResponse({"code": 1, "message": "Invalid prescription!"})

        if PrescriptionFactors.objects.filter(prescription=prescriptionData,factor=factorData).exists():
            return JsonResponse({"code": 1, "message": "already selected!"})
        try:
            PrescriptionFactors.objects.create(prescription=prescriptionData,factor=factorData,status=True).save()
            template=prescription_factors_item_template%(prescription_id,factor_id,factorData.description,prescription_id,factor_id,prescription_id,factor_id,prescription_id,factor_id)
            return JsonResponse({"code": 2, "message": template})
        except Prescription.DoesNotExist:
            return JsonResponse({"code": 1, "message": "error occurred!"})
    return HttpResponse("")