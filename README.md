# Carbon-Compute
An application for tracking carbon usage.

# Steps for deployment

First, create an S3 Bucket called "usr-records"

Note that there is a python file read_write.py in the repository. Create
a lambda function using appropriate roles and paste the code from read_write.py into the
lambda function.