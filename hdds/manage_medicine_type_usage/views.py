from django_datatables_view.base_datatable_view import BaseDatatableView
from django.utils.html import escape
from register_disease_data.models import *
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import traceback
def load_medicine_type_usage_form_data(request):
    if request.method == 'POST':
        type= request.POST.get('type')
        usage = request.POST.get('usage')
        measurement = request.POST.get('measurement')
        if type:
            type=int(type)
        if usage:
            usage=int(usage)
        if measurement:
            measurement=int(measurement)
        typeHTML="<option value=''>select type<option>"
        usageHTML="<option value=''>select taking style<option>"
        measurementHTML="<option value=''>select measurement <option>"
        all_type=MedicineType.objects.all()
        for part in all_type:
            if type and type==part.id:
                typeHTML = typeHTML.__add__("<option value='%s' selected>%s</option>" % (part.id, part.name))
            else:
                typeHTML=typeHTML.__add__("<option value='%s'>%s</option>"%(part.id,part.name))
        all_usage = MedicineTakingWay.objects.all()
        for part in all_usage:
            if usage and usage==part.id:
                usageHTML = usageHTML.__add__("<option value='%s' selected>%s</option>" % (part.id, part.description))
            else:
                usageHTML = usageHTML.__add__("<option value='%s'>%s</option>" % (part.id, part.description))
        all_measurement = Measurement.objects.all()
        for part in all_measurement:
            if measurement and measurement==part.id:
                measurementHTML = measurementHTML.__add__("<option value='%s' selected>%s</option>" % (part.id, part.name))
            else:
                measurementHTML = measurementHTML.__add__("<option value='%s'>%s</option>" % (part.id, part.name))

        return JsonResponse({"type":typeHTML,"usage":usageHTML,"measurement":measurementHTML})

    return JsonResponse("")

def htmlForInstractionOfMedicine(medicine_type_id):
    medicineTypeUsageObj=Medicine_Type_Usage.objects.get(pk=medicine_type_id)
    instructionHtml = ""
    _instractions = MedicineTakingInstruction.objects.filter(medicine_type=medicineTypeUsageObj)
    count = 1
    for item in _instractions:
        if instructionHtml == "":
            instructionHtml = "<table style='width:100%'><tr style='background-color:lightblue'><th>No</th><th>factors</th><th>Per day take</th><th>Per day detail</th><th>How long day</th><th></th><th></th></tr>"

        _factorHtml = ""

        _instructionFactor = InstructionFactor.objects.filter(medicine_taking_instruction=item)
        _count = 1
        for _item in _instructionFactor:
            if _factorHtml == "":
                _factorHtml = "<table id='factor_for_save_instruction_table_%s'>"%(item.id)
            _factorHtml = _factorHtml.__add__("<tr style='background-color:white; border : 0px solid whitesmoke' id='deletable_instruction_factor_table_row_%s_%s'>"
                                              "<td style='background-color:white; border : 0px solid whitesmoke'>%s</td>"
                                              "<td style='background-color:white; border : 0px solid whitesmoke'>%s</td>"
                                              "<td style='background-color:white; border : 0px solid whitesmoke;color:red'><i style='cursor:pointer;color:lightgray' class='fa fa-times' onclick='$(\".instruction_deletable_factor_class\").hide();$(\"#instruction_deletable_factor_%s_%s\").slideToggle();'></i></td>"
                                              "</tr style='background-color:white;'><tr style='display:none' class='instruction_deletable_factor_class' id='instruction_deletable_factor_%s_%s'>"
                                              "<td colspan='3' style='color:red;'>are_you_sure?<span style='color:white;'>__</span><span style='color:brown;cursor:pointer' onclick='$(\".instruction_deletable_factor_class\").hide();'><ins>no</ins></span><span style='color:white;'>__</span><span><ins style='color:blue;cursor:pointer' onclick='remove_factor_from_saved_instruction(%s,%s);$(\".instruction_deletable_factor_class\").hide();'>yes</ins></span></td></tr>"
                                              % (item.id,_item.id,"<i class='fa  fa-circle' style='color:lightgray'></i>",
                                                 _item.factor.description,item.id,_item.id,item.id,_item.id,item.id,_item.id))
            _count = _count + 1

        if _factorHtml != "":
            _factorHtml = _factorHtml.__add__("</table>")
        else:
            _factorHtml = "<span style='color:blue'>no_factors</span>"
        _factorHtml = _factorHtml.__add__("<div style='cursor:pointer;padding:5px;color:lightgray;height:25px'><i class='fa fa-plus-square float-right'"
                                          " onclick='_load_factor_option_to_instruction_form();$(\"#adding_factor_to_saved_instruction_div_%s\").slideToggle();'></i></div><div "
                                          "id='adding_factor_to_saved_instruction_div_%s' style='display:none'><select class='add_factor_to_save_instruction_dropdown' onchange='if($(this).val()!=0){add_factor_to_saved_instruction(%s,$(this).val());}'></select></div>"%(item.id,item.id,item.id))

        instructionHtml = instructionHtml.__add__(
            "<tr style='background-color:white' id='instruction_data_row_%s'><td>%s</td><td>%s</td><td id='perday_data_%s'>%s</td><td id='perdaydetail_data_%s'>%s</td><td id='how_long_%s'>%s</td><td style='color:blue;cursor:pointer'>"
            "<ins onclick='$(\".update_instruction_row\").hide();$(\".delete_instruction_row_confirmation\").hide();$(\"#update_instruction_row_%s\").slideToggle(); update_instruction_form_display(%s);'>edit</ins></td>"
            "<td style='color:red;cursor:pointer'><ins onclick='$(\".update_instruction_row\").hide();$(\".delete_instruction_row_confirmation\").hide();$(\"#delete_instruction_row_confirmation_%s\").slideToggle();' >delete</ins></td></tr>"
            "<tr class='delete_instruction_row_confirmation' id='delete_instruction_row_confirmation_%s' style='display:none'><td colspan='7'>"
            " <table class='table'><tr style='background-color:white'>  <td style='color:red'>are you sure to delete this instruction?</td>  <td><button class='btn btn-sm btn-warning' "
            "onclick='$(\".delete_instruction_row_confirmation\").hide();'>no</button></td>  <td><button class='btn btn-sm btn-primary' onclick='delete_instruction(%s)'>yes</button></td>  </tr></table> </td></tr>"
            "<tr class='update_instruction_row' id='update_instruction_row_%s' style='display:none'><td colspan='7' id='update_instruction_form_displayer_%s'></td></tr>"
            % (item.id,count, _factorHtml,item.id, item.perDayTake, item.id, item.perDayDetail, item.id, item.howLong,item.id,item.id,item.id,item.id,item.id,item.id,item.id))


        count = count + 1
    if instructionHtml == "":
        instructionHtml = ("<span style='color:red' id='no-instruction-message-%s'>No instruction registered for this medicine!</span>") % medicineTypeUsageObj.id
    else:
        instructionHtml = instructionHtml.__add__("</table>")
    instructionHtml = ("<div style='padding:5px'><i class='fa fa-times float-right' onclick='$(\".instraction_table_and_form_container_row\").hide()' style='color:brown;margin-bottom:5px;cursor:pointer'></i></div>").__add__(instructionHtml)
    instructionHtml = "<div id='instruction_tables_%s'>%s</div><br/>" \
                      "<div><ins style='color:blue;cursor:pointer' onclick='toggle_adding_instruction_form(%s)'>add instruction</ins></div>" \
                      "<br/><div id='add_instruction_for_medicine_form_container_%s'></div>" % (
                      medicineTypeUsageObj.id, instructionHtml, medicineTypeUsageObj.id, medicineTypeUsageObj.id)
    return instructionHtml



def load_saved_medicine_type_usage_data(request):
    if request.method == 'POST':
        key = request.POST.get('medicine')
        medicine=None
        try:
            medicine=Medicine.objects.get(pk=key)
        except Medicine.DoesNotExist:
            return HttpResponse("<span style='color:red'>No related data found!</span>")
        data=""
        saved_data=Medicine_Type_Usage.objects.filter(medicine=medicine)
        index=1;
        for parts in saved_data:
            instructionHtml=htmlForInstractionOfMedicine(parts.id)
            if data == "":
                data=data.__add__("<table class='table table-striped'><tr><th>No</th><th>Medicine Name</th><th>Type</th><th>Taking way</th><th>Measurement</th><th></th><th></th><th></th></tr>")
            data=data.__add__("<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td> <td><a onclick='$(\".instraction_table_and_form_container_row\").hide();$(\".update_medicine_type_usage_row\").hide();fill_update_data_to_form(%s,%s,%s,%s,%s);' style='cursor:pointer;color:blue'><ins>edit</ins></a>"
                              "<td><a style='color:magenta;cursor:pointer' onclick='$(\".update_medicine_type_usage_row\").hide();$(\".instraction_table_and_form_container_row\").hide();$(\"#instraction_table_and_form_container_row_%s\").slideToggle();'><ins>instruction</ins></a></td><td><a style='color:brown;cursor:pointer' onclick='$(\".instraction_table_and_form_container_row\").hide();confirm_delete_medicine_detail(%s)'><ins>delete</ins></a></td></tr>"
                              "<tr class='update_medicine_type_usage_row' id='medicine_type_usage_update_row_%s' style='display:none'><td  colspan='8'><div style='height:20px;'><i class='fa fa-times' onclick='$(\"#medicine_type_usage_update_row_%s\").slideToggle();' style='float:right;cursor:pointer;color:gray'></i></div><div id='medicine_type_usage_update_div_%s'></div><td></tr><tr style='display:none'></tr>"
                              "<tr style='border:2px solid lightgray;display:none' class='instraction_table_and_form_container_row' id='instraction_table_and_form_container_row_%s'>"
                              "<td colspan='8' id='instraction_table_and_form_container_%s'>%s</td></tr>"%( index,parts.medicine.name,parts.type.name,parts.takingWay.description,parts.measurement.name,
                                            parts.id,parts.medicine_id,parts.type_id,parts.takingWay_id,parts.measurement_id,parts.id,parts.id,parts.id,
                                            parts.id,parts.id,parts.id,parts.id,instructionHtml))
            index=index+1
        if data == "":
            data="<span style='color:red'>No related data found!</span>"
        else:
            data=data.__add__("</table>")
        return HttpResponse(data)
    return HttpResponse("")







def save_medicine_type_usage(request):
    if request.method == 'POST':
        medicine = request.POST.get('medicine')
        type = request.POST.get('type')
        usage = request.POST.get('usage')
        measurement = request.POST.get('measurement')
        medicineOBJ=typeOBJ=usageOBJ=measurementOBJ=None
        try:
            medicineOBJ=Medicine.objects.get(pk=medicine)
        except Medicine.DoesNotExist:
            return JsonResponse({"code": 1, "message": "Invalid medicine!"})
        try:
            typeOBJ=MedicineType.objects.get(pk=type)
        except MedicineType.DoesNotExist:
            return JsonResponse({"code": 2, "message": "Invalid type!"})
        try:
            usageOBJ=MedicineTakingWay.objects.get(pk=usage)
        except MedicineTakingWay.DoesNotExist:
            return JsonResponse({"code": 3, "message": "Invalid taking style!"})
        try:
            measurementOBJ=Measurement.objects.get(pk=measurement)
        except Measurement.DoesNotExist:
            return JsonResponse({"code": 4, "message": "Invalid measurement!"})
        medicine_type_usage=Medicine_Type_Usage.objects.filter(medicine=medicineOBJ, type=typeOBJ)
        if medicine_type_usage.exists():
            return JsonResponse({"code": 2, "message": "This type is already registered for this medicine!"})
        try:
            Medicine_Type_Usage.objects.create(medicine=medicineOBJ,type=typeOBJ,takingWay=usageOBJ,measurement=measurementOBJ,registralUserName_id=1).save()
            return JsonResponse({"code": 6, "message": "One medicine detail registered successfully!"})
        except Exception as e:
            print(e)
            return JsonResponse({"code": 5, "message": "error occured!"})
    return JsonResponse({"code":5,"message":"Invalid access!"})



def edit_medicine_type_usage(request):
    if request.method == 'POST':
        medicine_usage_type_id = request.POST.get('medicine_usage_type_id')
        type = request.POST.get('type')
        usage = request.POST.get('usage')
        measurement = request.POST.get('measurement')

        medicine = request.POST.get('medicine')
        medicine_usage_type_OBJ=medicineOBJ = typeOBJ = usageOBJ = measurementOBJ = None
        try:
            medicineOBJ = Medicine.objects.get(pk=medicine)
        except Medicine.DoesNotExist:
            return JsonResponse({"code": 5, "message": "Invalid medicine!"})

        try:
            medicine_usage_type_OBJ=Medicine_Type_Usage.objects.get(pk=medicine_usage_type_id)
        except Medicine_Type_Usage.DoesNotExist:
            return JsonResponse({"code": 5, "message": "Invalid medicine type and taking way data!"})
        try:
            typeOBJ=MedicineType.objects.get(pk=type)
        except MedicineType.DoesNotExist:
            return JsonResponse({"code": 2, "message": "Invalid type!"})
        try:
            usageOBJ=MedicineTakingWay.objects.get(pk=usage)
        except MedicineTakingWay.DoesNotExist:
            return JsonResponse({"code": 3, "message": "Invalid taking style!"})
        try:
            measurementOBJ=Measurement.objects.get(pk=measurement)
        except Measurement.DoesNotExist:
            return JsonResponse({"code": 4, "message": "Invalid measurement!"})

        medicine_type_usage = Medicine_Type_Usage.objects.filter(medicine=medicineOBJ, type=typeOBJ).exclude(id=medicine_usage_type_id)
        if medicine_type_usage.exists():
            return JsonResponse({"code": 2, "message": "This type is already registered for this medicine!"})
        try:
            Medicine_Type_Usage.objects.filter(id=medicine_usage_type_id).update(type=typeOBJ,takingWay=usageOBJ,measurement=measurementOBJ,)
            return JsonResponse({"code": 6, "message": "One medicine detail updated successfully!"})
        except Exception as e:
            return JsonResponse({"code": 5, "message": "error occured!"})
    return JsonResponse({"code":5,"message":"Invalid access!"})



def delete_disease_detail(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        medicine_usage_type_OBJ=None
        try:
            medicine_usage_type_OBJ=Medicine_Type_Usage.objects.get(pk=id)
        except Medicine_Type_Usage.DoesNotExist:
            return HttpResponse("This disease detail not found!")
        medicine_usage_type_OBJ.delete()
        return HttpResponse("yes")
    return HttpResponse("")







def add_instruction_for_medicine(request):
    if request.method == "POST":
        medicine_type_id = request.POST.get('medicine_type')
        medicineTypeObj=None
        try:
            if not medicine_type_id:
                return JsonResponse({"code": 5, "message": "Select valid medicine type!"})
            medicineTypeObj=Medicine_Type_Usage.objects.get(pk=medicine_type_id)
        except Medicine_Type_Usage.DoesNotExist:
            return JsonResponse({"code":5,"message":"Select valid medicine type!"})
        factor_ids = [val for key, val in request.POST.items() if "factor" in key]
        list_of_factors = []
        for item in factor_ids:
            try:
                list_of_factors.append(FactorOptions.objects.get(pk=item))
            except FactorOptions.DoesNotExist:
                return JsonResponse({"code": 1, "message": "Select valid factors!"})
        perDay=0
        try:
            if not request.POST.get('perDayTake'):
                return JsonResponse({"code": 2, "message": "Enter valid per day take!"})
            perDay= int(request.POST.get('perDayTake'))
            if perDay < 1:
                return JsonResponse({"code": 2,"message": "Enter valid per day take!"})
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Enter valid per day take!"})
        _perDayDetail = request.POST.get('perDayDetail')
        howLong = 0
        try:
            if not request.POST.get('howLong'):
                return JsonResponse({"code": 4, "message": "Enter valid how long to take!"})
            howLong = int(request.POST.get('howLong'))
            if howLong < 1:
                return JsonResponse({"code": 4, "message": "Enter valid how long to take!"})
        except Exception as e:
            return JsonResponse({"code": 4, "message": "Select valid how long to take!"})
        try:
            newInstruction=MedicineTakingInstruction.objects.create(medicine_type=medicineTypeObj,perDayTake=perDay,perDayDetail=_perDayDetail,howLong=howLong)
            newInstruction.save()
            for factor in list_of_factors :
                InstructionFactor.objects.create(medicine_taking_instruction=newInstruction,factor=factor,status=True).save()
            return JsonResponse({"code": 0,"message":htmlForInstractionOfMedicine(medicine_type_id)})
        except Exception as e:
            return JsonResponse({"code": 5, "message": "save error!"})
    return JsonResponse({"code": 5, "message": "Invalid access!"})




def remove_factor_from_saved_instruction(request):
    if request.method == "POST":
        instruction_factor_id = request.POST.get('instruction_factor_id')
        try:
            InstructionFactor.objects.filter(id=instruction_factor_id).delete()
            return HttpResponse("yes")
        except Exception as e:
            return HttpResponse("error occurred while deleting ...")
    return HttpResponse("Invalid access!")

def add_factor_to_saved_instruction(request):
    if request.method == "POST":
        instruction_id = request.POST.get('instruction_id')
        factor_id = request.POST.get('factor_id')
        instructionObj=None
        try:
            instructionObj=MedicineTakingInstruction.objects.get(pk=instruction_id)
        except MedicineTakingInstruction.DoesNotExist:
            return JsonResponse({"code":1,"message":"Invalid medicine instruction!"})
        factorObj = None
        try:
            factorObj = FactorOptions.objects.get(pk=factor_id)
        except FactorOptions.DoesNotExist:
            return JsonResponse({"code": 1, "message": "Invalid factors!"})
        instructionFactorObj=InstructionFactor.objects.filter(medicine_taking_instruction=instructionObj,factor=factorObj).first()

        if instructionFactorObj:
             return JsonResponse({"code": 2, "message":instructionFactorObj.id})

        try:
            _instructionFactorObj=InstructionFactor.objects.create(medicine_taking_instruction=instructionObj, factor=factorObj,status=1)
            _instructionFactorObj.save()
            item="<tr style='background-color:white; border : 0px solid whitesmoke' id='deletable_instruction_factor_table_row_%s_%s'>"\
                                              "<td style='background-color:white; border : 0px solid whitesmoke'>%s</td>"\
                                              "<td style='background-color:white; border : 0px solid whitesmoke'>%s</td>"\
                                              "<td style='background-color:white; border : 0px solid whitesmoke;color:red'><i style='cursor:pointer;color:lightgray' class='fa fa-times' onclick='$(\".instruction_deletable_factor_class\").hide();$(\"#instruction_deletable_factor_%s_%s\").slideToggle();'></i></td>"\
                                              "</tr style='background-color:white;'><tr style='display:none' class='instruction_deletable_factor_class' id='instruction_deletable_factor_%s_%s'>"\
                                              "<td colspan='3' style='color:red;'>are_you_sure?<span style='color:white;'>__</span><span style='color:brown;cursor:pointer' " \
                                                   "onclick='$(\".instruction_deletable_factor_class\").hide();'><ins>no</ins></span><span style='color:white;'>__" \
                                                    "</span><span><ins style='color:blue;cursor:pointer' onclick='remove_factor_from_saved_instruction(%s,%s);" \
                                                     "$(\".instruction_deletable_factor_class\").hide();'>yes</ins></span></td></tr>"\
                                                    %(instruction_id,_instructionFactorObj.id,"<i class='fa  fa-circle' style='color:lightgray'></i>",_instructionFactorObj.factor.description,instruction_id,_instructionFactorObj.id,instruction_id,_instructionFactorObj.id,instruction_id,_instructionFactorObj.id)
            return JsonResponse({"code": 3, "message": item})
        except Exception as e:
            return JsonResponse({"code": 4, "message": "error occurred!"})
    return JsonResponse({"code": 4, "message": "Invalid access!"})


def delete_instruction(request):
    if request.method == "POST":
        instruction_id = request.POST.get('instruction_id')
        try:
            MedicineTakingInstruction.objects.filter(id=instruction_id).delete()
            return HttpResponse("yes")
        except Exception as e:
            return HttpResponse("error occurred!")
    return HttpResponse("Invalid access!")

def update_instruction(request):
    if request.method == "POST":
        instruction_id = request.POST.get('instruction_id')
        instructionTypeObj=None
        try:
            if not instruction_id:
                return JsonResponse({"code": 3, "message": "Select valid instruction!"})
            instructionTypeObj=MedicineTakingInstruction.objects.get(pk=instruction_id)
        except MedicineTakingInstruction.DoesNotExist:
            return JsonResponse({"code":3,"message":"Select valid instruction!"})

        perDay=0
        try:
            if not request.POST.get('perDayTake'):
                return JsonResponse({"code": 1, "message": "Enter valid per day take!"})
            perDay= int(request.POST.get('perDayTake'))
            if perDay < 1:
                return JsonResponse({"code": 1,"message": "Enter valid per day take!"})
        except Exception as e:
            return JsonResponse({"code": 1, "message": "Enter valid per day take!"})
        _perDayDetail = request.POST.get('perDayDetail')

        howLong = 0

        try:
            if not request.POST.get('howLong'):
                return JsonResponse({"code": 2, "message": "Enter valid how long to take!"})
            howLong = int(request.POST.get('howLong'))
            if howLong < 1:
                return JsonResponse({"code": 2, "message": "Enter valid how long to take!"})
        except Exception as e:
            return JsonResponse({"code": 2, "message": "Select valid how long to take!"})


        try:
            MedicineTakingInstruction.objects.filter(id=instruction_id).update(perDayTake=perDay,perDayDetail=_perDayDetail,howLong=howLong)
            return JsonResponse({"code": 0})
        except Exception as e:
            return JsonResponse({"code": 3, "message": "update error!"})
    return JsonResponse({"code": 3, "message": "Invalid access!"})