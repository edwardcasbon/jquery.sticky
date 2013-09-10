var Sticky = {
	
	elements: [],
	
	scrolling: function () {
		var $scrollTop = $(window).scrollTop();
		for(var i=0; i<Sticky.elements.length; i++) {
			var instance = Sticky.elements[i];
			if($scrollTop > instance.top - instance.settings.offset) {
				if(instance.status === 'docked') {
					instance.element.css('position', 'fixed').css('top', instance.settings.offset);
					instance.status = 'sticky';
					if(typeof(instance.settings.sticky) === 'function') {
						instance.settings.sticky.call(instance.element);
					}
				}
			} else {
				if(instance.status === 'sticky') {
					instance.element.css('position', instance.css.position).css('top', instance.css.top);
					instance.status = 'docked';
					if(typeof(instance.settings.docked) === 'function') {
						instance.settings.docked.call(instance.element);
					}
				}
			}
		}
	}
};

(function($){
	$.fn.sticky = function(options) {
		var settings = $.extend({
			offset: 0,		// Amount to offset from the top.
			sticky: null,	// Function called when element sticks.
			docked: null	// Function called when element docks (Resumes static position).
		}, options);
		
		return this.each(function(){
			var stickyObject = {
				element: $(this),
				top: $(this).offset().top,
				settings: settings,
				status: 'docked',
				css: {
					position: $(this).css('position'),
					top: $(this).css('top')
				}
			};
			Sticky.elements.push(stickyObject);
			var $container = $("<div/>").addClass("stickyContainer").css("height", $(this).outerHeight());
			$(this).wrap($container);
			Sticky.scrolling();
		});
	};
	
	if(window.addEventListener) {
		window.addEventListener('scroll', Sticky.scrolling);
	} else if(window.attachEvent) {
		window.attachEvent('onscroll', Sticky.scrolling);
	}
})(jQuery);