// @ts-nocheck
const { check, validationResult } = require('express-validator');
console.log("Fichier de validation chargé");

/**
 * Validation réutilisable pour les emails.
 */
const validateEmail = check('mail_user_client')
    .isEmail()
    .withMessage('Email invalide');

/**
 * Validation réutilisable pour les mots de passe.
 */
const validatePassword = check('password_user_client')
    .isLength({ min: 4, max: 100 })
    .withMessage('Le mot de passe doit comporter entre 4 et 100 caractères');

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
    validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la connexion d'un utilisateur.
 */
const validateUserLogin = [
    validateEmail,
    validatePassword,
    handleValidationErrors
];

/**
 * Validations pour la mise à jour d'un utilisateur (sans valider le mot de passe).
 */
const validateUserUpdate = [
    validateEmail,  // Validation de l'email uniquement pour la mise à jour
    handleValidationErrors
];

/**
 * Validations pour la création d'un client.
 */
const validateUserClientCreation = [
    check('user_client_name')
        .isLength({ min: 1, max: 100 })
        .withMessage('Le nom du client doit comporter entre 1 et 100 caractères'),

    check('user_client_last_name') 
        .isLength({ min: 1, max: 100 })
        .withMessage('Le nom de famille doit comporter entre 1 et 100 caractères'),

    check('user_client_phone_number')
        .optional()
        .matches(/^[0-9\s\-\(\)]+$/)
        .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres, espaces, tirets ou parenthèses')
        .isLength({ min: 10, max: 15 })
        .withMessage('Le numéro de téléphone doit comporter entre 10 et 15 caractères'),

    check('user_client_address')
        .isLength({ min: 1, max: 255 })
        .withMessage('L\'adresse du client doit comporter entre 1 et 255 caractères'),
        
    validateEmail,
    handleValidationErrors
];

/**
 * Validations pour la mise à jour d'un utilisateur client.
 */
const validateUserClientUpdate = [
    check('user_client_image_name')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Le nom de fichier de l\'image doit comporter entre 1 et 255 caractères'),

    check('user_client_name')
        .optional() 
        .isLength({ min: 1, max: 100 })
        .withMessage('Le nom du client doit comporter entre 1 et 100 caractères'),

    check('user_client_last_name') 
        .optional() 
        .isLength({ min: 1, max: 100 })
        .withMessage('Le nom de famille doit comporter entre 1 et 100 caractères'),

    check('user_client_phone_number')
        .optional()
        .matches(/^[0-9\s\-\(\)]+$/)
        .withMessage('Le numéro de téléphone doit contenir uniquement des chiffres, espaces, tirets ou parenthèses')
        .isLength({ min: 10, max: 15 })
        .withMessage('Le numéro de téléphone doit comporter entre 10 et 15 caractères'),

    check('user_client_address')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('L\'adresse du client doit comporter entre 1 et 255 caractères'),
        
    handleValidationErrors
];

module.exports = {
    validateUserCreation,
    validateUserLogin,
    validateUserUpdate,
    validateUserClientCreation,
    validateUserClientUpdate
};
