const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = "mailer.docusear.ch";
let mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

export default function sendEmail({
  from = "mailer@docusear.ch",
  to,
  subject = "",
  html = "",
}) {
  const data = {
    from,
    to,
    subject,
    html,
  };

  return mailgun.messages().send(data);
}
