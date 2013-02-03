define(
[
	'happy/app/BaseApp',
	'happy/audio/Node',
	'happy/audio/AudioFile',
	'happy/utils/dom',
	'happy/utils/keyCode',
	'happy/utils/vendorPrefix',
	
	'happy/_libs/dat.gui',
	'happy/_libs/amd-utils/math/clamp',
	
	'KeyboardInteraction',
],
function (
	BaseApp,
	Node,
	AudioFile,
	
	dom,
	keyCode,
	vendorPrefix,
	
	Gui,
	clamp,
	
	KeyboardInteraction
){
	var AudioContext =  vendorPrefix.getValid('AudioContext');

	var App = function(){
		var 
		self = this,

		audioContext,
		output,
		stirAudio,
		chopAudio,
		wineAudio,	
		stirInteraction,
		chopInteraction,
		wineInteraction,
		mixer,
		gui;

		var setup = function(){	
			audioContext = new AudioContext();
			output = new Node(audioContext.destination);

			mixer = new Node(audioContext.createGainNode());
			mixer.connect(output);

			stirAudio = new AudioFile(audioContext);
			stirAudio.load({
				url: 'data/stir.mp3',
				onSuccess: onAudioLoaded
			});

			chopAudio = new AudioFile(audioContext);
			chopAudio.load({
				url: 'data/chop.mp3',
				onSuccess: onAudioLoaded
			});

			wineAudio = new AudioFile(audioContext);
			wineAudio.load({
				url: 'data/wine.mp3',
				onSuccess: onAudioLoaded
			});

			stirInteraction = new KeyboardInteraction();
			stirInteraction.key = 'LEFT_ARROW';

			chopInteraction = new KeyboardInteraction();
			chopInteraction.key = 'RIGHT_ARROW';

			wineInteraction = new KeyboardInteraction();
			wineInteraction.key = 'UP_ARROW';

			gui = new Gui();

			gui.speed = 0.0;
			gui.add(gui, 'speed', 0,1.0).listen();

			gui.stirGain = 1.0;
			gui.add(gui, 'stirGain', 0,1).step(0.001).listen();
			gui.chopGain = 1.0;
			gui.add(gui, 'chopGain', 0,1).step(0.001).listen();
			gui.wineGain = 1.0;
			gui.add(gui, 'wineGain', 0,1).step(0.001).listen();

			gui.increaseSpeed = 0.001;
			gui.add(gui, 'increaseSpeed', 0,0.01);
			gui.decreaseSpeed = 0.001;
			gui.add(gui, 'decreaseSpeed', 0,0.01);
		}
		var onAudioLoaded = function(){
			if(stirAudio.isReady && chopAudio.isReady && wineAudio.isReady){
				stirAudio.sound.root.connect(mixer);
				stirAudio.sound.play();
				stirAudio.gain = 1.0;

				chopAudio.sound.root.connect(mixer);
				chopAudio.sound.play();
				chopAudio.gain = 1.0;

				wineAudio.sound.root.connect(mixer);
				wineAudio.sound.play();
				wineAudio.gain = 1.0;
			}
		}
		var update = function(dt, time) {
			if(stirAudio.isReady && chopAudio.isReady && wineAudio.isReady){
				stirAudio.gain = gui.stirGain;

				if(chopInteraction.isActive){
					chopAudio.gain += 0.01;
					if(chopAudio.gain > gui.chopGain) chopAudio.gain = gui.chopGain;
				}
				else{
					chopAudio.gain -= 0.01;
					if(chopAudio.gain < 0) chopAudio.gain = 0;
				}

				if(wineInteraction.isActive){
					wineAudio.gain += 0.01;
					if(wineAudio.gain > gui.wineGain) wineAudio.gain = gui.wineGain;
				}
				else{
					wineAudio.gain -= 0.01;
					if(wineAudio.gain < 0) wineAudio.gain = 0;
				}
				

				if(stirInteraction.isActive){
					gui.speed += gui.increaseSpeed;
				}
				else{
					gui.speed -= gui.decreaseSpeed;
				}

				if(gui.speed < 0.0000001) gui.speed = 0.0000001;
				else if(gui.speed > 1.0) gui.speed = 1.0;

				stirAudio.speed = gui.speed;
				chopAudio.speed = gui.speed;
				wineAudio.speed = gui.speed;
			}			
		}
		var draw = function(dt, time) {

		}

		var onKeyUp = function(e){
			stirInteraction.onKeyUp(e);
			chopInteraction.onKeyUp(e);
			wineInteraction.onKeyUp(e);
		}

		var onKeyDown = function(e){
			stirInteraction.onKeyDown(e);
			chopInteraction.onKeyDown(e);
			wineInteraction.onKeyDown(e);
		}

		var onResize = function(size) {
			/*canvas.width = size.x;
			canvas.height = size.y;
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
			camera.aspect = gl.viewportWidth / gl.viewportHeight;
			//camera.update();*/
		}


		self.setup = setup;
		self.update = update;
		self.draw = draw;
		self.onKeyUp = onKeyUp;
		self.onKeyDown = onKeyDown;
		self.onResize = onResize;
	}
	App.prototype = new BaseApp();
	return App;
});