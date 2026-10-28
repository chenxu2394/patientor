targetScope = 'resourceGroup'

@description('Azure region for the App Service plan and web app.')
param location string

@description('Short prefix used in Azure resource names.')
@minLength(3)
@maxLength(40)
param namePrefix string

@description('Globally unique App Service name. This becomes the azurewebsites.net hostname.')
@minLength(2)
@maxLength(60)
param webAppName string

@description('Public container image, including its immutable tag.')
param containerImage string

@description('App Service plan SKU. F1 is free; B1 is a paid alternative with dedicated compute.')
@allowed([
  'F1'
  'B1'
])
param appServicePlanSku string = 'F1'

var appServicePlanName = '${namePrefix}-plan'
var isFreeTier = appServicePlanSku == 'F1'

resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSku
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2024-11-01' = {
  name: webAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      linuxFxVersion: 'DOCKER|${containerImage}'
      alwaysOn: !isFreeTier
      ftpsState: 'Disabled'
      http20Enabled: true
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'WEBSITES_PORT'
          value: '3001'
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
    }
  }
}

output webAppName string = webApp.name
output webAppHostname string = webApp.properties.defaultHostName
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output appServicePlanName string = appServicePlan.name
output containerImage string = containerImage
