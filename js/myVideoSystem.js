
import VideoSystemApp from "./videoSystem/videoSystemApp.js";


//objeto historyActions
const historyActions = {
	init: () =>  VideoSystemApp.handleInit() ,
	productionCategoryList: (event) => VideoSystemApp.handleProductsCategoryList(event.state.category),
	actorPersonList: () => VideoSystemApp.handleActors(),
	directorPersonList: () => VideoSystemApp.handleDirector(),
	showPerson: (event) =>	VideoSystemApp.handleShowPerson(event.state.name),
	production: (event) => VideoSystemApp.handleCategoryListProduction(event.state.production),
	newProduction:() =>VideoSystemApp.handlerNewProduction(),
	delProduction:() =>VideoSystemApp.handlerRemoveProduction(),
	assignPerson:() =>VideoSystemApp.handlerAssignPerson(),
	manageCategory:() =>VideoSystemApp.handlerManageCategory(),
	newPerson:() =>VideoSystemApp.handlerNewPerson(),
	delPerson:() =>VideoSystemApp.handleRemovePerson(),


}

//ejecutamos una acción cada vez que pulsemos las flechas
window.addEventListener('popstate', function(event) {
	if (event.state){
		historyActions[event.state.action](event);
	}
});
//establece el estado inicial del historial
history.replaceState({action: 'init'}, null);
