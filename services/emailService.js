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

async function sendAppointmentConfirmationEmail(
  toEmail, userName, date, time, status, garageName, serviceName, specificServiceName
) {
  if (!toEmail || !userName || !date || !time || !status || !garageName) {
    throw new Error("Champs requis manquants pour l'email de confirmation.");
  }
  
  try {
      const htmlContent = `
          <h1>Confirmation de Rendez-vous</h1>
          <p>Bonjour ${userName},</p>
          <p>Votre rendez-vous a été pris avec succès.</p>
          <ul>
              <li><strong>Date :</strong> ${date}</li>
              <li><strong>Heure :</strong> ${time}</li>
              <li><strong>Statut :</strong> ${status}</li>
              <li><strong>Garage :</strong> ${garageName}</li>
              ${serviceName ? `<li><strong>Service :</strong> ${serviceName}</li>` : ''}
              ${specificServiceName ? `<li><strong>Service spécifique :</strong> ${specificServiceName}</li>` : ''}
          </ul>
          <p>Nous vous remercions de votre confiance.</p>
      `;

      const emailData = {
          sender: { name: "MecaFixPro", email: "nikodevweb@gmail.com" },
          to: [{ email: toEmail }],
          subject: "Confirmation de votre Rendez-vous",
          htmlContent: htmlContent,
      };

      const response = await apiInstance.sendTransacEmail(emailData);
      console.log("Email envoyé avec succès :", response);
      return response;
    } catch (error) {
      console.error("Erreur détaillée lors de l'envoi de l'email :", error.response?.body || error.message);
      throw new Error("Échec de l'envoi de l'email.");
    }
    
}


module.exports = { 
  sendPasswordResetEmail,
  sendAppointmentConfirmationEmail
};
