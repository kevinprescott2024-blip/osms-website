const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click',()=>nav.classList.remove('open')));

/*
  FORM SUBMISSION — Web3Forms
  Each form posts to Web3Forms' API, which emails the submission straight to
  billwilson@osmsrecruiting.com. No backend server required.

  SETUP: get a free access key at https://web3forms.com/ and paste it into
  the hidden "access_key" input on both forms in index.html before publishing.

  Optional next step: connect a Zapier "New Web3Forms Submission" trigger to
  push each submission into a free Zoho CRM lead/deal (see README.md).
*/

/*
  ZOHO CRM SYNC — optional, silent, best-effort.
  Mirrors each submission into Zoho CRM as a Lead using Zoho's own native
  Web-to-Lead endpoint (Setup > Channels > Webforms). This runs in parallel
  with the Web3Forms submission above and never blocks or changes the
  user-facing status message — if Zoho is slow, unreachable, or rejects the
  data, the visitor still sees the normal Web3Forms confirmation, and email
  still arrives via Web3Forms regardless. See README.md for how this was
  built and why.

  FREE-TIER NOTE: Zoho's Free plan allows only 1 active webform per module.
  Both site forms below share that single Leads webform's tokens, so
  Employer Job Orders and Candidate Talent Network signups both land as
  Leads — tagged in the Description field (and by the Company field) so
  they're easy to tell apart and filter in Zoho. Qualified Employer leads
  should be converted to Deals manually in Zoho once they're ready to move
  into the pipeline built in Step 3 of README.md.
*/
const ZOHO_LEAD_ENDPOINT = 'https://crm.zoho.com/crm/WebToLeadForm';
const ZOHO_LEAD_TOKENS = {
    xnQsjsdp: '0dec7d013e9d4c711f1ff69c1e05eea82f55b3eb3f84d1933b61370bad8a0a87',
    zc_gad: '',
    xmIwtLD: 'a249880d56756d9a1e15e5972a098d87599bdbd86f153ecef3869f010f900752b4578b18684b4c3de0a106e69e0059fd',
    actionType: 'TGVhZHM=',
    returnURL: 'null',
    aG9uZXlwb3Q: '' // honeypot field Zoho expects on this form — must stay empty
};

function splitName(fullName) {
    const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return { first: '', last: parts[0] || '' };
    return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] };
}

function syncToZohoCRM(form) {
    try {
          const data = Object.fromEntries(new FormData(form).entries());
          const zfd = new FormData();
          Object.entries(ZOHO_LEAD_TOKENS).forEach(([key, value]) => zfd.append(key, value));

      let company, nameSource, description;
          if (form.id === 'employer-form') {
                  company = data.company_name || '';
                  nameSource = data.contact_name || '';
                  description = [
                            '[EMPLOYER JOB ORDER — Website]',
                            `Job Title: ${data.job_title || ''}`,
                            `Openings: ${data.openings || ''}`,
                            `Shift: ${data.shift || ''}`,
                            `Pay Range: ${data.pay_range || ''}`,
                            `Equipment/Machines: ${data.equipment || ''}`,
                            `Controls/Experience Required: ${data.controls_experience || ''}`,
                            `Job Description: ${data.job_description || ''}`
                          ].join('\n');
          } else if (form.id === 'candidate-form') {
                  company = 'Candidate — Talent Network';
                  nameSource = data.name || '';
                  description = [
                            '[CANDIDATE TALENT NETWORK — Website]',
                            `Location: ${data.city_state || ''}`,
                            `Primary Position: ${data.primary_position || ''}`,
                            `Years Experience: ${data.years_experience || ''}`,
                            `Machines: ${data.machines || ''}`,
                            `Controls: ${data.controls || ''}`,
                            `Desired Pay: ${data.desired_pay || ''}`,
                            `Preferred Shift: ${data.preferred_shift || ''}`,
                            `Employment Status: ${data.employment_status || ''}`,
                            `Travel Distance: ${data.travel_distance || ''}`
                          ].join('\n');
          } else {
                  return; // Unrecognized form — skip Zoho sync, Web3Forms still handles it.
          }

      const { first, last } = splitName(nameSource);
          zfd.append('Company', company);
          zfd.append('First Name', first);
          zfd.append('Last Name', last || company); // Zoho requires Last Name — safe fallback
      zfd.append('Email', data.email || '');
          zfd.append('Phone', data.phone || '');
          zfd.append('Description', description);

      // no-cors + fire-and-forget: we never read Zoho's response, so a failure
      // here is silently swallowed and has zero effect on the real submission.
      fetch(ZOHO_LEAD_ENDPOINT, { method: 'POST', mode: 'no-cors', body: zfd }).catch(() => {});
    } catch (err) {
          // Best-effort only — never let a Zoho sync error affect the site form.
    }
}

document.querySelectorAll('.osms-form').forEach(form => {
    form.addEventListener('submit', async e => {
          e.preventDefault();
          const status = form.querySelector('.form-status');
          const submitBtn = form.querySelector('button[type="submit"]');
          const goldColor = '#D4AF37';
          const redColor = '#E31937';
          const statusColor = form.classList.contains('dark-form') ? goldColor : redColor;

                              const accessKey = form.querySelector('input[name="access_key"]')?.value || '';
          if (!accessKey || accessKey.startsWith('PASTE_')) {
                  status.textContent = 'This form is not connected yet. Add your Web3Forms access key in index.html before publishing.';
                  status.style.color = redColor;
                  return;
          }

                              submitBtn.disabled = true;
          status.textContent = 'Sending…';
          status.style.color = '';

                              // Fire the Zoho CRM sync in parallel — it never awaits, never blocks,
                // and never affects the Web3Forms status message below.
                              syncToZohoCRM(form);

                              try {
                                      const formData = new FormData(form);
                                      const response = await fetch('https://api.web3forms.com/submit', {
                                                method: 'POST',
                                                headers: { Accept: 'application/json' },
                                                body: formData
                                      });
                                      const result = await response.json();

            if (result.success) {
                      status.textContent = 'Thank you — your information has been submitted. We will be in touch soon.';
                      status.style.color = statusColor;
                      form.reset();
            } else {
                      throw new Error(result.message || 'Submission failed');
            }
                              } catch (err) {
                                      status.textContent = 'Something went wrong sending this. Please call (281) 969-6555 or email billwilson@osmsrecruiting.com directly.';
                                      status.style.color = redColor;
                              } finally {
                                      submitBtn.disabled = false;
                              }
    });
});
