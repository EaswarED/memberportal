DeleteInstructConfigPOSTSchema = {  
    "StaffId": {"type": "string", "required": False},
    "Item":{"type": "dict", "required": False ,"schema":{
    "ClassList": {"type": "string", "required": True},
    "ApptList": {"type": "string", "required": False},
    "ContentList": {"type": "string", "required": False},
    "GroupList": {"type": "string", "required": False}
    }
    }  
}