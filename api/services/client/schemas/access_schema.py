PatientAccessPOSTSchema ={
     
    "first_name": {"type":"string","required":True},
    "doctor": {"type":"integer","required":True},
    "last_name": {"type":"string","required":False},
    "home_phone": {"type":"integer","required":False},
    "date_of_birth": {"type":"string","required":True},
    "email": {"type":"string","required":False}, 
    "id": {"type":"integer","required":True},  
    "social_security_number": {"type":"integer","required":False} 
}