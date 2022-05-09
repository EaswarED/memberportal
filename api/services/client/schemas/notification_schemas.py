NotificationPOSTSchema ={
    "Client":{"type": "dict", "required": True, "schema":{
            "Id": {"type": "integer", "required": True},
            "SendAccountEmails": {"type":"boolean","required":False},
            "SendScheduleEmails": {"type":"boolean","required":True},
            "SendScheduleTexts": {"type":"boolean","required":True}
                        }   
            },
            "SendEmail": {"type":"boolean","required":True}, 
            "CrossRegionalUpdate": {"type":"boolean","required":True},
            "Test": {"type":"boolean","required":True}
}