from django.shortcuts import render
from django.http import  HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from register_disease_data.models import *

posts = [
    {
        'author': 'CoreyMS',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': 'August 27, 2018'
    },
    {
        'author': 'Jane Doe',
        'title': 'Blog Post 2',
        'content': 'Second post content',
        'date_posted': 'August 28, 2018'
    }
]

symptom_category=[ "diarrhea", "Vomiting", "Headache", "Fever" ]

symptom=[
            ["diarrhea","bloody diarrhea"],
            ["Vomiting","simple vomitng"],
            ["diarrhea","Moderate diarrhea"],
            ["Fever","High degree fever"]
        ]

pathogen=["Virus","Protozoa","Plasmodium","Fungus","Bacteria","Ameoba"]

disease_category=["Stomach Disease","Intestinal disease","Blood disease"]

disease=[
            ["Typhoid","Blood disease","Bacteria"],
            ["Malaria","Blood disease","Plasmodium"],
            ["Ameobic dysentry","Intestinal disease","Plasmodium","Ameoba"]
]

Factor_category=["Pregnancy","Gender","Cholestrol","Age"]

Factors_option=[
            ["Pregnancy","She is not pregnant"],
            ["Gender","Male Gender"],
            ["Cholestrol","High cholestrol"],
            ["Gender","Female Gender"],
            ["Age","AGE OF 21 -50"]
]

measurement = ["Table spoon","Tea spoon","Mili gram","Drops","Dosing cup"]

medicine = [ "Ciprofloxacin", "Ceftriaxone" ]

medicine_type = [ "powder", "Tablet", "Liquid" ]

medicineTakingWay = [ "Rectal route", "Oral route", "Nasal route", "Injection routes" ]


@ensure_csrf_cookie
def home(request):
    context =\
    {
        'posts': posts
    }
    return render(request, 'manage_medicine_type_usage/medicine_type_usage.html', context)
def feedData(request):
    return HttpResponse("All data feeded successfully!");

    for element in symptom_category:
        SymptomCategory.objects.create(name=element,registralUserName_id=1).save()

    for element in symptom :
        category=SymptomCategory.objects.filter(name=element[0]).first()
        Symptom.objects.create(name=element[1],symptomCategory=category,registralUserName_id=1).save()

    for element in pathogen :
        Pathogen.objects.create(name=element,registralUserName_id=1).save()

    for element in disease_category:
        DiseaseCategory.objects.create(name=element,registralUserName_id=1).save()

    for element in disease:
        category = DiseaseCategory.objects.filter(name=element[1]).first()
        pathogen_ = Pathogen.objects.filter(name=element[2]).first()
        Disease.objects.create(DiseaseCategory=category, pathogen=pathogen_, name=element[0],registralUserName_id=1).save()

    for element in Factor_category:
        Factor.objects.create(name=element, registralUserName_id=1).save()

    for element in Factors_option :
        factor=Factor.objects.filter(name=element[0]).first()
        FactorOptions.objects.create(description=element[1],factor=factor,registralUserName_id=1).save()

    for element in measurement:
        Measurement.objects.create(name=element, registralUserName_id=1).save()

    for element in medicine:
        Medicine.objects.create( name=element, registralUserName_id=1).save()

    for element in medicine_type:
        MedicineType.objects.create( name=element, registralUserName_id=1).save()

    for element in medicineTakingWay:
        MedicineTakingWay.objects.create( description=element, registralUserName_id=1 ).save()

    return HttpResponse("All data feeded successfully!");











def about(request):
    return render(request, 'register_disease_data/about.html', {'title': 'About'})