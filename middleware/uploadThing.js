
const express = require('express');
const { createUploadthing } = require('uploadthing/express');  
const { validationResult } = require('express-validator');

const app = express();
const f = createUploadthing(); 

const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log('Téléversement terminé', data);
  }),
};


app.use('/api/uploadthing', uploadRouter.imageUploader);

// Démarrer votre serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
