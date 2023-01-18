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
	console.warn("*****************TESTEO DE CATEGORIES***********")

	console.info("Voy a crear 5 categorias diferentes");
	console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Comedia")))
	console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Acción","Peliculas de acción")))
	console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Aventura")))
	console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Drama")))
	console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Eliminar")))

	console.log("Eliminamos la categoria Eliminar")
	console.log("Cantidad de categorias: " + vs.removeCategory(vs.getCategory("Eliminar")))
	//Muestro todas las categorias con el iterador
	for (const category of vs.categories) {
		console.log(category.toString())
	}

	try{
		console.log("Trato de eliminar la categoría por defecto")
		console.log(vs.removeCategory(vs.getCategory("Categoria por defecto")))
	}catch(error){
		console.error(error)
		//ParameterValidationException: Error: you can't delete the default value
	}
	try{
		console.log("intento añadir una categoria que ya existe");
		console.log("Cantidad de categorias: " + vs.addCategory(vs.getCategory("Drama")))

	}catch(e){
		console.error(e);
		//DataAlreadyExistsException: Error: The category you tried to add already exists
	}
	console.warn("*****************TESTEO DE USER***************");
	console.info("Vamos a añadir 2 usuarios al sistema");
	console.log(vs.addUser(vs.getUser("Miguel","miguel@gmail.com","1234")))
	console.log(vs.addUser(vs.getUser("Jose","jose@gmail.com","1234")))

	console.log("Elimino al usuario Jose usuarios restantes " + vs.removeUser(vs.getUser("Jose")))
	console.log("Iteramos los usuarios")
	for (const user of vs.users) {
		console.log(user.toString())
	}
	try {
		console.log("Intengo añadir un usuario con el correo de otro usuario")
		console.log(vs.addUser(vs.getUser("ana","miguel@gmail.com","1234")))
	} catch (error) {
		console.error(error)
		//DataAlreadyExistsException: Error: The miguel@gmail.com you tried to add already exists
	}
	try {
		console.log("Intengo añadir un usuario con el nombre de otro usuario")
		console.log(vs.addUser(vs.getUser("miguel","gema@gmail.com","1234")))
	} catch (error) {
		console.error(error)
		//DataAlreadyExistsException: Error: The username you tried to add already exists
	}

	console.warn("**********TESTEO PRODUCTION********************");

	console.info("Voy a crear 8 producciones diferentes");
	console.log("Añadimos Movie: " + vs.addProduction(vs.getMovie("Superman","ESP",new Date(2015,1,1),"historia de pelicula","imagen.png",new Resource(60,"www.titulo.com"),[new Coordinate(40,40)])))
	console.log("Añadimos Movie: " + vs.addProduction(vs.getMovie("Spiderman","ESP",new Date(2015,1,1),"historia de pelicula","imagen.png")))
	console.log("Añadimos Movie: " + vs.addProduction(vs.getMovie("Solo en casa","ESP",new Date(2015,1,1),"historia de pelicula","imagen.png")))
	console.log("Añadimos Movie: " + vs.addProduction(vs.getMovie("Solo en casa 2","ESP",new Date(2015,1,1),"historia de pelicula","imagen.png")))
	console.log("Añadimos Serie: " + vs.addProduction(vs.getSerie("Riverdale","ESP",new Date(2015,1,1),"","imagen.png")))
	console.log("Añadimos Serie: " + vs.addProduction(vs.getSerie("Manos a la obra","ESP",new Date(2015,1,1),"","imagen.png")))
	console.log("Añadimos Serie: " + vs.addProduction(vs.getSerie("La que se avecina","ESP",new Date(2015,1,1),"","imagen.png")))
	console.log("Añadimos Serie: " + vs.addProduction(vs.getSerie("MacGyver","ESP",new Date(2015,1,1),"","imagen.png")))

	console.log("Vamos a obtener todas las produciones");
	for (const prod of vs.productions) {
		console.log(prod.toString());
	}

	try {
		console.log("Intenamos añadir una pelicula que ya existe");
		vs.addProduction(vs.getMovie("Superman"))
	} catch (error) {
		console.error(error);
		}
	console.log("Eliminamos la pelicula de Solo en casa");
	console.log("Cantidad de producciones: "+vs.removeProduction(vs.getMovie("Solo en casa")))

	console.warn("*****************TESTEO DE ACTOR***************");
	console.info("Voy a crear 5 directores para usarlos después");


	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Miguel","Gonzalez","",new Date(1999,10,10),"miguelangel.jpg")))
	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Manuel","Gonzalez","",new Date(1999,10,5),"manuel.jpg")))
	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Jose","Gonzalez","",new Date(2003,10,9),"jose.jpg")))
	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Teresa","Sanchez","",new Date(1998,10,9),"teresa.jpg")))
	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Maria","Sanchez","",new Date(1998,10,9),"teresa.jpg")))

	try{
	console.log("Voy a intentar añadir otra vez el Actor de nombre Jose")
	console.log("Cantidad de actores " + vs.addActor(vs.getActor("Jose")))
	}catch(error){
		console.error(error)
		//DataAlreadyExistsException: Error: The actor you tried to add already exists
	}
	try{
		console.log("Intento añadir un valor que no sea una persona")
		console.log("Cantidad de actores " + vs.addActor(12));
	}catch(e){
		console.error(e)
		// Error: The paramenter actor has an invalid value. (actor: Person)
	}

	console.log("Elimino el actor de nombre Miguel");
	console.log(vs.removeActor(vs.getActor("Miguel")))
	console.log("Mostramos todos los actor por iterador")
	for (const actor of vs.actors) {
		console.log(actor.toString())
	}

	console.warn("******************TESTEO DE DIRECTOR*****************")

	console.info("Voy a crear 4 directores");
	console.log("Cantidad de directores " + vs.addDirector(vs.getDirector("Luis","Gonzalez","",new Date(1999,10,10),"miguelangel.jpg")))
	console.log("Cantidad de directores " + vs.addDirector(vs.getDirector("Marta","Gonzalez","",new Date(1999,10,5),"manuel.jpg")))
	console.log("Cantidad de directores " + vs.addDirector(vs.getDirector("Javier","Gonzalez","",new Date(2003,10,9),"jose.jpg")))
	console.log("Cantidad de directores " + vs.addDirector(vs.getDirector("Alfonso","Sanchez","",new Date(1998,10,9),"teresa.jpg")))

	console.log("Eliminamos el director de nombre luis");
	console.log("Cantidad de directores " + vs.removeDirector(vs.getDirector("luis")));

	console.log("Iterador de directores");
	for (const director of vs.director) {
		console.log(director.toString())
	}
	console.warn("******************TESTEO DE ASSIGN CATEGORY y GET PRODUCTIONCATEGORY*****************");

	console.log("Vamos a asignar a la categoria de comedia la pelicula de solo en casa, la que se avecina y manos a la obra")
	console.log("Cantidad de peliculas en humor: "+ vs.assignCategory(vs.getCategory("Comedia"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("Manos a la obra")));
	console.log("Cantidad de peliculas en acción: " + vs.assignCategory(vs.getCategory("Acción"),vs.getMovie("Spiderman"),vs.getMovie("Superman")))
	console.log("Voy a asignar a aventura la pelicula del El gato con botas  la cual aun no ha sido creada");
	console.log("Cantidad de peliculas en aventura: " + vs.assignCategory(vs.getCategory("aventura"),vs.getMovie("Spiderman"),vs.getMovie("Superman"),vs.getMovie("El gato con botas","ESP",new Date(2015,1,1),"historia de pelicula","imagen.png")))
	console.log("Voy a añadir la pelicula del gato con botas a Acción")
	console.log("Cantidad de peliculas en acción: " + vs.assignCategory(vs.getCategory("accion"),vs.getMovie("El gato con botas")))

	console.log("Mostramos el iterador de producciones para mostrar que se ha añadido el gato con botas");
	for (let prod of vs.productions) {
		console.log(prod.toString());
	}

	console.info("vamos a testear getProductionCategory");
	console.log("Obtenemos las producciones en Comedia")
	for (let prod of vs.getProductionCategory(vs.getCategory("Comedia"))) {
		console.log(prod.toString());
	}

	console.log("Voy eliminar la categoria de comedia");
	console.log("Cantidad de categorias: " + vs.removeCategory(vs.getCategory("Comedia")))
	console.info("Ahora las producciones que teniamos en comedia las tenemos en categoria por defecto")
	for (let prod of vs.getProductionCategory(vs.getCategory("Categoria por defecto"))) {
		console.log(prod.toString());
	}
	console.warn("******************TESTEO DE ASSIGNACTOR y GET PRODUCTIONACTOR y GETCAST*****************");

	console.log("Vamos a asignar producciones al actor : Manuel")
	console.log("Cantidad de producciones del Actor Manuel: "+ vs.assignActor(vs.getActor("Manuel"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("Manos a la obra")));
	console.log("Cantidad de producciones de la Actriz Maria: "+ vs.assignActor(vs.getActor("Maria"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("Manos a la obra"),vs.getSerie("El gato con botas"),vs.getSerie("MacGyver"),vs.getSerie("Riverdale")));
	console.log("Cantidad de producciones del Actor Jose: "+ vs.assignActor(vs.getActor("Jose"),vs.getSerie("La que se avecina")));
	console.log("Cantidad de producciones de la Actriz Teresa: "+ vs.assignActor(vs.getActor("Teresa"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("Manos a la obra"),vs.getSerie("MacGyver"),vs.getSerie("Riverdale")));

	console.log("Mostramos las producciones en las que sale Manuel")
	for (let prod of vs.getProductionActor(vs.getActor("Manuel"))) {
		console.log(prod.toString());
	}
	console.log("Eliminamos a Manuel de La que se avecina" + vs.deassignActor(vs.getActor("Manuel"),vs.getSerie("La que se avecina")))
	console.log("Mostramos las producciones en las que sale Manuel")
	for (let prod of vs.getProductionActor(vs.getActor("Manuel"))) {
		console.log(prod.toString());
	}
	console.info("Obtenemos el casting de La que se avecina");
	for (let actor of vs.getCast(vs.getSerie("La que se avecina"))) {
		console.log(actor.toString());
	}

	console.warn("******************TESTEO DE ASSIGDIRECTOR y GET PRODUCTIONDIRECTOR*****************");

	console.log("Cantidad de producciones del Director Marta: "+ vs.assignDirector(vs.getDirector("Marta"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("El gato con botas"),vs.getSerie("MacGyver"),vs.getSerie("Riverdale")));
	console.log("Cantidad de producciones del Director Javier: "+ vs.assignDirector(vs.getDirector("Javier"),vs.getSerie("La que se avecina")));
	console.log("Cantidad de producciones del Director Alfonso: "+ vs.assignDirector(vs.getDirector("Alfonso"),vs.getSerie("La que se avecina"),vs.getMovie("Solo en casa 2"),vs.getSerie("Manos a la obra"),vs.getSerie("MacGyver"),vs.getSerie("Riverdale")));

	console.log("Mostramos las producciones en las que ha sido directora Marta")
	for (let prod of vs.getProductionDirector(vs.getDirector("Marta"))) {
		console.log(prod.toString());
	}
	console.log("Eliminamos a Marta de La que se avecina" + vs.deassignDirector(vs.getDirector("Marta"),vs.getSerie("La que se avecina")))

	console.log("Mostramos las producciones en las que ha sido directora Marta")
	for (let prod of vs.getProductionDirector(vs.getDirector("Marta"))) {
		console.log(prod.toString());
	}

	console.warn("******************FIN DEL TESTEO*****************");

}
window.onload = testVideoStreaming;

