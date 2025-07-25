#!/bin/bash

# Tac-Med Deployment Script
# Usage: ./deploy.sh <environment> [branch]

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=""
BRANCH="main"
PLAYBOOK="playbooks/deploy.yml"
ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored output
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

# Function to show usage
show_usage() {
    echo "Usage: $0 <environment> [branch]"
    echo ""
    echo "Environments:"
    echo "  development - Deploy to development server"
    echo "  staging     - Deploy to staging server"
    echo "  production  - Deploy to production server"
    echo ""
    echo "Examples:"
    echo "  $0 development"
    echo "  $0 staging feature/new-feature"
    echo "  $0 production"
    echo ""
    exit 1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if ansible is installed
    if ! command -v ansible-playbook &> /dev/null; then
        print_error "Ansible is not installed. Please install Ansible first."
        exit 1
    fi
    
    # Check if we're in the ansible directory
    if [ ! -f "ansible.cfg" ] || [ ! -f "$PLAYBOOK" ]; then
        print_error "Please run this script from the ansible directory."
        exit 1
    fi
    
    # Check if inventory file exists
    if [ ! -f "inventories/hosts.yml" ]; then
        print_error "Inventory file not found: inventories/hosts.yml"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to validate environment
validate_environment() {
    case $ENVIRONMENT in
        development|staging|production)
            print_status "Deploying to $ENVIRONMENT environment"
            ;;
        *)
            print_error "Invalid environment: $ENVIRONMENT"
            show_usage
            ;;
    esac
}

# Function to confirm production deployment
confirm_production() {
    if [ "$ENVIRONMENT" = "production" ]; then
        print_warning "You are about to deploy to PRODUCTION!"
        read -p "Are you sure you want to continue? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            print_status "Deployment cancelled"
            exit 0
        fi
    fi
}

# Function to run ansible syntax check
syntax_check() {
    print_status "Running syntax check..."
    if ansible-playbook "$PLAYBOOK" --syntax-check; then
        print_success "Syntax check passed"
    else
        print_error "Syntax check failed"
        exit 1
    fi
}

# Function to test connectivity
test_connectivity() {
    print_status "Testing connectivity to $ENVIRONMENT servers..."
    if ansible "$ENVIRONMENT" -m ping; then
        print_success "Connectivity test passed"
    else
        print_error "Cannot connect to $ENVIRONMENT servers"
        exit 1
    fi
}

# Function to run deployment
run_deployment() {
    print_status "Starting deployment to $ENVIRONMENT..."
    print_status "Branch: $BRANCH"
    
    local extra_vars=""
    if [ "$BRANCH" != "main" ]; then
        extra_vars="--extra-vars git_branch=$BRANCH"
    fi
    
    if ansible-playbook "$PLAYBOOK" --limit "$ENVIRONMENT" $extra_vars; then
        print_success "Deployment completed successfully!"
        print_status "Application should be available at the configured domain"
        
        # Show post-deployment information
        echo ""
        echo "Post-deployment checklist:"
        echo "1. Check application health: curl http://YOUR_DOMAIN/health"
        echo "2. Verify frontend: curl http://YOUR_DOMAIN/"
        echo "3. Check PM2 status: ssh user@server 'sudo su - tacmed -c \"pm2 status\"'"
        echo "4. Monitor logs: ssh user@server 'tail -f /opt/tac-med/logs/combined.log'"
    else
        print_error "Deployment failed!"
        exit 1
    fi
}

# Main script execution
main() {
    cd "$ANSIBLE_DIR"
    
    # Parse arguments
    if [ $# -lt 1 ]; then
        show_usage
    fi
    
    ENVIRONMENT=$1
    if [ $# -gt 1 ]; then
        BRANCH=$2
    fi
    
    # Execute deployment steps
    print_status "Starting Tac-Med deployment script"
    print_status "Environment: $ENVIRONMENT"
    print_status "Branch: $BRANCH"
    echo ""
    
    validate_environment
    check_prerequisites
    confirm_production
    syntax_check
    test_connectivity
    run_deployment
    
    print_success "All done! 🚀"
}

# Run main function with all arguments
main "$@"