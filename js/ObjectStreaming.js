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
}

export class Resource {
    #duracion;
    #link;
    constructor(duracion, link) {
        if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
        if (duracion === "undefined" || duracion === "")
            throw new EmptyValueException("duracion");
        if (Number.isNaN(link))
            throw InvalidValueException("link", "Number");
        if (typeof duracion != "string")
            throw new InvalidValueException("duracion", "String");
        //!Añadir luego expresión regular para el link
        this.#duracion = duracion;
        this.#link = link;
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
        resource = "",
        locations = ""
    ) {
        super(title, nationality, publication, synopsis, image);
        //compruebo si el valor que le hemos introducido es un recurso o si no es vacio
        if (resource.__proto__ != Resource.prototype || resource != "")
            throw new InvalidValueException("resource", "Resource");
        if (locations.__proto__ != Locations.prototype || locations != "")
            throw new InvalidValueException("Locations", "locations");

        this.#locations = locations;
        this.#resource = resource;
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
        resource = "",
        locations = "",
        season = 0
    ) {
        super(title, nationality, publication, synopsis, image);
        //compruebo si el valor que le hemos introducido es un recurso o si no es vacio
        if (resource.__proto__ != Resource.prototype || resource != "")
            throw new InvalidValueException("resource", "Resource");
        if (locations.__proto__ != Locations.prototype || locations != "")
            throw new InvalidValueException("locations", "Locations");
        if (Number.isNaN(season))
            throw new InvalidValueException("Number", "number");
        this.#locations = locations;
        this.#resource = resource;
        this.#season = season;
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
}

export class Coordinate {
    #latitude;
    #longitud;
    constructor(latitude, longitud) {
			if (Number.isNaN(latitude))
			throw InvalidValueException("latitude", "Number");
			if (Number.isNaN(longitud))
			throw InvalidValueException("longitud", "Number");
        this.#latitude = latitude;
        this.#longitud = longitud;
    }
}

//!TENGO QUE AÑADIR EL TOSTRING EN TODOS

//!Tengo que cambiar cosas porque Coordinete por ejemplo en movie es un array de recusos y yo he puesto un coordinate normal
