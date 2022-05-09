import decimal
import json


# This is a workaround for: http://bugs.python.org/issue16535
class encode(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            if float(obj).is_integer():
                return int(obj)
            return float(obj)
        if isinstance(obj, set):
            return list(obj)
        return super(encode, self).default(obj)


def replace_decimals(obj):
    if isinstance(obj, list):
        for i in range(len(obj)):
            obj[i] = replace_decimals(obj[i])
        return obj
    elif isinstance(obj, dict):
        for key in obj:
            obj[key] = replace_decimals(obj[key])
        return obj
    elif isinstance(obj, decimal.Decimal):
        # In my original code I'm converting to int or float, comment the line above if necessary.
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj
