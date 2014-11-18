/*! Easy Responsive Tools */

/* Easy Responsive Tools
 * A collection of useful fixes and helpers for responsive projects
 **/
(function( window, document ){
	
	var body = document.getElementsByTagName('body')[0];
	
	// Get the active Media Query as defined in the CSS
	// Use the following format:
	// #getActiveMQ-watcher { font-family: "default"; }
	// @media only screen and (min-width:20em){ #getActiveMQ-watcher { font-family: "small"; } }
	// etc.
	window.getActiveMQ = function()
	{

			// Build the watcher
		var watcher = document.createElement('div'),
			
			// alias getComputedStyle
			computed = window.getComputedStyle,
			
			// Regexp for removing quotes
			re = /['"]/g;
		
		// set upt the watcher and add it to the DOM
		watcher.setAttribute( 'id', 'getActiveMQ-watcher' );
		watcher.style.display = 'none';
		body.appendChild( watcher );
		
		// We’ll redefine this method the first time it’s run
		// For old IE
		if ( 'currentStyle' in watcher )
		{
			window.getActiveMQ = function()
			{
				return watcher.currentStyle['fontFamily'].replace( re, '' );
			};
		}
		
		// For modern browsers
		else if ( computed )
		{
			window.getActiveMQ = function()
			{
				return computed( watcher, null ).getPropertyValue( 'font-family' ).replace( re, '' );
			};
		}
		
		// For everything else
		else
		{
			window.getActiveMQ = function()
			{
				return 'unknown';
			};
		}
		
		return window.getActiveMQ();
		
	};

	/*! resize watcher */
	window.watchResize = function( callback )
	{
		var resizing;

		// throttle resizing with a resize event and a timer
		function resize()
		{
			if ( resizing )
			{
				clearTimeout( resizing );
				resizing = null;
			}
			resizing = setTimeout( done, 50 );
		}

		// actual resize completion
		function done()
		{
			clearTimeout( resizing );
			resizing = null;
			callback();
		}
		
		// add the event
		window.addEventListener( 'resize', resize, false);

		// init the callback function once when the window loads
		window.addEventListener( 'load', callback, false);

	};
	
	/*! A fix for theWebKit Resize Bug https://bugs.webkit.org/show_bug.cgi?id=53166. */
	function fixWebkitResizeBug()
	{
		window.watchResize(function(){
			
			var o_style = body.getAttribute( 'style' );
			
			body.style.overflow = 'hidden';
			body.innerHeight();
			
			if ( o_style )
			{
				body.style = o_style;
			}
			else
			{
				body.removeAttribute( 'style' );
			}
			
		});
	}
	window.addEventListener( 'load', fixWebkitResizeBug, false);

}( this, this.document ));
(function(){
    
    // defend against Comcast injection
    var head = document.getElementsByTagName('head')[0],
        children = head.children,
        total_children = children.length,
        child = null,
        i = 0,
        tag,
        elements, e_len, element,
        el_extration_re = /(#[^\s{;]+) /g;
    
    while ( i < total_children ) {
        
        // get the element
        child = children[i];
        tag = child.nodeName.toLowerCase();
        
        // if we hit the title or meta, most likely we have skipped over the injection
        if ( tag == 'title' || tag == 'meta' ) {
            break;
        }
        
        if ( tag == 'style' ) {
            // jackpot: this is our map to the injected crappola
            elements = child.innerText.match( el_extration_re );
            e_len = elements.length;
            
            while ( --e_len )
            {
                // find the element
                element = document.getElementById( elements[e_len].replace( '#', '' ) );
                
                // if it exists, remove it
                if ( element )
                {
                    //console.log( 'found crap! ' + elements[e_len] );
                    element.parentNode.removeChild( element );
                }
            }
        }
        
    }

    element = null;
    child = null;
    head = null;
    
}());