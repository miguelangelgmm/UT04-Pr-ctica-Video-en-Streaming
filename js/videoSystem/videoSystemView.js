import { newPersonValidation, removePersonValidation,removeProductionValidation,newCategoryValidation,asignPersonValidation } from './validation.js';
class VideoSystemView {

	#excecuteHandler(handler, handlerArguments, data, url, event) {
		handler(...handlerArguments);//le pasamos a la función handler los argumentos, contennido de this.dataset.
		//data,title,url
		//permite asignar un nuevo estado al historial de navegación, va a permitir volver atras o adelante sin recargar toda la página
		history.pushState(data, null, url);
		event.preventDefault();
	}
	#formatDate(date) {
		let newDate = [date.getFullYear(), date.getMonth(), date.getDate()]
		newDate[1] = newDate[1] > 9 ? newDate[1] : `0${newDate[1]}`
		newDate[2] = newDate[2] > 9 ? newDate[1] : `0${newDate[2]}`
		return `${newDate[0]}-${newDate[1]}-${newDate[2]}`;
	}
	//actualizar formulario de eliminar persona
	#lastName1Input;
	#lastName2Input;
	#bornInput;
	#URLPictureInput;
	#datalistOptions;
	#imgRemove;
	//actualizar formulario para eliminar producción
	#datalistDelProductionsOptions;

	#formDelNationality;
	#formDelPublication;
	#formDelSynopsis;
	#formDelURLImage;
	#formDelImage;

	//Botón de eliminar categoria
	#buttonRemoveCategory;
	#selectManagerCategoryRemove;
	//AsignPerson
	#imgAsignPerson
	#imgAsignProduction
	constructor() {
		this.categories = $('#navCategories');
		this.main = $('main');
		this.newWindows = new Map();
		this.body = $('body');
		//actualizar formulario de eliminar persona
		this.#lastName1Input;
		this.#lastName2Input;
		this.#bornInput;
		this.#URLPictureInput;
		this.#datalistOptions;
		this.#imgRemove;
		//actualizar formulario para eliminar producción
		this.#datalistDelProductionsOptions;

		this.#formDelNationality;
		this.#formDelPublication;
		this.#formDelSynopsis;
		this.#formDelURLImage;
		this.#formDelImage;

		//Botón de eliminar categoria
		this.#buttonRemoveCategory;
		this.#selectManagerCategoryRemove;

		//AsignPerson
		this.#imgAsignPerson;
		this.#imgAsignProduction
	}
	//funcion que retorna un div que contiene una lista de personas
	#showPersons(persons) {
		let container = $(`
		<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4 bg-blue-glass">
		</div>
		`);
		for (const person of persons) {
			container.append(`
			<section  class="col item-list mx-auto rounded-4 my-3 w-auto">
			<figure class="mx-3">
				<img src="${person.picture}" alt="" class="rounded-4 position-relative person mt-3" data-name='${person.name + "||" + person.lastname1}' >
				<figcaption>${person.name + " " + person.lastname1 + " " + person.lastname2}</figcaption>
			</figure>
		</section>
			`)
		}
		return container;
	}
	//funcion que retorna un div con una lista de producciones
	#showProductions(productions) {
		let section = $(`

		<section class="container-fluid mx-auto " >

		<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4 bg-blue-glass">

			</div>
	</section>
	`);
		for (const production of productions) {
			let div = $(`
		<section class="col item-list mx-auto rounded-4 my-3 w-auto">
			<figure class="production-person mx-3" >
				<img src="${production.image}" alt="" class="rounded-4 image-production mt-3" data-title="${production.title}">
			</figure>
		</section>`)
			section.children().append(div)
		}
		return section;
	}

	//muestra un iframe que corresponde a una película
	#showFrameFilm(production) {
		let container = $(`
			<div class="container-fluid  bg-dark p-0 rounded-5"  >
				<div class="container-fluid p-0" >
					<iframe src="${production.resource.link}"
					title="${production.title}"
					frameborder="0"
					allowfullscreen
					class="container-fluid frame-production rounded-5 shadow-white"></iframe>
				</div>
			</div>
		`)
		return container;
	}
	//muestra un iframe que corresponde a una serie
	#showFrameSerie(production) {

		let active = "active";
		let resources = production.getResource();

		let container = $(`
	<div id="carouselExampleControls" class="carousel slide  bg-transparent p-0 rounded-5 shadow-white" data-bs-ride="carousel">
		<div class="carousel-inner bg-transparent">
		</div>
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
		</button>
	</div>
`);

		for (const product of resources) {
			let div = $(`
		<div class="carousel-item ${active}  bg-transparent p-0 rounded-5 ">
			<iframe src="${product.link}"
			title="${production.title}"
			frameborder="0"
			allowfullscreen
			class="container-fluid frame-production bg-transparent rounded-5 "></iframe>
		</div>
	`);

			container.find('.carousel-inner').append(div);
			active = "";
		}

		return container;
	}

	showCategoriesInNav(categories) {

		this.categories.empty()//vaciamos las categorias actuales
		this.categories.append(`<a class="nav-link dropdown-toggle text-white" href="#" role="button"
		data-bs-toggle="dropdown" aria-expanded="false">
		Categorias
	</a>`)
		let ul = $(`<ul class="dropdown-menu"></ul>`);

		for (let category of categories) {
			ul.append(`<li><a data-category="${category.name}" class="dropdown-item list-nav-category" >${category.name}</a><li>`);
		}
		this.categories.append(ul);
	}


	/**
 * Enlaza un controlador de clicks a cada una de las imágenes de producción.
 * Al hacer el click la función le va a permitir ver la ficha de esa producción
 * @param handler - La función a llamar cuando el usuario hace click, pasandole el título de la película como parámetro
 */
	bindProductions(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;

		$('.image-production').click(function (event) {
			let production = this.dataset.title;
			//hander función a ejecutar, [pruduction] parámetros a ejecutar en la función handler, object->datos para el history,valor de la url y event
			excecuteHandler(
				handler, [production],
				{ action: 'production', production: production },// la # permite especificar secciones
				`#Production-${production.replaceAll(" ", "-")}`, event
			);
			//	handler(this.dataset.title);
		});
	}

	/**
	 *
	 * Vincula un controlador de clicks a cada uno de los elementos desplegables
	 * del navegador en este caso a los desplegables de categoria
	 * @param handler - La función que sera cargada al hacer click,pasandole como argumento la categoria
	 */
	bindProductionsNavCategoryList(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;
		$('.list-nav-category').click(function (event) {
			let category = this.dataset.category;
			excecuteHandler(
				handler, [category],
				{ action: 'productionCategoryList', category: category },
				`#Category-List-${category}`, event
			);
			//	handler(this.dataset.category);
		});
	}

	/**
	 * Vincula un evento de clicks a cada una de las categorias, va a cargar las listas de peliculas
	 * que tengan esa categoria
	 * @param handler - La función a ejecutar cada vez que hacemos click, pasandole como argumento la categoria
	 */
	bindProductionsCategoryList(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;

		document.querySelectorAll('.list-category').forEach(function (h4) {
			h4.addEventListener('click', (function (event) {
				let category = this.dataset.category;
				excecuteHandler(
					handler, [category],
					{ action: 'productionCategoryList', category: category },
					`#Category-List-${category}`, event
				);
				//	handler(this.dataset.category);
			}))
		})
	}

	/**
	 * Enlaza el logo de la web con un evento que se va a ejecutar cuando volvamos a home
	 * @param handler - La función que es lanzada al hacer click.
	 */
	bindInit(handler) {
		let excecuteHandler = this.#excecuteHandler;

		$('#logo').click((event) => {
			excecuteHandler(handler, [], { action: "init" }, "#", event)
		});
	}

	/**
	 * Enlaza el enlace de los actores del navegador con un evento que va a permitir listar los actores
	 * @param handler - La función que va a ser llamada al hacer click.
	 */
	bindActorPersonList(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;

		$('#actors').click(function (event) {
			excecuteHandler(handler, [], { action: "actorPersonList" }, "#actors", event)
			//	handler();
		});
	}

	/**
	 * Enlaza el enlace de los directores del navegador con un evento que va a permitir listar los directores
	 * @param handler - The function to be called when the button is clicked.
	 */
	bindDirectorPersonList(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;
		$('#directors').click(function (event) {
			excecuteHandler(handler, [], { action: "directorPersonList" }, "#directors", event)
			//	handler();
		});
	}
	/**
	 * Vincula un evento de click a los elementos que tengan la clase person, el evento va a permitir
	 * lanzar los datos de la persona que ha sido clickeada
	 * @param handler
	 */
	bindShowPerson(handler) {
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;
		$('.person').click(function (event) {
			let name = this.dataset.name;
			excecuteHandler(
				handler, [name],
				{ action: 'showPerson', name: name },
				`#Person-${name.replaceAll("||", "-")}`, event
			);
			//handler(this.dataset.name);
		});
	}

	//Función que va a mostrar el carusel en el momento que entramos a la página o vamos a inicio
	showProductionInLoad(productions) {

		function limitSypnosis(text) {
			//cramos un array a partir del texto
			let array = text.split(" ");

			if (array.length > 40) {
				//obtenemos los 40  primeros caracteres y añadimos ...
				text = array.slice(0, 40).join(" ") + "...";
			}
			return text
		}
		//un elemento de carousel por defecto tiene que estar activo
		let active = true;

		let carousel = $(`<div id="carouselExampleCaptions" class="carousel slide ms-5 me-5 mx-auto " data-bs-ride="carousel">
		<div class="carousel-indicators">
			<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
				aria-current="true" aria-label="Slide 1"></button>
			<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
				aria-label="Slide 2"></button>
			<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
				aria-label="Slide 3"></button>
		</div>
		<div class="carousel-inner mt-4 rounded-4 shadow-white">

		</div>
		`);
		//agregamos una producción al carousel
		for (let production of productions) {
			carousel.children().eq(1).append(`

			<div class="carousel-item ${active ? "active" : ""} ">

			<img src="${production.image}"  data-category="${production.title}" class="d-block w-100 bg-image-carousel" alt="${production.title}">
			<img src="${production.image}" data-category="${production.title}" class="position-absolute image-production image-carousel" alt="${production.title}" data-title="${production.title}" >

			<div class="carousel-caption d-none d-md-block text-carrusel ">
				<h5>${production.title}</h5>
				<p class = "px-4">${limitSypnosis(production.synopsis)}</p>
			</div>
			`);
			active = false;
		}

		carousel.append(`
		<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
		data-bs-slide="prev">
		<span class="carousel-control-prev-icon" aria-hidden="true"></span>
	</button>
	<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
		data-bs-slide="next">
		<span class="carousel-control-next-icon" aria-hidden="true"></span>
	</button>
</div>`);

		this.main.append(carousel);
	}

	//muestra las categorias en el elemento desplegable del nav
	showCategoriesInMain(categories) {
		this.main.empty();
		let categoriesMain = $(`<div class="container rounded-5 bg-dark mx-a mt-4 py-2 shadow-aside">
		<aside class="carousel-aside">
		</aside>
	</div>
	`);
		//obtenemos todas las categorias disponibles
		for (let category of categories) {
			categoriesMain.children().append(`

		<div class="item-aside p-2 list-category" href='#product-list'  data-category="${category.name}">
		<div>
			<img src="img/icons/${category.name.toLowerCase()}.png" alt="${category.name}" class="image-aside" >
			<h3 class="d-none d-lg-block">${category.name}</h3>
		</div>
	</div>
		`);
		}
		this.main.append(categoriesMain);
	}

	//Lista las producciones que pertenecen a una categoría
	listProductions(productions, title) {
		this.main.empty();
		let container = $(`
		<section class="container-fluid mx-auto " >
			<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4">
			</div>
		</section>
		`)
		//agregamos todas producciones
		let production = productions.next();
		while (!production.done) {
			let div = $(`
			<section class="col item-list mx-auto rounded-4 my-3 w-auto">
			<figure class="mx-3">
				<img src="${production.value.image}" alt="${production.value.title}" class="rounded-4 image-cat image-production" data-title="${production.value.title}">
			</figure>
			`);
			container.children().first().append(div);
			production = productions.next();
		}
		container.prepend(`<h1>${title}</h1>`);
		this.main.append(container);
	}


	//Permite mostrar los datos de una producción
	showProduction(production, categories, directors, actors) {
		//vaciamos el main
		this.main.empty();
		//Primero mostramos los datos de la producción
		let container = $(`
		<!-- Producción -->

	<section class="container-fluid mx-auto mt-5 rounded-5">

	</section>

	<!--Información-->
		<div class="container-fluid mt-5  pb-4" >
			<div class="row  mx-auto">
				<div class="col-lg-4 col-xs-5 mt-2">
					<figure class="lg-me-4 mx-auto text-center img-production-synosis">
						<img src="${production.image}" alt="" class="w-75 mx-auto rounded-4 ">
					</figure>
				</div>
				<div class="col-8">
						<div class="row mb-2">
							<h1>${production.title}</h1>
						</div>
						<div class="row mt-2 d-inline" id = "category-film">

						</div>
						<div class="row mt-4">
							<span>${production.publication.toLocaleDateString()} </span>
						</div>
						<div class="row">
							<span>
							${production.synopsis}
							</span>
						</div>
						<div class="row">
						<button id="b-open" data-title="${production.title}" class="btn btn-primary text-uppercase mr-2 px-4">Abrir en nueva ventana</button>
						</div>
					</div>
			</div>

		</div>
		`);

		//si no tiene la propiedad resource es una serie
		if ("resource" in production) {
			container.children().prepend(this.#showFrameFilm(production))
		} else {
			container.children().prepend(this.#showFrameSerie(production))
		}
		//mostramos las categorias a las que pertenece esa pelicula
		let categoriesFilm = container.find("#category-film");
		for (const category of categories) {
			categoriesFilm.append(`
			<div class="d-inline">
				<h4 class="d-inline bg-danger rounded-4 p-2 list-category"  data-category="${category.name}"> ${category.name} </h4>
			</div>
			`)
		}
		//mostramos los directores de la película
		let directorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Directores</h1>
		</section>
		`)
		//llamamos a la función que permite obtener todas las personas
		directorsFilm.append(
			this.#showPersons(directors)
		);
		container.last().children().append(directorsFilm);
		//mostramos los actorse de la película
		let actorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Actores</h1>
		</section>
		`)
		actorsFilm.append(
			//llamamos a la función que permite obtener todas las personas
			this.#showPersons(actors)
		);
		container.last().children().append(actorsFilm);

		this.main.append(container);
	}

	//Permite mostrar una lista de personas sin importar si son actores o directores
	showListPersons(persons) {
		this.main.empty();
		let container = $(`
		<section class="container-fluid mx-auto " >
			<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4">
			</div>
		</section>
		`)
		let person = persons.next();
		//en los datos de la persona voy a usar || para separar nombre y apellido
		while (!person.done) {
			let div = $(`
			<section  class="col item-list mx-auto rounded-4 my-3 w-auto">
			<figure class="mx-3">
				<img src="${person.value.picture}" alt="" class="rounded-4 person mt-3" data-name='${person.value.name + "||" + person.value.lastname1}'>
				<figcaption>${person.value.name + " " + person.value.lastname1 + " " + person.value.lastname2}</figcaption>
			</figure>
			</section>
			`);
			container.children().append(div);
			person = persons.next();
		}
		this.main.append(container);
	}


	//muestra la información de una persona, además va a mostrar las produciones que ha dirigido y las peliculas donde ha actuado
	//si no ha a actuado o no ha dirigido una pelicula no mostrara ese campo
	showPerson(person, directedProductions, actedProductions) {
		this.main.empty();
		let container = $(`
			<div class="container-fluid mt-5 pb-5">
				<div class="row  mx-auto">
					<div class="col-lg-4 col-xs-5 mt-2">
						<section class="col prueba2 mx-auto rounded-4 mt-3">
							<figure class="lg-me-4 mx-auto text-center">
								<img src="${person.picture}" alt="${person.name}" class="rounded-4 position-relative person-max">
							</figure>
						</section>
					</div>
					<div class="col-8">
						<div class="row">
							<h1>${person.name + " " + person.lastname1 + " " + person.lastname2}</h1>
						</div>
						<div class="row mt-4">
							<span>nacimiento:${person.born.toLocaleDateString()}  </span>
						</div>
					</div>
				</div>

			</div>
		`);
		//comprobamos si ha dirigido producciones
		if (directedProductions) {
			container.append(this.#showProductions(directedProductions).prepend(`<h1>${"Producciones dirigidas"}</h1>`));
		}
		//comprobamos si ha actuado en producciones
		if (actedProductions) {
			container.append(this.#showProductions(actedProductions).prepend(`<h1>${"Producciones como actor"}</h1>`));
		}

		this.main.append(container)
	}

	//----------Nueva ventana

	bindShowProductionInNewWindow(handler) {
		$('#b-open').click((event) => {
			//creamos la ventana nueva si no ha sido creada aun para esa producción
			if (!this.newWindows.has(event.target.dataset.title) || this.newWindows.get(event.target.dataset.title).closed) {
				let width = 800;
				let height = 600;
				this.newWindows.set(event.target.dataset.title, (window.open("newWindow.html", `${event.target.dataset.title}`, `width=${width}, height=${height}, top=${screen.height / 2 - height / 2}, left=${screen.width / 2 - width / 2}, titlebar=yes, toolbar=no, menubar=no, location=no`)))
				this.newWindows.get(event.target.dataset.title).addEventListener('DOMContentLoaded', () => {
					handler(event.target.dataset.title)
				});
			}
			else {
				//damos el foco a la ventana
				this.newWindows.get(event.target.dataset.title).focus();
			}

		});
	}

	showProductionInNewWindow(production, categories, actors, directors) {
		let newWindow = this.newWindows.get(production.title)
		//asignamos titulo a la ventana
		newWindow.document.title = production.title
		let main = newWindow.document.querySelector("main");
		let header = newWindow.document.querySelector("header");

		let heiderContainer = document.createRange().createContextualFragment(`
			<h1 class="bg-dark py-3 mb-5">
				${production.title}
			</h1>
		`)
		let container = document.createRange().createContextualFragment(`
		<!-- Producción -->

	<section class="container-fluid mx-auto mt-5 rounded-5">

	</section>

	<!--Información-->
		<div class="container-fluid mt-5  pb-4" >
			<div class="row  mx-auto">
				<div class="col-lg-4 col-xs-5 mt-2">
					<figure class="lg-me-4 mx-auto text-center img-production-synosis">
						<img src="${production.image}" alt="" class="w-75 mx-auto rounded-4 ">
					</figure>
				</div>
				<div class="col-8">
						<div class="row mb-2">
							<h1>${production.title}</h1>
						</div>
						<div class="row mt-2 d-inline" id = "category-film">

						</div>
						<div class="row mt-4">
							<span>${production.publication.toLocaleDateString()} </span>
						</div>
						<div class="row">
							<span>
							${production.synopsis}
							</span>
						</div>
					</div>
			</div>
		</div>
		`);

		//si no tiene la propiedad resource es una serie
		if ("resource" in production) {
			$(container).prepend(this.#showFrameFilm(production))
		} else {
			$(container).prepend(this.#showFrameSerie(production))
		}

		//mostramos las categorias a las que pertenece esa pelicula
		let categoriesFilm = container.querySelector("#category-film");
		for (const category of categories) {
			categoriesFilm.appendChild(document.createRange().createContextualFragment(`
			<div class="d-inline">
				<h4 class="d-inline bg-danger rounded-4 p-2 list-category"  data-category="${category.name}"> ${category.name} </h4>
			</div>
			`))
		}

		//mostramos los directores de la película
		let directorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Directores</h1>
		</section>
		`)
		//llamamos a la función que permite obtener todas las personas
		directorsFilm.append(
			this.#showPersons(directors)
		);
		//añadimos al ultimo hijo de container
		$(container).children().last().append(directorsFilm);
		//mostramos los actorse de la película
		let actorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Actores</h1>
		</section>
		`)
		actorsFilm.append(
			//llamamos a la función que permite obtener todas las personas
			this.#showPersons(actors)
		);
		//añadimos al ultimo hijo de container
		$(container).children().last().append(actorsFilm);

		header.appendChild(heiderContainer);
		main.appendChild(container)
	}


	/**
	 * Enlaza el enlace de cerrar ventnas con un evento que va a permitir cerrar las ventanas
	 * @param handler - La función que va a ser llamada al hacer click.
	 */
	bindCloseWindows(handler) {
		$('#close-Windows').click((event) => {
			handler();
		});
	}


	//---->Fomulario /

	showAdminNav() {
		let navbar = $("#navbarSupportedContent");
		let container = $(`
		<ul class="navbar-nav me-auto mb-2 mb-lg-0">
		<li class="nav-item dropdown ">
		<a class="nav-link dropdown-toggle text-white" role="button" data-bs-toggle="dropdown" >
			Administración
		</a>
		<ul class="dropdown-menu">
			<li><a id="newProduction" class="dropdown-item show-form"">Nueva producción</a></li>
			<li><a id="delProduction" class="dropdown-item show-form">Eliminar producción</a></li>
			<li><a id="assignPerson" class="dropdown-item show-form">Asignar Persona</a></li>
			<li><a id="manageCategory" class="dropdown-item show-form">Gestionar categorias</a></li>
			<li><a id="newPerson" class="dropdown-item show-form">Nueva persona</a></li>
			<li><a id="delPerson" class="dropdown-item show-form">Eliminar Persona</a></li>
		</ul>
	</li>
	</ul>
		`);

		navbar.append(container)
	}

	bindAdminMenu(handlerNewProduction, handlerRemoveProduction, handlerAssignPerson, handlerManageCategory, handlerNewPerson, handlerRemoveCategory) {
		$('#newProduction').click((event) => {
			this.#excecuteHandler(handlerNewProduction, [], { action: 'newProduction' }, '#new-Production', event);
		});
		$('#delProduction').click((event) => {
			this.#excecuteHandler(handlerRemoveProduction, [], { action: 'delProduction' }, '#remove-production', event);
		});
		$('#assignPerson').click((event) => {
			this.#excecuteHandler(handlerAssignPerson, [], { action: 'assignPerson' }, '#assign-person', event);
		});
		$('#manageCategory').click((event) => {
			this.#excecuteHandler(handlerManageCategory, [], { action: 'manageCategory' }, '#manage-category', event);
		});
		$('#newPerson').click((event) => {
			this.#excecuteHandler(handlerNewPerson, [], { action: 'newPerson' }, '#new-person', event);
		});
		$('#delPerson').click((event) => {
			this.#excecuteHandler(handlerRemoveCategory, [], { action: 'delPerson' }, '#remove-category', event);
		});
	}

	showFormNewPerson() {
		this.main.empty();
		let container = $(`
		<section class="container  bg-dark p-2 rounded-4 mt-5 px-4">
		<form name="formNewPerson" role="form" novalidate>
		<div class="row">
			<h1>Agregar una persona</h1>
		</div>
		<div class="row g-4">
			<div class="col-lg-4">
				<img src="img/defaultPerson.png"
					alt="img prueba" class="w-100">
			</div>
			<div class="col-lg-8">
				<div class="row g-4">
					<div class="col-lg-6">
						<div class=" form-floating color-bg-input">
							<input type="text" class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0" id="namePerson" placeholder="Nombre*" name="nameNewPerson" required>
							<div class="invalid-feedback ps-4">El nombre es obligatorio.</div>
							<div class="valid-feedback ps-4">Correcto.</div>
							<label for="namePerson" class="text-primary">Nombre*</label>
						</div>
					</div>
				<div class="col-lg-6">
					<div class=" form-floating color-bg-input">
						<input type="text"
							class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
							id="lastNamePerson1" placeholder="Primer Apellido*" name="lastName1" required>
							<div class="invalid-feedback ps-4">El apellido es obligatorio.</div>
							<div class="valid-feedback">Correcto.</div>
						<label for="lastNamePerson1" class="text-primary">Primer apellido*</label>
					</div>
				</div>
				<div class="col-lg-6">
					<div class=" form-floating color-bg-input">
						<input type="text"
							class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
							id="lastNamePerson2" placeholder="Segundo Apellido" name="lastName2">
							<div class="invalid-feedback ps-4">El apellido el formato del apellido es erroneo.</div>
							<div class="valid-feedback ps-4">Correcto.</div>
						<label for="lastNamePerson2" class="text-primary">Segundo apellido</label>
					</div>
				</div>
				<div class="col-lg-3">
					<div class=" form-floating color-bg-input">
						<input type="date"
							class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
							id="bornPerson" placeholder="Fecha Nacimiento*" name="born" max="yyyy-mm-dd" required>
							<div class="invalid-feedback ps-4">La fecha no es valida.</div>
							<div class="valid-feedback ps-4">Correcto.</div>
						<label for="bornPerson" class="text-primary">Fecha Nacimiento*</label>
					</div>
				</div>

				<div class="col-lg-3">
				<div class=" form-floating color-bg-input">
					<select class="form-select form-control border-0 ms-2" aria-label="Default select example" id="selectTypePerson" name="selectType">
						<option value="Actor">Actor</option>
						<option value="Director">Director</option>
					</select>
					<div class="invalid-feedback ps-4">No es correcto.</div>
					<div class="valid-feedback ps-4">Correcto.</div>
					<label for="selectTypePerson" class="text-primary">Actor o productor</label>
				</div>
			</div>

				<div class="col-lg-12">
					<div class=" form-floating color-bg-input">
						<input type="text" pattern="^(http(s?):\/\/)?[a-z0-9]+\.[a-z]{2,}.*\.(jpg|png|jpeg|webp)$" title="Ingrese una URL de imagen con una extensión válida (jpg, png, jpeg, webp)"
							data-bs-toggle="tooltip" data-bs-placement="left" title="Ingrese una URL de imagen con una extensión válida (jpg, png, jpeg, webp)"
							class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
							id="URLPicturePerson" placeholder="Primer Apellido" name="picturePerson" >
							<div class="invalid-feedback ps-4">La url no es valida debe finalizar en jpg, png,jpeg o webp.</div>
							<div class="valid-feedback ps-4">Correcto.</div>
						<label for="URLPicturePerson" class="text-primary">URL de la imágen</label>
					</div>
				</div>
				<div class="col-lg-8  mx-auto">
					<button class="btn btn-primary m-1 w-100 mx-auto" type="submit">Enviar</button>
				</div>
				</div>
			</div>
		</div>
			</form>
	</section>
		`)

		this.main.append(container)
	}
	bindFormNewPerson(handler) {
		newPersonValidation(handler);
	}
	showFormNewPersonModal(done, name, lastname1, type) {


		let modal = (done) ? $(`
				<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
							<div class="modal-content  bg-success">
								<div class="modal-header">
									<h5 class="modal-title" id="staticBackdropLabel">${type} creado correctamente</h5>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									<p>Se ha agregado al ${type} ${name} ${lastname1} de forma correcta </p>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
								</div>
							</div>
						</div>
					</div>
				`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
				<div class="modal-content  bg-danger">
					<div class="modal-header">
						<h5 class="modal-title" id="staticBackdropLabel">No se ha podido crear el ${type} </h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>El  ${type} ${name} ${lastname1} ya esta registrado </p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					</div>
				</div>
			</div>
		</div>`;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()
		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento
		//hidden.bs.modal entonces vamos a reseteamos el formulario, hacemos focus en la primera entrada, eliminamos el modal
		myModalElem.addEventListener('hidden.bs.modal', function (event) {
			if (done) {
				document.formNewPerson.reset();
			}
			console.log("prueba1")
			document.formNewPerson.nameNewPerson.focus();
			myModalElem.remove();
		});
	}

	showFormRemovePerson(actors, directors) {
		this.main.empty();
		let actorsView = [...actors];
		let directorsView = [...directors];

		let container = $(`

		<section class="container  bg-dark p-2 rounded-4 mt-5 px-4">
		<form name="formRemovePerson" role="form" novalidate>
			<div class="row">
				<h1>Eliminar una persona</h1>
			</div>
			<div class="row g-4">
				<div class="col-lg-4">
					<img src="img/defaultPerson.png"
						alt="img prueba" class="w-100" id ="imgRemove" >
				</div>
				<div class="col-lg-8">
					<div class="row g-4">
						<div class="col-lg-6">
							<div class="color-bg-input form-floating">
								<input class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0" list="datalistOptions" id="exampleDataList" placeholder="Nombre" name="delPerson" required>
								<datalist id="datalistOptions" >
								</datalist>
								<label for="exampleDataList" class="text-primary">Nombre</label>
								<div class="invalid-feedback ps-4">Este campo es obligatorio.</div>
							</div>
						</div>
					<div class="col-lg-6">
						<div class=" form-floating">
							<input type="text"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="lastNamePerson1" placeholder="Primer Apellido" name="lastName1" readonly value="Solo Lectura">
							<label for="lastNamePerson1" class="text-primary">Primer apellido</label>
						</div>
					</div>
					<div class="col-lg-6">
						<div class=" form-floating">
							<input type="text"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="lastNamePerson2" placeholder="Segundo Apellido" name="lastName2" value="Solo Lectura" readonly>
							<label for="lastNamePerson2" class="text-primary">Segundo apellido</label>
						</div>
					</div>
					<div class="col-lg-6">
						<div class=" form-floating">
							<input type="date"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="bornPerson" placeholder="Fecha Nacimiento" name="born" readonly value="000-00-00">
							<label for="bornPerson" class="text-primary">Fecha Nacimiento</label>
						</div>
					</div>
					<div class="col-lg-12">
						<div class=" form-floating">
							<input type="text"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="URLPicturePerson" placeholder="Primer Apellido" name="picturePerson" value="Solo Lectura" readonly>
							<label for="URLPicturePerson" class="text-primary">URL de la imágen</label>
						</div>
					</div>
					<div class="col-lg-8  mx-auto">
						<button class="btn btn-primary m-1 w-100 mx-auto bg-danger border-danger" type="submit"  id="delButton">Eliminar</button>
					</div>
					</div>
				</div>
			</div>
				</form>
		</section>
		`)
		const datalist = container.find('#datalistOptions');

		actorsView.forEach(person => {
			datalist.append(`<option value='${person.name + ` ` + person.lastname1 + "(actor)"}'>`)
		});
		directorsView.forEach(person => {
			datalist.append(`<option value='${person.name + " " + person.lastname1 + "(director)"}'">`)
		});
		// Agregar evento input al input del datalist

		this.main.append(container)
		this.#datalistOptions = document.querySelector("input[list='datalistOptions']");
		this.#lastName1Input = document.getElementById("lastNamePerson1")
		this.#lastName2Input = document.getElementById("lastNamePerson2")
		this.#bornInput = document.getElementById('bornPerson');
		this.#URLPictureInput = document.getElementById('URLPicturePerson');
		this.#imgRemove = document.getElementById("imgRemove");
	}

	bindUpdateShowRemovePerson(handler) {

		this.#datalistOptions.addEventListener("input", (event) => {
			handler(event.target.value)
		});
	}

	updateRemovePeson(person) {
		this.#lastName1Input.value = person.lastname1;
		this.#lastName2Input.value = person.lastname2 || " ";
		//necesito el formato año-mes-dia // 2023-02-02
		//	let date = [person.born.getFullYear(),person.born.getMonth(),person.born.getDate()]
		//		date[1] = date[1]>9?date[1]:`0${date[1]}`
		//		date[2] = date[2]>9?date[1]:`0${date[2]}`
		//	this.#bornInput.value =`${date[0]}-${date[1]}-${date[2]}`;
		this.#bornInput.value = this.#formatDate(person.born);

		this.#URLPictureInput.value = person.picture;
		this.#imgRemove.src = person.picture;
	}
	updateDefaultRemovePeson() {
		if (this.#URLPictureInput != "Solo lectura") {//evito actualizaciones innecesarias

			this.#lastName1Input.value = "Solo lectura";
			this.#lastName2Input.value = "Solo lectura";
			this.#bornInput.value = ``;
			this.#URLPictureInput.value = "Solo lectura";
			this.#imgRemove.src = "img/defaultPerson.png";
		}
	}

	bindFormRemovePerson(handler) {

		removePersonValidation(handler);
	}
	showFormRemovePersonModal(done, name = "") {
		let modal = (done) ? $(`
		<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
					<div class="modal-content  bg-success">
						<div class="modal-header">
							<h5 class="modal-title" id="staticBackdropLabel">Persona eliminada</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p>Se ha eliminado la persona de nombre ${name}</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
		<div class="modal-content  bg-danger">
			<div class="modal-header">
				<h5 class="modal-title" id="staticBackdropLabel">Error al eliminar </h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>La persona que estas tratando de eliminar no se encuntra disponible </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>`;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()
		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento
		//hidden.bs.modal entonces vamos a reseteamos el formulario, hacemos focus en la primera entrada, eliminamos el modal

		myModalElem.addEventListener('hidden.bs.modal', () => {
			if (done) {
				this.updateDefaultRemovePeson()
				document.formRemovePerson.reset();
			}
			document.formRemovePerson.delPerson.focus();
			myModalElem.remove();
		});

	}


	showFormRemoveProduction(productions) {
		this.main.empty();
		let container = $(
			`
			<section class="container  bg-dark p-2 rounded-4 mt-5 px-4">
			<form name="formRemoveProduction" role="form" novalidate>
			<div class="row">
				<h1>Eliminar una producción</h1>
			</div>
			<div class="row g-4">
				<div class="col-lg-4">
					<img src="img/default-production.jpg"
						alt="img prueba" class="w-100" id="imgProductionRemove">
				</div>
				<div class="col-lg-8">
					<div class="row g-4">
						<div class="col-lg-6">
							<div class="color-bg-input form-floating">
								<input class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0" list="dataListProductions" id="listDelProductions" placeholder="title" name="delProduction" required>
								<datalist id="dataListProductions" >
								</datalist>
								<label for="listDelProductions" class="text-primary">Nombre</label>
								<label for="exampleDataList" class="text-primary">Nombre</label>
								<div class="invalid-feedback ps-4">Este campo es obligatorio.</div>
							</div>
						</div>
					<div class="col-lg-6">
						<div class=" form-floating ">
							<input type="text"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="FormDelNationalityProduction" placeholder="Nacionalidad*" name="lastName1" readonly value="Solo Lectura">
							<label for="FormDelNationalityProduction" class="text-primary">Nacionalidad*</label>
						</div>
					</div>
					<div class="col-lg-6">
						<div class=" form-floating ">
							<input type="text"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="formDelURLImg" placeholder="Primer Apellido" name="picturePerson" value="Solo Lectura" readonly>
							<label for="formDelURLImg" class="text-primary">URL de la imágen</label>
						</div>
					</div>
					<div class="col-lg-6">
						<div class=" form-floating ">
							<input type="date"
								class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
								id="formDelPublication" placeholder="Fecha Publicacion" name="publication" readonly value="Solo Lectura">
							<label for="formDelPublication" class="text-primary">Fecha Publicacion</label>
						</div>
					</div>
					<div class="col-lg-12">
						<div class="form-floating">
							<textarea class="form-control border-info" placeholder="Leave a comment here" id="formDelSynosis"
								style="height: 100px" readonly >Solo lectura</textarea>
							<label for="formDelSynosis" class="text-info">Información de la pelicula</label>
						</div>
					</div>
					<div class="col-lg-8  mx-auto">
						<button class="btn btn-primary bg-danger border-danger m-1 w-100 mx-auto " type="submit" id="delProduct">Eliminar</button>
					</div>
					</div>
				</div>
			</div>
				</form>
		</section>
			`
		)

		let dataProductions = container.find("#dataListProductions")
		for (const production of productions) {
			dataProductions.append(`<option  value='${production.title}'> ${production.title}</option>`);
		}

		this.main.append(container)

		//Obtenemos los elementos del view que necesitamos para actualizarlos
		this.#datalistDelProductionsOptions = document.querySelector("input[list='dataListProductions']");

		this.#formDelNationality = document.getElementById("FormDelNationalityProduction")
		this.#formDelPublication = document.getElementById('formDelPublication');
		this.#formDelSynopsis = document.getElementById('formDelSynosis');
		this.#formDelURLImage = document.getElementById("formDelURLImg");
		this.#formDelImage = document.getElementById("imgProductionRemove");
	}



	updateRemoveProduction(production) {
		this.#formDelNationality.value = production.nationality;
		this.#formDelPublication.value = this.#formatDate(production.publication);
		this.#formDelSynopsis.value = production.synopsis;
		this.#formDelURLImage.value = production.image;
		this.#formDelImage.src = production.image;
	}
	updateDefaultRemoveProduction() {
		if (this.#formDelNationality.value != "Solo Lectura") {
			this.#formDelNationality.value = "Solo Lectura";
			this.#formDelPublication.value = "";
			this.#formDelSynopsis.value = "Solo Lectura";
			this.#formDelURLImage.value = "Solo Lectura";
			this.#formDelImage.src = "img/default-production.jpg";
		}
	}

	showFormRemoveProdutionModal(done,name,productions) {
		let modal = (done) ? $(`
		<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
					<div class="modal-content  bg-success">
						<div class="modal-header">
							<h5 class="modal-title" id="staticBackdropLabel">Producción eliminada</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p>Se ha eliminado la producción ${name}</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
		<div class="modal-content  bg-danger">
			<div class="modal-header">
				<h5 class="modal-title" id="staticBackdropLabel">No ha sido posible eliminar la producción </h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>la producción ${name} no se ha podido eliminar </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>`;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()
		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento
		//hidden.bs.modal entonces vamos a reseteamos el formulario, hacemos focus en la primera entrada, eliminamos el modal

		myModalElem.addEventListener('hidden.bs.modal', () => {
			if (done) {
				document.formRemoveProduction.reset();
				//si la pelicula se ha eliminado correctamente actualizamos la lista de datos
				let dataProductions = document.getElementById("dataListProductions");
				dataProductions.innerHTML = "";
				for (const production of productions) {
					$(dataProductions).append(`<option  value='${production.title}'> ${production.title}</option>`);
				}

			}
			document.formRemoveProduction.delProduction.focus();
			this.#formDelImage.src="img/default-production.jpg";
			myModalElem.remove();
		});
	}
	bindRemoveProduction(handler) {

		removeProductionValidation(handler)
	}
	bindUpdateShowRemoveProduction(handler) {

		this.#datalistDelProductionsOptions.addEventListener("input", (event) => {
			handler(event.target.value)
		});
	}


	showFormManagerCategory(categories) {
		this.main.empty();

		let container = $(`
		<section class="container  bg-dark p-2 rounded-4 mt-5 px-4 mb-3 pb-4">

			<div class="row">
				<h1>Gestionar Categoria</h1>
				<hr>
			</div>
				<div class="row">
					<div class="col-md-6 border-end">
						<form role="form" name="FormNewCategory">
						<!--Contenido de crear Categoria-->
						<div class="row g-4">
							<div class="col-12">
								<h2>Crear una categoria</h2>
							</div>
							<div class="col-12 d-flex align-middle">
								<div class="w-50 ">
									<div class=" form-floating color-bg-input">
										<input type="text"
											class="form-control  border  border-info border-3 border-top-0 border-start-0 border-end-0"
											id="newCategoryName" placeholder="nombre categoria*" name="newCategoryName" required>
										<label for="newCategoryName" class="text-primary">nombre categoria*</label>
										<div class="invalid-feedback ps-4">Este campo es obligatorio</div>
										<div class="valid-feedback ps-4">Correcto.</div>
									</div>
								</div>
								<div class="d-flex">
									<button class="btn btn-info w-100 ms-3" type="submit" id="newCategory">Crear Categoria</button>
								</div>
							</div>
							<div class="col-12">
								<div class="form-floating">
									<textarea class="form-control border-info" placeholder="Leave a comment here" id="newCategoryInf"
										style="height: 100px" name="newCategoryInf"></textarea>
									<label for="newCategoryInf" class="text-info">información adicional</label>
									<div class="invalid-feedback ps-4"></div>
									<div class="valid-feedback ps-4">Correcto.</div>
								</div>
							</div>
							</div>
						</form>
					</div>
					<div class="col-md-6">
						<form role='form' name='formRemoveCategory'>
						<!--Contenido de eliminar categoria-->
						<div class="row g-4">
							<h2>Eliminar una categoria</h2>
						</div>
						<div class="row g-4 mt-2">
							<div class="col-12 d-flex ">
								<div class="w-50 form-floating">
									<select class="form-select form-control border-danger" id="selectManagerCategory" aria-label="Default select example" name="selectCategoryRemove" >
										<option value=""selected></option>
									</select>
									<label for="selectManagerCategory" class="text-danger">Nombre*</label>
								</div>
								<div class="d-flex align-middle">
									<button class="btn btn-danger w-100 ms-3 d-flex  align-items-center" type="button" id="eliminar">Eliminar categoria</button>
								</div>
							</div>
						</div>
					</form>
					</div>
				</div>
		</section>
		`)
		let options = container.find('#selectManagerCategory');
		for (const category of categories) {
			options.append(`<option  value="${category.name}" "> ${category.name}</option>`);
		}

		this.main.append(container);

		this.#selectManagerCategoryRemove = document.getElementById("selectManagerCategory");
		this.#buttonRemoveCategory = document.getElementById("eliminar");

	}

	bindRemoveCategory(handler) {

		let category = this.#selectManagerCategoryRemove;
		this.#buttonRemoveCategory.addEventListener("click", (event) => {

			handler(category.value)
			event.preventDefault();
			event.stopPropagation();
		});
	}

	showFormRemoveCategoryModal(done,name,categories) {
		let modal = (done) ? $(`
		<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
					<div class="modal-content  bg-success">
						<div class="modal-header">
							<h5 class="modal-title" id="staticBackdropLabel">Categoria eliminada</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p>Se ha eliminado categoria ${name}</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
		<div class="modal-content  bg-danger">
			<div class="modal-header">
				<h5 class="modal-title" id="staticBackdropLabel">No ha sido posible eliminar la categoria </h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>Debes seleccionar una categoria, la categoria General no se puede eliminar </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>`;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()
		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento
		//hidden.bs.modal entonces vamos a reseteamos el formulario, hacemos focus en la primera entrada, eliminamos el modal

		myModalElem.addEventListener('hidden.bs.modal', () => {

			document.formRemoveCategory.reset();
			document.formRemoveCategory.selectCategoryRemove.focus();
			if(done){
				this.#selectManagerCategoryRemove.innerHTML="";
				$(this.#selectManagerCategoryRemove).append(`<option  value="" "></option>`);

				for (const category of categories) {
					$(this.#selectManagerCategoryRemove).append(`<option  value="${category.name}" "> ${category.name}</option>`);
				}
			}
			myModalElem.remove();
		});
	}

	bindNewCategory(handler) {
			newCategoryValidation(handler)
	}

	showFormNewCategoryModal(done,name,inf,categories) {
		let modal = (done) ? $(`
		<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
					<div class="modal-content  bg-success">
						<div class="modal-header">
							<h5 class="modal-title" id="staticBackdropLabel">Categoria Creada</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p>Se ha creado la categoria ${name} ${inf}</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
		<div class="modal-content  bg-danger">
			<div class="modal-header">
				<h5 class="modal-title" id="staticBackdropLabel">No ha sido posible crear la categoria </h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>La categoria ${name} ya existe </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>`;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()
		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento
		//hidden.bs.modal entonces vamos a reseteamos el formulario, hacemos focus en la primera entrada, eliminamos el modal

		myModalElem.addEventListener('hidden.bs.modal', () => {

			document.formRemoveCategory.reset();
			document.FormNewCategory.reset();
			document.FormNewCategory.newCategoryName.focus();
			if(done){
				this.#selectManagerCategoryRemove.innerHTML="";
				$(this.#selectManagerCategoryRemove).append(`<option  value="" "></option>`);

				for (const category of categories) {
					$(this.#selectManagerCategoryRemove).append(`<option  value="${category.name}" "> ${category.name}</option>`);
				}
			}
			myModalElem.remove();
		});
	}


	showFormAsignPerson(productions,actors,directors){

		this.main.empty();
		let container = $(`		<section class="container  bg-dark p-2 rounded-4 mt-5 px-4">
		<form role="form" name="formAsignPerson">

			<div class="row">
				<h1>Asignar una persona a una producción</h1>
			</div>

			<div class="row g-4">
				<div class="col-md-6">
				<div class="row mt-3 justify-content-center">
				<img src="img/default-film.jpg" alt="img prueba" class="w-50" id="imgAsignProduction">
					</div>

					<div class="row mt-3 justify-content-center">
						<div class="col-8">
							<div class="color-bg-input form-floating">
								<input
									class="form-control  border  border-info border-5 border-top-0 border-start-0 border-end-0 "
									list="dataListProductions" id="dataListProductionsInput" placeholder="title" name="nameProduction">
								<datalist id="dataListProductions">
								</datalist>
								<label for="listProductions" class="text-primary">title</label>
							</div>

						</div>
					</div>
					</div>
					<div class="col-md-6">
						<div class="row mt-3 justify-content-center">
							<img src="img/Unknown-Person.png" alt="img prueba" id="imgAsignPerson" class="w-50">
						</div>

						<div class="row mt-3 justify-content-center">
							<div class="col-8">
								<div class="color-bg-input form-floating">
									<input
										class="form-control  border  border-info border-5 border-top-0 border-start-0 border-end-0 "
										list="datalistOptionsPerson" id="datalistOptionsPersonInput" placeholder="name" name="namePerson">
									<datalist id="datalistOptionsPerson">
									</datalist>
									<label for="listProductions" class="text-primary">name</label>
								</div>

							</div>
						</div>
						</div>
				</div>

				</div>

			</div>
			<div class="row mt-4">
			<div class="col-lg-12  d-flex">
				<button class="btn btn-primary m-1 w-50 mx-auto " type="submit" id="asignButton">Asignar</button>
			</div>
		</form>
	</section>`);

	let datalistPerson = container.find('#datalistOptionsPerson');

	for (const person of actors) {
		datalistPerson.append(`<option value='${person.name + ` ` + person.lastname1 + "(actor)"}'>`)
	}


	for (const person of directors) {
		datalistPerson.append(`<option value='${person.name + " " + person.lastname1 + "(director)"}'">`)
	}

	let dataProductions = container.find("#dataListProductions")
	for (const production of productions) {
		dataProductions.append(`<option  value='${production.title}'> ${production.title}</option>`);
	}


	this.main.append(container);

	this.#imgAsignPerson = document.getElementById("imgAsignPerson")
	this.#imgAsignProduction = document.getElementById("imgAsignProduction")
	}

	bindUpdateAsignPerson(handler) {

		document.getElementById("datalistOptionsPersonInput").addEventListener("input", (event) => {
			handler(event.target.value)
		});
	}

	updateAsignPerson(person,handler) {
		this.#imgAsignPerson.src = person.picture;
		this.#imgAsignPerson.setAttribute("data-name", `${person.name + "||" + person.lastname1}`);
		this.#imgAsignPerson.classList.add("imgHover");

		this.bindShowPersonInAssign(handler)

	}
	bindShowPersonInAssign(handler){
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;
		this.#imgAsignPerson.onclick = function(event) {
			let name = this.dataset.name;
			excecuteHandler(
				handler, [name],
				{ action: 'showPerson', name: name },
				`#Person-${name.replaceAll("||", "-")}`, event
			);
		};
	}

	updateDefaultAsignPerson() {
		if(this.#imgAsignPerson != "img/Unknown-Person.png"){
		this.#imgAsignPerson.src = "img/Unknown-Person.png";
		//eliminamos el evento click
		this.#imgAsignPerson.onclick=null;
		this.#imgAsignPerson.classList.remove("imgHover");

		}
	}

	///Acualizar img producción

	bindUpdateAsignProuction(handler) {

		document.getElementById("dataListProductionsInput").addEventListener("input", (event) => {
			handler(event.target.value)
		});
	}
	updateAsignProduction(production,handler) {
		this.#imgAsignProduction.src = production.image;
		this.#imgAsignProduction.setAttribute("data-title", `${production.title}`);

		this.#imgAsignProduction.classList.add("imgHover");
		this.bindShowProductionInAssign(handler);
	}

	bindShowProductionInAssign(handler){
		//guardamos la referencia
		let excecuteHandler = this.#excecuteHandler;
		this.#imgAsignProduction.onclick = function(event) {
			let production = this.dataset.title;
			excecuteHandler(
				handler, [production],
				{ action: 'production', production: production },
				`#Production-${production.replaceAll(" ", "-")}`, event
			);
		};
	}

	updateDefaultAsignProduction() {
		if(this.#imgAsignProduction != "img/default-film.jpg"){
		this.#imgAsignProduction.src = "img/default-film.jpg";
		this.#imgAsignProduction.removeAttribute("data-title");
		//eliminamos el evento onclick
		this.#imgAsignProduction.onclick=null;
		//le quitamos la clase imgHover, solo da efecto hover
		this.#imgAsignProduction.classList.remove("imgHover");
		}
	}

	//enlazar evento al botón de asign
	bindFormAsignPerson(handler){
		asignPersonValidation(handler)
	}

	showFormAssignPersonModal(done,msg,title,name) {
		let modal = (done) ? $(`
		<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
					<div class="modal-content  bg-success">
						<div class="modal-header">
							<h5 class="modal-title" id="staticBackdropLabel">Actor asignado</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<p>Se ha asignado el actor ${name} a la producción ${title}</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
						</div>
					</div>
				</div>
			</div>
		`) :
			`<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">						<div class="modal-dialog">
		<div class="modal-content  bg-danger">
			<div class="modal-header">
				<h5 class="modal-title" id="staticBackdropLabel">No ha sido posible la asignación </h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>${msg} </p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
			</div>
		</div>
	</div>
</div>`;

	//obtenemos el estado actual del historial
		const currentState = history.state;

		//añadimos el modal al body
		this.body.append(modal);
		//creamos el modal
		let myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {})
		myModal.show()

		//obtenemos el modal del documento
		let myModalElem = document.getElementById('staticBackdrop');

		//al modal le asignamos el evento para ocultar el modal
		myModalElem.querySelector('button').addEventListener('click', () => {
			myModal.hide();
		});

		//si se ha ocultado el modal lanzara el evento

		myModalElem.addEventListener('hidden.bs.modal', () => {
			myModalElem.remove();
		});
		//evitamos que el modal afecte al historial

	}

}

export default VideoSystemView;
