// Required for GA to work
(function ($) {
  'use strict';
	var History = window.History;

	// State change event
	History.Adapter.bind(window,'statechange',function(){
    if (window.ga) {
      window.ga('set', 'page', window.location.pathname);
      window.ga('send', 'pageview');
    }
	});	
}(jQuery));
