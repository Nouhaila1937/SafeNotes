
variable "resource_group_name" {
  description = "Nom du groupe de ressources Azure"
  type        = string
}

variable "location" {
  description = "Région Azure où déployer les ressources"
  type        = string
  
}

variable "client_id" {
  description = "Azure Service Principal Client ID"
  type        = string
  sensitive   = true
}

variable "client_secret" {
  description = "Azure Service Principal Client Secret"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure Tenant ID"
  type        = string
}

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}