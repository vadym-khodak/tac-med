# Tac-Med Ansible Deployment

This directory contains Ansible playbooks and configurations for deploying the Tac-Med application to remote servers.

## Prerequisites

### Local Requirements
- Ansible 2.9+ installed
- SSH access to target servers
- Python 3.8+ on control machine

### Target Server Requirements
- Ubuntu 20.04+ or Debian 11+
- SSH access with sudo privileges
- Minimum 2GB RAM, 20GB disk space
- Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

## Directory Structure

```
ansible/
├── ansible.cfg                 # Ansible configuration
├── inventories/
│   └── hosts.yml              # Server inventory
├── playbooks/
│   ├── deploy.yml             # Main deployment playbook
│   └── tasks/                 # Modular task files
│       ├── mongodb.yml        # MongoDB installation
│       ├── nodejs.yml         # Node.js setup
│       ├── nginx.yml          # Nginx configuration
│       └── firewall.yml       # Security setup
├── templates/                 # Jinja2 templates
│   ├── server.env.j2          # Server environment config
│   ├── client.env.j2          # Client environment config
│   ├── ecosystem.config.js.j2 # PM2 configuration
│   └── nginx-tac-med.conf.j2  # Nginx site config
├── group_vars/                # Environment variables
│   ├── all.yml                # Global variables
│   ├── production.yml         # Production settings
│   ├── staging.yml            # Staging settings
│   └── development.yml        # Development settings
└── README.md                  # This file
```

## Quick Start

### 1. Configure Inventory

Edit `inventories/hosts.yml` and set your server IP addresses:

```yaml
# Replace with your actual server IPs
prod_server_ip: "1.2.3.4"
staging_server_ip: "5.6.7.8"
dev_server_ip: "9.10.11.12"
```

### 2. Configure Variables

Update the appropriate group_vars file for your environment:

- `group_vars/production.yml` - Production settings
- `group_vars/staging.yml` - Staging settings
- `group_vars/development.yml` - Development settings

**Important**: Update Auth0 credentials, domain names, and other sensitive information.

### 3. Deploy to Development

```bash
cd ansible
ansible-playbook playbooks/deploy.yml --limit development
```

### 4. Deploy to Staging

```bash
ansible-playbook playbooks/deploy.yml --limit staging
```

### 5. Deploy to Production

```bash
ansible-playbook playbooks/deploy.yml --limit production
```

## Detailed Configuration

### Server Environment Variables

Configure these variables in your group_vars files:

#### Required Variables
```yaml
# Server details
prod_server_ip: "YOUR_PRODUCTION_IP"
staging_server_ip: "YOUR_STAGING_IP"
dev_server_ip: "YOUR_DEVELOPMENT_IP"

# Auth0 Configuration
auth0_domain: "your-auth0-domain.auth0.com"
auth0_audience: "https://your-api-audience"
auth0_client_id: "your-auth0-client-id"

# Domain names
domain_name: "tac-med.yourdomain.com"
```

#### Optional Variables
```yaml
# Sentry monitoring
sentry_dsn: "your-sentry-dsn"
sentry_dsn_client: "your-client-sentry-dsn"

# JWT secret
jwt_secret: "your-secure-jwt-secret"

# PM2 configuration
pm2_instances: 2
pm2_exec_mode: "cluster"
```

### SSH Configuration

Ensure your SSH key is properly configured:

```bash
# Test SSH connection
ssh ubuntu@YOUR_SERVER_IP

# If using a specific key file
ssh -i ~/.ssh/your-key ubuntu@YOUR_SERVER_IP
```

Update `ansible.cfg` if using a different key:

```ini
[defaults]
private_key_file = ~/.ssh/your-specific-key
```

## Deployment Process

The deployment playbook performs these steps:

1. **System Setup**
   - Updates system packages
   - Creates application user
   - Installs required system packages

2. **Database Setup**
   - Installs MongoDB 7.0
   - Creates application database
   - Configures MongoDB service

3. **Application Runtime**
   - Installs Node.js 20.x
   - Installs global npm packages (PM2, NX)

4. **Application Deployment**
   - Clones/updates git repository
   - Installs dependencies
   - Builds application
   - Creates environment configuration

5. **Process Management**
   - Configures PM2 ecosystem
   - Starts application processes
   - Sets up PM2 auto-startup

6. **Web Server**
   - Configures Nginx reverse proxy
   - Sets up SSL (if configured)
   - Enables gzip compression

7. **Security**
   - Configures UFW firewall
   - Sets up fail2ban
   - Applies security headers

## Commands Reference

### Basic Deployment
```bash
# Deploy to specific environment
ansible-playbook playbooks/deploy.yml --limit production

# Deploy with specific branch
ansible-playbook playbooks/deploy.yml --limit staging --extra-vars "git_branch=feature/new-feature"

# Dry run (check mode)
ansible-playbook playbooks/deploy.yml --limit development --check

# Verbose output
ansible-playbook playbooks/deploy.yml --limit production -vvv
```

### Application Management

```bash
# SSH to server and manage PM2
ssh ubuntu@YOUR_SERVER_IP
sudo su - tacmed

# PM2 commands
pm2 status
pm2 restart tac-med-server
pm2 logs tac-med-server
pm2 reload all
```

### Troubleshooting

```bash
# Check system services
systemctl status nginx
systemctl status mongod

# Check application logs
tail -f /opt/tac-med/logs/error.log
tail -f /var/log/nginx/tac-med-error.log

# Check firewall status
ufw status
```

## Security Considerations

### Production Security
- Change default JWT secret
- Use strong passwords for Auth0
- Enable SSL/TLS certificates
- Configure fail2ban properly
- Regularly update system packages

### Network Security
- Restrict SSH access by IP
- Use non-standard SSH ports
- Enable automatic security updates
- Monitor access logs

### Application Security
- Keep dependencies updated
- Use environment-specific Auth0 tenants
- Enable CORS properly
- Validate all user inputs

## Backup Strategy

### Database Backup
```bash
# Create backup script
mongodump --db tac-med-production --out /backup/mongodb/$(date +%Y%m%d)

# Restore from backup
mongorestore --db tac-med-production /backup/mongodb/20231201/tac-med-production
```

### Application Backup
```bash
# Backup application files
tar -czf /backup/tac-med-$(date +%Y%m%d).tar.gz /opt/tac-med/app
```

## Monitoring

### Health Checks
- Application: `http://your-domain/health`
- API: `http://your-domain/api`
- Client: `http://your-domain/`

### Log Locations
- Application: `/opt/tac-med/logs/`
- Nginx: `/var/log/nginx/`
- System: `/var/log/syslog`
- MongoDB: `/var/log/mongodb/`

## Support

For deployment issues:
1. Check the logs in `/opt/tac-med/logs/`
2. Verify system services are running
3. Test network connectivity
4. Check firewall rules
5. Review Nginx configuration

For application issues, refer to the main project documentation.