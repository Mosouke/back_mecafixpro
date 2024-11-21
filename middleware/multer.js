const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Vérifier si le dossier 'uploads/' existe, sinon le créer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    /**
     * Fonction de destination pour le stockage des fichiers.
     * @param {Object} req - L'objet de requête.
     * @param {Object} file - L'objet de fichier.
     * @param {function} cb - Fonction de rappel pour indiquer la destination.
     */
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },

    /**
     * Fonction de nommage du fichier.
     * @param {Object} req - L'objet de requête.
     * @param {Object} file - L'objet de fichier.
     * @param {function} cb - Fonction de rappel pour indiquer le nom du fichier.
     */
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); 
    }
});

const fileFilter = (req, file, cb) => {
    /**
     * Fonction de filtrage des types de fichiers acceptés.
     * @param {Object} req - L'objet de requête.
     * @param {Object} file - L'objet de fichier.
     * @param {function} cb - Fonction de rappel pour accepter ou refuser le fichier.
     */
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); 
    } else {
        cb(new Error('Seules les images (.jpeg, .jpg, .png) sont acceptées !')); 
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
}).single('image'); 

module.exports = upload;
