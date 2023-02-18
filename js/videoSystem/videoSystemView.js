class VideoSystemView {
	constructor() {
		this.categories = $('#navbarSupportedContent ul li');
		this.main = $('main');

	}

	#showPersons(persons, elem = "") {

		let container = $(`
		<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4 ${elem}">
		</div>
		`);
		for (const person of persons) {
			container.append(`
			<section class="col item-list mx-auto rounded-4 mt-3">
			<figure data-name='${person.name + "||" + person.lastname1}' class="person">
				<img src="${person.picture}" alt="" class="rounded-4 position-relative ">
				<figcaption>${person.name + " " + person.lastname1 + " " + person.lastname2}</figcaption>
			</figure>
		</section>
			`)
		}
		return container;
	}
	#showProductions(productions) {
		let section = $(`

		<section class="container-fluid mx-auto " >

		<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4 bg-blue-glass">

			</div>
	</section>
	`);
		for (const production of productions) {
			let div = $(`
		<section class="col prueba2 mx-auto rounded-4 mt-3">
			<figure class="production-person" >
				<img src="${production.image}" alt="" class="rounded-4 image-prod" data-title="${production.title}">
			</figure>
		</section>`)
			section.children().append(div)
		}
		return section;
	}

	showCategoriesInNav(categories) {

		let ul = $(`<ul class="dropdown-menu"></ul>`);

		for (let category of categories) {
			ul.append(`<li><a data-category="${category.name}" class="dropdown-item" href="#">${category.name}</a><li>`);
		}
		this.categories.append(ul);
	}

	bindProductionsCarousel(handler) {
		$('.image-carousel').click(function (event) {
			handler(this.dataset.title);
		});
	}
	bindProductions(handler) {
		$('.image-prod').click(function (event) {
			handler(this.dataset.title);
		});
	}

	bindProductionsNavCategoryList(handler) {
		$('.dropdown-item').click(function (event) {
			handler(this.dataset.category);
		});
	}
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

		for (let production of productions) {
			carousel.children().eq(1).append(`

			<div class="carousel-item ${active ? "active" : ""} ">

			<img src="${production.image}"  data-category="${production.title}" class="d-block w-100 bg-image-carousel" alt="${production.title}">
			<img src="${production.image}" data-category="${production.title}" class="position-absolute image-carousel" alt="${production.title}" data-title="${production.title}" >

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

	showCategoriesInMain(categories) {
		this.main.empty();
		let categoriesMain = $(`<div class="container rounded-5 bg-dark mx-a mt-4 py-2 shadow-aside">
		<aside class="carousel-aside">
		</aside>
	</div>
	`);

		for (let category of categories) {
			categoriesMain.children().append(`

		<div class="item-aside p-2 link" href='#product-list'  data-category="${category.name}">
		<div>
			<img src="img/icons/${category.name}.png" alt="${category.name}" class="image-aside" >
			<h3 class="d-none d-lg-block">${category.name}</h3>
		</div>
	</div>
		`);
		}
		this.main.append(categoriesMain);
	}


	//Enlacamos a las categorias un evento
	bindProductionsCategoryList(handler) {
		$('.link').click(function (event) {
			handler(this.dataset.category);
		});
	}

	bindProductionCategoryList(handler) {
		document.querySelectorAll('div.link h4').forEach(function (h4) {
			h4.addEventListener('click', (function (event) {
				handler(this.dataset.category);
			}))
		})
	}

	bindInit(handler) {
		$('#logo').click((event) => {
			handler();
		});
	}




	//Lista de elementos
	listProductions(productions, title) {
		this.main.empty();
		let container = $(`
		<section class="container-fluid mx-auto " id="show-productions">
			<div class="row row-cols-4 mx-auto ms-2 me-2 mt-4 bg-dark p-2 rounded-4">
			</div>
		</section>
		`)
		let production = productions.next();
		while (!production.done) {
			let div = $(`
			<section class="col item-list mx-auto rounded-4 mt-3">
			<figure>
				<img src="${production.value.image}" alt="${production.value.title}" class="rounded-4 image-cat" data-title="${production.value.title}">
			</figure>
			`);
			container.children().first().append(div);
			production = productions.next();
		}
		container.prepend(`<h1>${title}</h1>`);
		this.main.append(container);
	}


	bindProductionToProduction(handler) {
		$('#show-productions').find('img').click(function (event) {
			handler(this.dataset.title);
		});
	}

	showProduction(production, categories, directors, actors) {
		this.main.empty();

		let container = $(`
		<!-- Producción -->
	<section class="container-fluid mx-auto mt-5 rounded-5">
		<div class="container-fluid  bg-dark p-0 rounded-5"  >
			<div class="container-fluid p-0" >
				<iframe src="${production.resource.link}"
				title="${production.title}"
				frameborder="0"
				allowfullscreen
				class="container-fluid frame-production rounded-5 shadow-white"></iframe>
			</div>
		</div>
	</section>
	<!--Información-->
		<div class="container-fluid mt-5 bg-dark pb-4" >
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
		let categoriesFilm = container.find("#category-film");
		for (const category of categories) {
			categoriesFilm.append(`
			<div class="link">
				<h4 class="d-inline bg-danger rounded-4 p-2 "  data-category="${category.name}"> ${category.name} </h4>
			</div>
			`)
		}

		let directorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Directores</h1>
		</section>
		`)
		directorsFilm.append(
			this.#showPersons(directors, "bg-blue-glass")
		);
		container.last().children().append(directorsFilm);

		let actorsFilm = $(`
		<section class="container-fluid mx-auto mt-2 " >
		<h1>Actores</h1>
		</section>
		`)
		actorsFilm.append(
			this.#showPersons(actors, "bg-blue-glass")
		);
		container.last().children().append(actorsFilm);

		this.main.append(container);
	}

	bindActorPersonList(handler) {
		$('#actors').click(function (event) {
			handler();
		});
	}
	bindDirectorPersonList(handler) {
		$('#directors').click(function (event) {
			handler();
		});
	}

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
			<section class="col item-list mx-auto rounded-4 mt-3">
			<figure data-name='${person.value.name + "||" + person.value.lastname1}' class="person">
				<img src="${person.value.picture}" alt="" class="rounded-4">
				<figcaption>${person.value.name + " " + person.value.lastname1 + " " + person.value.lastname2}</figcaption>
			</figure>
			</section>
			`);
			container.children().append(div);
			person = persons.next();
		}
		this.main.append(container);
	}

	bindPersonData(handler) {
		$('.person').click(function (event) {
			handler(this.dataset.name);
		});
	}

	personData(person, directedProductions, actedProductions) {
		this.main.empty();
		let container = $(`
			<div class="container-fluid mt-5 bg-dark pb-5">
				<div class="row  mx-auto">
					<div class="col-lg-4 col-xs-5 mt-2">
						<section class="col prueba2 mx-auto rounded-4 mt-3">
							<figure class="lg-me-4 mx-auto text-center">
								<img src="${person.picture}" alt="${person.name}" class="rounded-4 position-relative">
							</figure>
						</section>
					</div>
					<div class="col-8">
						<div class="row">
							<h1>${person.name +" " + person.lastname1+ " " + person.lastname2}</h1>
						</div>
						<div class="row mt-4">
							<span>nacimiento:${person.born.toLocaleDateString()}  </span>
						</div>
					</div>
				</div>

			</div>
		`);

		if (directedProductions) {
			container.append(this.#showProductions(directedProductions).prepend(`<h1>${"Producciones dirigidas"}</h1>`));
		}
		if (actedProductions) {
			container.append(this.#showProductions(actedProductions).prepend(`<h1>${"Producciones como actor"}</h1>`));
		}

		this.main.append(container)
	}



}

export default VideoSystemView;
