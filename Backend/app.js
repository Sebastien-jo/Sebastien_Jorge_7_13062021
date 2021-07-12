const express = require('express');
const bodyParser = require('body-parser');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const path = require('path');
/*Helmet aide à protéger l'application de certaines des vulnérabilités 
bien connues du Web en configurant de manière appropriée des en-têtes HTTP.*/



/* utilisation du module 'dotenv' pour masquer les informations de connexion
 à la base de données à l'aide de variables d'environnement*/
require('dotenv').config();
const app = express();
// Connection à la BDD


/* Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, 
afin que tout le monde puisse faire des requetes depuis son navigateur*/
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});



// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body


// Utilisation de la méthode body-parser pour la transformation du corps de la requête en JSON, en objet JS utilisable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/posts/', postsRoutes);
app.use('/api/auth/', usersRoutes);
module.exports = app;

