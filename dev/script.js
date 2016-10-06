var Banner = Banner || {};

Banner = (function (doc) {
	'use strict';

	var exports = {};

	exports.element = null;

	function init(wrapperId, assetsToLoad) {
		console.log('%c [Banner] Banner module inited ', 'background: #199860; color: #fff');
		exports.element = doc.getElementById(wrapperId);
		Banner.Loader.init(assetsToLoad);
		Banner.Loader.onLoadComplete(Banner.BannerController.init);
	}

	exports.init = init;
	return exports;

}(document));

Banner.Loader = (function () {
	'use strict';

	var exports = {},
		assetsList,
		assetImages = [],
		assetLoadedCounter = 0,
		callbackList = [];

	function init(loadingAssets) {
		console.log('%c [Banner.Loader] Banner Loader inited ', 'background: #199860; color: #fff');
		assetsList = loadingAssets || [];
		loadBanner();
	}

	function loadBanner() {
		var i;

		for (i = 0; i < assetsList.length; i++) {
			assetImages[i] = new Image();
			assetImages[i].src = assetsList[i];
			assetImages[i].onload = assetLoaded;
			assetImages[i].onerror = assetError;
			assetLoadedCounter++;
		}

	}

	function assetLoaded() {
		assetLoadedCounter--;
		checkLoadCompleteAndRunCallbacks();
	}

	function assetError(obj) {
		console.log('%c [Banner.Loader] Cannot load asset%s ', 'background: #b83226; color: #fff', obj.path && obj.path[0] ? ': ' + obj.path[0].src : '!');
	}

	function checkLoadCompleteAndRunCallbacks() {

		if (!assetLoadedCounter) {
			console.log('%c [Banner.Loader] All assets were loaded (%d assets) ', 'background: #199860; color: #fff', assetImages.length);
			while (callbackList.length > 0) {
				callbackList.shift()();
			}
		}

	}

	function onLoadComplete(callback) {
		callbackList.push(callback);
		checkLoadCompleteAndRunCallbacks();
	}

	exports.init = init;
	exports.onLoadComplete = onLoadComplete;
	return exports;

}());

Banner.BannerController = (function () {
	'use strict';

	var exports = {},
		isStarted = false,
		actualPhase = 0,
		legalVisible = false,
		playPhaseTimer = 0,
		currentlyVisible = false,
		elements = {};

	function init() {
		console.log('%c [Banner.BannerController] Banner controller inited ', 'background: #199860; color: #fff');

		initWindowShowListener();
		initDOMElements();
		initBindings();
		addClass(Banner.element, 'loaded');
	}

	function bgExitHandler() {
		Enabler.exit('Background Exit');
	}

	function initBindings() {
		if (elements.bgexit !== undefined) {
			elements.bgexit.addEventListener('click', bgExitHandler, false);
		}

		if (elements.legaltrigger !== undefined) {
			elements.legaltrigger.addEventListener('click', toggleLegal, false);
		}
	}

	function toggleLegal() {
		var mode = 'bottom-to-top';

		if (
			window.outerWidth === 728 && window.outerHeight === 90 ||
			window.outerWidth === 840 && window.outerHeight === 150
		) {
			mode = 'left-to-right';
		}

		TweenLite.set(elements.legalcopy, { clearProps: 'all' });

		if (legalVisible) {
			removeClass(elements.legaltrigger, 'active');
			if (mode === 'left-to-right') {
				TweenLite.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '-100%', y: '0%' });
			} else {
				TweenLite.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '0%', y: '100%' });
			}
			legalVisible = false;
		} else {
			addClass(elements.legaltrigger, 'active');
			TweenLite.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '0%', y: '0%' });
			legalVisible = true;
		}

	}

	function initDOMElements() {
		var wrapper = document.getElementById('banner-wrapper'),
			ids = wrapper.querySelectorAll('[id]'),
			formattedId,
			i = 0,
			l = ids.length;

		for (i; i < l; i++) {
			formattedId = ids[i].getAttribute('id').replace(/-/ig, '').toLowerCase();
			elements[formattedId] = document.getElementById(ids[i].getAttribute('id'));
		}
		console.log('%c [Banner.BannerController] DOM elements cached ', 'background: #199860; color: #fff');
	}

	function removeStyles() {
		var i;

		for (i in elements) {
			if (elements.hasOwnProperty(i)) {
				if (elements[i].getAttribute('data-fixed-style') === null) {
					TweenLite.set(elements[i], { clearProps: 'all' });
					elements[i].setAttribute('style', '');
				}
			}
		}
	}

	function playPhase(phaseName) {

		console.log('%c [Banner.BannerController] Playing phase: %s ', 'background: #199860; color: #fff', phaseName);

		if (!currentlyVisible) {
			next(2, phaseName);
			return;
		}

		switch (phaseName) {

			case 'start-screen':
				removeStyles();
				removeClass(elements.legaltrigger, 'active');
				next(1, 'screen-1');
				break;
			case 'screen-1':
				next(1, 'screen-2');
				break;
			case 'screen-2':
				next(1, 'restart');
				break;
			case 'restart':
				console.log('%c [Banner.BannerController] Banner is looping, restarting... ', 'background: #199860; color: #fff');
				next(0.3, 'start-screen');
				break;
		}

		actualPhase = phaseName;

	}

	function initWindowShowListener() {
		var hidden = 'hidden',
			state;

		if (hidden in document) {
			document.addEventListener('visibilitychange', onchange);
			state = 'visibilityState';
		} else if ((hidden = 'mozHidden') in document) {
			document.addEventListener('mozvisibilitychange', onchange);
			state = 'mozVisibilityState';
		} else if ((hidden = 'webkitHidden') in document) {
			document.addEventListener('webkitvisibilitychange', onchange);
			state = 'webkitVisibilityState';
		} else if ((hidden = 'msHidden') in document) {
			document.addEventListener('msvisibilitychange', onchange);
			state = 'msVisibilityState';
		} else if ('onfocusin' in document) {
			document.onfocusin = onshow;
			document.onfocusout = onhide;
		} else {
			window.onpageshow = window.onfocus = onshow;
			window.onpagehide = window.onblur = onhide;
		}

		if (document[state] === 'visible') {
			currentlyVisible = true;
		}

		function onchange() {
			currentlyVisible = document[state] === 'visible';
			if (isStarted === false && currentlyVisible) {
				play();
			} else if (currentlyVisible === false) {
				window.clearTimeout(playPhaseTimer);
			} else {
				playPhase(actualPhase);
			}
		}

		function onshow() {
			currentlyVisible = true;
		}

		function onhide() {
			currentlyVisible = false;
		}

	}

	function play() {
		if (currentlyVisible) {
			addClass(Banner.element, 'started');
			playPhase('start-screen');
			isStarted = true;
		}
	}

	function next(delay, phase) {
		playPhaseTimer = window.setTimeout(function () {
			playPhase(phase);
		}, delay * 1000);
	}

	function addClass(elem, className) {
		if (!hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	}

	function hasClass(elem, className) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	function removeClass(elem, className) {
		var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';

		if (hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}

	exports.init = init;
	exports.play = play;
	exports.next = next;
	exports.playPhase = playPhase;

	return exports;

}());
