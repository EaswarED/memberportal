MedicationPOSTSchema ={
      
    "doctor": {"type":"integer","required":True},  
    "notes": {"type":"string","required":False},
    "patient": {"type":"integer","required":True},
    "indication": {"type":"string","required":True},
    "rxnorm": {"type":"string","required":True},
    "dosage_quantity": {"type":"integer","required":True}
  
}