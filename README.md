## Task Management Web Application SaaS

This project is a simplified task management web application built with TypeScript and Effect-TS. It allows users to manage tasks, supporting operations such as creating, updating, deleting, and listing tasks for multiple users.

### Note : I have added a postman collection file in the project directory for the api's '{{base_ulr}}' variable denotes to the Localhost:3000 value. Its recommended to set the environment variable in the postman.

### Prerequisites

Before running the application, ensure you have Node.js installed on your machine.

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Lowdata/task-manager/tree/main
   cd task-manager
   npm install
   ```

Scripts
The following npm scripts are available for running the application:

Start the server:

 ```bash
npm start
```

Run in development mode:

 ```bash

npm run dev
```
This script uses ts-node-dev to run TypeScript files directly, restarting the server on file changes during development.

Run tests:

```bash
npm test
```
This script runs Jest to execute unit and integration tests.


RESTful API Endpoints

Users
- Create a new user:
```
POST /users?name=John
```
- This endpoint creates a new user with the specified name provided as a query parameter.

Tasks
- Create a new task for a user:
```
POST /users/:user_id/tasks
```
Body:

```
{
  "title": "Task Title",
  "description": "Task Description",
  "dueDate": "2024-06-30T23:59:59.999Z",
  "status": "To Do"
}
```
- Retrieve all tasks for a user:

```
GET /users/:user_id/tasks
```

- Retrieve a specific task for a user:
```
GET /users/:user_id/tasks/:task_id
```

- Update a specific task for a user:

```
PUT /users/:user_id/tasks/:task_id

Body (update fields):
{
  "title": "Updated Task Title",
  "status": "In Progress"
}
```
Delete a specific task for a user:
```
DELETE /users/:user_id/tasks/:task_id
```
