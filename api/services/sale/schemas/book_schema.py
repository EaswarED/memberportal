BuyandBookPOSTSchema = {
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
            "Quantity":{"type": "integer", "required": False},
            "AppointmentBookingRequests":{"type": "list", "schema":{
                "type":"dict", "schema":{
                            "StaffId": {"type": "integer", "required": True},
                            "LocationId": {"type": "integer", "required": True},
                            "SessionTypeId":{"type": "integer", "required": True},
                            "StartDateTime":{"type": "string", "required": True},
                            }   
                        }             
                    }
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