# ServiceHive Assignment

## GigFlow assignment for internship at [ServiceHive](https://www.servicehive.tech).
#### Implemented required features and also bonus features(transaction and ws notification)
## Requirements
- **Node.js 20+** for the frontend tools and npm scripts.
- **Bun** (>=1) so the backend `dev` and `start` scripts can run `bun` commands. Install it via `curl https://bun.sh/install | bash`, then reopen your shell so `bun` is on `$PATH`.
- **MongoDB 7+** (or Atlas) with replica set support because the backend uses transactions.

## MongoDB setup
### Cloud (preferred)
Use the connection string provided by Atlas or another hosted service and set it in `MONGO_URI` (see sample `.env` below). Most managed clusters already expose a replica set; just append `?retryWrites=true&w=majority` if it is not added automatically.

### Local replica set (required for transactions)
#### Linux (my setup)
1. Create and own the database directory: `sudo mkdir -p /data/db && sudo chown -R $(whoami) /data/db`.
2. Start `mongod` with a replica set: `mongod --dbpath /data/db --replSet rs0 --bind_ip localhost`.
3. In another shell run `mongosh --port 27017`, then `rs.initiate()` and `rs.status()` to confirm `rs0` is primary.
4. Use `mongodb://localhost:27017/gigflow?replicaSet=rs0` (or your preferred database name) for `MONGO_URI` so the driver knows to talk to the replica set.

#### Windows (not tested; ai generated)
1. Ensure `C:\data\db` exists, for example `mkdir C:\data\db` in PowerShell.
2. Start the server: `mongod --dbpath C:\data\db --replSet rs0 --bind_ip 127.0.0.1`.
3. Connect with `mongosh` to run `rs.initiate()` and confirm with `rs.status()`.
4. Set `MONGO_URI` to `mongodb://localhost:27017/gigflow?replicaSet=rs0`.

## Configuration
Create a `.env` file next to `backend/src` or at the root of `backend` with:

```
PORT=3000
CLIENT_URL=http://localhost:5173
ACCESS_SECRET=your-secret
REFRESH_SECRET=another-secret
MONGO_URI=mongodb://localhost:27017/gigflow?replicaSet=rs0
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d
```

Adjust secrets, ports, and the Mongo URI to match your cloud provider when needed. The frontend must match `CLIENT_URL` when it calls the backend.

## Backend (API)
1. Open a shell inside `backend` and run `bun install && bun run build`.
2. Start the dev server with `bun run start`.


## Frontend (Vite)
1. Enter the `frontend` directory and run `bun install`.
2. use `bun run build` followed by `bun run preview`.

## Notes
- The backend proxies cookies relying on `CLIENT_URL` being in `backend/src/app.ts` CORS whitelist, so keep the port/host consistent with the frontend dev server.
- If you switch MongoDB clusters, rerun `bun run build && bun run start` after adjusting `MONGO_URI` because the connection is read at startup.
****