"use strict";
import {
    BaseException,
    InvalidAccessConstructorException,
    EmptyValueException,
    ParameterValidationException,
    InvalidValueException,
    AbstractClassException,
} from "./BaseException.js";

import { Category } from "./ObjectStreaming.js";

class CategoryExists extends BaseException {
  constructor (fileName, lineNumber){
    super("Error: The category you tried to add already exists", fileName, lineNumber);
    this.name = "ParameterValidationException";
  }
}



export class VideoSystem {
    #nameSystem;
    #users;
    #ProductsSystem;
    #categories;
    #actors;
    #directors;

    constructor(name) {
			this.#nameSystem = name;
		}

    get name() {
        return this.#nameSystem;
    }
    /**
     * La función manda una excepción si el nombre es vacio en caso contrario asigna el nuevo nombre al sistema
     * @param {String} name - El nuevo nombre del sistem
     */
    set name(name) {
        if (!name) {
            throw new EmptyValueException("name");
        }
        this.#nameSystem = name;
    }

    get categories() {
        // referencia para habilitar el closure en el objeto
        let array = this.#categories;
        return {
            *[Symbol.iterator]() {
                for (let category of array) {
                    yield category;
                }
            },
        };
    }

    addCategory(category) {
        if (!(category instanceof Category))
            throw new InvalidValueException("category", Category);

        if (this.#categories.findIndex((c) => c.name == category.name) != -1) {
					throw new CategoryExists();
        }
        this.#categories.push(category);
    }



}
