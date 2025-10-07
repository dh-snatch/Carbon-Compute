# Carbon-Compute
An application for tracking carbon usage.

# Steps for deployment

First, create an S3 Bucket called "usr-records"

Note that there is a python file read_write.py in the repository. Create
a lambda function using appropriate roles and paste the code from read_write.py into the
lambda function.

The following test events should correctly:

write to usr-records:

{
  "action": "write",
  "data": {
    "user_id": 123,
    "name": "Alice",
    "email": "alice@example.com"
  }
}

read all the records
{ "action": "read"}

You will need to deploy the 