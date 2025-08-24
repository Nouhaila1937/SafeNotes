# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85"  # Version plus récente et stable
    }
  }
  required_version = ">= 1.0"  # Version Terraform plus récente
}

provider "azurerm" {
  features {}
  
  # Ces variables sont automatiquement lues depuis les env vars ARM_*
  # ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_SUBSCRIPTION_ID, ARM_TENANT_ID
}