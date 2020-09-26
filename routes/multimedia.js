'use strict'

var express = require('express');
var MultimediaController = require('../controllers/multimedia');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/multimedia'});

var router = express.Router();




// rutas útiles 
router.get('/multimedias/:last?',MultimediaController.getMultimedias);
router.get('/multimedias',MultimediaController.getMultimedias);
router.get('/multimedia/:id',MultimediaController.getMultimedia);
// Imagen
router.post('/upload-image/:id?', md_upload, MultimediaController.upload);
router.get('/get-image/:image', MultimediaController.getImage);

// Buscar
router.get('/search/:search', MultimediaController.search);

module.exports = router;