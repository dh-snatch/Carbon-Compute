import json
import boto3
import time

s3 = boto3.client("s3")
BUCKET = "usr-records"

def lambda_handler(event, context):
    action = event.get("action")
    # write a record into the s3 bucket
    if action == "write":
        user = event.get("user", "unknown user")
        activity = event.get("activity", "unknown activity")
        KEY = time.strftime("%Y-%m-%d-%H-%M-%S") + ".json"
        obj = {"user": user, "activity": activity}
        s3.put_object(Bucket=BUCKET, Key=KEY, Body=json.dumps(obj))
        return {"status": "ok", "message": f"Saved record for user '{user}' with activity '{activity}' as {KEY}"}
    # retreive ALL records
    elif action == "read":
        try:
            bucket_content = s3.list_objects_v2(Bucket=BUCKET)
            if 'Contents' not in bucket_content:
                return {"status": "error", "message": "No data yet"}
            
            records = []
            for record in bucket_content['Contents']:
                key = record['Key']
                resp = s3.get_object(Bucket=BUCKET, Key=key)
                content = json.loads(resp["Body"].read().decode())
                records.append({"key": key, "data": content})
            
            return {"status": "ok", "records": records}
        
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    else:
        return {"status": "error", "message": "Unknown action - try read/write"}
