"use strict";
import {
    BaseException,
    InvalidAccessConstructorException,
    EmptyValueException,
    ParameterValidationException,
    InvalidValueException,
    AbstractClassException,
} from "./BaseException.js";

class Person {
    #name;
    #lastname1;
    #lastname2;
    #born;
    #picture;
    constructor(name, lastname1, lastname2, born, picture) {
        if (!new.target) throw new InvalidAccessConstructorException(); // Verificación operador new
        if (name === "undefined" || name === "")
            throw new EmptyValueException("name");
        if (lastname1 === "undefined" || lastname1 === "")
            throw new EmptyValueException("lastname1");
        if (lastname2 === "undefined" || lastname2 === "")
            throw new EmptyValueException("lastname2");
        if (!born instanceof Date)
            throw new InvalidValueException("born", "Date");
        if (picture === "undefined" || picture === "")
            throw new EmptyValueException("picture");

        this.name = name;
        this.lastname1 = lastname1;
        this.lastname2 = lastname2;
        this.born = born;
        this.picture = picture;
    }

		toString(){
			return `Nombre: ${this.#name} apellido: ${this.#lastname1} ${this.#lastname2} fecha nacimiento:  ${this.#born.toLocaleDateString()} picture ${this.#picture}}`
		}
}
