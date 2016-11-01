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
		legalVisible = false,
		currentlyVisible = false,
		is160x160 = false,
		is160x600 = false,
		is300x600 = false,
		is300x250 = false,
		is728x90 = false,
		is840x150 = false,
		elements = {};

	function init() {
		console.log('%c [Banner.BannerController] Banner controller inited ', 'background: #199860; color: #fff');

		is160x160 = document.body.clientWidth === 160 && document.body.clientHeight === 160;
		is160x600 = document.body.clientWidth === 160 && document.body.clientHeight === 600;
		is300x600 = document.body.clientWidth === 300 && document.body.clientHeight === 600;
		is300x250 = document.body.clientWidth === 300 && document.body.clientHeight === 250;
		is728x90 = document.body.clientWidth === 728 && document.body.clientHeight === 90;
		is840x150 = document.body.clientWidth === 840 && document.body.clientHeight === 150;

		initWindowShowListener();
		initDOMElements();
		initBindings();
		generateCircles();

		if (hasClass(Banner.element, 'loaded') === false) {
			addClass(Banner.element, 'loaded');
		} else {
			removeClass(Banner.element, 'loaded');
		}
		play();
	}

	function generateCircles() {
		var randomInterval1 = getRandomInt(120, 180),
			randomInterval2 = getRandomInt(360, 380),
			randomInterval3 = getRandomInt(100, 140),
			randomInterval4 = getRandomInt(400, 400),
			randomInterval5 = getRandomInt(100, 130),
			randomInterval6 = getRandomInt(360, 400),
			randomInterval7 = getRandomInt(90, 100),
			randomInterval8 = getRandomInt(330, 370),
			randomInterval9 = getRandomInt(90, 120),
			randomInterval10 = getRandomInt(340, 400),
			paths, i, l, path;


		elements.circle1part1.setAttribute('d', describeArc(82, 82, 80, randomInterval1, randomInterval2));
		elements.circle1part2.setAttribute('d', describeArc(82, 82, 78, randomInterval1, randomInterval2));

		elements.circle2.setAttribute('d', describeArc(82, 82, 74, randomInterval3, randomInterval4));
		elements.circle3.setAttribute('d', describeArc(82, 82, 69, randomInterval5, randomInterval6));
		elements.circle4.setAttribute('d', describeArc(82, 82, 64, randomInterval5, randomInterval6));

		elements.circle5part1.setAttribute('d', describeArc(82, 82, 60, randomInterval7, randomInterval8));
		elements.circle5part2.setAttribute('d', describeArc(82, 82, 58, randomInterval7, randomInterval8));

		elements.circle6.setAttribute('d', describeArc(82, 82, 54, randomInterval9, randomInterval10));

		if (is160x600) {
			paths = document.querySelectorAll('svg path');
			l = paths.length;

			for (i = 0; i < l; i++) {
				path = paths[i];
				path.setAttribute('stroke', '#fff');
			}
		}
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
			document.body.clientWidth === 728 && document.body.clientHeight === 90 ||
			document.body.clientWidth === 840 && document.body.clientHeight === 150
		) {
			mode = 'left-to-right';
		}

		if (legalVisible === true) {
			removeClass(elements.legaltrigger, 'active');
			if (mode === 'left-to-right') {
				TweenMax.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '-100%', y: '0%' });
			} else {
				TweenMax.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '0%', y: '100%' });
			}
			legalVisible = false;
		} else {
			addClass(elements.legaltrigger, 'active');
			TweenMax.to(elements.legalcopy, 1, { delay: 0, ease: Expo.easeOut, x: '0%', y: '0%' });
			legalVisible = true;
		}

	}

	function initDOMElements() {
		var wrapper = document.getElementById('banner-wrapper'),
			ids = wrapper.querySelectorAll('[id]'),
			formattedId,
			i = 0,
			l = ids.length;

		elements.wrapper = wrapper;

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
					TweenMax.set(elements[i], { clearProps: 'all' });
					elements[i].setAttribute('style', '');
				}
			}
		}
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle) {
		var start = polarToCartesian(x, y, radius, endAngle),
			end = polarToCartesian(x, y, radius, startAngle),
			largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1',
			d = [
				'M', start.x, start.y,
				'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
			].join(' ');

		return d;
	}

	function playPhase(phaseName) {
		console.log('%c [Banner.BannerController] Playing phase: %s ', 'background: #199860; color: #fff', phaseName);

		switch (phaseName) {

			case 'start-screen':
				removeStyles();
				removeClass(Banner.element, 'screen-1');
				removeClass(Banner.element, 'screen-2');
				addClass(Banner.element, 'start');

				TweenMax.to(elements.wrapper, 0.3, { delay: 0, ease: Expo.easeOut, opacity: 1, onComplete: function() {
					playPhase('screen-1');
				}});

				break;
			case 'screen-1':
				removeClass(Banner.element, 'start');
				addClass(Banner.element, 'screen-1');
				TweenMax.to(elements.headline1, 0.5, { delay: 0.5, ease: Expo.easeOut, opacity: 1 });

				if (is160x160 || is300x250) {
					TweenMax.to(elements.headline1, 1, {
						delay: 2,
						ease: Expo.easeOut,
						y: document.body.clientHeight === 160 ? 100 : 150
					});

					TweenMax.to(elements.circleswrapper, 1, { delay: 2, ease: Expo.easeOut, y: 8 });

					if (document.body.clientHeight === 160) {
						TweenMax.to(elements.mainbackground, 1, {
							delay: 2,
							ease: Expo.easeOut,
							backgroundPosition: 'center 10%'
						});
					} else {
						TweenMax.to(elements.mainbackground, 1, {
							delay: 2,
							ease: Expo.easeOut,
							backgroundPosition: 'center 30%'
						});
					}
				} else if (is300x600) {
					TweenMax.to(elements.mainbackground, 1, {
						delay: 2,
						ease: Expo.easeOut,
						backgroundPosition: 'center 60%'
					});
					TweenMax.to(elements.circleswrapper, 1, { delay: 2, ease: Expo.easeOut, y: 10 });
					TweenMax.to(elements.headline1, 1, { delay: 2, ease: Expo.easeOut, y: 180 });
				} else if (is160x600) {
					TweenMax.to(elements.headline1, 1, { delay: 2, ease: Expo.easeOut, y: -60 });
					TweenMax.to(elements.circleswrapper, 1, {
						delay: 2,
						ease: Expo.easeOut,
						y: -80
					});
				} else if (is728x90) {
					TweenMax.to(elements.circleswrapper, 1, { delay: 2, ease: Expo.easeOut, x: 120, y: '-50%' });
					TweenMax.to(elements.headline1, 1, { delay: 2, ease: Expo.easeOut, opacity: 0 });
					TweenMax.to(elements.cta, 0.6, { delay: 2.5, ease: Expo.easeOut, opacity: 1 });
				} else if (is840x150) {
					TweenMax.to(elements.circleswrapper, 1, { delay: 2, ease: Expo.easeOut, x: 80, y: '-50%' });
					TweenMax.to(elements.headline1, 1, { delay: 2, ease: Expo.easeOut, opacity: 0 });
					TweenMax.to(elements.cta, 0.6, { delay: 2.5, ease: Expo.easeOut, opacity: 1 });
				} else {
					TweenMax.to(elements.headline1, 1, { delay: 2, ease: Expo.easeOut, opacity: 0 });
				}

				TweenMax.set(Banner.element, {
					delay: 3,
					onComplete: function() {
						playPhase('screen-2');
					}
				});
				break;
			case 'screen-2':
				removeClass(Banner.element, 'screen-1');
				addClass(Banner.element, 'screen-2');

				TweenMax.to(elements.circles1, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(20, 30) * -1 + "deg)" }});
				TweenMax.to(elements.circles2, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(15, 20) * -1 + "deg)" }});
				TweenMax.to(elements.circles3, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(30, 50) * -1 + "deg)" }});
				TweenMax.to(elements.circles4, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(10, 25) * -1 + "deg)" }});
				TweenMax.to(elements.circles5, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(0, 10) * -1 + "deg)" }});
				TweenMax.to(elements.circles6, 1, { delay: 0, css:{ transform:"rotate(" + getRandomInt(20, 40) * -1 + "deg)" }});

				TweenMax.set(Banner.element, {
					delay: 2,
					onComplete: function() {
						playPhase('screen-3');
					}
				});

				break;

			case 'screen-3':
				if (is160x160 || is300x250) {
					TweenMax.to(elements.headline1, 1, {
						delay: 2,
						ease: Expo.easeOut,
						y: document.body.clientHeight === 160 ? 46 : 72
					});
					TweenMax.to(elements.circleswrapper, 1, { delay: 2, ease: Expo.easeOut, y: '-100%' });
					TweenMax.to(elements.mainbackground, 1, {
						delay: 2,
						ease: Expo.easeOut,
						backgroundPosition: 'center 100%'
					});
					TweenMax.to(elements.logo, 0.6, { delay: 3, ease: Expo.easeOut, y: 0 });
				} else if (is300x600) {
					TweenMax.to(elements.circleswrapper, 0.5, { delay: 2, ease: Expo.easeOut, opacity: 0 });
					TweenMax.to(elements.headline1, 1, { delay: 2.3, ease: Expo.easeOut, y: 130 });
					TweenMax.to(elements.logo, 0.6, { delay: 3, ease: Expo.easeOut, y: 0 });
				} else if (is160x600) {
					TweenMax.to(elements.circleswrapper, 0.5, { delay: 2, ease: Expo.easeOut, opacity: 0 });
					TweenMax.to(elements.headline1, 1, { delay: 2.5, ease: Expo.easeOut, css:{ color: '#00264a' }});
					TweenMax.to(elements.logo, 0.6, { delay: 3, ease: Expo.easeOut, y: 0 });
				} else if (is728x90) {
					TweenMax.to(elements.logo, 0.6, { delay: 3, ease: Expo.easeOut, y: 0 });
					TweenMax.to(elements.cta, 0.3, { delay: 3, scale: 1.2, yoyo: true, repeat: 1 });
				} else if (is840x150) {
					TweenMax.to(elements.logo, 0.6, { delay: 3, ease: Expo.easeOut, y: 0 });
					TweenMax.to(elements.cta, 0.3, { delay: 3, scale: 1.2, yoyo: true, repeat: 1 });
				}

				TweenMax.to(elements.overlay, 1, { delay: 2.5, opacity: 0.65 });
				TweenMax.to(elements.cta, 0.6, { delay: 4, ease: Expo.easeOut, opacity: 1 });

				TweenMax.to(elements.wrapper, 0.6, { delay: 10, ease: Expo.easeOut, opacity: 0, onComplete: function() {
					playPhase('restart');
				}});

				break;
			case 'restart':
				console.log('%c [Banner.BannerController] Banner is looping, restarting... ', 'background: #199860; color: #fff');
				playPhase('start-screen');
				break;
		}
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
				TweenMax.pauseAll(true, true, true);
			} else {
				TweenMax.resumeAll(true, true, true);
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
	exports.playPhase = playPhase;

	return exports;

}());
