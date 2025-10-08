# Carbon-Compute
An application for tracking carbon usage.

# Steps for deployment

For the application you will need two S3 buckets. I created a bucket called carboncompute in order to host the website, and another called usr-records to track user carbon records.

In order to host a website using Amazon S3 upload index.html, index.js, and style.css to the bucket, 
navigate to bucket properties and enable static website hosting.

The next and only needed step is to create an API that will handle user records. There is no account creation currently, 
instead a random user ID is generated in local browser storage and a folder under that ID is created in usr-records.

Create a lambda function in AWS with the code provided in read_write.py (select Python 3.13). The purpose of this function
is to read and write records to the usr-records bucket. 

Next, you will need to navigate to API Gateway and create a REST API (not private). Create a method pointing to the lambda function
and enable CORS (POST). Deploy the API and paste the invoke URL into index.js and you should have a functional 
carbon tracking application.

