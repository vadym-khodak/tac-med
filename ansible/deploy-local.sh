#!/bin/bash

# Local Network Deployment Script for Tac-Med
# Usage: ./deploy-local.sh <ubuntu-laptop-ip> [username]

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <ubuntu-laptop-ip> [username]"
    echo "Example: $0 192.168.1.100 deploy"
    exit 1
fi

UBUNTU_IP=$1
USERNAME=${2:-deploy}
INVENTORY_FILE="inventories/local-network.yml"

print_status "Setting up deployment to Ubuntu laptop"
print_status "IP: $UBUNTU_IP"
print_status "User: $USERNAME"
echo ""

# Update inventory file with actual IP
print_status "Updating inventory file..."
sed -i.bak "s/192.168.1.XXX/$UBUNTU_IP/g" "$INVENTORY_FILE"
sed -i.bak "s/ansible_user: deploy/ansible_user: $USERNAME/g" "$INVENTORY_FILE"

# Test SSH connectivity
print_status "Testing SSH connectivity..."
if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$USERNAME@$UBUNTU_IP" "echo 'SSH connection successful'"; then
    print_success "SSH connection working"
else
    print_error "Cannot connect via SSH to $USERNAME@$UBUNTU_IP"
    print_warning "Make sure:"
    echo "  1. SSH server is running on Ubuntu laptop: sudo systemctl start ssh"
    echo "  2. Your SSH key is copied: ssh-copy-id $USERNAME@$UBUNTU_IP"
    echo "  3. The IP address is correct"
    exit 1
fi

# Test sudo access
print_status "Testing sudo access..."
if ssh -o ConnectTimeout=5 "$USERNAME@$UBUNTU_IP" "sudo -n true" 2>/dev/null; then
    print_success "Passwordless sudo is configured"
else
    print_warning "Passwordless sudo not configured. You may need to enter password during deployment."
    print_status "To enable passwordless sudo, run on Ubuntu laptop:"
    echo "  sudo echo '$USERNAME ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/$USERNAME"
fi

# Install Ansible requirements
print_status "Installing Ansible requirements..."
if ansible-galaxy install -r requirements.yml; then
    print_success "Ansible requirements installed"
else
    print_warning "Could not install some requirements, continuing anyway"
fi

# Test Ansible connectivity
print_status "Testing Ansible connectivity..."
if ansible local_test -i "$INVENTORY_FILE" -m ping; then
    print_success "Ansible can connect to Ubuntu laptop"
else
    print_error "Ansible connectivity test failed"
    exit 1
fi

# Run syntax check
print_status "Running playbook syntax check..."
if ansible-playbook playbooks/deploy.yml -i "$INVENTORY_FILE" --syntax-check; then
    print_success "Playbook syntax is valid"
else
    print_error "Playbook syntax check failed"
    exit 1
fi

# Confirm deployment
print_warning "Ready to deploy Tac-Med to Ubuntu laptop at $UBUNTU_IP"
read -p "Continue with deployment? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_status "Deployment cancelled"
    exit 0
fi

# Run deployment
print_status "Starting deployment..."
if ansible-playbook playbooks/deploy.yml -i "$INVENTORY_FILE" --limit local_test; then
    print_success "Deployment completed successfully! 🚀"
    echo ""
    print_status "Access your application:"
    echo "  Frontend: http://$UBUNTU_IP/"
    echo "  API: http://$UBUNTU_IP/api"
    echo "  Health: http://$UBUNTU_IP/health"
    echo ""
    print_status "SSH to Ubuntu laptop and check status:"
    echo "  ssh $USERNAME@$UBUNTU_IP"
    echo "  sudo su - tacmed"
    echo "  pm2 status"
    echo ""
else
    print_error "Deployment failed!"
    print_status "Check the logs and try again"
    exit 1
fi

print_success "Local deployment completed! 🎉"