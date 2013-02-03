define(
[
	'happy/utils/keyCode',
	'happy/_libs/signals',
],	
function
(
	keyCode,
	Signal
){
	"use strict";

	var KeyboardInteraction = function(){
		var
		self = this,
		key = 'UNDEFINED',
		type = 'down',
		isActive = false,
		wasActive = false,
		interactionStarted = new Signal(),
		interactionEnded = new Signal();

		
		var onKeyUp = function(e){
			if(keyCode.codeToChar(e.keyCode) == key){
				if(type == 'up'){
					isActive = true;
					if(!wasActive){
						interactionStarted.dispatch(self);
						wasActive = true;
					}
				}
				else{
					isActive = false;
					if(wasActive){
						wasActive = false;
						interactionEnded.dispatch(self);
					}					
				}
			}
		}
		var onKeyDown = function(e){
			if(keyCode.codeToChar(e.keyCode) == key){
				if(type == 'down'){
					isActive = true;
					if(!wasActive){
						interactionStarted.dispatch(self);
						wasActive = true;
					}
				}
				else{
					isActive = false;
					if(wasActive){
						wasActive = false;
						interactionEnded.dispatch(self);
					}
				}
			}
		}
		var setKey = function(value) {
			key = value;
		}
		var getKey = function() {
			return key;
		}
		var setType = function(value) {
			type = value;
		}
		var getType = function() {
			return type;
		}
		var setBar = function(value) {
			bar = value;
		}
		var getBar = function() {
			return bar;
		}
		var getIsActive = function() {
			return isActive;
		}
		var getInteractionStarted = function(){
			return	interactionStarted;
		}
		var getInteractionEnded = function(){
			return	interactionEnded;
		}
			

		Object.defineProperty(self, 'onKeyUp', {
			value: onKeyUp
		});
		Object.defineProperty(self, 'onKeyDown', {
			value: onKeyDown
		});
		Object.defineProperty(self, 'key', {
			get: getKey,
			set: setKey
		});
		Object.defineProperty(self, 'type', {
			get: getType,
			set: setType
		});
		Object.defineProperty(self, 'isActive', {
			get: getIsActive
		});
		Object.defineProperty(self, 'interactionStarted', {
			get: getInteractionStarted
		});
		Object.defineProperty(self, 'interactionEnded', {
			get: getInteractionEnded
		});

	}
	return KeyboardInteraction;
});