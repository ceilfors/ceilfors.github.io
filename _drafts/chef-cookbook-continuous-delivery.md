---
layout: post
title:  "Chef Cookbook Continuous Delivery"
tags: chef
comments: true
---

# Our Setup

- Chef Server
- Own managed CI server
- Chef Server used as the source of truth for role, environment and nodes

# Build

- Berkshelf to manage cookbooks
- Kitchen test
  - Split VMs to speed up build
- vagrant-cachier
- Foodcritic
- Cookstyle
- Rake
- Chef server upload

# Release Candidate

- Build tag
- Freeze version
- Bump version on every build

# Promotion

- Environment cookbook
- Download Berksfile.lock
- berks apply

# Deployment pipeline

- Every application build
- Every cookbook build
- Every promotion
