
function removePersonValidation(handler){
	let form = document.forms.fNewProduct;
	$(form).attr('novalidate', true);

	$(form).submit(function(event){
		let isValid = true;
		let firstInvalidElement = null;

		this.npDescription.value = this.npDescription.value.trim();
		showFeedBack($(this.npDescription), true);

		if (!this.npCategories.checkValidity()){
			isValid = false;
			showFeedBack($(this.npCategories), false);
			firstInvalidElement = this.npCategories;
		} else {
			showFeedBack($(this.npCategories), true);
		}

		if (!this.npUrl.checkValidity()){
			isValid = false;
			showFeedBack($(this.npUrl), false);
			firstInvalidElement = this.npUrl;
		} else {
			showFeedBack($(this.npUrl), true);
		}

		if (!this.npTax.checkValidity()){
			isValid = false;
			showFeedBack($(this.npTax), false);
			firstInvalidElement = this.npTax;
		} else {
			showFeedBack($(this.npTax), true);
		}

		if (!this.npPrice.checkValidity()){
			isValid = false;
			showFeedBack($(this.npPrice), false);
			firstInvalidElement = this.npPrice;
		} else {
			showFeedBack($(this.npPrice), true);
		}

		if (!this.npType[0].checkValidity()){
			isValid = false;
			let container = $('#cType');
			let div = container.find('div.invalid-feedback');
			container.last().find('div').removeClass('d-block');
			div.removeClass('d-none').addClass('d-block');
			$(this).find('input[type="radio"').parent().parent().next().removeClass('is-valid is-invalid').addClass('is-invalid');;
			firstInvalidElement = this.npType[0];
		} else {
			let container = $('#cType');
			let div = container.find('div.valid-feedback');
			container.last().find('div').removeClass('d-block');
			div.removeClass('d-none').addClass('d-block');
			$(this).find('input[type="radio"]').parent().parent().next().removeClass('is-valid is-invalid');
			$(this).find('input[type="radio"]:checked').parent().parent().next().addClass('is-valid');
		}

		if (!this.npModel.checkValidity()){
			isValid = false;
			showFeedBack($(this.npModel), false);
			firstInvalidElement = this.npModel;
		} else {
			showFeedBack($(this.npModel), true);
		}

		if (!this.npBrand.checkValidity()){
			isValid = false;
			showFeedBack($(this.npBrand), false);
			firstInvalidElement = this.npBrand;
		} else {
			showFeedBack($(this.npBrand), true);
		}

		if (!this.npSerial.checkValidity()){
			isValid = false;
			showFeedBack($(this.npSerial), false);
			firstInvalidElement = this.npSerial;
		} else {
			showFeedBack($(this.npSerial), true);
		}

		if (!isValid){
			firstInvalidElement.focus();
		} else {
			let categories = [...this.npCategories.selectedOptions].map(function (option){
				return option.value;
			})
			handler(this.npSerial.value, this.npBrand.value, this.npModel.value,
				this.npType.value, this.npPrice.value, this.npTax.value, this.npUrl.value,
				this.npDescription.value, categories);
		}
		event.preventDefault();
		event.stopPropagation();
	});

	form.addEventListener('reset',(function(event){
		let feedDivs = $(this).find('div.valid-feedback, div.invalid-feedback');
		feedDivs.removeClass('d-block').addClass('d-none');
		let inputs = $(this).find('input, textarea, select, label');
		inputs.removeClass('is-valid is-invalid');
	}));

	$(form.ncTitle).change(defaultCheckElement);
	$(form.ncUrl).change(defaultCheckElement);
}
