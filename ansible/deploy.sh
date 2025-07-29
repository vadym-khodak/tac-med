#!/bin/bash

# TAC-MED Deployment Script
# This script runs the Ansible playbooks to deploy the application

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TAC-MED Deployment Script ===${NC}"
echo ""

# Check if Ansible is installed
if ! command -v ansible &> /dev/null; then
    echo -e "${RED}Error: Ansible is not installed${NC}"
    echo "Please install Ansible first: sudo apt-get install ansible"
    exit 1
fi

# Default values
INVENTORY="hosts.yml"
TARGET_HOST=""
SSH_KEY=""
SKIP_PREPARE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            TARGET_HOST="$2"
            shift 2
            ;;
        -k|--key)
            SSH_KEY="$2"
            shift 2
            ;;
        -i|--inventory)
            INVENTORY="$2"
            shift 2
            ;;
        --skip-prepare)
            SKIP_PREPARE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -h, --host <IP>      Target host IP address"
            echo "  -k, --key <PATH>     Path to SSH private key"
            echo "  -i, --inventory <FILE> Inventory file (default: hosts.yml)"
            echo "  --skip-prepare       Skip running prepare-ubuntu.sh on target"
            echo "  --help               Show this help message"
            echo ""
            echo "Example:"
            echo "  $0 --host 192.168.1.100 --key ~/.ssh/id_rsa"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Check if inventory file exists
if [ ! -f "$INVENTORY" ]; then
    echo -e "${RED}Error: Inventory file not found: $INVENTORY${NC}"
    exit 1
fi

# Update inventory with target host if provided
if [ -n "$TARGET_HOST" ]; then
    echo -e "${YELLOW}Updating inventory with target host: $TARGET_HOST${NC}"
    
    # Create temporary inventory file
    if [[ "$INVENTORY" == *.yml || "$INVENTORY" == *.yaml ]]; then
        # Update YAML inventory
        sed -i.bak "s/ansible_host: .*/ansible_host: $TARGET_HOST/" "$INVENTORY"
    else
        # Update INI inventory
        sed -i.bak "s/ansible_host=.*/ansible_host=$TARGET_HOST/" "$INVENTORY"
    fi
fi

# Update SSH key if provided
if [ -n "$SSH_KEY" ]; then
    echo -e "${YELLOW}Using SSH key: $SSH_KEY${NC}"
    export ANSIBLE_PRIVATE_KEY_FILE="$SSH_KEY"
fi

# Test connection to target host
echo -e "${YELLOW}Testing connection to target host...${NC}"
if ! ansible all -i "$INVENTORY" -m ping; then
    echo -e "${RED}Error: Cannot connect to target host${NC}"
    echo "Please check:"
    echo "1. The target host IP is correct"
    echo "2. SSH key is properly configured"
    echo "3. The target host is accessible"
    exit 1
fi

# Run prepare script on target if not skipped
if [ "$SKIP_PREPARE" = false ]; then
    echo -e "${YELLOW}Running preparation script on target host...${NC}"
    ansible all -i "$INVENTORY" -m script -a "prepare-ubuntu.sh" --become
fi

# Run the main deployment playbook
echo -e "${GREEN}Starting TAC-MED deployment...${NC}"
ansible-playbook -i "$INVENTORY" deploy.yml

# Check deployment status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}"
    echo "======================================"
    echo "TAC-MED deployment completed successfully!"
    echo "======================================"
    echo -e "${NC}"
    
    # Get the actual host IP from inventory
    if [ -z "$TARGET_HOST" ]; then
        TARGET_HOST=$(ansible-inventory -i "$INVENTORY" --list | grep -oP '"ansible_host": "\K[^"]+' | head -1)
    fi
    
    echo "Application URLs:"
    echo "- Frontend: http://$TARGET_HOST:4200"
    echo "- Backend API: http://$TARGET_HOST:3000"
    echo ""
    echo "To manage the application, SSH to the target host and use:"
    echo "- pm2 status     # View running processes"
    echo "- pm2 logs       # View application logs"
    echo "- pm2 restart all # Restart all services"
else
    echo -e "${RED}"
    echo "======================================"
    echo "Deployment failed!"
    echo "======================================"
    echo -e "${NC}"
    echo "Please check the error messages above and try again."
    exit 1
fi