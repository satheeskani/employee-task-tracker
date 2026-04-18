# Employee Task Tracker

A full-stack mini application to manage employees and their tasks.
Built with **Node.js + Express** (backend), **MongoDB** (database), and **HTML/CSS/JS** (frontend).

---

## Project Structure

```
employee-task-tracker/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validators.js       # Input validation rules
│   ├── models/
│   │   ├── Employee.js         # Employee schema
│   │   └── Task.js             # Task schema (indexed on employee_id)
│   ├── routes/
│   │   ├── employees.js        # Employee endpoints
│   │   └── tasks.js            # Task endpoints
│   ├── server.js               # App entry point
│   ├── package.json
│   └── .env.example            # Copy to .env and fill in values
└── frontend/
    └── index.html              # Single-page UI
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas connection string

---

## Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/employee-task-tracker.git
cd employee-task-tracker
```

### 2. Configure environment
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/employee_task_tracker
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 3. Install dependencies and start the API
```bash
npm install
npm run dev       # development (nodemon, auto-reload)
# or
npm start         # production
```

You should see:
```
🚀 Server running in development mode on port 3000
✅ MongoDB connected: localhost
```

### 4. Open the frontend
Open `frontend/index.html` directly in your browser, or serve it with any static server:
```bash
npx serve ../frontend
```

---

## API Reference

Base URL: `http://localhost:3000/api`

All responses follow this shape:
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Human-readable error" }
```

---

### Employees

#### `POST /api/employees` — Create employee

**Request body:**
```json
{
  "name": "Satheeskumar M",
  "email": "sathees@company.com",
  "role": "Fullstack Developer"
}
```

**Success `201`:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "665f...",
    "name": "Satheeskumar M",
    "email": "sathees@company.com",
    "role": "Fullstack Developer",
    "createdAt": "2024-06-04T10:00:00.000Z"
  }
}
```

**Error `400`** (validation fail):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Must be a valid email address" }]
}
```

**Error `409`** (duplicate email):
```json
{ "success": false, "message": "A record with this email already exists" }
```

---

#### `GET /api/employees` — List all employees

**Success `200`:**
```json
{
  "success": true,
  "count": 2,
  "data": [ { "_id": "...", "name": "...", "role": "..." } ]
}
```

---

#### `GET /api/employees/:id` — Get single employee

---

### Tasks

#### `POST /api/tasks` — Create task

**Request body:**
```json
{
  "employee_id": "665f...",
  "task_title": "Build login page",
  "status": "pending"
}
```
`status` is optional — defaults to `"pending"`.
Valid statuses: `pending` | `in-progress` | `completed`

**Success `201`:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "666a...",
    "employee_id": { "_id": "665f...", "name": "Priya Sharma", "role": "Frontend Developer" },
    "task_title": "Build login page",
    "status": "pending",
    "createdAt": "2024-06-04T10:05:00.000Z"
  }
}
```

---

#### `GET /api/tasks/employee/:employeeId` — List tasks for an employee

**Success `200`:**
```json
{
  "success": true,
  "employee": { "id": "665f...", "name": "Priya Sharma", "role": "Frontend Developer" },
  "count": 3,
  "data": [ { ... } ]
}
```

---

#### `PATCH /api/tasks/:id/status` — Update task status

**Request body:**
```json
{ "status": "completed" }
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Task status updated",
  "data": { "_id": "...", "status": "completed", ... }
}
```

---

#### `GET /api/tasks/:id` — Get single task

---

### Health Check

#### `GET /health`
```json
{ "status": "ok", "timestamp": "2024-06-04T10:00:00.000Z" }
```

---

## Database Details

**Database:** `employee_task_tracker`
**Collections:**

| Collection  | Key fields                                              |
|-------------|--------------------------------------------------------|
| `employees` | `name`, `email` (unique, indexed), `role`, timestamps |
| `tasks`     | `employee_id` (ref + indexed), `task_title`, `status`, timestamps |

The `employee_id` field on `tasks` is indexed for fast `GET /tasks/employee/:id` queries.

---

## AWS Deployment (EC2)

### How I would deploy this:

**Infrastructure setup:**
1. Launch an **EC2 t3.micro** (free tier) with Amazon Linux 2023 or Ubuntu 22.04
2. Configure **Security Group** inbound rules:
   - Port 22 (SSH) — your IP only
   - Port 3000 or 80 (HTTP) — open
3. Attach an **Elastic IP** for a stable address

**Server setup:**
```bash
# Install Node.js 20 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20

# Install PM2 for process management
npm install -g pm2

# Install MongoDB on the instance (or use MongoDB Atlas — recommended for production)
```

**Deploy the app:**
```bash
# On EC2 — clone the repo
git clone https://github.com/your-username/employee-task-tracker.git
cd employee-task-tracker/backend
cp .env.example .env
# Edit .env with production MONGO_URI (Atlas connection string recommended)
npm install --omit=dev

# Start with PM2 (auto-restart on crash, survive reboots)
pm2 start server.js --name "task-tracker-api"
pm2 startup   # auto-start on reboot
pm2 save
```

**Serve the frontend:**
- Upload `frontend/index.html` to an **S3 bucket** with static hosting enabled
- Set `API` constant in the HTML to the EC2 public IP/domain
- Optional: put a **CloudFront** distribution in front of S3 for HTTPS + CDN

**Production improvements I would add:**
- Use **HTTPS** via an Application Load Balancer with ACM certificate
- Use **MongoDB Atlas** instead of a self-hosted instance
- Store `.env` secrets in **AWS Systems Manager Parameter Store** or **Secrets Manager**
- Add a **Nginx reverse proxy** on port 80/443 → Node on 3000
- Enable **CloudWatch** logging via PM2's log rotation

---

## Design Decisions

- **express-validator** for input validation — keeps route handlers clean
- **Global error handler** middleware catches Mongoose errors (CastError, ValidationError, duplicate key) so routes don't need try/catch for error formatting
- **`employee_id` index** on the tasks collection ensures O(log n) lookups when listing tasks by employee
- **`/health` endpoint** included for load-balancer health checks and uptime monitoring
- Responses always include `success: true/false` for consistent client-side handling
