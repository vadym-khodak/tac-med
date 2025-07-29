#!/bin/bash

# Script to prepare Ubuntu machine for tac-med deployment
# This script configures the network and installs necessary dependencies

set -e

echo "=== Preparing Ubuntu machine for tac-med deployment ==="

# Update system packages
echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install required system packages
echo "Installing required system packages..."
sudo apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    ca-certificates \
    gnupg \
    lsb-release \
    python3 \
    python3-pip \
    python3-venv \
    software-properties-common

# Install Node.js (LTS version)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
echo "Installing MongoDB..."
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages and install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Ansible
echo "Installing Ansible..."
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt-get install -y ansible

# Install PM2 globally for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 3000/tcp     # Backend server
sudo ufw allow 4200/tcp     # Frontend dev server
sudo ufw allow 27017/tcp    # MongoDB
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS

# Get the machine's IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')
echo ""
echo "=== Setup Complete ==="
echo "Machine IP Address: $IP_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Make sure this machine is accessible from your Ansible control machine"
echo "2. Add this IP ($IP_ADDRESS) to your Ansible inventory"
echo "3. Run the Ansible playbooks to deploy the application"
echo ""
echo "Services will be available at:"
echo "- Backend API: http://$IP_ADDRESS:3000"
echo "- Frontend: http://$IP_ADDRESS:4200"
echo "- MongoDB: mongodb://$IP_ADDRESS:27017"