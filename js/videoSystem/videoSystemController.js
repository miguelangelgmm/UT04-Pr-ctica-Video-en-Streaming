import { Coordinate, Resource } from '../entities/videoSystem.js';

class VideoSystemController {

	#videoSystem;
	#videoSystemView;
	#randomProductions;
	#loadVideoSystemObjects() {

		//añadir otro .then para las peliculas aleatorias
		fetch("./data.json", {
			method: 'POST'
		})
			.then(response => response.json())//response.json() convierte la respuesta en un objeto javaScript
			.then(data => {
				data.users.forEach(user => {
					this.#videoSystem.addUser(this.#videoSystem.getUser(user.name, user.mail, user.password))

				});

				/**Categorias*/
				data.categories.forEach((category) => {
					if (category.name != "General") {
						//La categoria general es la categoria por defecto
						this.#videoSystem.addCategory(this.#videoSystem.getCategory(category.name, category.description))
					}
					//movies
					category.movies.forEach((nameMovie) => {
						this.#videoSystem.assignCategory(
							this.#videoSystem.getCategory(category.name),
							this.#videoSystem.getMovie(
								data.productions[nameMovie].title,
								data.productions[nameMovie].nationality,
								new Date(Date.parse(data.productions[nameMovie].publication)
								),
								data.productions[nameMovie].synopsis,
								data.productions[nameMovie].image,
								new Resource(
									data.productions[nameMovie].Resource.time,
									data.productions[nameMovie].Resource.link
								),
								[
									new Coordinate(data.productions[nameMovie].Coordinate.lat, data.productions[nameMovie].Coordinate.long),
								]
							)
						);
						//actores
						try {
							data.productions[nameMovie].actors.forEach((person) => {
								this.#videoSystem.assignActor(
									this.#videoSystem.getActor(
										data.actors[person].name,
										data.actors[person].lastname1,
										data.actors[person].lastname2,
										new Date(Date.parse(data.actors[person].born)),
										data.actors[person].picture
									),
									this.#videoSystem.getMovie(nameMovie)
								);
							})
							//director
							data.productions[nameMovie].directors.forEach((person) => {
								this.#videoSystem.assignDirector(
									this.#videoSystem.getDirector(
										data.directors[person].name,
										data.directors[person].lastname1,
										data.directors[person].lastname2,
										new Date(Date.parse(data.directors[person].born)),
										data.directors[person].picture
									),
									this.#videoSystem.getMovie(nameMovie)
								);
							})
						} catch (e) {
							//Si esa pelicula ya tiene los actores lanzara un error, lo omitimos y simplemente asignamos la pelicula a la categoria
						}
					})
					//Series
					category.series.forEach((nameSerie) => {

						const resources = data.productions[nameSerie].Resource.map((resource) => {
							return new Resource(resource.time, resource.link);
						});
						this.#videoSystem.assignCategory(
							this.#videoSystem.getCategory(category.name),
							this.#videoSystem.getSerie(

								data.productions[nameSerie].title,
								data.productions[nameSerie].nationality,
								new Date(Date.parse(data.productions[nameSerie].publication)
								),
								data.productions[nameSerie].synopsis,
								data.productions[nameSerie].image,
								
								[...resources],
								[
									new Coordinate(data.productions[nameSerie].Coordinate.lat, data.productions[nameSerie].Coordinate.long),
								],
								data.productions[nameSerie].season
							))
						//actores
						try {
							data.productions[nameSerie].actors.forEach((person) => {
								this.#videoSystem.assignActor(
									this.#videoSystem.getActor(
										data.actors[person].name,
										data.actors[person].lastname1,
										data.actors[person].lastname2,
										new Date(Date.parse(data.actors[person].born)),
										data.actors[person].picture
									),
									this.#videoSystem.getSerie(nameSerie)
								);
							})
							//director
							data.productions[nameSerie].directors.forEach((person) => {
								this.#videoSystem.assignDirector(
									this.#videoSystem.getDirector(
										data.directors[person].name,
										data.directors[person].lastname1,
										data.directors[person].lastname2,
										new Date(Date.parse(data.directors[person].born)),
										data.directors[person].picture
									),
									this.#videoSystem.getSerie(nameSerie)
								);
							})
						} catch (e) {
							//Si esa pelicula ya tiene los actores lanzara un error, lo omitimos y simplemente asignamos la pelicula a la categoria
						}
					})
				});

			}).then(() => {
				this.loadNavJSON()
				this.#randomProductions = [...this.#videoSystem.randomProductions()];
				this.onAddRandomProductionLoad();
				this.#videoSystemView.bindProductions(this.handleCategoryListProduction)
			}
			).catch((e) => {
				console.log(e)
			})





		/**Categorias*/
		/*
		this.#videoSystem.addCategory(this.#videoSystem.getCategory("Comedia", "Género que busca hacer reír al espectador y proporcionar un escape de la vida cotidiana a través del humor"));
		this.#videoSystem.addCategory(this.#videoSystem.getCategory("Acción", "Género emocionante que se centra en la acción y el suspense. Estas películas a menudo incluyen persecuciones, peleas, explosiones y otros efectos especiales para crear una experiencia de visualización intensa y emocionante."));
		this.#videoSystem.addCategory(this.#videoSystem.getCategory("Fantasía", "Género que se basa en elementos imaginarios, como magia, seres fantásticos, mundos imaginarios y otros elementos que no existen en el mundo real. Este género permite a los cineastas explorar historias y personajes que van más allá de lo posible en la vida real."));

*/

	}
	constructor(model, view) {
		this.#videoSystem = model;
		this.#videoSystemView = view;

		//Cargamos todos los objetos
		this.#loadVideoSystemObjects();

		//Obtengo 3 producciones aleatorias para mostrarlas al cargar, las voy a guardar en un array para mantener las mismas al usuario
		//hasta que reinicie la página ahora se va a cargar una vez se cargen los datos del JSON
		//!	this.#randomProductions = [...model.randomProductions()];

		this.onLoad();

	}

	/**Contenido que se al entrar la web */
	onLoad = () => {

		//!cargamos las producciones aleatorias ahora se van a cargar una vez se cargen los datos del JSON
		//!	this.onAddRandomProductionLoad();

		//vinculamos las funciones a la vista

		//viculamos la lista de actores, directores y  botón de inicio, estos elementos solo se van a vincular la primera vez
		this.#videoSystemView.bindActorPersonList(this.handleActors);
		this.#videoSystemView.bindDirectorPersonList(this.handleDirector);
		this.#videoSystemView.bindInit(this.handleInit);
		//vinculamos cerrar todas las ventnas
		this.#videoSystemView.bindCloseWindows(this.handleCloseAllNewWindows)

		//mostramos el formulario de gestión
		this.#videoSystemView.showAdminNav();
		//vinculamos sus eventos correspondientes
		this.#videoSystemView.bindAdminMenu(
			this.handlerNewProduction,
			this.handlerRemoveProduction,
			this.handlerAssignPerson,
			this.handlerManageCategory,
			this.handlerNewPerson,
			this.handleRemovePerson
		);

		if (document.cookie == "username=admin") {
			this.#videoSystemView.loadNavbar(true);
			//mostramos el boton de cerrra sesion
			this.#videoSystemView.bttnCloseSession();
			//asignamos el evento para eliminar la cookie
			this.#videoSystemView.bindRemoveCookie(this.handleRemoveCookie);
		} else {
			this.#videoSystemView.loadNavbar(false);

			this.#videoSystemView.bindShowFormLogin(this.handleShowLogin)

		}
	}
	loadNavJSON = () => {
		//cargamos los elementos del navegador
		this.onAddCategoryNav();
		//cargamos las categorias en el main
		this.onAddCategoryMain();
		//Si pulsamos en las categorias mostrara la lista que corresponda a esa categoria
		this.#videoSystemView.bindProductions(this.handleCategoryListProduction)
	}
	//Cuando vuelvo a home
	onInit = () => {
		//cargamos la categoria en el main y vinculamos su evento
		this.onAddCategoryMain();
		//añadimos las produciones aleatorias al pulsar en inicio
		this.onAddRandomProductionLoad();
		this.#videoSystemView.bindProductions(this.handleCategoryListProduction)

	}
	//controlador de la  función de inicio
	handleInit = () => {
		this.onInit();
	}
	//va a mostrar la lista de categorias en el navegador y vincular el evento para listar las películas de cada categoria
	onAddCategoryNav = () => {
		this.#videoSystemView.showCategoriesInNav(this.#videoSystem.categories);
		this.#videoSystemView.bindProductionsNavCategoryList(this.handleProductsCategoryList)
	}
	//muestra 3 producciones aleatorias
	onAddRandomProductionLoad = () => {
		//puedo generar otras 3 peliculas aleatorias o mantenerlas
		this.#videoSystemView.showProductionInLoad(this.#randomProductions);
	}
	//va a mostrar la lista de categorias en el main y vincular el evento para listar las películas de cada categoria
	onAddCategoryMain = () => {
		this.#videoSystemView.showCategoriesInMain(this.#videoSystem.categories);
		this.#videoSystemView.bindProductionsCategoryList(this.handleProductsCategoryList);
	}


	/*
	función que se ejecuta cuando el usuario hace click en una categoría en la lista de categorías.
	La función toma como parámetro el título de la categoría.
	Obtenemos la categoría que tiene ese título
	Listamos las películas
	Asignamos el evento correspondiente para ver los datos de cada película
*/
	handleProductsCategoryList = (title) => {
		let category = this.#videoSystem.getCategory(title);
		this.#videoSystemView.listProductions(this.#videoSystem.getProductionCategory(category), title);
		this.#videoSystemView.bindProductions(this.handleCategoryListProduction)
	}
	/*
	función que se ejecuta cuando el usuario hace click en en una producción.
	tomamos como parámetro el nombre de la película.
	Obtenemos la producción que tiene ese título
	Obtenemos las categorias que tienen esa película
	Obtenemos el casting de actores
	Obtenemos los directores de la película
	Mostamos la película con sus actores y sus directores
	Asignamos el evento correspondiente para ver los datos de las categorias y las personas
*/
	handleCategoryListProduction = (title) => {

		let production = this.#videoSystem.getMovie(title);
		let categories = this.#videoSystem.getCategoryProduction(production)
		let actors = this.#videoSystem.getCast(production);
		let directors = this.#videoSystem.getCastDirector(production)
		this.#videoSystemView.showProduction(production, categories, directors, actors);
		this.#videoSystemView.bindProductionsCategoryList(this.handleProductsCategoryList);
		this.#videoSystemView.bindShowPerson(this.handleShowPerson)
		this.#videoSystemView.bindShowProductionInNewWindow(this.handleShowProductionNewWindow)

	}
	/**Función que se ejecuta cuando pulsamos en actores, en este caso llamamos a la función onActorList--> on hace referencia a onLoad */
	handleActors = () => {
		this.onActorList();
	}
	/**Función que se ejecuta cuando pulsamos en directores, en este caso llamamos a la función onDirectorList--> on hace referencia a onLoad */
	handleDirector = () => {
		this.onDirectorList();
	}

	/*función que va a listar todos los actores y les va a asignar un evento para mostrar sus datos */
	onActorList = () => {
		let iterator = this.#videoSystem.actors[Symbol.iterator]();
		this.#videoSystemView.showListPersons(iterator)
		this.#videoSystemView.bindShowPerson(this.handleShowPerson)
	}
	/*función que va a listar todos los directores y les va a asignar un evento para mostrar sus datos */
	onDirectorList = () => {
		let iterator = this.#videoSystem.director[Symbol.iterator]();
		this.#videoSystemView.showListPersons(iterator)
		this.#videoSystemView.bindShowPerson(this.handleShowPerson)
	}
	/**
	 * función que se ejecuta para mostrar los datos de una persona y toma como parámetro name
	 */
	handleShowPerson = (name) => {
		//el name esta compuesto por nombre y apellido
		let fullName = name.split("||")
		let person;
		let acted;
		let directed;
		//comprobamos si esta persona es un actor
		if (this.#videoSystem.checkActor(fullName[0], fullName[1])) {
			//si es un actor le asignamos la la variable person con getActor y obtenemos sus produciones donde ha actuado
			person = this.#videoSystem.getActor(fullName[0], fullName[1]);
			acted = this.#videoSystem.getProductionActor(person)
		}
		//comprobamos si es un director
		if (this.#videoSystem.checkDirector(fullName[0], fullName[1])) {
			//si es un director le asignamos la la variable person con getActor y obtenemos sus produciones donde ha actuado
			person = this.#videoSystem.getDirector(fullName[0], fullName[1]);
			directed = this.#videoSystem.getProductionDirector(person)

		}
		//mostramos las producciones
		this.#videoSystemView.showPerson(person, directed, acted)
		//enlazamos los eventos de las producciones
		this.#videoSystemView.bindProductions(this.handleCategoryListProduction);
	}

	handleShowProductionNewWindow = (title) => {
		let production = this.#videoSystem.getMovie(title);
		let categories = this.#videoSystem.getCategoryProduction(production)
		let actors = this.#videoSystem.getCast(production);
		let directors = this.#videoSystem.getCastDirector(production)
		this.#videoSystemView.showProductionInNewWindow(production, categories, actors, directors);
	}


	/*método que cierra todas las ventanas que han sido abiertas y limpian el mapa de ventanas */
	handleCloseAllNewWindows = () => {

		for (const window of this.#videoSystemView.newWindows.values()) {
			//cerramos las ventanas
			window.close()
			/* Si quiero cerrar pasado un tiempo
			setTimeout(function() {
				window.close()
			}, 400);
		*/
		}
		this.#videoSystemView.newWindows.clear()
	}

	//----Formulario

	handlerNewProduction = () => {

		this.#videoSystemView.showFormAddProduction(this.#videoSystem.categories, this.#videoSystem.actors, this.#videoSystem.director);
		this.#videoSystemView.bindFormNewProduction(this.handleNewProduction)


	}
	handlerRemoveProduction = () => {
		let productions = this.#videoSystem.productions;
		this.#videoSystemView.showFormRemoveProduction(productions)
		this.#videoSystemView.bindUpdateShowRemoveProduction(this.handleUpdateRemoveProduction)
		this.#videoSystemView.bindRemoveProduction(this.handlerRemoveProductionDelProduction)

	}
	handlerAssignPerson = () => {
		this.#videoSystemView.showFormAsignPerson(this.#videoSystem.productions, this.#videoSystem.actors, this.#videoSystem.director);
		this.#videoSystemView.bindUpdateAsignPerson(this.handleUpdateAsignPerson)
		this.#videoSystemView.bindUpdateAsignProuction(this.handleUpdateProductionAsignPerson)
		this.#videoSystemView.bindFormAsignPerson(this.handleAssignProductionAsignPerson)

	}
	handlerManageCategory = () => {
		let categories = this.#videoSystem.categories;
		this.#videoSystemView.showFormManagerCategory(categories);
		this.#videoSystemView.bindRemoveCategory(this.hadlerRemoveCategory)
		this.#videoSystemView.bindNewCategory(this.handleNewCategory)
	}
	handlerNewPerson = () => {
		this.#videoSystemView.showFormNewPerson();
		this.#videoSystemView.bindFormNewPerson(this.handleCreateNewPerson);
	}
	handleCreateNewPerson = (name, lastname1, lastname2, date, type, img) => {

		let done;
		//intentamos crear el actor o el director
		try {
			if (type == "Actor") {
				this.#videoSystem.addActor(this.#videoSystem.getActor(name, lastname1, lastname2, new Date(Date.parse(date)), img))
			}
			else {
				this.#videoSystem.addDirector(this.#videoSystem.getDirector(name, lastname1, lastname2, new Date(Date.parse(date)), img))
			}
			done = true
		} catch (e) {
			//si no se ha podido crear el actor ponemos done a false, en el modal mostraremos un mensaje de error
			done = false;
		}
		this.#videoSystemView.showFormNewPersonModal(done, name, lastname1, type)
	}

	handleRemovePerson = () => {

		let actors = this.#videoSystem.actors;
		let directors = this.#videoSystem.director
		this.#videoSystemView.showFormRemovePerson(actors, directors);
		this.#videoSystemView.bindUpdateShowRemovePerson(this.handleUpdateRemovePerson)
		this.#videoSystemView.bindFormRemovePerson(this.handledelRemovePerson)
	}
	handledelRemovePerson = (name) => {
		name = name.trim();
		let done;

		try {
			if (name.includes("(actor)")) {
				name = name.replaceAll("(actor)", "")
				try {
					this.#videoSystem.removeActor(this.#videoSystem.getActorFullName(name));
				} catch (e) {
				}
			} else {
				name = name.replaceAll("(director)", "")

				this.#videoSystem.removeDirector(this.#videoSystem.getDirectorFullName(name));
			}
			done = true;
		} catch (e) {
			done = false;
		}

		this.#videoSystemView.showFormRemovePersonModal(done, name)

	}

	handleUpdateRemovePerson = (name) => {
		name = name.trim();
		if (name.includes("(actor)")) {
			name = name.replaceAll("(actor)", "")
			try {
				this.#videoSystemView.updateRemovePeson(this.#videoSystem.getActorFullName(name));
			} catch (e) {
			}
		}
		else if (name.includes("(director)")) {
			name = name.replaceAll("(director)", "")
			try {
				this.#videoSystemView.updateRemovePeson(this.#videoSystem.getDirectorFullName(name));
			} catch (e) {
			}
		}
		else {
			this.#videoSystemView.updateDefaultRemovePeson()
		}
	}

	handleUpdateRemoveProduction = (title) => {
		title = title.trim();
		try {
			//si existe esa pelicula la mostramos
			let production = this.#videoSystem.getMovie(title)
			this.#videoSystemView.updateRemoveProduction(production)
		} catch (e) {
			//si no existe mostramos las caracteriscias por defecto
			this.#videoSystemView.updateDefaultRemoveProduction()
		}
	}

	handlerRemoveProductionDelProduction = (name) => {

		let done;
		try {
			let production = this.#videoSystem.getMovie(name)
			this.#videoSystem.removeProduction(production);
			done = true;

		} catch (error) {
			done = false;
		}

		this.#videoSystemView.showFormRemoveProdutionModal(done, name, this.#videoSystem.productions)
	}

	hadlerRemoveCategory = (title) => {

		let done;

		try {
			let category = this.#videoSystem.getCategory(title);
			this.#videoSystem.removeCategory(category);
			done = true;
		} catch (e) {
			done = false;
		}
		this.#videoSystemView.showFormRemoveCategoryModal(done, title, this.#videoSystem.categories)

		this.onAddCategoryNav();

	}
	handleNewCategory = (title, inf) => {

		let done;

		try {
			let category = this.#videoSystem.getCategory(title, inf);
			this.#videoSystem.addCategory(category);
			done = true;
		} catch (e) {
			done = false;
		}
		this.#videoSystemView.showFormNewCategoryModal(done, title, inf, this.#videoSystem.categories)

		this.onAddCategoryNav();

	}

	handleUpdateAsignPerson = (name) => {
		name = name.trim();
		if (name.includes("(actor)")) {
			name = name.replaceAll("(actor)", "")

			try {
				//le mando el controlador de showPerson para que el usuario pueda hacer click en la imagen y ver los resultados de la asignación
				this.#videoSystemView.updateAsignPerson(this.#videoSystem.getActorFullName(name), this.handleShowPerson);
			} catch (error) {
			}

		}
		else if (name.includes("(director)")) {
			name = name.replaceAll("(director)", "")

			try {
				this.#videoSystemView.updateAsignPerson(this.#videoSystem.getDirectorFullName(name));
			} catch (error) {
			}

		}
		else {
			this.#videoSystemView.updateDefaultAsignPerson()
		}
	}
	handleUpdateProductionAsignPerson = (title) => {
		title = title.trim();
		try {
			//si existe esa pelicula la mostramos
			let production = this.#videoSystem.getMovie(title)
			this.#videoSystemView.updateAsignProduction(production, this.handleCategoryListProduction)
		} catch (e) {
			//si no existe mostramos las caracteriscias por defecto
			this.#videoSystemView.updateDefaultAsignProduction()
		}
	}

	handleAssignProductionAsignPerson = (title, name) => {

		let type = (name.includes("(actor)")) ? "actor" : "director";
		let msg = null;
		let done;
		//	let firstName;
		//	let lastName;
		if (!name.includes("(actor)") && !name.includes("(director)")) {
			msg = "El nombre introducido no se conoce como actor ni como director";
		}
		if (!msg) {
			try {
				if (type == "actor") {
					name = name.replaceAll("(actor)", "")
				} else {
					name = name.replaceAll("(director)", "")
				}

				let person;
				let production = this.#videoSystem.getMovie(title)

				if (type == "actor") {
					person = this.#videoSystem.getActorFullName(name);
					this.#videoSystem.assignActor(person, production)
				} else {
					person = this.#videoSystem.getDirectorFullName(name);
					this.#videoSystem.assignDirector(person, production)
				}
				done = true;
			} catch (e) {
				done = false;
				msg = "Ha ocurrido un error en la asignación " + e;
			}
		}

		this.#videoSystemView.showFormAssignPersonModal(done, msg, title, name)
	}

	handleNewProduction = (type, title, nationality, date, categories, synopsis, actors, directors, urlImg, resource, lat, long, season, time) => {

		let done;
		urlImg = urlImg || "/img/default-p.jpg";
		resource = resource || "https://www.youtube.com/embed/U2DkSxMGfGE";
		time = parseInt(time) || 0;
		lat = parseInt(lat) || 0;
		long = parseInt(long) || 0;

		try {
			//Si puede obtener una película es porque esa película ya existe entonces no podemos crear otra
			this.#videoSystem.getMovie(title);
			done = false;
		} catch (e) {
			let production;
			if (type != "Serie") {

				production = this.#videoSystem.getMovie(title, nationality, date, synopsis, urlImg, new Resource(time, resource), [new Coordinate(lat, long)]);
			}
			else {
				production = this.#videoSystem.getSerie(title, nationality, date, synopsis, urlImg, [new Resource(time, resource)], [new Coordinate(lat, long)], season)
			}
			//añadimos la producción
			this.#videoSystem.addProduction(production);
			//si hay actores para añadir
			if (actors.length > 0) {
				actors.forEach(actor => {
					this.#videoSystem.assignActor(this.#videoSystem.getActorFullName(actor), production)
				});
			}
			if (directors.length > 0) {
				directors.forEach(director => {
					this.#videoSystem.assignDirector(this.#videoSystem.getDirectorFullName(director), production)
				});
			}
			if (categories.length > 0) {
				categories.forEach(category => {
					this.#videoSystem.assignCategory(this.#videoSystem.getCategory(category), production)
				});
			}
			done = true;
		}

		this.#videoSystemView.showFormAddProductionModal(done, title)

	}

	handleShowLogin = () => {

		this.#videoSystemView.showFormLogin();
		this.#videoSystemView.bindFormLogin(this.handleLoginUser);

		//this.#videoSystemView.bindUpdateShowRemovePerson(this.handleUpdateRemovePerson)
		//	this.#videoSystemView.bindFormRemovePerson(this.handledelRemovePerson)
	}
	handleLoginUser = (name, password) => {
		let users = this.#videoSystem.users;

		let authenticated = false;
		for (const user of users) {
			if (user.username == name && user.password == password) {
				//si se ha encontrado al usuario admin
				authenticated = true;
				break;
			}
		}
		this.#videoSystemView.showFormLoginModal(authenticated);

		if (authenticated) {
			document.cookie = `username=admin`;
			//actulizamos el nav
			this.#videoSystemView.showAdminCookie();
			//volemos a inicio
			this.onInit();
			//mostramos el boton de cerrra sesion
			this.#videoSystemView.bttnCloseSession();
			//asignamos el evento para eliminar la cookie
			this.#videoSystemView.bindRemoveCookie(this.handleRemoveCookie);

		}

	}

	handleRemoveCookie = () => {
		//hacemos que la cookie expire
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
		//quitamos bttn de cerrar sesion
		this.#videoSystemView.bttnCloseSessionEmpty();
		//ponemos otra vez iniciar Session
		this.#videoSystemView.CloseAdminCookie();
		//enlazamos el evento para el formulario de inicio de sesion
		this.#videoSystemView.bindShowFormLogin(this.handleShowLogin)
	}

}

export default VideoSystemController;
