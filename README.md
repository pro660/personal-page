# Personal Page Full-stack Project

## Structure

```text
my_project/
  frontend/  React CRA
  backend/   Spring Boot + JPA + MySQL
```

## MySQL

Create the database before running the backend.

```sql
CREATE DATABASE personal_page;
```

If your MySQL root account has a password, run the backend with `DB_PASSWORD`.

```powershell
$env:DB_PASSWORD="your_mysql_password"
cd backend
.\gradlew.bat bootRun
```

You can also override the username or full URL.

```powershell
$env:DB_USERNAME="root"
$env:DB_URL="jdbc:mysql://localhost:3306/personal_page?serverTimezone=Asia/Seoul&characterEncoding=UTF-8"
```

## Backend

```powershell
cd backend
.\gradlew.bat bootRun
```

APIs:

```text
GET  http://localhost:8080/api/hello
GET  http://localhost:8080/api/profile
GET  http://localhost:8080/api/skills
GET  http://localhost:8080/api/projects
POST http://localhost:8080/api/contact
```

## Frontend

Use `npm.cmd` on PowerShell if `npm` is blocked by execution policy.

```powershell
cd frontend
npm.cmd start
```

Open:

```text
http://localhost:3000
```

## Development Flow

1. Add or change an API in `backend/src/main/java/com/example/backend/controller`.
2. Add database behavior through `entity` and `repository`.
3. Run Spring Boot on port `8080`.
4. Call the API from React in `frontend/src/App.js`.
5. Check the browser on port `3000`.
