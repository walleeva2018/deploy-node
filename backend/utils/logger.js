const logRoutes = () => {
    console.log(`Available routes:`);
    console.log(`\n=== USER ROUTES ===`);
    console.log(`- GET  /              - Welcome message & API info`);
    console.log(`- GET  /home          - Home page with recent users`);
    console.log(`- POST /signup        - User signup`);
    console.log(`- POST /signin        - User sign in`);
    console.log(`- GET  /users         - Get all users`);
    console.log(`- POST /users         - Create user (legacy)`);
    console.log(`\n=== TASK ROUTES ===`);
    console.log(`- POST   /tasks           - Create new task`);
    console.log(`- GET    /tasks           - Get all tasks`);
    console.log(`- GET    /tasks/:id       - Get task by ID`);
    console.log(`- PUT    /tasks/:id       - Update task`);
    console.log(`- DELETE /tasks/:id       - Delete task`);
    console.log(`- GET    /tasks/stats/:userId - Get user task statistics`);
    console.log(`\n=== UTILITY ROUTES ===`);
    console.log(`- GET  /health        - Health check`);
  };
  
  module.exports = { logRoutes };