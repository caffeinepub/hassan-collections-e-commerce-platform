# Custom Domain Setup Guide for HASSANé Collections

This guide documents the complete process for configuring the custom domain `shophassane.com` for the HASSANé Collections e-commerce platform on the Internet Computer.

## Overview

The application is configured to work with both:
- **Apex domain**: `https://shophassane.com`
- **WWW subdomain**: `https://www.shophassane.com`

Both domains will provide the same user experience with consistent Internet Identity authentication.

## Prerequisites

- Access to your domain registrar's DNS management panel
- Deployed canister on the Internet Computer
- Canister ID (format: `xxxxx-xxxxx-xxxxx-xxxxx-cai`)

## Step 1: DNS Configuration

Configure the following DNS records at your domain registrar:

### For Apex Domain (shophassane.com)

| Type  | Name              | Content                                          | TTL  |
|-------|-------------------|--------------------------------------------------|------|
| CNAME | @                 | icp1.io                                          | Auto |
| CNAME | _acme-challenge   | _acme-challenge.shophassane.com.icp2.io         | Auto |
| TXT   | _canister-id      | YOUR_CANISTER_ID                                 | Auto |

### For WWW Subdomain (www.shophassane.com)

| Type  | Name                    | Content                                          | TTL  |
|-------|-------------------------|--------------------------------------------------|------|
| CNAME | www                     | icp1.io                                          | Auto |
| CNAME | _acme-challenge.www     | _acme-challenge.www.shophassane.com.icp2.io     | Auto |
| TXT   | _canister-id.www        | YOUR_CANISTER_ID                                 | Auto |

**Important Notes:**
- Replace `YOUR_CANISTER_ID` with your actual canister ID
- Some DNS providers may require `@` to be replaced with the domain name itself
- DNS propagation can take up to 48 hours, but typically completes within a few hours

## Step 2: Internet Identity Configuration

The application includes the following files for Internet Identity authentication across custom domains:

### `.well-known/ii-alternative-origins`
This file lists all valid origins for Internet Identity authentication:
