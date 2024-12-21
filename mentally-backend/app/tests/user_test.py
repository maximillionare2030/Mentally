import requests
import json

# Test data for mental health update
test_data = {
    "surprise": 1,
    "disgust": 2,
    "happiness": 3,
    "PHQ_score": 10,
    "anger": 4,
    "sadness": 5,
    "fear": 6
}

# Example JWT token (replace with an actual JWT)
valid_jwt = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhYWMyNzEwOTkwNDljMGRmYzA1OGUwNjEyZjA4ZDA2YzMwYTA0MTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWVudGFsbHktOTU3ZGIiLCJhdWQiOiJtZW50YWxseS05NTdkYiIsImF1dGhfdGltZSI6MTczNDgyMTg4OSwidXNlcl9pZCI6IklWaFdTTVdTNVBYRkZ3TzMyVVd6UzVOUVJzVjIiLCJzdWIiOiJJVmhXU01XUzVQWEZGd08zMlVXelM1TlFSc1YyIiwiaWF0IjoxNzM0ODIxODg5LCJleHAiOjE3MzQ4MjU0ODksImVtYWlsIjoic2FtcGxlQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNhbXBsZUBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.OghTvV9OFMzDeFoY6GQuqYP_38rfTzZ1JzjjfMkIyFzMAyz5W4Yfd0LBjbQDBznb7mtCiPtHYkBvlLNCoz35nK_AK9VBEjf_jQcDWBLboZoSwRh1rsycnuizwZG6VMowmC9vYuDOBQX6HmgDVF46dgos4fGiAHKiAY8gzqd2IaBXzxoGb3FUpYxleGjn2rFtx6EsK1eNEdj7Dwe0XVnm0zwdQXj9BZVoWCJ1ECb_NoYkvQsStJyBXgNN7Qfs9Bqme_uHvqrPsLfTA0a06WxRLWyCTf-ce85aO4bvIt7J3aDhBR41wMRxvAsDA6VEvM2nyYFqbhB2hHdywLoMx8BUKA"
# Define the API URL
url = "http://localhost:8000/user/update-mental-data"

# Define the headers and include the JWT token
headers = {
    "Authorization": f"Bearer {valid_jwt}",
    "Content-Type": "application/json"
}

# Make a POST request to the API
response = requests.post(url, headers=headers, json=test_data)

# Check the response status
if response.status_code == 200:
    print("Success:", response.json())  # Print success message
else:
    print("Error:", response.status_code, response.json())  # Print error message
