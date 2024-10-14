// @ts-nocheck
const { check, validationResult } = require('express-validator');
console.log("Fichier de validation chargé");

/**
 * Validation réutilisable pour les emails.
 */
const validateEmail = check('mail_user').isEmail().withMessage('Email invalide');

/**
 * Validation réutilisable pour les mots de passe.
 */
const validatePassword = [
    check('password')
        .isLength({ min: 4, max: 100 }).withMessage('Le mot de passe doit comporter entre 4 et 100 caractères')
];

/**
 * Fonction de gestion des erreurs de validation.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log("Erreurs de validation:", errors.array());
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Validations pour la création d'un utilisateur.
 */
const validateUserCreation = [
    validateEmail,
    ...validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la connexion d'un utilisateur.
 */
const validateUserLogin = [
    validateEmail,
    ...validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la mise à jour d'un utilisateur.
 */
const validateUserUpdate = [
    validateEmail,
    ...validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la création d'un client.
 */
const validateClientCreation = [
    check('client_name')
        .isLength({ min: 1, max: 100 }).withMessage('Le nom du client doit comporter entre 1 et 100 caractères')
        .bail(),
    check('client_last_name') // Ajout de la validation du nom de famille
        .isLength({ min: 1, max: 100 }).withMessage('Le nom de famille doit comporter entre 1 et 100 caractères')
        .bail(),
    check('client_phone_number')
    .optional()
    .matches(/^[0-9]+$/)
    .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres')
    .isLength({ min: 10, max: 15 })
    .withMessage('Le numéro de téléphone doit comporter entre 10 et 15 chiffres'),

    check('client_address')
        .isLength({ min: 1, max: 255 }).withMessage('L\'adresse du client doit comporter entre 1 et 255 caractères')
        .bail(),
    validateEmail,
    ...validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la mise à jour d'un client.
 */
const validateClientUpdate = [
    check('client_name')
        .optional() // Optionnel
        .isLength({ min: 1, max: 100 }).withMessage('Le nom du client doit comporter entre 1 et 100 caractères')
        .bail(),
    check('client_last_name') // Ajout de la validation du nom de famille
        .optional() // Optionnel
        .isLength({ min: 1, max: 100 }).withMessage('Le nom de famille doit comporter entre 1 et 100 caractères'),
    check('client_phone_number')
    .optional()
    .matches(/^[0-9]+$/)
    .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres')
    .isLength({ min: 10, max: 15 })
    .withMessage('Le numéro de téléphone doit comporter entre 10 et 15 chiffres'),

    check('client_address')
        .optional() // Optionnel
        .isLength({ min: 1, max: 255 }).withMessage('L\'adresse du client doit comporter entre 1 et 255 caractères'),
    validateEmail,
    ...validatePassword,
    handleValidationErrors
];

// Exportation des validations
module.exports = {
    validateUserCreation,
    validateUserLogin,
    validateUserUpdate,
    validateClientCreation,
    validateClientUpdate,
};
