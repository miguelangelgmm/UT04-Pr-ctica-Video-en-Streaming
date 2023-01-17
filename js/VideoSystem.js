"use strict";
import {
    BaseException,
    InvalidAccessConstructorException,
    EmptyValueException,
    ParameterValidationException,
    InvalidValueException,
    AbstractClassException,
} from "./BaseException.js";

import {
    Person,
    Category,
    Production,
    User,
    Movie,
    Resource,
    Serie,
} from "./ObjectStreaming.js";

class DataAlreadyExistsException extends BaseException {
    constructor(param, fileName, lineNumber) {
        super(
            `Error: The ${param} you tried to add already exists`,
            fileName,
            lineNumber
        );
        this.param = param;
        this.name = "DataAlreadyExistsException";
    }
}

class DataNotFoundException extends BaseException {
    constructor(param, fileName, lineNumber) {
        super(
            `Error: the ${param} you are trying to delete doesn't exist`,
            fileName,
            lineNumber
        );
        this.name = "ParameterValidationException";
    }
}
class CannotDeleteDefaultValueException extends BaseException {
    constructor(fileName, lineNumber) {
        super(
            `Error: you can't delete the default value`,
            fileName,
            lineNumber
        );
        this.name = "ParameterValidationException";
    }
}

export let VideoSystem = (function () {
    //La función anónima devuelve un método getInstance que permite obtener el objeto único
    let instantiated; //Objeto con la instancia única ImageManager

    function init(name) {
        //Inicialización del Singleton
        class VideoSystem {
            #nameSystem;
            #users = [];
            #productions = [];

            #defaultCategory = new Category("Categoria por defecto"); //Categoría por defecto

            //ACTORES Y DIRECTORES TAMBIÉN
            #categories = [];
            /*{
							category;
							productions=[];
						}*/
            #actors = [];
            /*{
							actor;
							production=[]
						}*/
            #directors = [];
            /*{
							directors;
							production=[]
						}*/
            #defaultCategoryProductions;
            #getPosCategory(category) {
                return this.#categories.findIndex(
                    (cat) => cat.category.name == category.name
                );
            }
            #removeProductions(productions, delProductions) {
                productions.forEach((prod, index) => {
                    if (delProductions.some((p) => p.title == prod.title))
                        //Si existe esa producción la eliminamos
                        productions.splice(index, 1);
                });
            }
            #addNewProductions(newProductions) {
                let newProds = newProductions.filter((product) =>
                    this.#productions.every((p) => p.title != product.title)
                );
                //Si no existen las producciones la añadimos
                this.#productions.push(...newProds);
            }
            constructor(name) {
                this.#nameSystem = name;
                //Añadimos la categoria por defecto
                this.addCategory(this.#defaultCategory);
                //Asignamos la dirección de memoria de las producciones por defecto a defaultCategoryProductions
                this.#defaultCategoryProductions =
                    this.#categories[0].productions;
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
                            yield category.category;
                        }
                    },
                };
            }

            addCategory(category) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", "Category");
                if (this.#getPosCategory(category) != -1) {
                    throw new DataAlreadyExistsException("category");
                }
                //añadimos un objeto con las claves
                //clave category -> Categoria que va a añadir el usuario
                //clave productions -> array vacio que va a relacionar la categoria con sus producciones
                this.#categories.push({
                    category: category,
                    productions: [],
                });
                console.log(this.#categories[0]);
                return this.#categories.length;
            }
            removeCategory(category) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", Category);
                //No se puede eliminar la cateogria por defecto
                if (category.name == this.#categories[0].name)
                    throw new CannotDeleteDefaultValueException();

                let pos = this.#getPosCategory(category);

                if (pos == -1) {
                    throw new DataNotFoundException(category);
                }
                //Obtenemos las producciones que no disponemos actualemente en la lista de por defecto
                let prodsDefault = this.#categories[pos].productions.filter(
                    (a) =>
                        this.#defaultCategoryProductions.some(
                            //!creo que esto seria every para que todas las producciones sean distinto nombre, mirar después
                            (b) => a.name != b.name
                        )
                );
                //Si la longitud del array es mayor a 0 añadimos las películas a defaultCategoryProductions
                if (prodsDefault.length)
                    this.#defaultCategoryProductions.push(prodsDefault);

                this.#categories.splice(pos, 1);
                return this.#categories.length;
            }

            //Factoria de Category
            getCategory(name, description = "") {
                let position = this.#getPosCategory(name);
                let category;
                position == -1
                    ? (category = new Category(name, description)) //si no existe la categoria la creamos
                    : (category = this.#categories[position].category); //si existe la recuperamos de la lista de categorias

                return category;
            }
            //	Devuelve un iterador que permite recorrer los usuarios del sistema
            get users() {
                // referencia para habilitar el closure en el objeto
                let array = this.#users;
                return {
                    *[Symbol.iterator]() {
                        for (let user of array) {
                            yield user;
                        }
                    },
                };
            }
            //añade un nuevo usuario
            addUser(user) {
                if (!(user instanceof User))
                    throw new InvalidValueException("user", "User");
                if (!user) throw new EmptyValueException("user");
                if (
                    this.#users.findIndex((u) => u.username == user.username) !=
                    -1
                )
                    throw new DataAlreadyExistsException(user.username);
                if (this.#users.findIndex((u) => u.email == user.email) != -1)
                    throw new DataAlreadyExistsException(user.email);

                this.#users.push(user);
                return this.#users.length;
            }
            //elimina un usuario
            removeUser(user) {
                if (!(user instanceof User))
                    throw new InvalidValueException("user", "User");
                if (!user) throw new EmptyValueException("user");
                pos = this.#users.findIndex((u) => u.name == user.name);
                if (pos == -1) {
                    throw new DataNotFoundException("user");
                }
                this.#users.splice(pos, 1);
                return this.#users.length;
            }
            //Factoria de user
            getUser(username, email, password) {
                let position = this.#getPosCategory(name);
                let user;
                position == -1
                    ? (user = new User(username, email, password)) //si no existe el usuario lo creamos
                    : (user = this.#users[position]); //si existe lo recuperamos de la lista de categorias

                return user;
            }

            //	Devuelve un iterador que permite recorrer las producciones del sistema
            get productions() {
                // referencia para habilitar el closure en el objeto
                let array = this.#productions;
                return {
                    *[Symbol.iterator]() {
                        for (let production of array) {
                            yield production;
                        }
                    },
                };
            }
            //añade una nueva producción
            addProduction(production) {
                if (!(production instanceof Production))
                    throw new InvalidValueException("production", "Production");
                if (!production) throw new EmptyValueException("production");

                if (
                    this.#productions.findIndex(
                        (product) => product.title == production.title
                    ) != -1
                )
                    throw new DataAlreadyExistsException(production.title);

                this.#productions.push(pos);
                return this.#productions.length;
            }
            //elimina una producción
            removeProduction(production) {
                if (!(production instanceof Production))
                    throw new InvalidValueException("production", "Production");
                if (!production) throw new EmptyValueException("production");
                let pos = this.#productions.findIndex(
                    (production) => production.title == production.title
                );
                if (pos == -1) {
                    throw new DataNotFoundException("production");
                }
                this.#productions.splice(pos, 1);
                return this.#productions.length;
            }
            //Factoria de Series
            getSerie(
                title,
                nationality = "",
                publication,
                synopsis = "",
                image = "",
                resource = [],
                locations = [],
                seasons
            ) {
                let position = this.#productions.findIndex(
                    (production) => production.title == production.title
                );
                let production;
                if (position == -1) {
                    //creamos una copia del array pasado por el usuario para evitar que pueda mentener su referencia
                    locations = [...locations];
                    resource = [...resource];
                    production = new Serie(
                        title,
                        nationality,
                        publication,
                        synopsis,
                        image,
                        resource,
                        locations,
                        seasons
                    );
                } else production = this.#productions[position]; //si existe lo recuperamos de la lista de productions

                return production;
            }
            //Factoria de Peliculas
            getMovie(
                title,
                nationality = "",
                publication,
                synopsis = "",
                image = "",
                resource = new Resource(0, "www.default.com"),
                locations = []
            ) {
                let position = this.#productions.findIndex(
                    (production) => production.title == production.title
                );
                let production;
                if (position == -1) {
                    //creamos una copia del array pasado por el usuario para evitar que pueda mentener su referencia
                    locations = [...locations];
                    //si no existe la producción
                    production = new Movie(
                        title,
                        nationality,
                        publication,
                        synopsis,
                        image,
                        resource,
                        locations
                    );
                } else production = this.#productions[position]; //si existe lo recuperamos de la lista de productions

                return production;
            }
            //ACTORES
            //	Devuelve un iterador que permite recorrer las producciones del sistema
            get actors() {
                // referencia para habilitar el closure en el objeto
                let array = this.#actors;
                return {
                    *[Symbol.iterator]() {
                        for (let actor of array) {
                            yield actor;
                        }
                    },
                };
            }
            //añade un nuevo actor
            addActor(actor) {
                if (!(actor instanceof Person))
                    throw new InvalidValueException("actor", "actor");
                if (!actor) throw new EmptyValueException("actor");

                if (
                    this.#actors.findIndex(
                        (act) => act.actors.name == actor.name
                    ) != -1
                )
                    throw new DataAlreadyExistsException(actor.name);

                this.#actors.push({ actor: actor, productions: [] });
                return this.#actors.length;
            }
            removeActor(actor) {
                if (!(actor instanceof actor))
                    throw new InvalidValueException("actor", "Actor");
                if (!actor) throw new EmptyValueException("actor");
                let pos = this.#actors.findIndex(
                    (act) => act.actor.name == actor.name
                );
                if (pos == -1) {
                    throw new DataNotFoundException("actor");
                }
                this.#actors.splice(pos, 1);
                return this.#actors.length;
            }
            //Factoria de Actores
            getActor(name, lastname1, lastname2 = "", born, picture = "") {
                let position = this.#actors.findIndex(
                    (actor) => actor.name == actor.name
                );
                let actor;
                position == -1
                    ? (actor = new Person(
                          name,
                          lastname1,
                          (lastname2 = ""),
                          born,
                          (picture = "")
                      )) //si no existe la producción
                    : (actor = this.#actors[position]); //si existe lo recuperamos de la lista de categorias

                return actor;
            }

            //Directores
            //	Devuelve un iterador que permite recorrer los directores del sistema
            get director() {
                // referencia para habilitar el closure en el objeto
                let array = this.#directors;
                return {
                    *[Symbol.iterator]() {
                        for (let director of array) {
                            yield director;
                        }
                    },
                };
            }
            //añade un nuevo actor
            addDirector(director) {
                if (!(director instanceof Person))
                    throw new InvalidValueException("director", "Director");
                if (!director) throw new EmptyValueException("director");

                if (
                    this.#directors.findIndex(
                        (direct) => direct.director.name == director.name
                    ) != -1
                )
                    throw new DataAlreadyExistsException(director.name);

                this.#directors.push({ director: director, productions: [] });
                return this.#directors.length;
            }
            removeDirector(directors) {
                if (!(directors instanceof directors))
                    throw new InvalidValueException("directors", "directors");
                if (!directors) throw new EmptyValueException("directors");
                let pos = this.#directors.findIndex(
                    (direct) => direct.director.name == directors.name
                );
                if (pos == -1) {
                    throw new DataNotFoundException("directors");
                }
                this.#directors.splice(pos, 1);
                return this.#directors.length;
            }
            //Factoria de Directores
            getDirector(name, lastname1, lastname2 = "", born, picture = "") {
                let position = this.#directors.findIndex(
                    (director) => director.name == director.name
                );
                let director;
                position == -1
                    ? (director = new Person(
                          name,
                          lastname1,
                          (lastname2 = ""),
                          born,
                          (picture = "")
                      )) //si no existe la producción
                    : (director = this.#directors[position]); //si existe lo recuperamos de la lista de categorias

                return director;
            }
            assignCategory(category, ...productions) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", "Category");

                if (
                    !productions.every(
                        (production) => production instanceof Production
                    )
                )
                    throw new InvalidValueException("production", "Production");

                //Si no existe la categoria la creamos
                let posCategory = this.#getPosCategory(category);
                if (posCategory == -1) {
                    this.addCategory(category);
                    posCategory = this.#getPosCategory(category);
                }
                //Filtramos la lista y la dejamos solo con las producciones necesarias
                let prods = productions.filter((product) =>
                    this.#categories[posCategory].productions.every(
                        (p) => p.title != product.title
                    )
                );
                this.#categories[posCategory].productions.push(...prods);
                //filtramos las producciones asiganadas y comprobamos si son nuevas y las añadimos
                //al array de producciones si no existen
                this.#addNewProductions(prods);

                return this.#categories[posCategory].productions.length;
            }

            deassignCategory(category, ...productions) {
                if (!(category instanceof Category))
                    throw new InvalidValueException("category", "Category");
                console.log(productions);
                if (
                    !productions.every(
                        (production) => production instanceof Production
                    )
                )
                    throw new InvalidValueException("production", "Production");

                //Obtenemos la posición de la categoria
                let posCategory = this.#getPosCategory(category);
                if (posCategory != -1) {
                    this.#removeProductions(
                        this.#categories[posCategory].productions,
                        productions
                    );

                    return this.#categories[posCategory].productions.length;
                }
                //Si la categoria no existe retorna undefined
            }

            assignDirector(director, ...productions) {
                if (!(director instanceof Person))
                    throw new InvalidValueException("director", "Person");

                if (
                    !productions.every(
                        (production) => production instanceof Production
                    )
                )
                    throw new InvalidValueException("production", "Production");

                //Si no existe el director lo creamos
                let posDirector = this.#getPosCategory(director);
                if (posDirector == -1) {
                    this.addCategory(director);
                    posDirector = this.#getPosCategory(director);
                }
                //Filtramos la lista y la dejamos solo con las producciones necesarias
                let prods = productions.filter((product) =>
                    this.#directors[posDirector].productions.every(
                        (p) => p.title != product.title
                    )
                );
                //Si no existen las producciones la añadimos

                this.#directors[posDirector].productions.push(...prods);
                this.#addNewProductions(prods);

                return this.#directors[posDirector].productions.length;
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

//!Cuando haga lo del array opcional tengo que tener cuidado con la referencia de la memoria
