const Brevo = require('sib-api-v3-sdk');
require('dotenv').config();

// Configure l'API key avec la méthode correcte
Brevo.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new Brevo.TransactionalEmailsApi();

// Fonction d'envoi d'e-mails
async function sendEmail(toEmail, subject, message) {
  try {
    const emailData = {
      sender: { name: "MecaFixPro", email: "nikodevweb@gmail.com" },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: message,
    };

    // Envoi de l'email via Brevo
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log("Email envoyé :", response);
    return response;
  } catch (error) {
    console.error("Erreur d'envoi :", error);
    throw new Error("Échec de l'envoi de l'email.");
  }
}

module.exports = { sendEmail };
