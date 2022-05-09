AppointmentPOSTSchema = {
    "ClientId": {"type": "integer", "required": True},
    "LocationId": {"type": "integer", "required": True},
    "SessionTypeId": {"type": "integer", "required": True},
    "StaffId": {"type": "integer", "required": True},
   "StaffRequested": {"type": "boolean", "required": False}, 
    "StartDateTime": {"type":"string", "required": True},
    "Test": {"type": "boolean", "required": True},
}