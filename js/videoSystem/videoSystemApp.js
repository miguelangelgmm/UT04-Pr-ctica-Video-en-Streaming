import  {VideoSystem}  from "./videoSystemModel.js";
import VideoSystemController from "./videoSystemController.js";
import  VideoSystemView  from "./videoSystemView.js";

const VideoSystemApp = new VideoSystemController(
	VideoSystem.getInstance("System"),new VideoSystemView()
	);

export default  VideoSystemApp;
