"use strict";

import { Category } from './ObjectStreaming.js';
import {VideoSystem} from './VideoSystem.js';


/*
Testeo del gestor de imágenes.
*/
function testVideoStreaming(){

	let vs = VideoSystem.getInstance("Streaming");

	console.log(vs.name)
	console.log(vs.name="Spotify")
	console.log(vs.name)
	vs.addCategory(new Category("Dance"))
}
window.onload = testVideoStreaming;

