# Bookstore Application - Defect Log

## 📊 Overview
**Project:** React Bookstore E-commerce Platform  
**Maintainer:** Trio Testers Team  
**Last Updated:** $(18/11/2025)

## 🎯 Purpose
Track and manage all defects found during testing with complete resolution history.

## 🔧 Defect Status Definitions
- **New** - Recently reported, not yet reviewed
- **Open** - Confirmed and assigned for fix
- **In Progress** - Currently being worked on
- **Fixed** - Resolution implemented
- **Verified** - Fix confirmed by testing
- **Closed** - Defect completely resolved
- **Reopened** - Issue recurred after fix
- **Won't Fix** - Decision made not to address

## 🐛 Active Defects

### Critical Severity (P0)

#### DEFECT-001
**Title:** Application Crash on Invalid Login Attempt
**Status:** Fixed ✅
**Severity:** P0 - Critical
**Priority:** High
**Environment:** All browsers
**Reported Date:** $(11/11/2025)
**Assigned To:** Trio Testers Team

**Description:**
Application crashes with white screen when submitting login form with malformed email.

**Steps to Reproduce:**
1. Navigate to /login
2. Enter "invalid-email" in email field
3. Enter any password
4. Click Login button
5. Observe application crash

**Expected Behavior:**
Show validation error message and remain on login page.

**Actual Behavior:**
White screen, console shows unhandled exception.

**Root Cause:**
Missing email format validation in AuthContext.

**Resolution:**
Added comprehensive input validation in AuthContext.js

**Test Evidence:**
- Unit test: `AuthContext.test.js` - invalid login scenario
- Cypress test: `user-authentication.cy.js` - error handling

### High Severity (P1)

#### DEFECT-002
**Title:** Shopping Cart Total Calculation Incorrect
**Status:** Open 🔄
**Severity:** P1 - High
**Priority:** High
**Environment:** Chrome, Firefox
**Reported Date:** $(16/11/2025)
**Assigned To:** Frontend Team

**Description:**
Cart total shows incorrect amount when multiple items with different quantities are added.

**Steps to Reproduce:**
1. Add Book A ($10) to cart
2. Add Book B ($15) to cart
3. Update Book A quantity to 3
4. Observe total calculation

**Expected Behavior:**
Total should be (3 * $10) + $15 = $45

**Actual Behavior:**
Total shows $35 (incorrect calculation)

**Impact:**
Financial discrepancy affecting user trust.

### Medium Severity (P2)

#### DEFECT-003
**Title:** Mobile Menu Overlaps Page Content
**Status:** In Progress 🛠️
**Severity:** P2 - Medium
**Priority:** Medium
**Environment:** Mobile browsers
**Reported Date:** $(15/11/2025)
**Assigned To:** UI/UX Team

**Description:**
Mobile navigation menu doesn't push page content down, causing overlap.

## ✅ Resolved Defects

### DEFECT-001 - Application Crash on Invalid Login
**Resolution Date:** $(17/11/2025)
**Fix Version:** 1.1.0
**Verified By:** Testing Team
**Close Date:** $(18/11/2025)

### DEFECT-004 - Register Form Submit Button Disabled State
**Resolution Date:** $(18/11/2025)
**Fix Version:** 1.1.0
**Verified By:** Trio Testers Team Lead
**Close Date:** $(18/11/2025)

## 📈 Defect Metrics

### Current Sprint
- **Total Defects:** 8
- **Open Defects:** 2
- **Critical Defects:** 0
- **Defect Resolution Rate:** 85%

### Historical Trends
| Sprint | Reported | Resolved | Carry Over | Resolution Rate |
|--------|----------|----------|------------|-----------------|
| Sprint 1 | 15 | 12 | 3 | 80% |
| Sprint 2 | 10 | 9 | 1 | 90% |
| Current | 8 | 6 | 2 | 85% |

## 🔄 Defect Triage Process

### Weekly Triage Meeting
- **When:** Every Monday 10:00 AM
- **Attendees:** Test Lead, Dev Lead, Product Owner
- **Agenda:**
  1. Review new defects
  2. Assign severity and priority
  3. Assign to development teams
  4. Review aging defects

### Severity-Priority Matrix

 | Urgent | High | Medium | Low
Critical | P0 | P0 | P0 | P1
High | P0 | P1 | P1 | P2
Medium | P1 | P2 | P2 | P3
Low | P2 | P3 | P3 | P3

This defect log is updated daily during active development cycles