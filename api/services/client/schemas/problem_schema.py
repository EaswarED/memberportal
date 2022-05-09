ProblemPOSTSchema ={
     
    "doctor": {"type":"integer","required":True},
    "notes": {"type":"string","required":False},
    "patient": {"type":"integer","required":True},
    "name": {"type":"string","required":True}, 
    "icd_code": {"type":"string","required":True}, 
    "date_diagnosis": {"type":"string","required":True}
}