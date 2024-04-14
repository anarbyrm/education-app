# NestJS Udemy Clone

This repository contains a clone project of Udemy built with NestJS. This project aims to replicate some of the core functionalities of the Udemy platform using the NestJS framework.

## Presentation

This project serves as a learning resource for understanding how to build robust backend applications using NestJS, a progressive Node.js framework. It demonstrates various features of NestJS, including:

- Controllers and Routing
- Dependency Injection
- Middleware
- Authentication and Authorization
- Database Integration (e.g., TypeORM, MongoDB)
- Error Handling
- Testing (e.g., Unit Testing, End-to-End Testing)

By exploring this project, developers can gain insights into best practices for structuring and implementing backend applications with NestJS.

## Commands

To run the NestJS Udemy clone project locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/anarbyrm/education-app.git

2. **Install Dependencies:**

    ```bash
   cd education-app
   npm install

3. **Start the Development Server:**

    ```bash
    npm run start:dev

This command will start the development server. The server runs on: **_http://localhost:<port>_**.

4. **Set Up Environment Variables:**

Before running the project, make sure to set up the necessary environment variables. Refer to the Environment Variables section below for a list of required variables.

The following environment variables need to be set up for the NestJS Udemy clone project to function correctly:

    NODE_ENV=
    HOST=
    PORT=

    JWT_SECRET=
    AVATAR_MAX_SIZE=

    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    SMTP_SENDER=

    SECRET=
    VECTOR=
    (Add any additional environment variables if necessary)

Make sure to provide appropriate values for these variables in your development environment. You can set these variables in a .env file located in the root directory of the project.

5. **Explore the API Endpoints:**

Once the server is running, you can explore the available API endpoints using:
- tools like Postman or cURL.
- swagger API doc at **"/docs"** endpoint