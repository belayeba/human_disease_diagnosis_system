from django.db import models
from users.models import CustomUser

class Pathogen (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return "Name : %s" % self.name

class DiseaseCategory (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return "Name : %s" % self.name

class Disease (models.Model):
    name=models.CharField(max_length= 100)
    DiseaseCategory = models.ForeignKey(DiseaseCategory, on_delete=models.CASCADE)
    pathogen = models.ForeignKey(Pathogen, on_delete=models.CASCADE)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return " Name : %s ___ Disease category : ( %s ) ___  Pathogen : ( %s ) " %(self.name,self.DiseaseCategory,self.pathogen)

class SymptomCategory (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return "Name : %s" % self.name

class Symptom (models.Model):
    name=models.CharField(max_length= 300)
    symptomCategory=models.ForeignKey(SymptomCategory,on_delete=models.CASCADE)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        return " Name : %s ___ Symptom category : ( %s ) " %(self.name,self.symptomCategory)


class Factor (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return "Name : %s" % self.name

class FactorOptions(models.Model):
    factor=models.ForeignKey(Factor,on_delete=models.CASCADE)
    description=models.CharField(max_length= 400)
    registralUserName = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    def __str__(self):
        return " Description : %s ___ Factor Type : ( %s ) " % (self.description, self.factor)

class Measurement (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return "Name : %s" % self.name

class Medicine (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return "Name : %s" % self.name

class MedicineType (models.Model):
    name=models.CharField(max_length= 100)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return "Name : %s" % self.name

class MedicineTakingWay (models.Model):
    description=models.CharField(max_length= 400)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return "Description : %s" % self.description


class DiseaseFactor (models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    factor = models.ForeignKey(FactorOptions, on_delete=models.CASCADE)
    factorStatus = models.BooleanField()
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        status=""
        if self.factorStatus:
            status="Include"
        else:
            status = "Exclude"
        return " Disease : (%s) ______ Factor Option : ( %s ) ______ Factor status : '%s' " % (self.disease, self.factor,status)



class DiseaseSymptom (models.Model):
    disease=models.ForeignKey(Disease,on_delete=models.CASCADE)
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    isMust=models.BooleanField()
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    def __str__(self):
        status = ""
        if self.isMust:
            status = "YES"
        else:
            status = "NO"
        return " Disease : (%s) ______ Symptom : ( %s ) ______ Is it must : '%s' " % ( self.disease, self.symptom, status)







class Medicine_Type_Usage(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    type = models.ForeignKey(MedicineType, on_delete=models.CASCADE)
    takingWay=models.ForeignKey(MedicineTakingWay, on_delete=models.CASCADE)
    measurement=models.ForeignKey(Measurement, on_delete=models.CASCADE)
    registralUserName=models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return self.medicine.name+"    "+self.type.name+"   "+self.takingWay.description+"   "+self.measurement.name




class MedicineTakingInstruction(models.Model):
    medicine_type=models.ForeignKey(Medicine_Type_Usage,on_delete=models.CASCADE)
    factors=models.ManyToManyField(FactorOptions,through="InstructionFactor")
    perDayTake = models.PositiveIntegerField()
    perDayDetail = models.CharField(max_length=500)
    howLong = models.PositiveIntegerField()
    def __str__(self):
        return "%s_______%s_______%s_______%s" %(self.medicine_type.medicine.name,self.medicine_type.type.name,self.perDayTake,self.howLong)


class InstructionFactor(models.Model):
    medicine_taking_instruction = models.ForeignKey(MedicineTakingInstruction, on_delete=models.CASCADE)
    factor = models.ForeignKey(FactorOptions, on_delete=models.CASCADE)
    status = models.BooleanField()

    def __str__(self):
        return "%s______%s"%(self.medicine_taking_instruction ,self.factor)










class Prescription (models.Model):
    disease           =   models.ForeignKey(Disease, on_delete=models.CASCADE)
    medicine_type     =   models.ForeignKey(Medicine_Type_Usage, on_delete=models.CASCADE)
    factor            =   models.ManyToManyField(FactorOptions, through="PrescriptionFactors")
    registralUserName =   models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    def __str__(self):
        return self.disease.name+"    "+self.medicine_type.medicine.name+"    "+self.medicine_type.type.name




class PrescriptionFactors(models.Model):
    prescription=models.ForeignKey(Prescription, on_delete=models.CASCADE)
    factor=models.ForeignKey(FactorOptions, on_delete=models.CASCADE)
    status=models.BooleanField()

