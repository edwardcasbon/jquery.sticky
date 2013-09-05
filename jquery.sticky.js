var Sticky = {
	
	elements: [],
	
	scrolling: function () {
		var $scrollTop = $(window).scrollTop();
		for(var i=0; i<Sticky.elements.length; i++) {
			var instance = Sticky.elements[i];
			if($scrollTop > instance.top - instance.offset) {
				instance.element.css('position', 'fixed').css('top', instance.offset);
			}
		}
	}
};

(function($){
	$.fn.sticky = function(offset) {
		return this.each(function(){
			var stickyObject = {
				element: $(this),
				top: $(this).offset().top,
				offset: (offset) ? offset : 0
			};
			Sticky.elements.push(stickyObject);
			var $container = $("<div/>").addClass("stickyContainer").css("height", $(this).height());
			$(this).wrap($container);
			Sticky.scrolling();
		});
	};
	
	if(window.addEventListener) {
		window.addEventListener('scroll', Sticky.scrolling);
	} else if(window.attachEvent) {
		window.attachEvent('scroll', Sticky.scrolling);
	}
	
})(jQuery);