#!/bin/bash

# Build the application
npm run build

# Generate Prisma client
npm run prisma:generate

# Create a deployment package
zip -r deploy.zip . -x "node_modules/*" ".git/*" ".next/*"

# Deploy to Elastic Beanstalk
eb deploy production-environment

# Configure custom domain
eb config production-environment --cfg custom-domain

# Clean up
rm deploy.zip 