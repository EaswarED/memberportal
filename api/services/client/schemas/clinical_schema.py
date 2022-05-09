ClinicalNotePOSTSchema ={
    "data":{"type":"list","schema":{
        "type":"dict","schema":{
"clinical_note_field": {"type":"integer","required":True},
    "doctor": {"type":"integer","required":True},
    "appointment": {"type":"integer","required":False},
    "clinical_note_template": {"type":"integer","required":True},
    "value": {"type":"string","required":True}
        }
    }}
}