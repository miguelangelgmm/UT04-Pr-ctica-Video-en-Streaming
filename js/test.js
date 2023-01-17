"use strict";


import {VideoSystem} from './VideoSystem.js';
import {Coordinate,Resource} from './ObjectStreaming.js';

/*
Testeo del gestor de imágenes.
*/
function testVideoStreaming(){

	console.info("Creamos el objeto Streaming")
	let vs = VideoSystem.getInstance("Streaming");

	console.log(`El nombre de la app es: ${vs.name}`)
	console.log(`El nuevo nombre de la app es: ${vs.name="VideoStreaming"}`)
	console.log("Añadimos la categoria Aventura")
	vs.addCategory(vs.getCategory("Aventura","historias emocionanates pueden ser de acción, misterio, fantasía o ciencia ficción"))
	console.info("Categorias disponibles")
	for (const category of vs.categories) {
		console.log(category.toString())
	}
	console.info("Eliminamos la caterogia Aventura")
	vs.removeCategory(vs.getCategory("Aventura"))
	console.info("Categorias disponibles")
	for (const category of vs.categories) {
		console.log(category.toString())
	}

	console.info("Asignamos producciones a las categorias")
	console.log(vs.assignCategory(vs.getCategory("Humor"),vs.getMovie("Titulo","ESP",new Date(2,2,2020),"historia de pelicula","imagen.png",new Resource(60,"www.titulo.com"),[new Coordinate(40,40)])))

	for (const category of vs.categories) {
		console.log(category.toString())
	}
	console.log(vs.deassignCategory(vs.getCategory("Humor"),vs.getMovie("Titulo")))
	for (const category of vs.categories) {
		console.log(category.toString())
	}
}
window.onload = testVideoStreaming;

