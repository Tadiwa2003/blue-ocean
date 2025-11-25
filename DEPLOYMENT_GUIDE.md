# Deployment & Security Guide

## 🔒 Security Configuration

### 1. Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# File Upload (AWS S3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# CDN
CDN_URL=https://cdn.yourdomain.com

# Security
ALLOW_ALL_CORS=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. SSL/TLS Configuration

#### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Database Security

#### MongoDB Atlas Security

1. **Network Access:**
   - Whitelist only your server IPs
   - Use VPC peering for AWS/GCP

2. **Database Users:**
   - Create dedicated database user with minimal permissions
   - Use strong passwords
   - Enable MFA for admin accounts

3. **Encryption:**
   - Enable encryption at rest
   - Use TLS/SSL for connections

4. **Backups:**
   - Enable automated backups
   - Test restore procedures regularly

### 4. API Security

#### Rate Limiting

```javascript
// server/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Too many login attempts, please try again later.',
});
```

#### CORS Configuration

```javascript
// server/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

#### Helmet.js for Security Headers

```bash
npm install helmet
```

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 5. Authentication Security

#### Password Hashing

```javascript
import bcrypt from 'bcryptjs';

const saltRounds = 12; // Use 12+ rounds in production

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

#### JWT Configuration

```javascript
// Use strong secret (32+ characters)
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Short expiration for access tokens
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Environment Variables:**
   - Add in Vercel dashboard: Settings → Environment Variables

#### Backend (Railway)

1. **Connect Repository:**
   - Go to Railway.app
   - New Project → Deploy from GitHub

2. **Environment Variables:**
   - Add all variables in Railway dashboard

3. **Build Command:**
   ```bash
   npm install
   ```

4. **Start Command:**
   ```bash
   npm run server
   ```

### Option 2: AWS (Full Stack)

#### Frontend (S3 + CloudFront)

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **CloudFront Distribution:**
   - Create distribution
   - Point to S3 bucket
   - Enable HTTPS
   - Configure caching

#### Backend (EC2 or ECS)

**EC2 Setup:**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo
cd your-repo

# Install dependencies
npm install

# Start with PM2
pm2 start server/index.js --name api
pm2 save
pm2 startup
```

**ECS Setup:**
- Create ECS cluster
- Create task definition
- Create service
- Configure load balancer

### Option 3: DigitalOcean

#### App Platform

1. **Create App:**
   - Connect GitHub repository
   - Select Node.js
   - Configure build/run commands

2. **Database:**
   - Create managed MongoDB database
   - Add connection string to environment variables

3. **Domains:**
   - Add custom domain
   - Configure SSL

### Option 4: Docker Deployment

#### Dockerfile

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server/ ./server/
COPY . .

EXPOSE 3001

CMD ["node", "server/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/mydb
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### Deploy

```bash
docker-compose up -d
```

---

## 📊 Monitoring & Logging

### 1. Application Monitoring

#### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Health Check Endpoint

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: getConnectionStatus() ? 'connected' : 'disconnected',
  });
});
```

### 2. Error Tracking

#### Sentry Integration

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Logging

#### Winston Logger

```bash
npm install winston
```

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

---

## 🔐 Security Checklist

- [ ] All environment variables set and secure
- [ ] SSL/TLS certificates installed and valid
- [ ] Database credentials secure and rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Authentication tokens with short expiration
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (if using SQL)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers configured (Helmet)
- [ ] Error messages don't leak sensitive info
- [ ] File uploads validated and scanned
- [ ] Regular security updates
- [ ] Backups configured and tested
- [ ] Monitoring and alerting set up
- [ ] Access logs enabled
- [ ] Firewall rules configured
- [ ] DDoS protection enabled (Cloudflare)

---

## 📝 Post-Deployment

1. **Test all endpoints**
2. **Verify SSL certificate**
3. **Test payment processing**
4. **Check email delivery**
5. **Monitor error logs**
6. **Set up alerts**
7. **Document deployment process**
8. **Create rollback plan**

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB URI
   - Verify network access
   - Check firewall rules

2. **CORS Errors**
   - Verify FRONTEND_URL in environment
   - Check CORS middleware configuration

3. **SSL Certificate Issues**
   - Verify certificate expiration
   - Check certificate path
   - Ensure proper permissions

4. **Rate Limiting Too Aggressive**
   - Adjust rate limit settings
   - Whitelist trusted IPs

---

This guide provides a comprehensive foundation for secure deployment. Adjust based on your specific hosting provider and requirements.

