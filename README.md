SkinProScan - A Web-Based AI Solution for Preliminary Detection and Awareness 
of Bacterial & Fungal Skin Diseases
 
 GitHub link of the project - 
 https://github.com/Dewasinghe-Dayoda/Final-Year-Project
 
 Project Summary:

SkinProScan is a full-stack MERN web application designed to detect and raise 
awareness about bacterial and fungal skin diseases. The system integrates AI-powered 
image classification, symptom assessment, appointment booking, and educational content.

 Key Features:

QuickCheck - Users can upload a skin image for AI-based disease detection  
Symptom Checker - Simple form for symptom-based assessment  
Appointment Booking - Schedule appointments with healthcare professionals  
Educational Content - Learn about common skin diseases  
AI Model Integration - Classifies cellulitis, impetigo, ringworm, and athlete’s foot  
User Authentication - Secure login system using JWT  


Tech Stack:

Frontend: React (Create React App), Axios, React Icons, Datepicker  
Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer  
Model: .keras model, executed via Python script (`verify_model.py`)


How to Run the Project (Local Setup):

Extract the ZIP  
Open the project in VS Code  

Step 1 - Setup Environment Variables  
- Copy `.env`  
- Fill in your MongoDB URI and JWT Secret

Step 2 - Install Dependencies  

Frontend:  
> cd frontend  
> npm install  

Backend:  
> cd backend  
> npm install  

Step 3 - Run the Services (use 3 VS Code terminals):

Backend:  
> cd backend  
> node server.js  

AI Model:  
> cd backend  
> python verify_model.py 

Frontend:  
> cd frontend  
> npm start  

Step 4 - Access the Application  
Frontend: http://localhost:3000  
Backend API: http://localhost:5000

step 5 - Register and Log in
when you try to use QuickCheck feature it will take you to login(Login valid for only 24h)
click sign up link in the Login page and regiter yourself with a username, email and password. 
then use the email and password to log in.

ex: karen@gmail.com,
    karen123




