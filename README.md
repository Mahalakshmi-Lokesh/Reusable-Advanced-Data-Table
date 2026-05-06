
# Reusable LWC Data Table Component

## Overview
A **generic, reusable Lightning Web Component (LWC)** for displaying Salesforce data with advanced features like search, filtering, pagination, and inline editing.  
Supports both **standard and custom objects**.

## Features
- Dynamic object & field configuration  
- Global search + column filtering  
- Server-side sorting & pagination  
- Inline editing (LDS)  
- Custom row actions  
- CSV export (Apex + JS)  
- Slots for header & footer  
- Loading, error & no-data states  

## Prerequisites
- Salesforce CLI 
- VS Code with Salesforce Extensions
- Dev Hub enabled

## Setup Instructions

### 1) Clone Repository:
git clone https://github.com/Mahalakshmi-Lokesh/Reusable-Advanced-Data-Table.git

cd reusable-lwc-datatable

### 2️) Create Scratch Org:
sf org create scratch -f config/project-scratch-def.json -a demoOrg -d 30

### 3) Set Default Org:
sf config set target-org demoOrg

### 4) Deploy Code:
sf project deploy start

### 5) Open Org
sf org open

## Functional Capabilities

### Global Search
Search across records dynamically.
### Column Filtering
Filter specific fields like:
- Name
- Industry 
### Sorting
Click column headers to sort (server-side).
### Pagination
- Server-side pagination using OFFSET 
- Page navigation supported 
### Inline Editing
- Edit records directly in table 
- Uses Lightning Data Service (updateRecord) 
### Row Actions
Custom actions like:
- View 
- Delete 
Defined in parent component.

## CSV Export
Click Export CSV to download data.
- Generated using Apex
- Download triggered via JavaScript

## Test Data
If no records are visible:
- Create sample Account records manually OR
- Enable sample data in scratch org:
  
"hasSampleData": true

## Demo
https://www.awesomescreenshot.com/video/52225700?key=ffa56bac708580c57d0377a47aa16263

## GitHub Repository
https://github.com/Mahalakshmi-Lokesh/Reusable-Advanced-Data-Table.git
