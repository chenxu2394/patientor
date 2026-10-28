using './main.bicep'

var config = loadJsonContent('deployment.config.json')

param location = config.location
param namePrefix = config.namePrefix
param webAppName = config.webAppName
param appServicePlanSku = config.appServicePlanSku
// GitHub Actions overrides this fallback with the SHA image built by each run.
param containerImage = '${config.containerImageRepository}:${config.initialContainerImageTag}'
