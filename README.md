# Azure Full-Stack E-Commerce Web Application

A complete full-stack E-Commerce website built using **React + Node.js + Express + Azure SQL Database**, deployed on **Microsoft Azure Static Web Apps and Azure App Service**.

This project demonstrates a scalable cloud-hosted architecture where a frontend client communicates with a backend API which securely connects to a cloud database.

---

## 🌐 Live Application

Frontend (Azure Static Web App):
`https://ashy-sea-090fda60f.4.azurestaticapps.net/`

Backend API (Azure App Service):
`https://luxe-ecommerce-api.azurewebsites.net/`

---

## 🧠 Project Architecture

User Browser → React Frontend → Node/Express Backend → Azure SQL Database

The frontend never connects directly to the database.
All database operations are handled securely through the backend API.

---

## 🚀 Features

### User Features

* Browse products
* View product details
* Select size (S, M, L, XL)
* Add to cart
* Checkout
* Place orders
* View order history
* Persistent login (local storage authentication)

### Admin/Data Features

* Products stored in Azure SQL
* Stock per size
* Orders stored in database
* Order items tracking
* User profile storage

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Context API (State management)
* Tailwind CSS

### Backend

* Node.js
* Express.js
* CORS
* dotenv
* mssql (SQL Server driver)

### Database

* Microsoft Azure SQL Database

### Cloud & Deployment

* Azure Static Web Apps (Frontend hosting)
* Azure App Service (Backend hosting)
* Azure SQL Database (Cloud database)
* GitHub Actions (CI/CD)

---

## 📂 Project Structure

```
AWS_WEB/
│
├── src/                 # React frontend
├── public/
├── dist/                # Build output
│
├── server/              # Node.js backend
│   ├── server.js
│   ├── setup_complete_db.sql
│   └── .env
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

### 2️⃣ Install Frontend

```
npm install
```

Run frontend:

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 3️⃣ Setup Backend

Go to server folder:

```
cd server
npm install
```

Create `.env` file:

```
DB_SERVER=yourserver.database.windows.net
DB_NAME=yourdatabase
DB_USER=yourusername
DB_PASSWORD=yourpassword
PORT=3000
```

Run backend:

```
node server.js
```

Backend runs at:

```
http://localhost:3000
```

---

## 🗄️ Database Setup

1. Go to Azure Portal
2. Open **Azure SQL Database**
3. Open **Query Editor**
4. Run:

```
server/setup_complete_db.sql
```

This creates:

* Products
* ProductSizes
* Cart
* Orders
* OrderItems
* Users tables

---

## 🔐 Environment Variables

### Backend (.env)

```
DB_SERVER=
DB_NAME=
DB_USER=
DB_PASSWORD=
PORT=3000
```

### Frontend (Azure Static Web App → Configuration → Application Settings)

```
VITE_API_URL=https://your-backend-app.azurewebsites.net
```

---

## ☁️ Deployment

### Frontend Deployment

* Hosted on Azure Static Web Apps
* Auto-deploys using GitHub Actions on push to `main`

### Backend Deployment

Deployed using Azure CLI:

```
az webapp up --name <backend-name> --resource-group <rg-name> --runtime "NODE|20-lts"
```

---

## 🔌 API Endpoints

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| GET    | /products       | Get all products    |
| GET    | /products/:id   | Get single product  |
| POST   | /cart           | Add item to cart    |
| POST   | /orders         | Place order         |
| GET    | /orders/:userId | Get order history   |
| POST   | /users          | Create user profile |

---

## 📊 Learning Outcomes

This project demonstrates:

* Cloud deployment
* REST API development
* SQL database integration
* Full-stack architecture
* CI/CD pipelines
* Environment variable configuration
* CORS handling
* Authentication without third-party services

---

## ⚠️ Important Notes

* Frontend never directly accesses the database.
* All data passes through the backend API.
* Azure firewall rules must allow backend server access.

---

## 👨‍💻 Author

**Abhiram T E**

Full-Stack Web Application Major Project
Cloud Deployment using Microsoft Azure

---

## 📜 License

This project is created for educational purposes.
