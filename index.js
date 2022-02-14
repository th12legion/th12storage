let stateStorage = {};
let stateStorageTriggers = {};

/*
* 	Функция для проверки триггерной функции
*
*	@param {Function} trigger - функция триггер
*
*	@return {Boolean} - статус проверки
* 
*/
let checkTrigger = function(trigger = null) {
	if(trigger==null 
	|| typeof trigger!=="function"
	|| (typeof trigger.name!=="undefined" && trigger.name.trim()==="")){
		return false;
	}

	return true;
}

/*
* 	Функция сравнения значение
*
*	@param {Any} oldValueCheck - Старое значение
*	@param {Any} newValueCheck - Новое Значение
*
*	@return {Boolean} - статус проверки
* 
*/
let compareValue = function(oldValueCheck, newValueCheck) {
	if(typeof oldValueCheck!=="object"
		&& typeof oldValueCheck===typeof newValueCheck
		&& oldValueCheck===newValueCheck){
		return true;
	}else if(typeof oldValueCheck==="object"
				&& typeof oldValueCheck===typeof newValueCheck){
			let oldValue = JSON.stringify(oldValueCheck);
			let newValue = JSON.stringify(newValueCheck);
		if(oldValue===newValue){
			return true;
		}
	}

	return false;
}

/*
* 	Функция(Хук) для использования хранилища
*
*	@param {String} name - Название переменной
*	@param {Any} defaultValue - Значение по умолчанию
*	@param {Boolean} update - Триггер на создание функции обновления
*
*	@return {Array} - Массив со значением и триггером
* 
*/
export let useStorage = function(name = "", defaultValue = null, update = false) {
	if(typeof stateStorage[name]==="undefined"){
		stateStorage[name] = defaultValue;
	}
	
	let setter = null;
	if(update===true){
		setter = function (value, cb = null, update = true) {
			if((cb!==null && checkTrigger(cb)===false)
			|| compareValue(stateStorage[name], value)===true
			|| update===false){
				return false;
			}

			let random = Math.random();
			stateStorage[name] = value;
			if(typeof cb==="function"){
				cb(random);
			}

			if(typeof stateStorageTriggers[name]!=="undefined"){
				for(let key in stateStorageTriggers[name]){
					stateStorageTriggers[name][key](random);
				}
			}

			return true;
		}
	}

	return [stateStorage[name], setter];
}

/*
* 	Функция(Хук) для подписки на изминения значений в хранилище
*
*	@param {String} component - Компонент в котором находится переменная
*	@param {Array} subscribes - Массив с именами переменных, которые надо отслеживать
*	@param {Function | null} trigger - Триггер функция, которую надо вызвать при изменении значения
*
*	@return {Boolean} - Статус подписки
* 
*/
export let useStorageSubscribe = function (component, subscribes, trigger = null) {
	if(checkTrigger(trigger)===false
	|| Array.isArray(subscribes)===false
	|| subscribes.length===0){
		return false;
	}

	for(let i = 0; i<subscribes.length; i++){
		let name = subscribes[i];
		if(typeof stateStorageTriggers[name]==="undefined"){
			stateStorageTriggers[name] = {};
		}
		
		stateStorageTriggers[name][component] = trigger;
	}

	return true;
}