
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}
resource "azurerm_service_plan" "app_plan" {
  name                = "myAppServicePlan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "F1" # Gratuit
}

# Create the web app, pass in the App Service Plan ID
resource "azurerm_linux_web_app" "app_service" {
  name                  = "webapp-Safenotes"
  location              = azurerm_resource_group.rg.location
  resource_group_name   = azurerm_resource_group.rg.name
  service_plan_id       = azurerm_service_plan.app_plan.id
  depends_on            = [azurerm_service_plan.app_plan]
  https_only            = true
  site_config { 
    # pour F1 il ne faut pas toujours etre on parceque c'est gratuit F1 
    always_on           = false
    minimum_tls_version = "1.2"
    application_stack {
      node_version = "16-lts"
    }
  }
}