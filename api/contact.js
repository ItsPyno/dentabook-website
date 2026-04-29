module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, practice, email, phone, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DentaBook AI <conorpyne@dentabook.ie>',
        to: 'conorpyne@dentabook.ie',
        reply_to: email,
        subject: `New enquiry from ${name}${practice ? ' — ' + practice : ''}`,
        html: `<h2>New DentaBook AI Enquiry</h2><p><strong>Name:</strong> ${name}</p><p><strong>Practice:</strong> ${practice || 'Not provided'}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Message:</strong><br/>${message || 'No message'}</p>`
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Resend error');
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
};