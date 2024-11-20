const multer = require('multer');
const path = require('path');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Assure-toi que le dossier 'uploads/' existe ou crée-le au besoin
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Génère un suffixe unique pour éviter les conflits de nom de fichier
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Filtre pour vérifier que l'extension et le type MIME sont valides
const fileFilter = (req, file, cb) => {
    // Extensions acceptées
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); 
    } else {
        cb(new Error('Seules les images (.jpeg, .jpg, .png) sont acceptées !')); 
    }
};

// Paramètres de configuration de multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

// Middleware d'upload d'image pour l'utilisateur/client
const uploadImage = (req, res, next) => {
    upload.single('user_client_image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message }); 
        }
        // Ajouter l'image au corps de la requête
        if (req.file) {
            req.body.user_client_image_name = req.file.filename; 
        }
        next();
    });
};

module.exports = uploadImage;
