'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Multimedia = require('../models/multimedia');

var controller = {

   
    getMultimedias: (req, res)=>{
        var query = Multimedia.find({});
        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        // Find
        query.sort('-_id').exec((err, multimedias) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos !!!'
                });
            }

            if(!multimedias){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay datos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                multimedias
            });

        });
    },

    getMultimedia: (req, res)=>{
        // Recoger el id de la url
        var multimediaId = req.params.id;

        // Comprobar que existe
        if(!multimediaId || multimediaId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el archivo !!!'
            });
        }

        // Buscar 
        Multimedia.findById(multimediaId, (err, multimedia) => {
            
            if(err || !multimedia){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el archivo!!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                multimedia
            });

        });
    },
	
    // Subida de la imagen
    upload: (req, res)=>{
        // Configurar el modulo connect multiparty 

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });
        
        }else{
             // Si todo es valido, sacando id de la url
             var multimediaId = req.params.id;

             if(multimediaId){
                // Buscar el contenido, asignarle el nombre de la imagen y actualizarlo
                Multimedia.findOneAndUpdate({_id: multimediaId}, {image: file_name}, {new:true}, (err, multimediaUpdated) => {

                    if(err || !multimediaUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del archivo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        multimedia: multimediaUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }
    },
    getImage: (req, res)=>{

        var file = req.params.image;
        var path_file = './upload/multimedia/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },
    search: (req, res)=>{

        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Multimedia.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "sinopsis": { "$regex": searchString, "$options": "i"}},
			{ "clasification": { "$regex": searchString, "$options": "i"}},
			{ "category": { "$regex": searchString, "$options": "i"}},
			{ "language": { "$regex": searchString, "$options": "i"}}
        ]})
  
        .exec((err, multimedias) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!multimedias || multimedias.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay archivos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                multimedias
            });

        });
    },

};

module.exports = controller;