
## Requirements to Run This Project

1. **Download the Project**:  
   Clone the repository or download it as a ZIP file.

2. **Install Dependencies**:  
   Run the following command to install the necessary dependencies from the `package.json` file:
   npm install
3. **Create a .env File**:
    At the root of the project, create a .env file and add the following configuration details:

 **MONGO_URI=mongodb+srv://your_url_here**
 **JWT_SECRET=your secret key**
 **REFRESH_TOKEN_SECRET=your refresh token secret**
 **PORT=8080**
 **MAIL_USERNAME=your email address**
 **MAIL_PASSWORD=your app password**
The MAIL_PASSWORD and MAIL_USERNAME are required for registration to work successfully.
A confirmation link is sent to the user's inbox for email verification during the registration process.
## Note:
For instructions on creating an app password for your email, visit:
https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237

## Start the Project:
Use the following command to start the project server in development mode:
npm run dev

## View Swagger Documentation:
After starting the server, visit the Swagger documentation at: http://localhost:8080/api-docs