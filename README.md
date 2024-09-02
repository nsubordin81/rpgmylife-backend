## Development Setup

### Prerequisites

- Node.js (v14 or later recommended)
- Docker

### Setting up the Database

This project uses MongoDB, running in a Docker container. To set up the database:

1. Ensure Docker is installed and running on your system.

2. Run the following command to start the MongoDB container:

   ```bash
   docker run -d --name rpgmylife-mongo -p 27017:27017 -v rpgmylife-mongodata:/data/db mongo:latest
   ```

   This command creates a Docker container named `rpgmylife-mongo`, maps port 27017 to your host system, and creates a persistent volume for the database data.

3. To check if the container is running:

   ```bash
   docker ps
   ```

   You should see `rpgmylife-mongo` in the list of running containers.

4. In subsequent development sessions, you can start the existing container with:

   ```bash
   docker start rpgmylife-mongo
   ```

### Setting up the Backend

1. Navigate to the `rpgmylife-backend` directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `rpgmylife-backend` directory with the following content:

   ```
   MONGODB_URI=mongodb://localhost:27017/rpgmylife
   PORT=5000
   ```

4. Start the backend server:

   ```bash
   node src/app.js
   ```

   The server should now be running on `http://localhost:5000`.

### Setting up the Frontend

1. Navigate to the `rpgmylife-frontend` directory.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend should now be accessible at `http://localhost:3000` (or whatever port Vite assigns).

### Testing the API

You can test the API using curl. For example, to get the character data:

for example, to get the character data:

```bash
curl http://localhost:5000/api/character
```

to create a new character:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Hero","race":"Human","class":"Warrior"}' http://localhost:5000/api/character
```

to update the character:

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"level":2,"totalExperience":1000,"gold":50}' http://localhost:5000/api/character
```