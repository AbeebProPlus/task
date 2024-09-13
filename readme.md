Requirements to run this project
    1. Download the project or clone
    2. Run `npm install` to pull the neccsessary dependencies in package.json
    3.For example http://localhost:8080/api-docs/
    4. Create a .env file at the root ot the project and supply the details highlighted below
        MONGO_URI=mongodb+srv://your_url_here
        JWT_SECRET= your secret key
        REFRESH_TOKEN_SECRET=your refresh token secret
        PORT=8080
        MAIL_USERNAME=your email address
        MAIL_PASSWORD=your app password
        Visit here to see how you can create an app password: https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237
    6. The MAIL_PASSWORD AND MAIL_USERNAME are neccessaty for the registration to work successfully. Each time a user requests to register, a confirmation link is sent to the user's inbox to confirm their details.    
    7. Use `npm run dev` command to start the project server
    8. Visit http://localhost:PORT/api-docs/ to run see the documentation, where PORT is the port number you have specified in your .env file