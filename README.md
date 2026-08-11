# OSMS Website — Free-Stack Build (V2, No GHL)

This replaces the original GoHighLevel-dependent build. Everything below is a
genuinely free tool with published, checkable limits — no trial that quietly
converts to a bill.

## What changed from V1
- Both forms (Employer Job Order, Candidate Talent Network) now submit to
  **Web3Forms** instead of GoHighLevel. Submissions email straight to
  billwilson@osmsrecruiting.com — no backend server, no monthly fee.
- `data-ghl-form` attributes were renamed to `data-form-id` (cosmetic only).
- Nothing else about the design, copy, or branding changed.

## Ongoing cost: $0/month
The only real-world cost in this stack is renewing the osmsrecruiting.com
domain (~$12–15/yr), which you already own — that's not a new expense.

---

## STEP 1 — Get a Web3Forms access key (2 minutes, no account needed)
1. Go to https://web3forms.com/
2. Enter billwilson@osmsrecruiting.com and click "Create Access Key."
3. Copy the key emailed to that inbox.
4. Open `index.html`, find the **two** lines that say:
   `value="PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE"`
   and paste the same key into both.
5. Free tier: 250 submissions/month, shared across both forms. That's a lot
   of headroom for a site just launching — revisit only if volume grows.

## STEP 2 — Publish with GitHub Pages (free hosting + free HTTPS)
1. Create a free GitHub account (if you don't already have one) at
   https://github.com/signup
2. Create a new repository, e.g. `osms-website`, and upload all files in
   this folder (`index.html`, `styles.css`, `script.js`, `assets/`).
3. In the repo, go to Settings → Pages → set the source branch to `main`
   and folder to `/ (root)`. GitHub will give you a live
   `https://<username>.github.io/osms-website/` URL within a minute or two.
4. To use osmsrecruiting.com instead of the github.io URL:
   - In the repo's Pages settings, enter `osmsrecruiting.com` as the custom
     domain. GitHub creates the `CNAME` file for you automatically.
   - At your domain registrar, point DNS at GitHub Pages (an A record set
     to GitHub's IPs, or a CNAME if using a `www` subdomain — GitHub shows
     the exact records to add once you enter the domain).
   - Check "Enforce HTTPS" once the DNS change propagates (can take a few
     hours).

## STEP 3 — Set up Zoho CRM Free (the "workflow" piece)
1. Sign up free at https://www.zoho.com/crm/ (no credit card required).
2. Free plan gives you: 3 users, unlimited Leads/Contacts/Deals, 1 Deals
   pipeline, 1 automation rule.
3. Recommended structure (fits the free limits without losing either
   flow from the original plan):
   - **Employer Job Orders → Deals module**, using your one free pipeline
     with these stages: Job Order Received → Benefits Received →
     Agreement Signed → Search Initiation Fee Paid → Active Search →
     Candidate Presented → Interview → Placement → Placement Fee →
     60-Day Protection Active.
   - **Candidates → Leads module**, tracked via the standard Lead Status
     field (not pipeline-limited in Zoho): New → Resume Received →
     Phone Screen → Qualified → Presented to Employer → Interview →
     Offer/Placed → Not a Fit.
   - *This Leads/Deals split is a standard Zoho pattern, not something I
     ran hands-on in your account — confirm the Lead Status field is
     freely editable when you're in Setup, since UI details can shift.*
4. Spend your one free automation rule where Web3Forms's plain email
   notification doesn't already help — e.g., a task reminder if a Deal
   sits in "Job Order Received" for more than 2 business days.

## STEP 4 — Connect the website forms to Zoho (Zapier free)
1. Sign up free at https://zapier.com/ (100 tasks/month, unlimited
   single-trigger-single-action Zaps).
2. Zap 1: Trigger = "New Form Submission" (Web3Forms) on the Employer form
   → Action = "Create Deal" in Zoho CRM.
3. Zap 2: Trigger = "New Form Submission" (Web3Forms) on the Candidate form
   → Action = "Create Lead" in Zoho CRM.
4. Map the form fields to the matching Zoho fields during setup.

## STEP 5 — Content still outstanding
- Bill's photo still needs to replace the placeholder in the "Meet Bill"
  section (`#bill .bill-photo-placeholder` in index.html / styles.css).

## If OSMS outgrows this later
The signal to pay for something (Zoho's next tier, or GoHighLevel) is
running out of runway on these specific numbers — not before:
- More than ~250 form submissions/month (Web3Forms cap)
- Needing more than 1 Deals pipeline or more than 1 automation rule (Zoho)
- Needing more than 100 Zapier tasks/month
