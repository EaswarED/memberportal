PatientAppointmentPOSTSchema = {
    "patient": {"type": "integer", "required": True},
    "doctor": {"type": "integer", "required": True},
    "exam_room": {"type": "integer", "required": True},
    "scheduled_time": {"type": "string", "required": True},
   "office": {"type": "integer", "required": False}, 
    "duration": {"type":"integer", "required": True}

}