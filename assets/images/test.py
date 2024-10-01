import requests

pipedream_url = "https://eoi4zds3zvye1l6.m.pipedream.net"
# Specify the image path
image_path = 'E:/Work/app-for-medcat/medcat/assets/images/test.py'

# Read the image content
with open(image_path, 'rb') as image_file:
    image_content = image_file.read()

# Send the image as a POST request to Pipedream
response = requests.post(pipedream_url, files={"image": image_content})

# Print the response content
print(response.text)
