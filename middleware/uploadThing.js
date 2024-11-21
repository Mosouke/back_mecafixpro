const { createUploadthing } = require("uploadthing/server");

const uploadThing = createUploadthing();

const fileRouter = {
  imageUpload: uploadThing({
    image: { maxFileSize: "4MB", maxFileCount: 1 }, 
  }).onUploadComplete(async ({ file }) => {
    console.log("Fichier téléversé :", file);
    // Si besoin, stockez le lien `file.url` dans la base de données (ou dans un fichier)
  }),
};

module.exports = { fileRouter };
