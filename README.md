# LocalServe: Local Service Booking Platform

A full-stack web app where customers book local service providers (electricians, plumbers, tutors, carpenters, cleaners) by time slot. Providers manage their own availability, and admins get an overview of the platform.

**Live demo:** `https://YOUR-APP.vercel.app` (add after deployment)
**API:** `https://YOUR-API.onrender.com` (add after deployment)

<img width="1905" height="951" alt="image" src="https://github.com/user-attachments/assets/105e07fe-757d-4600-b3d0-ab25fe4ce03c" />
<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/eb3f491a-b5e2-4815-bcb3-8d18e8c36373" />
<img width="1900" height="934" alt="image" src="https://github.com/user-attachments/assets/72fcdcd6-dcc0-4eef-8bce-9e5310a38b9e" />




---

## Features

- **Three roles:** customer, provider and admin, with role-based access control
- **JWT authentication** with BCrypt password hashing
- **Booking calendar:** pick a day, pick a time, confirm
- **Provider dashboard:** add or remove open time slots, see incoming bookings
- **Slot conflict prevention:** transactional pessimistic locking (`SELECT ... FOR UPDATE`) stops two customers from booking the same slot; providers cannot create overlapping slots
- **Email notifications** (booking confirmed, new booking, cancelled) sent asynchronously with `@Async`
- **Admin overview:** user and booking totals, full user and booking lists
- Clean JSON error messages, request validation, CORS configuration

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Java, Spring Boot 3 (Web, Data JPA, Security, Validation, Mail) |
| Auth | JWT (jjwt), BCrypt |
| Database | H2 (quick local start), MySQL (local), PostgreSQL (production) |
| Deployment | Render (backend, Docker), Vercel (frontend) |

## Architecture

```
React (Vercel)  --JSON/HTTPS-->  Spring Boot REST API (Render)  --JPA-->  Database
```

Backend layers: `controller` (HTTP) -> `service` (business rules) -> `repository` (database), plus `security` (JWT), `dto` (API shapes) and `exception` (error handling).

## How double booking is prevented

`BookingService.book()` runs in a single transaction and loads the slot with a pessimistic write lock. If two customers click Book at the same moment, the second request waits for the first to commit, then sees the slot is already booked and receives HTTP 409 with a clear message.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a customer or provider account |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/providers?category=` | Public | List providers, optionally by category |
| GET | `/api/providers/{id}` | Public | One provider |
| GET | `/api/providers/{id}/slots` | Public | Open future slots of a provider |
| GET / POST | `/api/dashboard/slots` | Provider | List / add own slots |
| DELETE | `/api/dashboard/slots/{id}` | Provider | Remove an unbooked slot |
| GET | `/api/dashboard/bookings` | Provider | Bookings for own slots |
| POST | `/api/bookings` | Customer | Book a slot |
| GET | `/api/bookings/my` | Customer | Own bookings |
| PATCH | `/api/bookings/{id}/cancel` | Customer | Cancel a booking |
| GET | `/api/admin/stats`, `/users`, `/bookings` | Admin | Platform overview |

## Project structure

```
localService/
├─ backend/    Spring Boot API (pom.xml, Dockerfile, src/)
└─ frontend/   React app (package.json, vercel.json, src/)
```

---

## Run locally

**Requirements:** JDK 17 or newer, Maven (or IntelliJ, which bundles it), Node.js 18+.

### 1. Backend
```bash
cd backend
mvn spring-boot:run
```
Or open the `backend` folder in IntelliJ and run `BookingApplication`. The API starts at `http://localhost:8080` with an in-memory H2 database.

A default admin is created at startup: `admin@localserve.com` / `Admin@123`. **Change this before deploying.**

**Optional: use MySQL locally.** Add the `mysql-connector-j` dependency to `pom.xml` and set these in `application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/localserve?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```
Do not commit a real password.

### 2. Frontend
```bash
cd frontend
cp .env.example .env        # Windows: copy .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173`.

### 3. Try it
1. Sign up as a provider and add open times for tomorrow.
2. Sign up as a customer, open the provider, pick a time and confirm.
3. Check **My bookings**, then cancel to see the slot reopen.

### Environment variables (backend)

| Variable | Purpose | Default (local) |
|---|---|---|
| `JWT_SECRET` | Token signing key, 32+ characters | demo value (change it) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin account | `admin@localserve.com`, `Admin@123` |
| `CORS_ORIGINS` | Allowed frontend URL(s), comma separated | `http://localhost:5173` |
| `DATABASE_URL`, `DB_USER`, `DB_PASSWORD` | Production database (prod profile) | not set |
| `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`, `MAIL_FROM` | Optional real emails | not set (emails are logged) |

---

## Deployment

**Order: database, then backend (Render), then frontend (Vercel), then update CORS.**
Free plans and limits change, so check each service's current free tier before you start.

### Before you deploy
- In `backend/pom.xml`, make `<java.version>` match the Dockerfile (**17**). The Dockerfile builds with JDK 17, so a different version in the pom will fail the build.
- Set `app.seed-demo=false` (or remove that line) so demo accounts with a known password are not created online.
- Push the project to GitHub (repo root contains `backend/` and `frontend/`).

### Step 1: Create a MySQL database
Use a hosted PostgreSQL service (for example Neon, or a Render mysql database).
1. Create a database and copy the connection details.
2. Convert them to JDBC format. If the provider shows:
   `mysql://USER:PASSWORD@HOST/DBNAME?sslmode=require`
   then your values are:
   - `DATABASE_URL` = `jdbc:mysql://HOST/DBNAME?sslmode=require`
   - `DB_USER` = `USER`
   - `DB_PASSWORD` = `PASSWORD`

### Step 2: Deploy the backend on Render
1. Sign in to Render and choose **New -> Web Service**, then connect your GitHub repository.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime / Language:** `Docker` (Render finds the `Dockerfile`)
   - **Instance type:** Free (or any plan you prefer)
3. Add **Environment Variables**:

| Key | Value |
|---|---|
| `DATABASE_URL` | JDBC URL from Step 1 |
| `DB_USER` | database user |
| `DB_PASSWORD` | database password |
| `JWT_SECRET` | a random string, 40+ characters |
| `ADMIN_EMAIL` | your own admin email |
| `ADMIN_PASSWORD` | a strong password |
| `CORS_ORIGINS` | add in Step 4 (your Vercel URL) |

4. Click **Create Web Service** and wait for the build. The first build takes several minutes.
5. Test: open `https://YOUR-API.onrender.com/api/providers`. It should return `[]`.

Note: free Render services may go to sleep when idle, so the first request after a break can take a while.

### Step 3: Deploy the frontend on Vercel
1. Sign in to Vercel and choose **Add New -> Project**, then import the same GitHub repository.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - Build command `npm run build`, output directory `dist` (the defaults)
3. Add an **Environment Variable**:
   - `VITE_API_URL` = `https://YOUR-API.onrender.com` (no trailing slash)
4. Click **Deploy**, then copy your site URL, for example `https://localserve.vercel.app`.

`frontend/vercel.json` already routes all paths to `index.html`, so refreshing on `/dashboard` works.

### Step 4: Connect frontend and backend (CORS)
1. In Render, open your backend service -> **Environment**.
2. Set `CORS_ORIGINS` to your exact Vercel URL, with no trailing slash and no path.
3. Save. Render redeploys automatically.

### Step 5: Test the live app
1. Open your Vercel URL and sign up as a provider.
2. Add open times, then log out.
3. Sign up as a customer and book a time.
4. Log in with your admin credentials and check the admin page.

### Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Browser console shows a CORS error | `CORS_ORIGINS` on Render does not exactly match the Vercel URL. Fix it and redeploy. |
| Sign up or login shows "Could not reach the server" | `VITE_API_URL` is wrong or missing. Fix it in Vercel and redeploy the frontend (Vite reads it at build time). |
| Render build fails on the Java version | `java.version` in `pom.xml` is not 17. Set it to 17 and push again. |
| Backend crashes on startup | Check Render logs. Usually `DATABASE_URL`, `DB_USER` or `DB_PASSWORD` is wrong, or the URL does not start with `jdbc:postgresql://`. |
| First request is very slow | A free Render service was asleep. Wait and retry. |
| Page not found on refresh | Make sure `vercel.json` is in the `frontend` folder. |

---

## What I learned and could extend

- Layered architecture, DTOs, validation and global error handling in Spring Boot
- Stateless JWT authentication and role-based authorization with Spring Security
- Database transactions and locking to prevent race conditions
- Possible next steps: ratings and reviews, search by city, recurring availability, payments, optimistic locking with `@Version`, Flyway migrations, unit tests for `BookingService`, Swagger/OpenAPI docs

## Author

**Anuj Chaudhary**
GitHub: [github.com/anonymous8528](https://github.com/anonymous8528) | LinkedIn: [linkedin.com/in/anuj-chaudhary-34b9aa284](https://linkedin.com/in/anuj-chaudhary-34b9aa284) | Portfolio: [anonymous8528.github.io/portfolio](https://anonymous8528.github.io/portfolio)
