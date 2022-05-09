AllergyPOSTSchema ={
     
    "description": {"type":"string","required":True},
    "doctor": {"type":"integer","required":True},
    "notes": {"type":"string","required":False},
    "patient": {"type":"integer","required":True},
    "reaction": {"type":"string","required":True},
    "rxnorm": {"type":"string","required":True},
    "snomed_reaction": {"type":"string","required":False},    
}