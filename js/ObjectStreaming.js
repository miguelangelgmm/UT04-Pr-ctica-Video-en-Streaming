"use strict";
import {
    BaseException,
    InvalidAccessConstructorException,
    EmptyValueException,
    ParameterValidationException,
    InvalidValueException,
    AbstractClassException,
} from "./BaseException.js";

export class Person {
    #name;
    #lastname1;
    #lastname2;
    #born;
    #picture;
    constructor(name, lastname1, lastname2 = "", born, picture = "") {
        if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
        if (name === "undefined" || name === "")
            throw new EmptyValueException("name");
        if (lastname1 === "undefined" || lastname1 === "")
            throw new EmptyValueException("lastname1");
        if (!born instanceof Date)
            throw new InvalidValueException("born", "Date");
        if (typeof name != "string")
            throw new InvalidValueException("name", "String");
        if (typeof lastname1 != "string")
            throw new InvalidValueException("lastname1", "String");
        if (typeof lastname2 != "string")
            throw new InvalidValueException("lastname2", "String");
        if (typeof picture != "string")
            throw new InvalidValueException("picture", "String");

        this.name = name;
        this.lastname1 = lastname1;
        this.lastname2 = lastname2;
        this.born = born;
        this.picture = picture;
    }

    toString() {
        return `Nombre: ${this.#name} apellido: ${this.#lastname1} ${
            this.#lastname2
        } fecha nacimiento:  ${this.#born.toLocaleDateString()} picture ${
            this.#picture
        }}`;
    }
}
export class Category {
    #name;
    #description;
    constructor(name, description = "") {
        if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
        if (name === "undefined" || name === "")
            throw new EmptyValueException("name");
        if (typeof name != "string")
            throw new InvalidValueException("name", "String");
        if (typeof description != "string")
            throw new InvalidValueException("description", "String");
        this.#name = name;
        this.#description = description;
    }
		toString(){
			return `Nombre Categoria: ${this.#name}, Descripción: ${this.#description}`
		}
}

export class Resource {
    #duracion;
    #link;
    constructor(duracion, link) {
        if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
        if (duracion === "undefined" || duracion === "")
            throw new EmptyValueException("duracion");

        if (link === "undefined" || link === "")
            throw new EmptyValueException("link");
        if (
            !/^https?:\/\/(www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}(\:(\d){2,4})?(\/[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(
                link
            ) ||
            !/^(\/?[a-zA-Z0-9_.$%._\+~#]+)*(\?(\w+=.*)(\&(\w+=.+))*)?$/.test(
                link
            )
        )
            throw new InvalidValueException("link", link);
        if (typeof duracion != "string")
            throw new InvalidValueException("duracion", "String");
				this.#link = link;
        this.#duracion = duracion;
        this.#link = link;
    }

		toString(){
			return `Duración: ${this.#duracion}, Link: ${this.#link}`
		}
}
//heredan movie y serie de él
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
            throw new AbstractClassException("Production"); //Comprobamos si la clase no sea instancianda directamente
        if (typeof title != "string")
            throw new InvalidValueException("title", "String");
        if (typeof nationality != "string")
            throw new InvalidValueException("nationality", "String");
        if (typeof synopsis != "string")
            throw new InvalidValueException("synopsis", "String");
        if (typeof image != "string")
            throw new InvalidValueException("image", "String");
        if (!publication instanceof Date)
            throw new InvalidValueException("publication", "Date");

        this.#title = title;
        this.#nationality = nationality;
        this.#publication = publication;
        this.#synopsis = synopsis;
        this.#image = image;
    }
		toString(){
			return `Título: ${this.#title}, nacionalidad: ${this.#nationality}, publciación: ${this.#publication}, sinopsis: ${this.#synopsis}, imagen: ${this.image} `
		}
}

export class Movie extends Production {
    #resource;
    #locations;
    constructor(
        title,
        nationality = "",
        publication,
        synopsis = "",
        image = "",
        resource = new Resource(0, 0),
        locations = []
    ) {
        super(title, nationality, publication, synopsis, image);
        //compruebo si el valor que le hemos introducido es un recurso o si no es vacio
        if (resource.__proto__ != Resource.prototype)
            throw new InvalidValueException("resource", "Resource");
        if (locations.some((location) => location.__proto__ != Coordinate.prototype))
            throw new InvalidValueException("Locations", "locations");

        this.#locations = locations;
        this.#resource = resource;
    }
		toString(){
			return super.toString() + ` Recursos: ${this.#resource.toString()} ` +" Localización "+ this.#locations.join("||")//mirar después el join
		}
}

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
        if (resources.some((resource) => resource.__proto__ != Resource.prototype))
            throw new InvalidValueException("Resources", "resource");
						if (locations.some((location) => location.__proto__ != Coordinate.prototype))
            throw new InvalidValueException("Locations", "locations");
        if (Number.isNaN(season))
            throw new InvalidValueException("Number", "number");
        this.#locations = locations;
        this.#resource = resources;
        this.#season = season;
    }
		toString(){
			return super.toString() + ` Recursos: ${this.#resource.toString()} ` + " Localización: "+this.#locations.join("||") + `Temporadas: ${this.#season}`//mirar después el join
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
		toString(){
			return `usuario: ${this.#username} email: ${this.#email} contraseña: ${this.#password}`
		}
}

export class Coordinate {
	#latitude;
	#longitude;
	constructor(latitude = 0, longitude = 0){

		latitude = typeof latitude !== 'undefined' ? Number(latitude).valueOf() : 0;
		if (Number.isNaN(latitude)  || latitude < -90 || latitude > 90)
			throw new InvalidValueException("latitude", latitude);
		longitude = typeof longitude !== 'undefined' ? Number(longitude).valueOf() : 0;
		if (Number.isNaN(longitude)  || longitude < -180 || longitude > 180)
			throw new InvalidValueException("longitude", longitude);

		this.#latitude = latitude;
		this.#longitude = longitude;
	}
	toString(){
		return `Latitude: ${this.#latitude} Longitud: ${this.#longitude}`
	}
}

