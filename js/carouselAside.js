let carrusel = document.querySelector(".carousel-aside");
let isDown = false;
let startX;
let scrollLeft;

carrusel.addEventListener("mousedown", function (e) {
	isDown = true;
	startX = e.pageX - carrusel.offsetLeft;
	scrollLeft = carrusel.scrollLeft;
});

carrusel.addEventListener("mouseleave", function () {
	isDown = false;
});

carrusel.addEventListener("mouseup", function () {
	isDown = false;
});

carrusel.addEventListener("mousemove", function (e) {
	if (!isDown) return;
	e.preventDefault();
	let x = e.pageX - carrusel.offsetLeft;
	let move = (x - startX) * 3; // Ajusta la velocidad del movimiento
	carrusel.scrollLeft = scrollLeft - move;
});
