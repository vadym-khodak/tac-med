## Deploy client, server, and MongoDB on a local Linux Ubuntu machine in the same WIFI network

This directory contains Ansible playbooks and scripts to deploy the TAC-MED application (client, server, and MongoDB) on a local Ubuntu machine in your network.

### Prerequisites

1. **Control Machine (your computer):**
   - Ansible installed
   - SSH access to the target Ubuntu machine
   - This repository cloned

2. **Target Machine (Ubuntu 20.04 or newer):**
   - Ubuntu 20.04 or newer
   - SSH server enabled
   - Your SSH public key added to `~/.ssh/authorized_keys`

### Files Structure

```
ansible/
├── prepare-ubuntu.sh      # Script to prepare Ubuntu machine
├── deploy.sh             # Main deployment script
├── deploy.yml            # Main Ansible playbook
├── hosts.yml             # Ansible inventory (YAML format)
├── inventory.ini         # Ansible inventory (INI format)
├── playbooks/
│   ├── mongodb.yml       # MongoDB deployment playbook
│   ├── server.yml        # Backend server deployment playbook
│   └── client.yml        # Frontend client deployment playbook
└── templates/
    ├── mongod.conf.j2    # MongoDB configuration template
    ├── server.env.j2     # Server environment template
    ├── client.env.j2     # Client environment template
    └── pm2.ecosystem.config.js.j2  # PM2 configuration template
```

### Quick Start

1. **Prepare the target Ubuntu machine:**
   ```bash
   # Copy and run the preparation script on the target machine
   scp prepare-ubuntu.sh ubuntu@<TARGET_IP>:~/
   ssh ubuntu@<TARGET_IP> 'chmod +x prepare-ubuntu.sh && sudo ./prepare-ubuntu.sh'
   ```

2. **Update the inventory file:**
   Edit `hosts.yml` and replace the IP address:
   ```yaml
   ansible_host: YOUR_UBUNTU_MACHINE_IP
   ```

3. **Run the deployment:**
   ```bash
   ./deploy.sh --host <TARGET_IP> --key ~/.ssh/id_rsa
   ```

### Deployment Script Options

```bash
./deploy.sh [OPTIONS]

Options:
  -h, --host <IP>        Target host IP address
  -k, --key <PATH>       Path to SSH private key
  -i, --inventory <FILE> Inventory file (default: hosts.yml)
  --skip-prepare         Skip running prepare-ubuntu.sh on target
  --help                 Show help message
```

### Manual Deployment Steps

If you prefer to run the playbooks manually:

1. **Test connection:**
   ```bash
   ansible all -i hosts.yml -m ping
   ```

2. **Run the deployment:**
   ```bash
   ansible-playbook -i hosts.yml deploy.yml
   ```

### What Gets Deployed

1. **MongoDB** - Running on port 27017
2. **Backend Server** - Node.js/NestJS app on port 3000
3. **Frontend Client** - React app on port 4200

All services are managed by PM2 and will auto-restart on system reboot.

### Post-Deployment

After successful deployment:

1. **Access the application:**
   - Frontend: http://<TARGET_IP>:4200
   - Backend API: http://<TARGET_IP>:3000/health

2. **SSH to the target machine to manage services:**
   ```bash
   ssh ubuntu@<TARGET_IP>
   
   # View running services
   pm2 status
   
   # View logs
   pm2 logs
   
   # Restart services
   pm2 restart all
   ```

3. **Admin credentials:**
   - Generated automatically during deployment
   - Stored in `/opt/tac-med/server/.env`

### Troubleshooting

1. **Connection issues:**
   - Ensure SSH key is properly configured
   - Check firewall settings on target machine
   - Verify the target machine is on the same network

2. **Deployment failures:**
   - Check Ansible output for specific errors
   - Verify all ports (3000, 4200, 27017) are available
   - Ensure sufficient disk space on target machine

3. **Service issues:**
   - SSH to target and check PM2 logs: `pm2 logs`
   - Check MongoDB status: `sudo systemctl status mongod`
   - Verify environment variables in `.env` files