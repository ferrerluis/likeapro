$( document ).ready(function() {

    $(".movement").click(function(e) {

    	$elem = $(e.currentTarget);
    	
    	$elem.addClass('teal')

    	$('.teal').each(function() {
		    $(this).removeClass('teal') 
		});
		
		$elem.toggleClass('teal') 	
        
    });
});