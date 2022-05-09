UpdateClientPOSTSchema = {
    "Client":{"type": "dict", "required": True, "schema":{
        "Id": {"type": "integer", "required": True},
        "FirstName": {"type":"string","required":True},
        "LastName": {"type":"string","required":True},
        "Gender": {"type":"string","required":True},
        "BirthDate": {"type":"string","required":True},
        "MobilePhone": {"type":"string","required":True},
        "Email": {"type":"string","required":True},
        "AddressLine1": {"type":"string","required":False},
        "City": {"type":"string","required":False},
        "State": {"type":"string","required":False}, 
        "Country": {"type":"string","required":False},
        "PostalCode": {"type":"integer","required":False},
        "SendAccountEmails": {"type":"boolean","required":False},
        
    }},

            "CrossRegionalUpdate":{"type": "boolean", "required": True},
            "Test":{"type":"boolean","required":False}
    }