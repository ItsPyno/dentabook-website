const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, practice, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'DentaBook AI <conorpyne@dentabook.ie>',
      to: 'conorpyne@dentabook.ie',
      reply_to: email,
      subject: `New enquiry from ${name}${practice ? ' — ' + practice : ''}`,
      html: `
        <h2>New DentaBook AI Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Practice:</strong> ${practice || 'Not provided'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong><br/>${message || 'No message provided'}</p>
        <hr/>
        <p style="color:#64748b;font-size:12px">Sent from the DentaBook AI contact form at dentabook.ie</p>
      `
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Resend error:', e);
    res.status(500).json({ error: e.message });
  }
};
