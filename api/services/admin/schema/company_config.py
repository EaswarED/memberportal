CompanyConfigPOSTSchema = {
    "Code": {"type": "string", "required": False},
    "Item":{"type": "dict", "required": False ,"schema":{
    "Name": {"type": "string", "required": True},
    "Address1": {"type": "string", "required": False},
    "Address2": {"type": "string", "required": False},
    "Email": {"type": "string", "required": False},
     "City": {"type": "string", "required": False},
     "StateCd": {"type": "string", "required": False},
      "Phone": {"type": "integer", "required": False}, 
     "Country": {"type": "string", "required": False},  
     "Zip": {"type": "string", "required": False}, 
     "Email_ref":{"type": "boolean", "required": False}, 
    "Phone_ref":{"type": "boolean", "required": False}
    }
    },
    "ClassList":{"type": "list", "required": False},
    "ApptList":{"type": "list", "required": False},
    "GroupList":{"type": "list", "required": False},
    "ContentList":{"type": "list", "required": False},
    }