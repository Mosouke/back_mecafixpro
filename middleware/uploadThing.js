const { createUploadthing } = require('uploadthing/express'); // Importation CommonJS

const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({
    image: {
      /**
       * Liste complète des options et valeurs par défaut, voir la référence API File Route
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("Téléchargement terminé", data);
  }),
};

module.exports = uploadRouter;
