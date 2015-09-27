$( document ).ready(function() {

    $(".movement").click(function(e) {

    	$elem = $(e.currentTarget);
    	$elem.addClass('teal')

    	$('.teal').each(function() {
    		if($(this) != $elem) {
    			$(this).removeClass('teal') 
    		}
		    
		});
		$elem.toggleClass('teal') 	
    });

    $(".legendCoord").click(function(e) {

    	$elem = $(e.currentTarget);

    	$('.tealLegend').each(function() {
		    $(this).removeClass('tealLegend') 
		});
		
		$elem.toggleClass('tealLegend') 	
        
    });
});