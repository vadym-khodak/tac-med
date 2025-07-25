#!/bin/bash

# Setup script for Ubuntu laptop (target machine)
# Run this script ON the Ubuntu laptop

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

echo "🔧 Setting up Ubuntu laptop for Ansible deployment"
echo ""

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install SSH server
print_status "Installing OpenSSH server..."
sudo apt install -y openssh-server

# Start and enable SSH
print_status "Starting SSH service..."
sudo systemctl start ssh
sudo systemctl enable ssh

# Install Python (required for Ansible)
print_status "Installing Python3..."
sudo apt install -y python3 python3-pip

# Create deployment user
read -p "Create a deployment user? (recommended) [y/N]: " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter username for deployment [deploy]: " USERNAME
    USERNAME=${USERNAME:-deploy}
    
    if id "$USERNAME" &>/dev/null; then
        print_warning "User $USERNAME already exists"
    else
        print_status "Creating user $USERNAME..."
        sudo adduser --gecos "" "$USERNAME"
        sudo usermod -aG sudo "$USERNAME"
        
        # Enable passwordless sudo
        echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" | sudo tee "/etc/sudoers.d/$USERNAME"
        
        print_success "User $USERNAME created with sudo privileges"
    fi
fi

# Get IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')
print_success "Ubuntu laptop setup completed!"
echo ""
print_status "Network Information:"
echo "  IP Address: $IP_ADDRESS"
echo "  SSH Status: $(systemctl is-active ssh)"
echo ""
print_status "Next steps on your Mac:"
echo "  1. Copy SSH key: ssh-copy-id $USERNAME@$IP_ADDRESS"
echo "  2. Test connection: ssh $USERNAME@$IP_ADDRESS"
echo "  3. Run deployment: cd ansible && ./deploy-local.sh $IP_ADDRESS $USERNAME"
echo ""
print_warning "Make sure both laptops are on the same WiFi network!"