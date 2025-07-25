variable "S3_TERRAFORM_STATE_BUCKET" {
  type = string
  description = "The name of the S3 bucket for Terraform state"
  default = "tac-med-terraform-state"
}

variable "DYNAMODB_TERRAFORM_LOCKS_TABLE" {
  type = string
  description = "The name of the DynamoDB table for Terraform locks"
  default = "terraform-lock"
}

variable "AWS_REGION" {
  type    = string
  default = "eu-central-1"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g., dev, staging, prod)"
  default     = "production"
}

variable "app_name" {
  type        = string
  description = "Application name"
  default     = "tac-med"
}

variable "S3_ORIGIN_ID" {
  type = string
  description = "The ID for the S3 origin"
  default = "tac-med-static-assets"
}

variable "DEPLOYMENT_BUCKET_NAME" {
  description = "Name of the S3 bucket for storing serverless deployments"
  type        = string
  default     = "tac-med-production-deployments"
}


variable "ROOT_DOMAIN_NAME" {
  type = string
  description = "The root domain name"
  default = "tac-med.vadymkhodak.com"
}

variable "APP_DOMAIN_NAME" {
  type = string
  description = "The domain name for the web application"
  default = "app.tac-med.vadymkhodak.com"
}

variable "API_DOMAIN_NAME" {
  description = "Domain name for the API Gateway"
  type        = string
  default     = "api.tac-med.vadymkhodak.com"
}
