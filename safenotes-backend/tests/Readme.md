this file to run a new action
est ce que ce workflow 
name: Build and deploy Node.js app to Azure Web App - colti-app-production

on:

  push:

    branches:

      - Nouhaila-lahsaoui-patch-1

  workflow_dispatch:

jobs:

  build-and-deploy:

    runs-on: ubuntu-latest

    environment: "${{ github.ref_name }}"

    steps:

      - name: Checkout code

        uses: actions/checkout@v4

      - name: Set up Node.js

        uses: actions/setup-node@v3

        with:

          node-version: '18.x'

      - name: Install dependencies and build

        working-directory: container_images/culti-bayer-backend

        run: |

          npm install

          npm run build --if-present

      - name: Zip app for deployment

        run: zip -r release.zip container_images/culti-bayer-backend

      - name: Azure Login

        uses: azure/login@v1

        with:

          client-id: ${{ secrets.AZURE_CLIENT_ID }}

          tenant-id: ${{ secrets.AZURE_TENANT_ID }}

          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy to Azure Web App

        uses: azure/webapps-deploy@v3

        with:

          app-name: 'colti-bayer-app-production'

          package: release.zip

qui est responsable de voir :( Application Error

If you are the application administrator, you can access the diagnostic resources.