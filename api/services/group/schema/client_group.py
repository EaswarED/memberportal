ClientToEnrollPOSTSchema = {
   
    "ClientId": {"type": "integer", "required": True},
    "ClassScheduleId": {"type": "integer", "required": True},
    "SendEmail": {"type": "boolean", "required": False},
    "Waitlist": {"type": "boolean", "required": False},
    "Test": {"type": "boolean", "required": True},

}