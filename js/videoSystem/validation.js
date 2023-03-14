function defaultCheckElement(event) {
	this.value = this.value.trim();
	if (!this.checkValidity()) {
		showFeedBack($(this), false);
	} else {
		showFeedBack($(this), true);
	}
}

function showFeedBack(input, valid, message) {
	let validClass = (valid) ? 'is-valid' : 'is-invalid';
	let div = (valid) ? input.nextAll("div.valid-feedback") : input.nextAll("div.invalid-feedback");
	input.nextAll('div').removeClass('d-block');
	div.removeClass('d-none').addClass('d-block');
	input.removeClass('is-valid is-invalid').addClass(validClass);
	if (message) {
		div.empty();
		div.append(message);
	}
}

function newPersonValidation(handler) {
	let form = document.forms.formNewPerson;
	$(form).attr('novalidate', true);

	$(form).submit(function (event) {

		let isValid = true;
		let firstInvalidElement = null;


		//La imagen es opcional
		if (!this.picturePerson.checkValidity()) {
			isValid = false;
			showFeedBack($(this.picturePerson), false);
			firstInvalidElement = this.picturePerson;
		} else {
			showFeedBack($(this.picturePerson), true);
		}

		//La fecha de nacimiento no puede ser superior a la de hoy
		this.born.setAttribute("max", new Date().toISOString().split('T')[0]);

		if (!this.born.checkValidity()) {
			isValid = false;
			showFeedBack($(this.born), false);
			firstInvalidElement = this.born;
		} else {
			showFeedBack($(this.born), true);
		}

		//el segundo apellido es opcional
		this.lastName2.value = this.lastName2.value.trim();
		showFeedBack($(this.lastName2), true);

		this.lastName1.value = this.lastName1.value.trim();
		if (!this.lastName1.checkValidity()) {
			isValid = false;
			showFeedBack($(this.lastName1), false);
			firstInvalidElement = this.lastName1;
		} else {
			showFeedBack($(this.lastName1), true);
		}

		this.nameNewPerson.value = this.nameNewPerson.value.trim();
		if (!this.nameNewPerson.checkValidity()) {
			isValid = false;
			showFeedBack($(this.nameNewPerson), false);
			firstInvalidElement = this.nameNewPerson;
		} else {
			showFeedBack($(this.nameNewPerson), true);
		}
		showFeedBack($(this.selectType), true);

		if (!isValid) {
			firstInvalidElement.focus();
		} else {
			handler(this.nameNewPerson.value, this.lastName1.value, this.lastName2.value, this.born.value, this.selectType.value, this.picturePerson.value)
			//handler(this.ncTitle.value, this.ncUrl.value, this.ncDescription.value);
		}
		event.preventDefault();
		event.stopPropagation();

	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

	//cada vez que hay un cambio mostramos si es correcto
	$(form.picturePerson).change(defaultCheckElement);
	$(form.nameNewPerson).change(defaultCheckElement);
	$(form.lastName1).change(defaultCheckElement);
	$(form.lastName2).change(defaultCheckElement);

}



function removePersonValidation(handler) {
	let form = document.forms.formRemovePerson;
	$(form).attr('novalidate', true);

	$(form).submit(function (event) {
		let isValid = true;
		let firstInvalidElement = null;

		//si el usuario intenta enviar el formulario en blanco mostramos que es necesario que introduzca el nombre a eliminar
		this.delPerson.value = this.delPerson.value.trim();
		if (!this.delPerson.checkValidity()) {
			isValid = false;
			showFeedBack($(this.delPerson), false);
			firstInvalidElement = this.delPerson;
		} else {
			//	showFeedBack($(this.nameNewPerson), true);
		}

		if (!isValid) {
			firstInvalidElement.focus();
		} else {
			handler(this.delPerson.value)

		}
		event.preventDefault();
		event.stopPropagation();

	});


	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

	//cada vez que hay un cambio mostramos si es correcto
	$(form.picturePerson).change(defaultCheckElement);
	$(form.nameNewPerson).change(defaultCheckElement);
	$(form.lastName1).change(defaultCheckElement);
	$(form.lastName2).change(defaultCheckElement);

}

function removeProductionValidation(handler) {
	let form = document.forms.formRemoveProduction;
	$(form).attr('novalidate', true);

	$(form).off('submit'); // Desvincular el evento submit existente si existe

	$(form).submit(function (event) {
		let isValid = true;
		let firstInvalidElement = null;

		this.delProduction.value = this.delProduction.value.trim();
		if (!this.delProduction.checkValidity()) {
			isValid = false;
			showFeedBack($(this.delProduction), false);
			firstInvalidElement = this.delProduction;
		} else {
			//	showFeedBack($(this.nameNewPerson), true);
		}


		if (!isValid) {
			firstInvalidElement.focus();
		} else {
			handler(this.delProduction.value)

		}
		event.preventDefault();
		event.stopPropagation();

	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));
}



function newCategoryValidation(handler) {
	let form = document.forms.FormNewCategory;

	$(form).attr('novalidate', true);


	$(form).submit(function (event) {


		let isValid = true;
		let firstInvalidElement = null;


		if (!this.newCategoryName.checkValidity()) {
			isValid = false;
			showFeedBack($(this.newCategoryName), false);
			firstInvalidElement = this.newCategoryName;
		} else {
			showFeedBack($(this.newCategoryName), true);
		}
		if (!this.newCategoryInf.checkValidity()) {
			isValid = false;
			showFeedBack($(this.newCategoryInf), false);
			firstInvalidElement = this.newCategoryInf;
		} else {
			showFeedBack($(this.newCategoryInf), true);
		}


		if (!isValid) {
			firstInvalidElement.focus();
		} else {

			handler(this.newCategoryName.value, this.newCategoryInf.value)
			//handler(this.ncTitle.value, this.ncUrl.value, this.ncDescription.value);
		}
		event.preventDefault();
		event.stopPropagation();


	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

	//cada vez que hay un cambio mostramos si es correcto
	$(form.newCategoryName).change(defaultCheckElement);

}

function asignPersonValidation(handler) {
	let form = document.forms.formAsignPerson;

	$(form).attr('novalidate', true);


	$(form).submit(function (event) {
		console.log(form.submit)

		let isValid = true;
		let firstInvalidElement = null;



		this.namePerson.value = this.namePerson.value.trim();
		if (!this.namePerson.checkValidity()) {
			isValid = false;
			showFeedBack($(this.namePerson), false);
			firstInvalidElement = this.namePerson;
		} else {
			//	showFeedBack($(this.nameNewPerson), true);
		}

		this.nameProduction.value = this.nameProduction.value.trim();
		if (!this.nameProduction.checkValidity()) {
			isValid = false;
			showFeedBack($(this.nameProduction), false);
			firstInvalidElement = this.nameProduction;
		} else {
			//	showFeedBack($(this.nameNewPerson), true);
		}


		if (!isValid) {
			firstInvalidElement.focus();
		} else {

			handler(this.nameProduction.value, this.namePerson.value)

		}
		event.preventDefault();
		event.stopPropagation();


	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

}

function NewProductionValidation(handler) {
	let form = document.forms.formNewProduction;

	$(form).attr('novalidate', true);


	$(form).submit(function (event) {


		let isValid = true;
		let firstInvalidElement = null;

		if (!this.seasonsForm.checkValidity()) {
			isValid = false;
			showFeedBack($(this.seasonsForm), false);
			firstInvalidElement = this.seasonsForm;
		} else {
			showFeedBack($(this.seasonsForm), true);
		}

		if (!this.time.checkValidity()) {
			isValid = false;
			showFeedBack($(this.time), false);
			firstInvalidElement = this.time;
		} else {
			showFeedBack($(this.time), true);
		}


		if (!this.longitudeForm.checkValidity()) {
			isValid = false;
			showFeedBack($(this.longitudeForm), false);
			firstInvalidElement = this.longitudeForm;
		} else {
			showFeedBack($(this.longitudeForm), true);
		}

		if (!this.latitudForm.checkValidity()) {
			isValid = false;
			showFeedBack($(this.latitudForm), false);
			firstInvalidElement = this.latitudForm;
		} else {
			showFeedBack($(this.latitudForm), true);
		}

		this.resourceForm.value = this.resourceForm.value.trim();
		if (!this.resourceForm.checkValidity()) {
			isValid = false;
			showFeedBack($(this.resourceForm), false);
			firstInvalidElement = this.resourceForm;
		} else {
			showFeedBack($(this.resourceForm), true);
		}

		this.UrlImg.value = this.UrlImg.value.trim();
		if (!this.UrlImg.checkValidity()) {
			isValid = false;
			showFeedBack($(this.UrlImg), false);
			firstInvalidElement = this.UrlImg;
		} else {
			showFeedBack($(this.UrlImg), true);
		}

		this.synosisProduction.value = this.synosisProduction.value.trim();
		if (!this.synosisProduction.checkValidity()) {
			isValid = false;
			showFeedBack($(this.synosisProduction), false);
			firstInvalidElement = this.synosisProduction;
		} else {
			showFeedBack($(this.synosisProduction), true);
		}

		if (!this.dateProduction.checkValidity()) {
			isValid = false;
			showFeedBack($(this.dateProduction), false);
			firstInvalidElement = this.dateProduction;
		} else {
			showFeedBack($(this.dateProduction), true);
		}

		this.nacionalityForm.value = this.nacionalityForm.value.trim();
		if (!this.nacionalityForm.checkValidity()) {
			isValid = false;
			showFeedBack($(this.nacionalityForm), false);
			firstInvalidElement = this.nacionalityForm;
		} else {
			showFeedBack($(this.nacionalityForm), true);
		}

		this.titleProduction.value = this.titleProduction.value.trim();
		if (!this.titleProduction.checkValidity()) {
			isValid = false;
			showFeedBack($(this.titleProduction), false);
			firstInvalidElement = this.titleProduction;
		} else {
			showFeedBack($(this.titleProduction), true);
		}


		if (!isValid) {
			firstInvalidElement.focus();
		} else {
			//obtenemos todas las categorias que tengan check
			let categories = form.querySelectorAll('input[type="checkbox"][id^="category"]:checked');
			let categoriesValue = [];
			categories.forEach((category) => {
				categoriesValue.push(category.value);
			});
			let actorsValue = [];
			Array.from(	this.actorsSelect.selectedOptions).forEach((actor) => {
				actorsValue.push(actor.value);
			});
			let directorsValue = [];
			Array.from(	this.directorsSelect.selectedOptions).forEach((director) => {
				directorsValue.push(director.value);
			});


			handler(
								this.typeProductionSelect.value,
                this.titleProduction.value,
                this.nacionalityForm.value,
                new Date(Date.parse(this.dateProduction.value)),
                categoriesValue,
                this.synosisProduction.value,
                actorsValue,
                directorsValue,
                this.UrlImg.value,
                this.resourceForm.value,
                this.latitudForm.value,
								this.longitudeForm.value,
								this.seasonsForm.value,
								this.time.value
            );

		}
		event.preventDefault();
		event.stopPropagation();


	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

}

function LoginUserValidation(handler) {
	let form = document.forms.formLogin;

	$(form).attr('novalidate', true);


	$(form).submit(function (event) {

		let isValid = true;
		let firstInvalidElement = null;

		this.nameUser.value = this.nameUser.value.trim();

		if (!this.nameUser.checkValidity()) {
			isValid = false;
			showFeedBack($(this.nameUser), false);
			firstInvalidElement = this.nameUser;
		} else {
			showFeedBack($(this.nameUser), true);
		}
		this.password.value = this.password.value.trim();

		if (!this.password.checkValidity()) {
			isValid = false;
			showFeedBack($(this.password), false);
			firstInvalidElement = this.password;
		} else {
			showFeedBack($(this.password), true);
		}



		if (!isValid) {
			firstInvalidElement.focus();
		} else {

			handler(this.nameUser.value,this.password.value);

		}
		event.preventDefault();
		event.stopPropagation();


	});

	form.addEventListener('reset', (function (event) {
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input');
		inputs.removeClass('is-valid is-invalid');
	}));

}



export { newPersonValidation, removePersonValidation, removeProductionValidation, newCategoryValidation, asignPersonValidation, NewProductionValidation,LoginUserValidation };
