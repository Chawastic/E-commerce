[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/zN7EOVUc)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13818460&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### EP - Course Assignment

Startup code for Noroff back-end development 1 - EP course (e-commerce).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---


# References

Stackoverflow forum helping me with certain jest testing issues

https://stackoverflow.com/questions/45315679/jest-run-async-function-once-before-all-tests


My old personal projects have been a lot of help - link to public repositories here:

1. https://github.com/Chawastic/mar23ft-api-ca-Chawastic-main
2. https://github.com/Chawastic/Memes
3. https://github.com/Chawastic/mar23ft-dab-ca-1-Chawastic-161d902604b56e6b76849d949b8476ffa4406e9e

Last year i got a copy of David Flannagan's 
Javascript the definitive guide. While not having any code directly sourced it has been of a lot of help. 

Certain Moodle modules such as:
1. PROJECT METHODOLOGY - MODULE 1
2. DATABASES - MODULE 1
3. DATABASES - MODULE 3
4. REST APIS - MODULE 3
5. REST APIS - MODULE 4
6. REST APIS - MODULE 5

I have taken some advantage of ChatGPT 3.5
Specifically helping me create the rawSQL service searchProducts in services/SearchService file.
I have also used ChatGPT to help create more readable files. Improving indentations certain wording and spacing.


# Application Installation and Usage Instructions
1. Create a database in Mysql workbench called ecommerce, make sure the user and password are the same as in the .env file.
2. Clone the repository to your local machine.
3. Run npm install to install all the dependencies.
4. Start the application with npm start. The server will start on the defined PORT in your .env file.
5. Open localhost http://localhost:3000/ in your browser to interact with the front-end - Log in to application using -username: Admin, password: P@ssword2023.
6. To test Back-end api's open http://localhost:3000/doc. Remember to get the token in the JSON return from the log-in route and paste it in the authorization of the other API's (formatted "BEARER thisisafaketoken123").

# Environment Variables
To run this project, you need to add the following environment variables to your .env file:

HOST - The host on which your server is running. (localhost). ADMIN_USERNAME - The username for administrative access. (your sql username) ADMIN_PASSWORD - The password for administrative access. (your sql password) DATABASE_NAME - The name of your database. (ecommerce) DIALECT - The database dialect you are using. (mysql) PORT - The port number where the server will listen. (3000)

JWT_SECRET - This is a secret key used for signing and verifying JSON Web Tokens . You can generate a random string and use it as your secret.

SESSION_SECRET - This is a necesarry secret key for express-session

To generate a token secret using Node.js:

1. Open you terminal
2. Type require('crypto').randomBytes(64).toString('hex')
3. use the generated string as your token secret in the .env file where it says "insert token here". Also make sure to genereate another one for your SESSION_SECRET.


Below is an example of what a .env file could look like:

HOST = "localhost"
ADMIN_USERNAME = "padmin"
ADMIN_PASSWORD = "0000"
DATABASE_NAME = "ecommerce"
DIALECT = "mysql"
PORT = "3000"
JWT_SECRET = "ad4f3d5ecb591f031913143574317151fb84dc0373d549af81b19dfdb94b0fd618b0586c8fcae523b2068bb3a4eff8b1c7906fa37a016f027c3eeb33ea87823a"
SESSION_SECRET = "ba441834c571b8b7b0aaf1e76f20a5cbe7eccaf4e75aa5ad920988d94b02abf9cf556465c54ce563a9d1086a1885cd1c02c6cea21e8a30bd1052638decc2123a"


# Additional Libraries/Packages
This project uses the following additional libraries/packages:

    "axios": "^1.6.7",
    "bcrypt": "^5.1.1",
    "bootstrap": "^5.2.3",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.4.3",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "express-flash": "^0.0.2",
    "express-session": "^1.18.0",
    "express-session-json": "^0.0.8",
    "http-errors": "~1.6.3",
    "jsend": "^1.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "~1.9.1",
    "mysql": "^2.18.1",
    "mysql2": "^3.9.2",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "sequelize": "^6.37.0",
    "sequelize-cli": "^6.6.2",
    "swagger-autogen": "^2.23.7",
    "swagger-ui-express": "^5.0.0"

# NodeJS Version Used
The project is developed using NodeJS version: v20.10.0



