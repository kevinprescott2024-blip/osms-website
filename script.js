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