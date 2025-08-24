output "resource_group_name" {
  description = "Nom du Resource Group créé"
  value       = azurerm_resource_group.rg.name
}

output "app_service_name" {
  description = "Nom de l'App Service"
  value       = azurerm_linux_web_app.app_service.name
}

output "app_service_url" {
  description = "URL de l'application déployée"
  value       = azurerm_linux_web_app.app_service.default_hostname
}
