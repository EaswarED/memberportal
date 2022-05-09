ClassCompanyAddPOSTSchema = {  
    "Code": {"type": "list", "required": False},
    "Item":{"type": "dict", "required": False ,"schema":{
    "ClassList": {"type": "list", "required": True},
    "ApptList": {"type": "list", "required": False},
    "ContentList": {"type": "list", "required": False},
    "GroupList": {"type": "list", "required": False}
    }
    }   
}