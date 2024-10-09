const { check } = require('express-validator');
console.log("Fichier de validation chargé");

/**
 * Validation réutilisable pour les emails.
 * @type {ValidationChain} // Remplacez l'importation dynamique par le type simple
 */
const validateEmail = check('mail_user').isEmail().withMessage('Email invalide');

/**
 * Validation réutilisable pour les mots de passe.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validatePassword = [
    check('password')
        .isLength({ min: 4 }).withMessage('Le mot de passe doit comporter au moins 4 caractères'),
    check('password')
        .isLength({ max: 100 }).withMessage('Le mot de passe doit comporter au plus 100 caractères')
];

/**
 * Validations pour la création d'un utilisateur.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validateUserCreation = [validateEmail, ...validatePassword];

/**
 * Validations pour la connexion d'un utilisateur.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validateUserLogin = [validateEmail, ...validatePassword];

/**
 * Validations pour la mise à jour d'un utilisateur.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validateUserUpdate = [validateEmail, ...validatePassword];

/**
 * Validations pour la création d'un client.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validateClientCreation = [
    check('client_name')
        .isLength({ min: 1 }).withMessage('Le nom du client doit comporter au moins 1 caractère'),
    check('client_name')
        .isLength({ max: 100 }).withMessage('Le nom du client doit comporter au plus 100 caractères'),
    check('client_phone_number')
        .optional()
        .isLength({ max: 100 }).withMessage('Le numéro de téléphone doit comporter au plus 100 caractères'),
    check('client_address')
        .isLength({ min: 1 }).withMessage('L\'adresse du client doit comporter au moins 1 caractère'),
    check('client_address')
        .isLength({ max: 255 }).withMessage('L\'adresse du client doit comporter au plus 255 caractères'),
    validateEmail,
    ...validatePassword
];

/**
 * Validations pour la mise à jour d'un client.
 * @type {Array<ValidationChain>} // Remplacez l'importation dynamique par le type simple
 */
const validateClientUpdate = [
    check('client_name')
        .isLength({ min: 1 }).withMessage('Le nom du client doit comporter au moins 1 caractère'),
    check('client_name')
        .isLength({ max: 100 }).withMessage('Le nom du client doit comporter au plus 100 caractères'),
    check('client_phone_number')
        .optional()
        .isLength({ max: 100 }).withMessage('Le numéro de téléphone doit comporter au plus 100 caractères'),
    check('client_address')
        .optional()
        .isLength({ min: 1 }).withMessage('L\'adresse du client doit comporter au moins 1 caractère'),
    validateEmail,
    ...validatePassword
];

// Exportation des validations
module.exports = {
    validateUserCreation,
    validateUserLogin,
    validateUserUpdate,
    validateClientCreation,
    validateClientUpdate,
};
