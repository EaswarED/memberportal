RemoveClientToClassPOSTSchema = {
    "ClientId": {"type": "integer", "required": True},
    "ClassId": {"type": "integer", "required": True},
    "LateCancel": {"type": "boolean", "required": False},
    "SendEmail": {"type": "boolean", "required": False},
    "Test": {"type": "boolean", "required": False},
}