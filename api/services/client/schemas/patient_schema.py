PatientPOSTSchema ={
     
    "first_name": {"type":"string","required":True},
    "last_name": {"type":"string","required":True},
    "gender": {"type":"string","required":True},
    "doctor": {"type":"integer","required":True},
    "home_phone": {"type":"string","required":False},
    "work_phone": {"type":"string","required":True},
    "date_of_birth": {"type":"string","required":True},
    "address": {"type":"string","required":True},
    "country": {"type":"string","required":True},
    "state": {"type":"string","required":True},
    "zip_code": {"type":"integer","required":True},
    "email": {"type":"string","required":True},
    "race": {"type":"string","required":True},
    "preferred_language":{"type":"string","required":False},
    "ethinicity": {"type":"string","required":False}, 
    "emergency contact_name": {"type":"string","required":False},
    "emergency contact_phone": {"type":"string","required":False},

}