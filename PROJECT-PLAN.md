# State Leg ZIPs — Project Plan

## Overview

A web tool at **statelegzips.com** that lets users copy ZIP codes by state legislative district. Primary use case: ad targeting on platforms like StackAdapt, Meta, and Google Ads.

## Architecture

- **Next.js 16** (App Router) deployed on **Railway**
- Pre-built data from US Census Bureau relationship files (no runtime API dependencies)
- **SendGrid** for "Request Update" email notifications
- Domain: `statelegzips.com`

## Data Source

US Census Bureau ZCTA-to-SLD relationship files:
- SLDL (House): `tab20_sldl202420_zcta520_natl.txt`
- SLDU (Senate): `tab20_sldu202420_zcta520_natl.txt`

A build script (`scripts/build-data.ts`) downloads, parses, and outputs `public/data/districts.json`.

## Key Decisions

- **Include ZIPs in ALL overlapping districts** (better for ad targeting reach)
- **CSV format for clipboard** (comma-separated, no spaces)
- **Per-state last-updated dates** tracked manually in `public/data/state-updates.json`
- **No visible ZIP codes** — click a district pill and ZIPs are silently copied to clipboard

## User Flow

1. Homepage shows 50 state pills in a grid
2. Click a state → two-column view: House districts (left), Senate districts (right)
3. Click a district pill → ZIP codes copied to clipboard instantly
4. Toast notification confirms "Copied! (N ZIPs)"
5. "Request Update" button per state sends email via SendGrid

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS 4, Geist font
- SendGrid (`@sendgrid/mail`) for email
- Railway for deployment

## Environment Variables (Railway)

- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `UPDATE_REQUEST_EMAIL`

## Data Refresh Process

1. Run `npm run build:data` (downloads latest Census files)
2. Update dates in `public/data/state-updates.json`
3. Commit and push (Railway auto-deploys)
