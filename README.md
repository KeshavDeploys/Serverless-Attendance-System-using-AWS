# 🚀 Serverless Attendence System using AWS 

------

# ⚡ Attendicity

A serverless **face-based attendance system** built with:

- **Frontend**: Pure HTML/CSS/JS (futuristic UI, responsive, with webcam capture)
- **Backend**: AWS Lambda + API Gateway + Rekognition + DynamoDB
- **Storage**: Amazon S3 for face datasets

<img src="Screenshot.png" alt="Attendicity UI" width="700"/>

---

## 🚀 Features
- **Landing Page** introducing Attendicity
- **Webcam Integration** (capture face directly from browser)
- **Serverless Backend** with AWS Lambda & API Gateway
- **Face Recognition** powered by Amazon Rekognition
- **Attendance Logging** in DynamoDB
- **Responsive, Futuristic UI** with animations
- **Easy File Configs** frontend (no build tools required)

---

🎥 How It Works <br />

- Landing Page → Click Try it out.<br />
- Start Camera → Allow webcam access.<br />
- Capture → Grab a snapshot from the live video feed.<br />
- Send → Image (Base64) is POSTed to Lambda via API Gateway.<br />
- Lambda → Uses Rekognition to match the face, logs presence in DynamoDB.<br />
- Response → UI displays Attendance marked or Face not recognized.<br />
---

How to setup locally
2. Backend Setup (AWS)<br />
Create S3 bucket (e.g. attendence-intern-project) and upload training images in faces/.<br />

Create Rekognition Collection:<br />
aws rekognition create-collection --collection-id AttendicityCollection --region ap-south-1<br />

Create DynamoDB Table named Attendance with userId as primary key.<br />
Create a Lambda Function (MarkAttendance) using Node.js 20.x runtime.<br />
Attach an IAM role with Rekognition, DynamoDB, S3 permissions.<br />
Deploy the index.js (provided in lambda/) as the handler.<br />
Create an API Gateway (HTTP API):<br />
Integration: Lambda → MarkAttendance<br />
Route: POST /MarkAttendence<br />
Enable CORS (* origins, OPTIONS, POST methods, Content-Type, Authorization headers)<br />
Deploy stage (e.g. dev)<br />

3. Frontend Setup<br />
Edit index.html and replace the API_URL constant:<br />
const API_URL = "https://your-api-id.execute-api.ap-south-1.amazonaws.com/dev/MarkAttendence";<br />
Serve the file locally (to avoid file:// CORS issues).<br />
# Use Live Server in VSCode<br />
---

📬 Contact ME<br />
Feel free to connect or collaborate:<br />

📝 License<br />
This project is open source and free to use — feel free to fork, reference, or build on top of it!<br />
<br />
Let me know if you’d like to add badges (like GitHub stars, last commit, etc.) or dark mode screenshots!<br />
