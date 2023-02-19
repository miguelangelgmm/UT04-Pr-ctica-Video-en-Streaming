"use strict";
import {
	BaseException,
	InvalidAccessConstructorException,
	EmptyValueException,
	ParameterValidationException,
	InvalidValueException,
	AbstractClassException,
} from "../BaseException.js";

export class Person {
	#name;
	#lastname1;
	#lastname2;
	#born;
	#picture;
	constructor(name, lastname1, lastname2 = "", born, picture = "") {
		if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
		//Verificamos que todos los valores sean validos
		if (name === "undefined" || name === "")
			throw new EmptyValueException("name");
		if (lastname1 === "undefined" || lastname1 === "")
			throw new EmptyValueException("lastname1");
		if (!(born instanceof Date))
			throw new InvalidValueException("born", "Date");
		if (typeof name != "string")
			throw new InvalidValueException("name", "String");
		if (typeof lastname1 != "string")
			throw new InvalidValueException("lastname1", "String");
		if (typeof lastname2 != "string")
			throw new InvalidValueException("lastname2", "String");
		if (typeof picture != "string")
			throw new InvalidValueException("picture", "String");

		this.#name = name;
		this.#lastname1 = lastname1;
		this.#lastname2 = lastname2;
		this.#born = born;
		this.#picture = picture;
	}

	toString() {
		return `Nombre: ${this.#name} apellido: ${this.#lastname1} ${this.#lastname2
			} fecha nacimiento:  ${this.#born.toLocaleDateString()} picture ${this.#picture
			}`;
	}

	get name() {
		return this.#name;
	}
	get lastname1() {
		return this.#lastname1;
	}
	get picture(){
		return this.#picture;
	}
	get lastname2(){
		return this.#lastname2;
	}
	get born(){
		return this.#born;
	}
}
export class Category {
	#name;
	#description;
	constructor(name, description = "") {
		if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
		//validamos todos los valores
		if (name === "undefined" || name === "")
			throw new EmptyValueException("name");
		if (typeof name != "string")
			throw new InvalidValueException("name", "String");
		if (typeof description != "string")
			throw new InvalidValueException("description", "String");
		this.#name = name;
		this.#description = description;
	}
	toString() {
		return `Categoria: ${this.#name}, Descripción: ${this.#description}`;
	}
	get name() {
		return this.#name;
	}
}

export class Resource {
	#duracion;
	#link;
	constructor(duracion, link) {
		if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
		//validaciones
		if (duracion === "undefined" || duracion === "")
			throw new EmptyValueException("duracion");

		if (link === "undefined" || link === "")
			throw new EmptyValueException("link");
		if (
			!/^https?:\/\/(www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}(\:(\d){2,4})?(\/[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(
				link
			) &&
			!/^(\/?[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(
				link
			)
		)
			throw new InvalidValueException("link", link);
		if (typeof duracion != "number")
			throw new InvalidValueException("duracion", "Number");
		this.#link = link;
		this.#duracion = duracion;
		this.#link = link;
	}

	toString() {
		return `Duración: ${this.#duracion}, Link: ${this.#link}`;
	}
	get link(){
		return this.#link;
	}
	get duration(){
		return this.#duracion;
	}
}

export class Production {
	#title;
	#nationality;
	#publication;
	#synopsis;
	#image;
	constructor(
		title,
		nationality = "",
		publication,
		synopsis = "",
		image = ""
	) {
		if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
		if (new.target == Production)
			throw new AbstractClassException("Production"); //Comprobamos si la clase no sea instanciada directamente
		if (typeof title != "string")
			throw new InvalidValueException("title", "String");
		if (typeof nationality != "string")
			throw new InvalidValueException("nationality", "String");
		if (typeof synopsis != "string")
			throw new InvalidValueException("synopsis", "String");
		if (typeof image != "string")
			throw new InvalidValueException("image", "String");
		if (!(publication instanceof Date))
			throw new InvalidValueException("publication", "Date");

		this.#title = title;
		this.#nationality = nationality;
		this.#publication = publication;
		this.#synopsis = synopsis;
		this.#image = image;
	}
	toString() {
		return `Título: ${this.#title}, nacionalidad: ${this.#nationality
			}, publciación: ${this.#publication}, sinopsis: ${this.#synopsis
			}, imagen: ${this.#image} `;
	}

	get title() {
		return this.#title;
	}
	get nationality(){
		return this.#nationality;
	}
	get publication(){
		return this.#publication;
	}
	get synopsis(){
		return this.#synopsis;
	}
	get image(){
		return this.#image;
	}
}

//movie hereda de Production
export class Movie extends Production {
	#resource;
	#locations;
	constructor(
		title,
		nationality = "",
		publication,
		synopsis = "",
		image = "",
		resource = new Resource(0, "www.default.com"),
		locations = []
	) {
		super(title, nationality, publication, synopsis, image);
		//compruebo si el valor que le hemos introducido es un recurso o si no es vacio
		if (resource.__proto__ != Resource.prototype)
			throw new InvalidValueException("resource", "Resource");
		if (
			locations.some(
				(location) => location.__proto__ != Coordinate.prototype
			)
		)
			throw new InvalidValueException("Locations", "locations");

		this.#locations = locations;
		this.#resource = resource;
	}
	toString() {
		return (
			super.toString() +
			` Recursos: ${this.#resource.toString()} ` +
			" Localización " +
			this.#locations.join("||")
		); //mirar después el join
	}

	get resource(){
		return this.#resource;
	}

}

//Serie hereda de Production

export class Serie extends Production {
	#resource;
	#locations;
	#season;
	constructor(
		title,
		nationality = "",
		publication,
		synopsis = "",
		image = "",
		resources = [],
		locations = [],
		season = 0
	) {
		super(title, nationality, publication, synopsis, image);
		//compruebo si el valor que le hemos introducido es un recurso o si no es vacio
		if (
			resources.some(
				(resource) => resource.__proto__ != Resource.prototype
			)
		)
			throw new InvalidValueException("Resources", "resource");
		if (
			locations.some(
				(location) => location.__proto__ != Coordinate.prototype
			)
		)
			throw new InvalidValueException("Locations", "locations");
		if (Number.isNaN(season))
			throw new InvalidValueException("Number", "number");
		this.#locations = locations;
		this.#resource = resources;
		this.#season = season;
	}
	toString() {
		return (
			super.toString() +
			` Recursos: ${this.#resource.toString()} ` +
			" Localización: " +
			this.#locations.join("||") +
			`Temporadas: ${this.#season}`
		); //mirar después el join
	}

	get season(){
		return this.season;
	}
	*getResource(){
		for (const reso of this.#resource) {
			yield reso;
		}
	}

}

export class User {
	#username;
	#email;
	#password;
	constructor(username, email, password) {
		if (username === "undefined" || username === "")
			throw new EmptyValueException("username");
		if (
			/^[a-zA-Z][a-zA-Z0-9_\-]*(\.[a-zA-Z0-9_\-]*)*[a-zA-Z0-9]$/.test(
				username
			) !== true
		)
			throw new InvalidValueException("username", username);

		if (email === "undefined" || email === "")
			throw new EmptyValueException("email");
		if (
			/^[a-zA-Z][a-zA-Z0-9_\-]*(\.[a-zA-Z0-9_\-]*)*[a-zA-Z0-9]\@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
				email
			) !== true
		)
			throw new InvalidValueException("email", email);

		if (password === "undefined" || password === "")
			throw new EmptyValueException("password");
		if (typeof password != "string")
			throw new InvalidValueException("password", "String");

		this.#username = username;
		this.#password = password;
		this.#email = email;
	}
	toString() {
		return `usuario: ${this.#username} email: ${this.#email} contraseña: ${this.#password
			}`;
	}
	get username() {
		return this.#username;
	}
	get email() {
		return this.#email;
	}
	get password() {
		return this.#password;
	}
}
//Coordenadas
export class Coordinate {
	#latitude;
	#longitude;
	constructor(latitude = 0, longitude = 0) {
		latitude =
			typeof latitude !== "undefined" ? Number(latitude).valueOf() : 0;
		if (Number.isNaN(latitude) || latitude < -90 || latitude > 90)
			throw new InvalidValueException("latitude", latitude);
		longitude =
			typeof longitude !== "undefined" ? Number(longitude).valueOf() : 0;
		if (Number.isNaN(longitude) || longitude < -180 || longitude > 180)
			throw new InvalidValueException("longitude", longitude);

		this.#latitude = latitude;
		this.#longitude = longitude;
	}
	toString() {
		return `Latitude: ${this.#latitude} Longitud: ${this.#longitude}`;
	}

	get latitude() {
		return this.#latitude;
	}
	set latitude(value) {
		value = typeof value !== "undefined" ? Number(value).valueOf() : 0;
		if (Number.isNaN(value) || value < -90 || value > 90)
			throw new InvalidValueException("latitude", value);
		this.#latitude = value;
	}

	get longitude() {
		return this.#longitude;
	}
	set longitude(value) {
		value = typeof value !== "undefined" ? Number(value).valueOf() : 0;
		if (Number.isNaN(value) || value < -180 || value > 180)
			throw new InvalidValueException("longitude", value);
		this.#longitude = value;
	}

	getSexagesimalLatitude() {
		let direction = this.latitude >= 0 ? "N" : "S";
		let latitude = Math.abs(this.latitude);
		let grades = Math.floor(latitude);
		let tmpMinutes = (latitude - grades) * 60;
		let minutes = Math.floor(tmpMinutes);
		let tmpSeconds = (tmpMinutes - minutes) * 60;
		let seconds = Math.round(tmpSeconds);

		return grades + "°" + minutes + "'" + seconds + "''" + direction;
	}

	getSexagesimalLongitude() {
		let direction = this.longitude >= 0 ? "E" : "W";
		let longitude = Math.abs(this.longitude);
		let grades = Math.floor(longitude);
		let tmpMinutes = (longitude - grades) * 60;
		let minutes = Math.floor(tmpMinutes);
		let tmpSeconds = (tmpMinutes - minutes) * 60;
		let seconds = Math.round(tmpSeconds);

		return grades + "°" + minutes + "'" + seconds + "''" + direction;
	}
}
