jquery.sticky
=============

jQuery plugin for stickying elements on-screen.

Example: 

<code>$(".element").sticky(options);</code>

##Options

* offset (optional) - Integer - Amount to offset from the top. You may use this when stickying multiple elements.
* sticky (optional) - Function - A callback function for when the element starts sticky'ing.
* docked (optional) - Function - A callback function for when the element docks to its original position.

###Example

<pre>$(".element").sticky({
  offset: $(".anotherElement").height(),
  sticky: function() {
    $(this).css("background", "red");
  },
  docked: function() {
    $(this).css("background", "blue");
  }
});</pre>

