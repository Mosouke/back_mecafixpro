const Brevo = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY_BREVO;  
const apiInstance = new Brevo.TransactionalEmailsApi();

async function sendPasswordResetEmail(toEmail, userName, resetUrl) {
  try {
    const htmlContent = `
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Bonjour ${userName},</p>
      <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans une heure.</p>
    `;

    const emailData = {
      sender: { name: "MecaFixPro", email: "nikodevweb@gmail.com" }, 
      to: [{ email: toEmail }], 
      subject: "Réinitialisation du mot de passe", 
      htmlContent: htmlContent,  
    };

  
    const response = await apiInstance.sendTransacEmail(emailData);
    console.log("Email envoyé avec succès :", response);
    return response; 
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error.message);
    throw new Error("Échec de l'envoi de l'email.");
  }
}

module.exports = { sendPasswordResetEmail };
