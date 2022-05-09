BuyandClassPOSTSchema = {
    "ClientId": {"type": "string", "required": True},
    "Test": {"type": "boolean", "required": True},
    "Items":{"type": "list", "required": True, "schema":{
        "type":"dict","schema":{
            "Item":{"type": "dict", "required": True,
                    "schema":{ 
                        "Type": {"type": "string", "required": False},
                        "Metadata":{"type": "dict", "required": False ,
                                    "schema":{ 
                                        "Id": {"type": "string", "required": False}
                                        }
                                    },
                                }
                    },
            
            "ClassIds":{"type":"list","required":False},
            "Quantity":{"type": "integer", "required": False},
            }
        }
    },
        
    "InStore":{"type": "boolean", "required": False},
    "Payments":{"type": "list", "required": True, "schema":{
        "type":"dict", "schema":{ "Type":{"type": "string", "required": False},
                        "Metadata":{"type": "dict", "required": False, 
                         "schema":{
                                    "Amount":{"type": "integer", "required": False},
                                    "ExpMonth":{"type":"integer"},
                                    "ExpYear":{"type":"integer"},
                                    "creditCardNumber":{"type":"integer"}
                                }
                            }
                    }
                }
            
        },
    "SendEmail":{"type": "boolean", "required": False},
    "LocationId":{"type": "integer", "required": False}       
}