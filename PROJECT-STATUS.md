# State Leg ZIPs — Project Status

**Last Updated:** February 14, 2026

## Current Status

**Phase:** Deployed — Live

Site is fully deployed and live at statelegzips.com. All core functionality working.

### What's Working
- Data pipeline processes Census files (51 states, 1,950 senate districts, 4,833 house districts, 33,642 ZCTAs)
- Homepage displays 50 state pills
- District view shows House/Senate districts as clickable pills
- Click-to-copy copies ZIPs in CSV format to clipboard
- Request Update form sends email via SendGrid
- Nebraska handled as unicameral (Legislature only)
- Deployed on Railway with custom domain
- Google Analytics (GA4) with custom event tracking for state clicks, district clicks, and ZIP copies

## Completed
- [x] Data pipeline and build script
- [x] Full UI with state and district navigation
- [x] Click-to-copy ZIP codes in CSV format
- [x] Request Update email via SendGrid
- [x] Railway deployment with custom domain
- [x] Google Analytics (GA4) integration
- [x] All 50 states + DC verified
