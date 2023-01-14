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
    constructor(fileName, lineNumber) {
        super(
            "Error: The category you tried to add already exists",
            fileName,
            lineNumber
        );
        this.name = "ParameterValidationException";
    }
}
class CategoryNoExists extends BaseException {
    constructor(fileName, lineNumber) {
        super(
            "Error: the category you are trying to delete doesn't exist",
            fileName,
            lineNumber
        );
        this.name = "ParameterValidationException";
    }
}
//! Podría hacer que no se puedan instanciar varios videoSystem

export let VideoSystem = (function () {
    //La función anónima devuelve un método getInstance que permite obtener el objeto único
    let instantiated; //Objeto con la instancia única ImageManager

    function init(name) {
        //Inicialización del Singleton
        class VideoSystem {
            #nameSystem;
            #users;
            #ProductsSystem;
            #actors;
            #directors;

            #defaultCategory = new Category("Categoria por defecto"); //Categoría por defecto

            #stores = [];
            #categories = [];
            #defaultCategoryProducts;
            /*{
		category;
		product[];
	}*/

            constructor(name) {
                this.#nameSystem = name;
                //Añadimos la categoria por defecto
                this.addCategory(this.#defaultCategory);
                //Asignamos la dirección de memoria de las producciones por defecto a defaultCategoryProducts
                this.#defaultCategoryProducts = this.#categories[0].products;
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
                if (typeof name != "string")
                    throw new InvalidValueException("name", "String");
                this.#nameSystem = name;
            }

            get categories() {
                // referencia para habilitar el closure en el objeto
                let array = this.#categories;
                return {
                    *[Symbol.iterator]() {
                        for (let category of array) {
                            yield category[category];
                        }
                    },
                };
            }
            #getPosCategory(category) {
                console.log(this.#categories);
                return this.#categories.findIndex(
                    (cat) => cat.category.name == category.name
                );
            }

            addCategory(category) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", "Category");
                if (this.#getPosCategory(category) != -1) {
                    throw new CategoryExists();
                }
                //añadimos un objeto con las claves
                //clave category -> Categoria que va a añadir el usuario
                //clave products -> array vacio que va a relacionar la categoria con sus producciones
                this.#categories.push({
                    category: category,
                    products: [],
                });
                return this;
            }
            removeCategory(category) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", Category);
                //No se puede eliminar la cateogria por defecto
                if (category.name.localeCompare(this.#defaultCategory.name)) {
                    throw "Tengo que añadir error";
                }
                let pos = this.#getPosCategory(category);

                if (pos == -1) {
                    throw new CategoryNoExists();
                }

                //!Tengo que probar si esto funciona
                let productsDefault = this.#categories[pos][products].filter(
                    (a) =>
                        this.#defaultCategoryProducts.some(
                            (b) => a.name != b.name
                        )
                );
                this.#defaultCategoryProducts.push(productsDefault);

                this.#categories.splice(pos, 1);
                return this;
            }

            //Factoria de Category
            getCategory(title) {
                let position = this.#categories.findIndex(
                    (cat) => cat.category.title === title
                );
                let category;
                if (position === -1) {
                    category = new Category(title);
                } else {
                    category = this.#categories[position].category;
                }
                return category;
            }
        }
        let instance = new VideoSystem(name); //Devolvemos el objeto ImageManager para que sea una instancia única.
        Object.freeze(instance);
        return instance;
    } //Fin inicialización del Singleton
    return {
        // Devuelve un objeto con el método getInstance
        getInstance: function (name) {
            if (!instantiated) {
                //Si la variable instantiated es undefined, primera ejecución, ejecuta init.
                instantiated = init(name); //instantiated contiene el objeto único
            }
            return instantiated; //Si ya está asignado devuelve la asignación.
        },
    };
})();
