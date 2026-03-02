# Deployment Guide

Complete guide for deploying Cyber-Guard AI Moderation Engine to production.

## Pre-Deployment Checklist

- [ ] Python 3.8+ installed
- [ ] Docker installed (for containerized deployment)
- [ ] PostgreSQL 15+ (optional, for persistence)
- [ ] Redis 7+ (optional, for caching)
- [ ] 4GB+ RAM available
- [ ] SSL certificate (for HTTPS)
- [ ] Domain name configured

## Local Development

### Quick Start
```bash
# Windows
run.bat

# Linux/Mac
chmod +x run.sh
./run.sh
```

### Manual Setup
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
cp .env.example .env
python app/main.py
```

## Docker Deployment

### Single Container
```bash
# Build image
docker build -t cyberguard-ai:latest .

# Run container
docker run -d \
  --name cyberguard-ai \
  -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e DEBUG=false \
  cyberguard-ai:latest
```

### Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## Production Configuration

### Environment Variables

Create `.env` file:

```bash
# Application
APP_NAME=CyberGuard AI
APP_VERSION=1.0.0
ENVIRONMENT=production
DEBUG=false

# API
API_HOST=0.0.0.0
API_PORT=8000
API_PREFIX=/api/v1

# Security
SECRET_KEY=<generate-strong-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (if using)
DATABASE_URL=postgresql://user:password@db-host:5432/cyberguard
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Redis (if using)
REDIS_URL=redis://redis-host:6379/0
REDIS_MAX_CONNECTIONS=50

# ML Models
MODEL_CACHE_DIR=/app/models
MODEL_DEVICE=cpu  # or cuda for GPU
BATCH_SIZE=32

# Privacy
ENCRYPTION_KEY=<generate-encryption-key>
DATA_RETENTION_DAYS=30
ENABLE_PII_REDACTION=true

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=5000

# Monitoring
LOG_LEVEL=INFO
ENABLE_METRICS=true
```

### Generate Secrets

```python
# Generate SECRET_KEY
import secrets
print(secrets.token_urlsafe(32))

# Generate ENCRYPTION_KEY
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

## Cloud Deployment

### AWS (EC2 + Docker)

```bash
# 1. Launch EC2 instance (t3.medium or larger)
# 2. Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone repository
git clone <your-repo-url>
cd cyber-guard-ai

# 5. Configure environment
cp .env.example .env
nano .env  # Edit configuration

# 6. Deploy
docker-compose up -d

# 7. Configure security group
# Allow inbound: 8000 (API), 22 (SSH)
```

### Google Cloud (Cloud Run)

```bash
# 1. Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/cyberguard-ai

# 2. Deploy to Cloud Run
gcloud run deploy cyberguard-ai \
  --image gcr.io/PROJECT_ID/cyberguard-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars ENVIRONMENT=production,DEBUG=false
```

### Azure (Container Instances)

```bash
# 1. Create resource group
az group create --name cyberguard-rg --location eastus

# 2. Create container registry
az acr create --resource-group cyberguard-rg --name cyberguardacr --sku Basic

# 3. Build and push image
az acr build --registry cyberguardacr --image cyberguard-ai:latest .

# 4. Deploy container
az container create \
  --resource-group cyberguard-rg \
  --name cyberguard-ai \
  --image cyberguardacr.azurecr.io/cyberguard-ai:latest \
  --cpu 2 \
  --memory 4 \
  --ports 8000 \
  --environment-variables ENVIRONMENT=production DEBUG=false
```

### Heroku

```bash
# 1. Login to Heroku
heroku login

# 2. Create app
heroku create cyberguard-ai

# 3. Add buildpack
heroku buildpacks:set heroku/python

# 4. Set environment variables
heroku config:set ENVIRONMENT=production
heroku config:set DEBUG=false

# 5. Deploy
git push heroku main

# 6. Scale dynos
heroku ps:scale web=2
```

## Kubernetes Deployment

### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cyberguard-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cyberguard-ai
  template:
    metadata:
      labels:
        app: cyberguard-ai
    spec:
      containers:
      - name: api
        image: cyberguard-ai:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: DEBUG
          value: "false"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: cyberguard-ai-service
spec:
  selector:
    app: cyberguard-ai
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl get services
```

## Reverse Proxy (Nginx)

### nginx.conf
```nginx
upstream cyberguard_api {
    server localhost:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://cyberguard_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Monitoring & Logging

### Health Checks
```bash
# Basic health check
curl http://localhost:8000/health

# Detailed check
curl http://localhost:8000/api/v1/health
```

### Logging
```bash
# Docker logs
docker logs -f cyberguard-ai

# Docker Compose logs
docker-compose logs -f api

# Kubernetes logs
kubectl logs -f deployment/cyberguard-ai
```

### Metrics (Future)
- Prometheus for metrics collection
- Grafana for visualization
- Alert Manager for notifications

## Performance Tuning

### Gunicorn (Production WSGI)
```bash
# Install
pip install gunicorn

# Run with workers
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
```

### Worker Calculation
```
workers = (2 x CPU cores) + 1
```

### Resource Limits
- Minimum: 2 CPU, 4GB RAM
- Recommended: 4 CPU, 8GB RAM
- High traffic: 8+ CPU, 16GB+ RAM

## Backup & Recovery

### Database Backup (if using)
```bash
# PostgreSQL backup
pg_dump -U user -d cyberguard > backup_$(date +%Y%m%d).sql

# Restore
psql -U user -d cyberguard < backup_20240101.sql
```

### Model Backup
```bash
# Backup models directory
tar -czf models_backup.tar.gz models/

# Restore
tar -xzf models_backup.tar.gz
```

## Security Hardening

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Environment Variables**: Never commit secrets to git
3. **Rate Limiting**: Configure appropriate limits
4. **Input Validation**: Already implemented in Pydantic models
5. **CORS**: Configure allowed origins in production
6. **Firewall**: Restrict access to necessary ports only
7. **Updates**: Keep dependencies updated

## Troubleshooting

### High Memory Usage
- Reduce `BATCH_SIZE` in .env
- Limit concurrent requests
- Use model quantization

### Slow Response Times
- Enable Redis caching
- Increase worker count
- Use GPU for inference
- Optimize database queries

### Model Download Issues
- Pre-download models during build
- Use model cache directory
- Check internet connectivity

## Maintenance

### Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or for Kubernetes
kubectl rollout restart deployment/cyberguard-ai
```

### Database Migrations (future)
```bash
# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test health endpoint
4. Review resource usage
5. Contact support if needed

---

**Production Checklist**

- [ ] Environment variables configured
- [ ] Secrets generated and secured
- [ ] SSL certificate installed
- [ ] Reverse proxy configured
- [ ] Health checks passing
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Security hardening applied
- [ ] Load testing completed
- [ ] Documentation updated
