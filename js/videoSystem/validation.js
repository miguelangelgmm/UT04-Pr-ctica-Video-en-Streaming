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
			handler(this.nameNewPerson.value,this.lastName1.value,this.lastName2.value,this.born.value,this.selectType.value,this.picturePerson.value)
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

	$(form).off('submit'); // Desvincular el evento submit existente si existe

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



}



export { newPersonValidation ,removePersonValidation,removeProductionValidation};
