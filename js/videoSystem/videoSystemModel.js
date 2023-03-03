"use strict";
import {
	BaseException,
	InvalidAccessConstructorException,
	EmptyValueException,
	ParameterValidationException,
	InvalidValueException,
	AbstractClassException,
} from "../BaseException.js";

import {
	Person,
	Category,
	Production,
	User,
	Movie,
	Resource,
	Serie,
} from "../entities/videoSystem.js";

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
		super(`Error: you can't delete the default value`, fileName, lineNumber);
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

			#defaultCategory = new Category("General"); //Categoría por defecto

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
			//Producciones asiganadas a la categoria por defecto
			#defaultCategoryProductions;

			/**
			 * retorna el indice de la categoria en el array de categorias que tiene el mismo nombre que la categoria pasada por parámetro
			 * @param category - Categoria
			 * @returns Indice
			 */
			#getPosCategory(category) {
				return this.#categories.findIndex(
					(
						cat //Quiero que no diferencie entre mayúsculas y tildes
					) =>
						cat.category.name.localeCompare(category, "en", {
							sensitivity: "base",
						}) == 0
				);
			}

			/**
			 * retorna el indice del director en el array de directores que tiene el mismo nombre que el del director pasada por parámetro
			 * @param category - director
			 * @returns Indice
			 */
			#getPosDirector(director) {
				return this.#directors.findIndex(
					(direct) =>
						direct.director.name.localeCompare(director.name, "en", {
							sensitivity: "base",
						}) == 0
				);
			}

			/**
			 * retorna el indice de un actor en el array de actores
			 * @param actor - El actor del cual queremos obtener la posición
			 * @returns El índice de la posición del actor
			 */
			#getPosActor(actor) {

				return this.#actors.findIndex(

					(act) =>{
						return (
							act.actor.name.localeCompare(actor.name, "en", {sensitivity: "base",}) == 0 &&
							act.actor.lastname1.localeCompare(actor.lastname1,"en",{sensitivity:"base"})==0
						)
					}

				);
			}

			/**
			 * Elimina una o más producciones de un array
			 * @param  productions productión a eliminar
			 * @param  delProductions array de producciones
			 */
			#removeProductions(productions, delProductions) {
				productions.forEach((prod, index) => {
					//Si ese
					if (
						delProductions.some(
							(p) => p.title.localeCompare(prod.title),
							"en",
							{
								sensitivity: "base",
							}
						) == 0
					) {
						//Si existe esa producción la eliminamos
						productions.splice(index, 1);
					}
				});
			}

			/**
			 * 	Añade una nueva producción al array de producciones
			 * @param newProductions
			 */
			#addNewProductions(newProductions) {
				let newProds = newProductions.filter((product) =>
					this.#productions.every(
						(p) => p.title.localeCompare(product.title),
						"en",
						{ sensitivity: "base" } == 0
					)
				);
				//Si no existen las producciones la añadimos
				this.#productions.push(...newProds);
			}

			/**
			 * Elimina un objeto production de una lista de actores,productores o categorias
			 * @param production - La producción que va a ser eliminada
			 * @param list - lista de producciones
			 */
			#removeProduction(production, list) {
				list.forEach((product) => {
					//buscamos si dispone de la pelicula que queremos eliminar
					let pos = product.productions.findIndex(
						(p) => p.title == production.title
					);
					//Si existe la eliminamos
					if (pos != -1) {
						product.productions.splice(pos, 1);
					}
				});
			}

			constructor(name) {
				this.#nameSystem = name;
				//Añadimos la categoria por defecto
				this.addCategory(this.#defaultCategory);
				//Asignamos la dirección de memoria de las producciones por defecto a defaultCategoryProductions
				this.#defaultCategoryProductions = this.#categories[0].productions;
			}
			//Retorna el nombre del sistema
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
			//Iterador de categorias
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
			/**
			 * añade una categoria al array de categorias
			 * @param category
			 * @returns
			 */
			addCategory(category) {
				if (!(category instanceof Category))
					throw new InvalidValueException("category", "Category");

				if (this.#getPosCategory(category.name) != -1) {
					throw new DataAlreadyExistsException("category");
				}
				//añadimos un objeto con las claves
				//clave category -> Categoria que va a añadir el usuario
				//clave productions -> array vacio que va a relacionar la categoria con sus producciones
				this.#categories.push({
					category: category,
					productions: [],
				});
				return this.#categories.length;
			}
			/**
			 * elimina una categoria de la lista de categorias
			 * @param category
			 * @returns
			 */
			removeCategory(category) {
				if (!(category instanceof Category))
					throw new InvalidValueException("category", Category);
				//No se puede eliminar la cateogria por defecto
				if (category.name == this.#categories[0].category.name)
					throw new CannotDeleteDefaultValueException();
				//obtenemos la posición de la categoria
				let pos = this.#getPosCategory(category.name);

				if (pos == -1) {
					throw new DataNotFoundException(category);
				}
				//Obtenemos las producciones que no disponemos actualemente en la lista de por defecto
				let prodsDefault = this.#categories[pos].productions.filter((a) =>
					this.#categories[0].productions.every((b) => a.title != b.title)
				);
				//Si la longitud del array es mayor a 0 añadimos las películas a categ#categories[0]category
				if (prodsDefault.length)
					this.#categories[0].productions.push(...prodsDefault);

				this.#categories.splice(pos, 1);
				return this.#categories.length;
			}

			//Factoria de Category
			getCategory(name, description = "") {
				if (name === "undefined" || name === "")
					throw new EmptyValueException("name");
				//obtenemos la posición de la categoria
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
					//Comparamos sin tener en cuenta mayúsculas y tildes
					this.#users.findIndex(
						(u) =>
							u.username.localeCompare(user.username, "es", {
								sensitivity: "base",
							}) == 0
					) != -1
				)
					throw new DataAlreadyExistsException("username");
				if (
					this.#users.findIndex(
						(u) =>
							u.email.localeCompare(user.email, "es", {
								sensitivity: "base",
							}) == 0
					) != -1
				)
					throw new DataAlreadyExistsException("email");

				this.#users.push(user);
				return this.#users.length;
			}
			//elimina un usuario
			removeUser(user) {
				if (!(user instanceof User))
					throw new InvalidValueException("user", "User");
				if (!user) throw new EmptyValueException("user");
				let pos = this.#users.findIndex((u) => u.username == user.username);
				if (pos == -1) {
					throw new DataNotFoundException("user");
				}
				this.#users.splice(pos, 1);
				return this.#users.length;
			}
			//Factoria de user
			getUser(username, email, password) {
				if (username === "undefined" || username === "")
					throw new EmptyValueException("username");
				let position = this.#users.findIndex(
					(u) =>
						username.localeCompare(u.username, "es", {
							sensitivity: "base",
						}) == 0
				);
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
				//obtenemos la posición de la producción en la lista de producciones
				let pos = this.#productions.findIndex(
					(product) => product.title == production.title
				);
				//Si la producción se encuentra en la lista lanzamos una exepción
				if (pos != -1) {
					throw new DataAlreadyExistsException("production");
				}
				//añadimos la producción y retornamos la longitud
				return this.#productions.push(production);
			}
			//elimina una producción
			removeProduction(production) {
				if (!(production instanceof Production))
					throw new InvalidValueException("production", "Production");
				if (!production) throw new EmptyValueException("production");
				let pos = this.#productions.findIndex(
					(prod) => prod.title == production.title
				);
				if (pos == -1) {
					throw new DataNotFoundException("production");
				}
				//eliminamos la produción de la lista de reproducciones
				this.#productions.splice(pos, 1);
				//eliminamos la produción de las demas listas
				this.#removeProduction(production, this.#directors);
				this.#removeProduction(production, this.#actors);
				this.#removeProduction(production, this.#categories);

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
				if (title === "undefined" || title === "")
					throw new EmptyValueException("name");

				let position = this.#productions.findIndex((production) => {
					return (
						title.localeCompare(production.title, "en", {
							sensitivity: "base",
						}) == 0
					);
				});
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
				if (title === "undefined" || title === "")
					throw new EmptyValueException("name");
				let position = this.#productions.findIndex((production) => {
					return (
						title.localeCompare(production.title, "en", {
							sensitivity: "base",
						}) == 0
					);
				});
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
							yield actor.actor;
						}
					},
				};
			}
			//añade un nuevo actor
			addActor(actor) {
				if (!(actor instanceof Person))
					throw new InvalidValueException("actor", "Person");
				if (!actor) throw new EmptyValueException("actor");

				if (this.#actors.findIndex((act) =>{return act.actor.name == actor.name && act.actor.lastname1 == actor.lastname1}) != -1)
					throw new DataAlreadyExistsException("actor");

				this.#actors.push({ actor: actor, productions: [] });
				return this.#actors.length;
			}
			removeActor(actor) {
				if (!(actor instanceof Person))
					throw new InvalidValueException("actor", "Peron");
				if (!actor) throw new EmptyValueException("actor");
				let pos = this.#actors.findIndex((act) => act.actor.name == actor.name);
				//Si no existe lanza un error
				if (pos == -1) {
					throw new DataNotFoundException("actor");
				}
				this.#actors.splice(pos, 1);
				return this.#actors.length;
			}
			//Factoria de Actores
			getActor(name, lastname1, lastname2 = "", born, picture = "") {
				if (name === "undefined" || name === "")
					throw new EmptyValueException("name");
				let position = this.#actors.findIndex((act) => {
					return (
						name.localeCompare(act.actor.name, "es", { sensitivity: "base" }) ==
							0 &&
						lastname1.localeCompare(act.actor.lastname1, "es", {
							sensitivity: "base",
						}) == 0
					);
				});

				let actor;
				if (position == -1) {
					actor = new Person(name, lastname1, lastname2, born, picture);
				} else {
					//si no existe la producción
					actor = this.#actors[position].actor;
				}
				//si existe lo recuperamos de la lista de categorias

				return actor;
			}
			//Comprueba si existe un actor
			checkActor(name,lastname1){
				return this.#actors.findIndex((act) => {
					return (
						name.localeCompare(act.actor.name, "es", { sensitivity: "base" }) ==
							0 &&
						lastname1.localeCompare(act.actor.lastname1, "es", {
							sensitivity: "base",
						}) == 0
					);
				}) != -1
			}
			//Comprueba si existe un director
			checkDirector(name,lastname1){
				return this.#directors.findIndex((director) => {
					return (
						name.localeCompare(director.director.name, "es", { sensitivity: "base" }) ==
							0 &&
						lastname1.localeCompare(director.director.lastname1, "es", {
							sensitivity: "base",
						}) == 0
					);
				}) != -1
			}

			//Directores
			//	Devuelve un iterador que permite recorrer los directores del sistema
			get director() {
				// referencia para habilitar el closure en el objeto
				let array = this.#directors;
				return {
					*[Symbol.iterator]() {
						for (let director of array) {
							yield director.director;
						}
					},
				};
			}
			//añade un nuevo actor
			addDirector(director) {
				if (!(director instanceof Person))
					throw new InvalidValueException("director", "Director");
				if (!director) throw new EmptyValueException("director");

				if (this.#getPosDirector(director) != -1)
					throw new DataAlreadyExistsException("director");

				this.#directors.push({ director: director, productions: [] });
				return this.#directors.length;
			}
			removeDirector(directors) {
				if (!(directors instanceof Person))
					throw new InvalidValueException("directors", "Person");
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
				if (name === "undefined" || name === "")
					throw new EmptyValueException("name");
				let position = this.#directors.findIndex(
					(direct) =>
						name.localeCompare(direct.director.name, "es", {
							sensitivity: "base",
						}) == 0
				);

				let director;
				position == -1
					? (director = new Person(name, lastname1, lastname2, born, picture)) //si no existe la producción
					: (director = this.#directors[position].director); //si existe lo recuperamos de la lista de categorias

				return director;
			}
			/**
			 * Asigna una o más producciones a una categoria
			 * @param category - Category
			 * @param productions - Array de producciones para asignar a la categoria
			 * @returns El número de producciones que tiene la categoria
			 */ assignCategory(category, ...productions) {
				if (!(category instanceof Category))
					throw new InvalidValueException("category", "Category");

				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Si no existe la categoria la creamos
				let posCategory = this.#getPosCategory(category.name);
				if (posCategory == -1) {
					this.addCategory(category);
					posCategory = this.#getPosCategory(category.name);
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
			//elimina una producción de una categoria
			deassignCategory(category, ...productions) {
				if (!(category instanceof Category))
					throw new InvalidValueException("category", "Category");
				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Obtenemos la posición de la categoria
				let posCategory = this.#getPosCategory(category.name);
				if (posCategory != -1) {
					this.#removeProductions(
						this.#categories[posCategory].productions,
						productions
					);

					return this.#categories[posCategory].productions.length;
				}
				//Si la categoria no existe retorna undefined
			}
			/**
			 * Asigna una o más producciones a un director
			 * @param director - Person
			 * @param productions - Array de producciones para asignar al director
			 * @returns El número de producciones que tiene el director
			 */
			assignDirector(director, ...productions) {
				if (!(director instanceof Person))
					throw new InvalidValueException("director", "Person");

				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Si no existe el director lo creamos
				let posDirector = this.#getPosDirector(director);
				if (posDirector == -1) {
					this.addDirector(director);
					posDirector = this.#getPosDirector(director);
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
			//Elimina una producción de un director
			deassignDirector(director, ...productions) {
				if (!(director instanceof Person))
					throw new InvalidValueException("director", "Person");
				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Obtenemos la posición de la categoria
				let posDirector = this.#getPosDirector(director);
				if (posDirector != -1) {
					this.#removeProductions(
						this.#directors[posDirector].productions,
						productions
					);

					return this.#directors[posDirector].productions.length;
				}
				//Si el director no existe retorna undefined
			}

			/**
			 * Asigna una o más producciones a un actor
			 * @param actor - Person
			 * @param productions - Array de producciones para asignar al actor
			 * @returns El número de producciones que tiene el actor
			 */
			assignActor(actor, ...productions) {
				if (!(actor instanceof Person))
					throw new InvalidValueException("actor", "Person");

				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Si no existe el actor lo creamos
				let posActor = this.#getPosActor(actor);
				if (posActor == -1) {
					this.addActor(actor);
					posActor = this.#getPosActor(actor);
				}
				//Filtramos la lista y la dejamos solo con las producciones necesarias
				let prods = productions.filter((product) =>
					this.#actors[posActor].productions.every(
						(p) => p.title != product.title
					)
				);
				//Si no existen las producciones la añadimos

				this.#actors[posActor].productions.push(...prods);
				this.#addNewProductions(prods);

				return this.#actors[posActor].productions.length;
			}
			deassignActor(actor, ...productions) {
				if (!(actor instanceof Person))
					throw new InvalidValueException("actor", "Person");
				if (
					!productions.every(
						(production) => production instanceof Production
					) ||
					productions.length == 0
				)
					throw new InvalidValueException("production", "Production");

				//Obtenemos la posición de la categoria
				let posActor = this.#getPosActor(actor);
				if (posActor != -1) {
					this.#removeProductions(
						this.#actors[posActor].productions,
						productions
					);
					return this.#actors[posActor].productions.length;
				}
			}

			*getCast(production) {
				if (!(production instanceof Production))
					throw new InvalidValueException("production", "Production");
				//Obtenemos los actores que han actuado en la película
				for (let actor of this.#actors.filter(function (prod) {
					return prod.productions.some(
						(p) => p.title == production.title
					);
				})) {
					yield actor.actor;
				}
			}
			*getCastDirector(production) {
				if (!(production instanceof Production))
					throw new InvalidValueException("production", "Production");
				//Obtenemos los directores que han dirigido la película
				for (let director of this.#directors.filter(function (prod) {
					return prod.productions.some(
						(p) => p.title == production.title
					);
				})) {
					yield director.director;
				}
			}

			*getProductionDirector(director) {
				if (!(director instanceof Person))
					throw new InvalidValueException("director", "Person");
				// referencia para habilitar el closure en el objeto

				let array = this.#directors[this.#getPosDirector(director)].productions;

				for (let production of array) {
					yield production;
				}
			}
			*getProductionActor(actor) {
				if (!(actor instanceof Person))
					throw new InvalidValueException("actor", "Person");
				// referencia para habilitar el closure en el objeto

				let array = this.#actors[this.#getPosActor(actor)].productions;

				for (let production of array) {
					yield production;
				}
			}
			*getProductionCategory(category) {
				if (!(category instanceof Category))
					throw new InvalidValueException("category", "Category");
				// referencia para habilitar el closure en el objeto

				let array =
					this.#categories[this.#getPosCategory(category.name)].productions;
				for (let production of array) {
					yield production;
				}
			}
			*getCategoryProduction(production) {
				if (!(production instanceof Production))
					throw new InvalidValueException("production", "Production");
				// referencia para habilitar el closure en el objeto
				let categories = this.#categories;
				for (const category of categories) {
					if(category.productions.includes(production)){
						yield category.category
					}

				}
			}


			//Permite obtener 3 producciones aleatorias
			*randomProductions() {
				let array = [];
				let length = this.#productions.length;

				while (array.length < 3) {
					let newPosition = Math.floor(Math.random() * length);
					let production = this.#productions[newPosition];
					if (!array.includes(production)) {
						array.push(production);
						yield production;
					}
				}
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
