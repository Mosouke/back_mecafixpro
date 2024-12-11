const Brevo = require('sib-api-v3-sdk');
require('dotenv').config();

// Configuration de l'API Client
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY_BREVO;
console.log("API Key:", process.env.API_KEY_BREVO);

const apiInstance = new Brevo.TransactionalEmailsApi();

async function sendEmail(toEmail, subject, message) {
  try {
    const emailData = {
      sender: { name: "MecaFixPro", email: "nikodevweb@gmail.com" },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: message,
    };

    // Envoi de l'email
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log("Email envoyé avec succès :", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error.response?.body || error);
    throw new Error("Échec de l'envoi de l'email.");
  }
}

module.exports = { sendEmail };
