var Sticky = (function($) {

	var elements = [];

	var setSticky = function setSticky(instance) {
		instance.element.css('position', 'fixed').css('top', offset);
		instance.status = 'sticky';
		if(typeof(instance.settings.sticky) === 'function') {
			instance.settings.sticky.call(instance.element);
		}
	};

	var unsetSticky = function unsetSticky(instance) {
		instance.element.css('position', instance.css.position).css('top', instance.css.top);
		instance.status = 'docked';
		if(typeof(instance.settings.docked) === 'function') {
			instance.settings.docked.call(instance.element);
		}
	};

	var scrolling = function scrolling() {
		var $scrollTop = $(window).scrollTop();
		for(var i = 0; i < elements.length; i++) {
			var instance = elements[i];
			var containerTop = instance.container.position().top;
			var offset = getOffset(instance);
			var href;

			if($scrollTop > containerTop - offset) {
				if(instance.status === 'docked') {
					setSticky(instance);
				}
			} else {
				if(instance.status === 'sticky') {
					unsetSticky(instance);
				}
			}

			// Check if hovering over internal element.
			for(var j = 0; j < instance.nav.elements.length; j++) {
				var navItem = instance.nav.elements[j];
				var $content = $(navItem.hash);

				// Check to see if the local content exists.
				if($content.length > 0) {

					var scrollOffset = 0 - instance.element.outerHeight();
					var contentTop = parseInt($content.position().top) + scrollOffset;
					var contentBottom = contentTop + $content.outerHeight(true);

					if(instance.nav.status == navItem) {
						if( ($scrollTop < contentTop) || ($scrollTop > contentBottom) ) {

							// Out.
							href = ((navItem.pathname.charAt(0)==='/') ? navItem.pathname : '/' + navItem.pathname) + navItem.hash;
							instance.element.find('a[href=\"' + href + '\"]').removeClass(instance.nav.activeClass);
							instance.nav.status = false;
						}
					}

					// In?
					if( ($scrollTop >= contentTop) && ($scrollTop < contentBottom) && (instance.nav.status !== navItem) ) {

						if(instance.nav.status !== false) {

							// Out.
							href = ((instance.nav.status.pathname.charAt(0)==='/') ? instance.nav.status.pathname : '/' + instance.nav.status.pathname) + instance.nav.status.hash;
							instance.element.find('a[href=\"' + href + '\"]').removeClass(instance.nav.activeClass);
						}

						// In.
						instance.nav.status = navItem;
						href = ((navItem.pathname.charAt(0)==='/') ? navItem.pathname : '/' + navItem.pathname) + navItem.hash;
						instance.element.find('a[href=\"' + href + '\"]').addClass(instance.nav.activeClass);
					}
				}
			}
		}
	};

	var getOffset = function getOffset(instance) {
		if(instance.settings.offset !== 'auto') {
			return instance.settings.offset;
		}

		// Offset is auto. Automatically calculate the offset based on the sticky
		// elements above it.
		var offset = 0;
		for(var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if(element.element.is(instance.element)) {
				return offset;
			}
			offset += element.element.outerHeight(true);
		}
	};

	return {
		elements: elements,
		scrolling: scrolling
	};
})(jQuery);

(function($) {
	$.fn.sticky = function(options) {
		var settings = $.extend({

			// Amount to offset from the top.
			offset: 'auto',

			// Function called when element sticks.
			sticky: null,

			// Function called when element docks (Resumes static position).
			docked: null,

			// Class name for when hovering over internal elements.
			navActiveClass: 'sticky-hover-active'

		}, options);

		return this.each(function(){

			var $this = $(this);
			var stickyObject = {
				element: $this,
				top: $this.offset().top,
				settings: settings,
				status: 'docked',
				css: {
					position: $this.css('position'),
					top: $this.css('top')
				},
				nav: {
					// Internal nav elements.
					elements: [],
					status: false,
					activeClass: settings.navActiveClass
				}
			};

			if(!$this.parent().hasClass('stickyContainer')) {
				var $container = $('<div/>');

				$container.addClass('stickyContainer')
					.css('height', $this.outerHeight())
					.css('float', 'left')
					.css('width', '100%')
					.css('margin-top', $this.css('margin-top'))
					.css('margin-bottom', $this.css('margin-bottom'));

				$this.wrap($container);
			}

			stickyObject.container = $this.parent();

			// Loop through nav elements, if any, adding any internal links.
			$this.find('nav a').each(function() {
				var $this = $(this);
				var href = $this.attr('href');
				var a = document.createElement('a');

				a.href = href;
				if(a.hash !== '') {
					stickyObject.nav.elements.push(a);
				}
			});

			Sticky.elements.push(stickyObject);
			Sticky.scrolling();

		});
	};

	$(window).on('scroll', Sticky.scrolling);
})(jQuery);
