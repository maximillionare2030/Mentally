import requests
import json

# Test data for mental health update
test_data = {
    "surprise": 1000,
}

# Example JWT token (replace with an actual JWT)
token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhYWMyNzEwOTkwNDljMGRmYzA1OGUwNjEyZjA4ZDA2YzMwYTA0MTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWVudGFsbHktOTU3ZGIiLCJhdWQiOiJtZW50YWxseS05NTdkYiIsImF1dGhfdGltZSI6MTczNDgzMzE0MiwidXNlcl9pZCI6IjZRdGgyUGluSGdPTnB2aDFOSFlwUmxNemc2RTIiLCJzdWIiOiI2UXRoMlBpbkhnT05wdmgxTkhZcFJsTXpnNkUyIiwiaWF0IjoxNzM0ODMzMTQyLCJleHAiOjE3MzQ4MzY3NDIsImVtYWlsIjoic2FtcGxlQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNhbXBsZUBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.SIMqAA8B29pmIhzn8YxMk6idr1ecQz81cxeqYTmEWhK26xn3FmXq-SDy14SJFh19szI52wisjQD8bksIH2gvnG7r5SilBPL0oJxV57Fg4mi7XVrcdvcVCItIWIhvTD9vaQ3_Qwh5ojby3Ql5FWuU5m5XLGB9zD2aOBmFBGIaeOthVD6AxhNHZFa33JJukg6ECg_q5H01SB7xvIoS1f4pS1aOTcdArIbphez9dsVAoz1c1pt-HbAdLT1a1iBDiFQSEsvXmDzncC8jBmiIUTiuH5-9ls-QYfqdeUT_NB2Mrkf3BEokZ6rr-kItj-Q5mjq_b2a-b5cdSwJ_4Tw6Fy8YLA"
# Define the API URL
url = "http://localhost:8000/user/update-mental-data"

# Define the headers and include the JWT token
headers = {
    "Authorization": token,
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, json=test_data)
print(response.status_code, response.text)


