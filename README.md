# 🧺 Multi-Outlet Laundry Management System (Front-End)

A modern, responsive, and scalable front-end application built with **Angular 22**. This application serves as the client interface for the **Multi-Outlet Laundry Management System**, providing a seamless experience for administrators, cashiers, and outlet staff.

---

## ✨ Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (RBAC)
- 🏢 Multi-Outlet Support
- 📦 Laundry Order Management
- 👤 Customer Management
- 💳 Payment Management
- 🧴 Inventory Monitoring
- ⚙️ Laundry Machine Monitoring
- 📊 Dashboard & Analytics
- 🌙 Dark / Light Theme *(if available)*
- 📱 Responsive Design
- 🚀 Lazy Loaded Modules
- ⚡ Route Guards
- 🔄 HTTP Interceptors
- 📝 Reactive Forms
- 🎯 Standalone Components

---

# 🛠 Tech Stack

| Technology | Version |
|------------|----------|
| Angular | 22 |
| TypeScript | Latest |
| RxJS | Latest |
| Angular Router | Latest |
| Angular Signals | Latest |
| Angular HttpClient | Latest |
| SCSS | Latest |

---

# 🚀 Getting Started

## Prerequisites

Before running this project, make sure you have installed:

- Node.js 22+
- npm or pnpm
- Angular CLI 22

Verify installation:

```bash
node -v
npm -v
ng version
```

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/rian0502/fe-saklin.git
```

---

## 2. Go to Project Directory

```bash
cd fe-saklin
```

---

## 3. Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

## 4. Configure Environment

Update the API endpoint inside:

```
src/environments/
```

Example:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

---

## 5. Start Development Server

```bash
ng serve
```

or

```bash
npm start
```

The application will be available at:

```
http://localhost:4200
```

---

# 📁 Project Structure

```
src
├── app
│   ├── core
│   │   ├── api
│   │   ├── guards
│   │   ├── interceptors
│   │   ├── layouts
│   │   └── services
│   ├── features
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── customer
│   │   ├── laundry
│   │   ├── inventory
│   │   └── settings
│   ├── shared
│   │   ├── components
│   │   ├── directives
│   │   ├── pipes
│   │   └── models
│   └── app.routes.ts
├── assets
├── environments
└── styles.scss
```

---

# 🔐 Authentication

The application authenticates users using **Bearer Token (Laravel Sanctum)**.

After successful login, every API request automatically includes:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

using an Angular **HTTP Interceptor**.

---

# ⚙️ Available Scripts

Start development server

```bash
ng serve
```

Build application

```bash
ng build
```

Production build

```bash
ng build --configuration production
```

Run unit tests

```bash
ng test
```

Run end-to-end tests

```bash
ng e2e
```

Generate a component

```bash
ng generate component component-name
```

Generate a service

```bash
ng generate service service-name
```

Generate a guard

```bash
ng generate guard guard-name
```

Generate an interceptor

```bash
ng generate interceptor interceptor-name
```

---

# 🌐 Backend API

This project communicates with the Laravel REST API.

Default development endpoint:

```
http://localhost:8000/api
```

Ensure the backend server is running before starting the frontend.

---

# 📦 Build for Production

```bash
ng build --configuration production
```

The production build output will be generated inside:

```
dist/
```

---

# 🧪 Testing

Run unit tests:

```bash
ng test
```

Run end-to-end tests:

```bash
ng e2e
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Muhammad Febrian Hasibuan**

GitHub:
https://github.com/rian0502
