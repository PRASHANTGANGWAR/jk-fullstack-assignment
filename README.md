## 📝 Blog Application

A full-stack blog application with Google/Facebook authentication, built using:

- 🔧 **NestJS** for the backend (with PassportJS and JWT)
- ⚛️ **React** for the frontend (Google/Facebook login)
- 🐳 **Docker** for containerization
- ☁️ **AWS EC2** for deployment
- 🛆 **Terraform** for infrastructure as code
- 🧪 **Jest** for testing
- 🔁 **GitHub Actions** for CI/CD

---

## 🗂️ Project Structure

```
.
├── jk-fullstack-assignment/
│   ├── .github/workflows/        # GitHub Actions workflows
│   ├── .terraform/               # Terraform working directory (auto-generated)
│   ├── be/                       # Backend (NestJS)
│   ├── fe/                       # Frontend (React)
│   ├── .gitignore                # Git ignore file
│   ├── deploy-app.yml            # Ansible playbook for deployment
│   ├── dynamic_inventory.ini     # Ansible inventory file (can be dynamic/static)
│   ├── inventory.tpl             # Ansible dynamic inventory template
│   ├── main.tf                   # Terraform main configuration
│   └── README.md                 # Project documentation

```

---

## ✨ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PRASHANTGANGWAR/jk-fullstack-assignment.git
cd jk-fullstack-assignment
```

---

## 📦 Backend (NestJS)

### 🔧 Setup

```bash
cd be
npm install
```

### 🛠️ Run in Dev

```bash
npm run start:dev
```

### 🧪 Testing

```bash
npm run test          # Run unit tests (Jest)
```

---

### ⚙️ Environment Variables

Create a `.env` file in `be/` with correct values.


---

### 🐳 Dockerize Backend

```bash
cd be
docker build -t be-app .
```

## 🎨 Frontend (React)

### 🔧 Setup

```bash
cd fe
npm install
```

### 🛠️ Run in Dev

```bash
npm start
```

### 🧪 Testing

```bash
npm run test         # Run unit tests
```

### ⚙️ Environment Variables

Create a `.env` file in `fe/`:

```env
VITE_API_URL=http://localhost:3001
```

---

### 🐳 Dockerize frontend

```bash
cd fe
docker build -t fe-app .
```

---

## ☁️ Deploying to AWS

### Prerequisites

- Docker installed and configured
- AWS CLI configured
- Terraform initialized (`terraform init`)


```bash
terraform apply -auto-approve
```


