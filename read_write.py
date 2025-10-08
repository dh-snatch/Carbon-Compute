import json
import boto3
import time

s3 = boto3.client("s3")
BUCKET = "usr-records"

def lambda_handler(event, context):
    action = event.get("action")
    user_id = event.get("user_id")

    if not user_id:
        return {"status": "error", "message": "Missing user_id"}

    # write a record into the s3 bucket
    if action == "write":
        user = event.get("user", "unknown user")
        activity = event.get("activity", "unknown activity")
        quantity = event.get("quantity", 0)
        carbon = event.get("carbon", 0)
        KEY = f"{user_id}/{time.strftime('%Y-%m-%d-%H-%M-%S')}.json"
        obj = {"user": user_id, "activity": activity, "quantity": quantity, "carbon": carbon}
        s3.put_object(Bucket=BUCKET, Key=KEY, Body=json.dumps(obj))
        return {"status": "ok", "message": f"Saved record for user '{user}' with activity '{activity}' as {KEY}"}

    # retrieve ALL records for a specific user
    elif action == "read":
        try:
            bucket_content = s3.list_objects_v2(Bucket=BUCKET, Prefix=f"{user_id}/")
            if 'Contents' not in bucket_content:
                return {"status": "error", "message": "No data yet for this user"}

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
