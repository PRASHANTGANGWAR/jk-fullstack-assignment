## 📝 Blog Application

A full-stack blog application with Google/Facebook authentication, built using:

- 🔧 **NestJS** for the backend (with PassportJS and JWT)
- ⚛️ **React** for the frontend (Google/Facebook login)
- 🐳 **Docker** for containerization
- ☁️ **AWS ECR & EKS** for deployment
- 🛆 **Terraform** for infrastructure as code
- 🧪 **Jest** and **Cypress** for testing

---

## 🗂️ Project Structure

```
.
├── backend/        # NestJS Backend
├── frontend/       # React Frontend
├── docker/         # Docker-related configs
├── eks-terraform/  # Terraform scripts for AWS infrastructure
└── README.md
```

---

## ✨ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

---

## 📦 Backend (NestJS)

### 🔧 Setup

```bash
cd backend
npm install
```

### 🛠️ Run in Dev

```bash
npm run start:dev
```

### 🧪 Testing

```bash
npm run test          # Run unit tests (Jest)
npm run test:e2e      # Run E2E tests
```

---

### ⚙️ Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
CALLBACK_URL=http://localhost:3000/auth/google/callback
```

---

### 🐳 Dockerize Backend

```bash
cd backend
docker build -t blog-backend .
```

Push to ECR:

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag blog-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/blog-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/blog-backend:latest
```

---

## 🎨 Frontend (React)

### 🔧 Setup

```bash
cd frontend
npm install
```

### 🛠️ Run in Dev

```bash
npm start
```

### 🧪 Testing

```bash
npm run test         # Run unit tests
npx cypress open     # Integration testing
```

### ⚙️ Environment Variables

Create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=xxx
REACT_APP_FACEBOOK_APP_ID=xxx
```

---

## ☁️ Deploying to AWS

### Prerequisites

- Docker installed and configured
- AWS CLI configured
- Terraform initialized (`cd eks-terraform && terraform init`)

### 1. 🏗️ Create EKS Cluster

```bash
cd eks-terraform
terraform apply
```

Once successful, configure `kubectl`:

```bash
aws eks --region <region> update-kubeconfig --name <cluster_name>
```

### 2. 🚀 Deploy Backend

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
```

### 3. 🚀 Deploy Frontend

(Optional, once frontend is containerized and uploaded to ECR):

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

---

## 📊 Monitoring & Logs

```bash
kubectl get pods
kubectl logs <pod-name>
```

---

## ✅ Features

- Google & Facebook OAuth
- JWT-based session handling
- Post CRUD for authenticated users
- Public post detail view
- Full test suite (Jest + Cypress)
- AWS EKS deployment via Terraform
