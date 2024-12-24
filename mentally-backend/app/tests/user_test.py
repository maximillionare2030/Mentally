import requests
import json

# Test data for mental health update
test_data = {
    "surprise": 1000,
}

# Example JWT token (replace with an actual JWT)
token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE3MWI1MTU1MmI0ODA5OWNkMGFkN2Y5YmZlNGViODZiMDM5NmUxZDEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbWVudGFsbHktOTU3ZGIiLCJhdWQiOiJtZW50YWxseS05NTdkYiIsImF1dGhfdGltZSI6MTczNDk4OTY1MCwidXNlcl9pZCI6IjhaZER6SnhVdWpXeVZXeEZxdHdudDA3QmhLMTIiLCJzdWIiOiI4WmREekp4VXVqV3lWV3hGcXR3bnQwN0JoSzEyIiwiaWF0IjoxNzM0OTg5NjUwLCJleHAiOjE3MzQ5OTMyNTAsImVtYWlsIjoic2FtcGxlQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNhbXBsZUBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.U7ltPWBvyw888iMfSuFJZb26XSGctGozYJ7tLRheL9_6Z54rtRJOBG26_3umYGBcheXbiCOwCPz2j5-ihlHrjRXDvr-VkXGy7fqmd8H3d1vIWd1mPUSURXDYi9qrWp3-o20nTJUfoOsDCY-FvhC8fd3K_Gz72-26tNeZ_mRWrL56yWJ-ftrxBie0dxb5rhnDdzdWXl_SJkM3zx562uzcFDqKMV3IPMv5A5OnNjye3kYxi-fcHy6_G_67QxUjrp-XjP-8ofIm6i1MEUDAcrhq0NFKJsZkqWY7jFoDLJt4iMAY_satePsOuOEfhGwbfOM-3uBuNoGvVig4EBN7QjTggA"
# Define the API URL
url = "http://localhost:8000/user/get_user_data"

# Define the headers and include the JWT token
headers = {
    "Authorization": token,
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, json=test_data)
print(response.status_code, response.text)


