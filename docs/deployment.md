# Azure deployment

Patientor runs as a public GHCR container on Azure Linux App Service. Bicep
defines the Azure resources, and GitHub Actions uses OpenID Connect (OIDC) to
authenticate to Azure without a publish profile or client secret.

## Architecture

- GitHub Actions checks the application and builds the Docker image.
- Each image is published as `ghcr.io/chenxu2394/patientor:<commit-sha>`.
- Bicep provisions an F1 Linux App Service plan and the `patientor-v1` web app.
- App Service pulls the public image anonymously from GHCR.
- GitHub Actions receives a short-lived Azure token through OIDC for each
  deployment.

## Prerequisites

- An Azure subscription with permission to create resource groups, managed
  identities, role assignments, App Service plans, and web apps.
- A GitHub repository with Actions enabled.
- Azure CLI with Bicep support.
- GitHub CLI.
- Node.js 24.
- Docker, only for optional local container builds.

## 1. Review the deployment configuration

Reusable values are stored in `infra/deployment.config.json`:

```json
{
  "location": "westeurope",
  "bootstrapLocation": "westeurope",
  "namePrefix": "patientor-v1",
  "webAppName": "patientor-v1",
  "appServicePlanSku": "F1",
  "containerImageRepository": "ghcr.io/chenxu2394/patientor",
  "initialContainerImageTag": "latest"
}
```

`webAppName` must be globally unique because it determines the
`azurewebsites.net` hostname. The F1 plan is intended for learning and light
demonstration workloads. The configured image tag is a valid fallback for
manual use; the workflow publishes both tags and always deploys the immutable
commit SHA built by the current run.

## 2. Configure the GHCR package

The deployment uses a public package so App Service can pull it without registry
credentials.

1. Open the `patientor` package on the GitHub profile.
2. Open **Package settings**.
3. Confirm the package visibility is **Public**.
4. Under **Manage Actions access**, ensure this repository has the **Write**
   role.

The workflow explicitly requests `packages: write` and authenticates to GHCR
with its repository-scoped `GITHUB_TOKEN`. No personal access token is stored in
the repository.

## 3. Bootstrap GitHub OIDC access to Azure

Authenticate with both command-line tools and select the target Azure
subscription:

```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID_OR_NAME"
gh auth login
```

Confirm the selected subscription before creating resources:

```bash
az account show \
  --query '{subscription:name, subscriptionId:id, tenantId:tenantId}' \
  --output table
```

Run the one-time bootstrap:

```bash
./scripts/bootstrap-azure.sh
```

The script discovers the GitHub owner, repository, and default branch from the
configured remote. With the default configuration, it creates:

- `patientor-v1-bootstrap-rg`, containing the GitHub deployment identity.
- `patientor-v1-rg`, containing the application resources.
- A federated credential restricted to this repository and its deployment
  branch.
- A Contributor assignment scoped to the application resource group.
- The GitHub secrets and variables consumed by the deployment workflow.

The GitHub secrets contain Azure identifiers, not a reusable client secret.

## 4. Deploy

Start the first deployment manually:

```bash
gh workflow run deploy-azure.yml
gh run watch
```

The workflow:

1. Installs dependencies and checks both TypeScript projects.
2. Builds and publishes the commit-SHA container image.
3. Authenticates to Azure using GitHub OIDC.
4. Previews the Bicep changes with `what-if`.
5. Deploys the F1 App Service plan and configures the web app to pull the exact
   image built by the run.

Later pushes to `main` deploy automatically when application, container,
workflow, or infrastructure files change.

## 5. Verify

Check the backend health endpoint:

```bash
curl --fail --show-error https://patientor-v1.azurewebsites.net/api/ping
```

The expected response is `pong`. The web application is available at:

```text
https://patientor-v1.azurewebsites.net
```

## Operational notes

- F1 provides shared compute, has no SLA, and may unload an idle application.
- The application stores added patients and entries in process memory. Changes
  are reset whenever App Service restarts or a new deployment occurs.
- Commit-SHA image tags are immutable deployment identifiers, making the image
  used by each release explicit and auditable.
