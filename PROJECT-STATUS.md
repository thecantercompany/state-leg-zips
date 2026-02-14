# District ZIP Lookup — Project Status

**Last Updated:** February 14, 2026

## Current Status

**Phase:** Deployed — Live with Known Bugs

Site is live at statelegzips.com. Core functionality working but has known bugs that need fixing.

### What's Working
- Data pipeline processes Census files (51 states, 1,950 senate districts, 4,833 house districts, 33,642 ZCTAs)
- Homepage displays 50 state pills
- District view shows House/Senate districts as clickable pills
- Click-to-copy copies ZIPs in CSV format to clipboard
- Request Update form sends email via SendGrid
- Nebraska handled as unicameral (Legislature only)
- Deployed on Railway with custom domain

## To-Do List

- [ ] Fix known bugs (see below)
- [ ] Verify all 50 states + DC work correctly in production
- [x] Add Google Analytics (GA4) with custom event tracking for state clicks, district clicks, and ZIP copies

## Known Bugs

_Bugs to be documented as they are identified and triaged._
