terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.94.1"
    }
  }
  required_version = ">= 1.11.3"

  backend "s3" {
    bucket         = "tac-med-terraform-state"
    key            = "terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}

provider "aws" {
  region     = var.AWS_REGION

  default_tags {
    tags = {
      Environment = var.environment
      App         = var.app_name
      CostCenter  = var.app_name
    }
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = var.environment
      App         = var.app_name
      CostCenter  = "ap"
    }
  }
}