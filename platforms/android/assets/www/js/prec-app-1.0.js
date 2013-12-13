/*!
 * PrecApp v 1.0 ~ Copyright (c) 2012 Precedent Communications, http://precedent.co.uk
 * 
 */


//////////////////////////////////////////////////
//Load the correct js file before anything else//
////////////////////////////////////////////////
if (navigator.userAgent.toLowerCase().match(/android/)) {
	console.log("uses android");
	//alert("uses android")
    PrecAppUtils.DEVICE_PLATFORM_SHORTCODE='an';
		document.write('<script charset="utf-8" src="js/cordova-2.1.0-an.js"><\/script>');
	} else if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
            PrecAppUtils.DEVICE_PLATFORM_SHORTCODE='ip';
		console.log("uses iphone");
		//alert("uses iphone")
		document.write('<script charset="utf-8" src="js/cordova-2.1.0-ip.js"><\/script>');
	} else { 
	//alert("uses nothing")
    PrecAppUtils.DEVICE_PLATFORM_SHORTCODE='un';
    }


/********************************/
/*** START OVERRIDE FUNCTIONS ***/
/********************************/

// override these within your HTML pages as required by the App
function topLevelViewLoadComplete()
{

}

function pageRequested(pageURL, pageLoadState)
{
	
}

function onPageForwardComplete()
{

}

function onGoBackStart()
{
	
}

function onPageBackComplete()
{

}

function popOverClosed(myVar)
{
	
}

function docReady()
{
	
}

 
function updateLayout() 
{ 
     
} 

function appReady()
{
	
}

function backFromFormPage()
{
	
}

function goBackFromTopPage()
{
	
}

function onScrollStart(touchEvent)
{		
		
}

function onScrollMove(touchEvent)
{

}

function onScrollEnd(touchEvent)
{
	
}

function onRefresh(){
	
}

/******************************/
/*** END OVERRIDE FUNCTIONS ***/
/******************************/

/***********************************/


/**************************/
/*** PREC APP LISTENERS ***/
/**************************/

// Listener for $(document).ready
// Once jQuery is ready we can init()
$(document).ready(function(){	
	PrecApp.init();
});


// Listener for $(window).resize
// for performance put the event on a debouncer
// note this event would keep triggering on iOS unless we check against SCREEN_W, SCREEN_H
// ensures that UI measurements, views ( drill downs ) correctly position and size according to screensize updates

//!important: test for true re-orienation! because the soft keyboard also triggers this function
$(window).resize(debouncer( function ( e ) {
	           
    var w = $(window).innerWidth();
    var h = $(window).innerHeight();
  
    var keyboardShowHideEvent = false; // prove true

	if (w==PrecApp.SCREEN_W)
	{
		keyboardShowHideEvent=true;
		
		
		if (h<PrecApp.SCREEN_H)
			keyBoardShowEvent(true);
		else
			keyBoardShowEvent(false);
	}
	
	if (!keyboardShowHideEvent)
	{
		// source landscape and portrait
		if (h < PrecApp.SCREEN_H)
			PrecApp.IS_LANDSCAPE = true;
		else
			PrecApp.IS_LANDSCAPE = false;
						
		PrecApp.IS_PORTRAIT = !PrecApp.IS_LANDSCAPE;
		
		PrecApp.SCREEN_W=w;
		PrecApp.SCREEN_H=h;
		PrecApp.AVAILABLE_SCROLL_H = PrecApp.SCREEN_H-(PrecApp.HEADER_HEIGHT+PrecApp.TOOLBAR_HEIGHT);
		console.log("AVAILABLE_SCROLL_H",PrecApp.AVAILABLE_SCROLL_H);
		PrecApp.iScrollUpdate();
		PrecApp.drillDownUpdate();
		
		updateLayout();
	}	

},500 ) );

// Debouncer call back utility function
// provides a function callback on a timeout
function debouncer( func , timeout ) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          func.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   };
}

/**************************/
/*** PREC APP INTERNALS ***/
/**************************/

// we store all variables & functions for PrecApp in its own namespace
var PrecApp={
	
	/** USER ADJUSTABLE VARS ACCORDING TO UI **/
	PHONE_HEADER_HEIGHT:42,
	TABLET_HEADER_HEIGHT:74,
	TOOLBAR_HEIGHT:0,
	ANIM_DURATION:300, //sliding transition animation time in milliseconds
	ANIM_EASING:"linear",//"linear",
	DEFAULT_HEADER_FONTSIZE:0.9, //this is in EM
	HOME_PAGE:"page_A_0.html",
	BASE_PAGE_ID:null, // A,B,C,D,E etc ...
	TEST_CONNECTION:true,
	TABLET_PAGE_WIDTH_PERCENT:1,//0.67, // used for tablet layouts with side menus
	/** END USER ADJUSTABLE VARS**/
	
	HEADER_HEIGHT:null,
	SCREEN_W:null,
	SCREEN_H:null,
	IS_LANDSCAPE:null,
	IS_PORTRAIT:null,
	I_SCROLL:null, // this can be considered to be a "class"
	POPOVER_ISCROLL:null,
	HEADER_ISCROLL:null,
	
	FROM_PAGE_ID:0,
	TO_PAGE_ID:0,
	CURRENT_PAGE_ID:0,
	AVAILABLE_SCROLL_H:null,
	LOCK_DRILLDOWN_CREATION:false,
	IS_TABLET:false,

	I_SCROLL_STACK:[],
	HEADER_TITLES:[],
	HTML_PAGE_NAMES:[],
	PAGE_LOAD_STATES:{topLevel:0, goingForward:1, goingBack:2},
	SCROLL_MOVE:0,
    SCROLL_MOVE_LIMIT:5,
	
    ANIMATE_POPOVER:true, //if the popover should be animated or not
	POPOVER_OPEN:false,
	ACTIVE_STYLESHEET:null, // used for alternative stylesheets
		
	TOP_LEVEL_UNIQUE_NUM:0, // auto increment this after every top level page load
	BLOCK_TOGGLE_OVERLAY:false, //used on the crisis dialog, it's toggling the "toggleOverlay" function and we dont want it.

	/* main function set */
	// called on doc ready
	init:function()
	{
		// init IMAGE_CACHE
		$("#IMAGE_CACHE").html("");
		
		var w = $(window).width();
		var h = $(window).height();
	
		PrecApp.SCREEN_W=w;
	    PrecApp.SCREEN_H=h;
	
	    if (w>h)
		{
			PrecApp.IS_LANDSCAPE = true;
			PrecApp.IS_PORTRAIT = false;
		}
		else
		{
			PrecApp.IS_LANDSCAPE = false;
			PrecApp.IS_PORTRAIT = true;
		}
	
		if (w>=600)
		{
			PrecApp.IS_TABLET = true;
			window.localStorage.setItem("IS_TABLET", "true");
			
			// update metrics for tablet
			PrecApp.HEADER_HEIGHT = PrecApp.TABLET_HEADER_HEIGHT;
		} 
		else 
		{
			window.localStorage.setItem("IS_TABLET", "false");
			
			// update metrics for phone
			PrecApp.HEADER_HEIGHT = PrecApp.PHONE_HEADER_HEIGHT;
		}

		PrecApp.setAvailableScrollHeight();
		
	    PrecApp.drillDownUpdate();
		PrecApp.iScrollUpdate();
		//updateLayout();
		
		// Phonegap API for listener "deviceready" or website bypass
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="un")
		{
			docReady();
			appReady();
		}
		else
		{
			docReady();
			document.addEventListener("deviceready", PrecApp.onDeviceReady, false);
		}
	},		
	
	// inits "top level" HTML pages
	initTopLevel:function()
	{
		// clean up any resident I_SCROLL_STACK
		for(var i=0;i<PrecApp.I_SCROLL_STACK.length;i++)
		{
			PrecApp.I_SCROLL_STACK[i].destroy();
		}
	
		PrecApp.I_SCROLL_STACK=[];
		PrecApp.HEADER_TITLES=[];
		PrecApp.HTML_PAGE_NAMES=[];
		//destroy all existing drilldowns
		$("#drillDownHolder").empty();
		
		// ensure that base ui scroll view is back to postion 0
		if (PrecApp.IS_TABLET)
			$("#ui_scroll_view_0").css({"left": Math.ceil(PrecApp.SCREEN_W*(1-PrecApp.TABLET_PAGE_WIDTH_PERCENT))});
		else
			$("#ui_scroll_view_0").css({"left": "0px"});
			
		PrecAppComponents.hideBack();
		PrecAppComponents.closePopOver();
	
		// reset some key vars
		PrecApp.CURRENT_PAGE_ID=0;
		PrecApp.FROM_PAGE_ID=0;
		PrecApp.TO_PAGE_ID=0	
	},
	
	setAvailableScrollHeight:function()
	{
		PrecApp.AVAILABLE_SCROLL_H = PrecApp.SCREEN_H-(PrecApp.HEADER_HEIGHT+PrecApp.TOOLBAR_HEIGHT);
	},
		
	// Phonegap API, if overidden , ensure it does at least this
	onDeviceReady:function()
	{
		PrecAppUtils.getDeviceType();	
		
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="an" || PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="bl")
        { 
        	   PrecApp.preventDoubleClick();           	   
               document.addEventListener("backbutton", PrecApp.goBack, false);
               document.addEventListener("menubutton", PrecApp.goHome, false);
        }
		
		if(PrecAppUtils.TEST_CONNECTION)
		{
			PrecAppUtils.testConnection();
		}
		//Init Nugget here
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE!="un" && Nugget != undefined)
			Nugget.init();
		//End of init nugget
		appReady();
	},
	
	navigateToTopLevelPage:function(navID, tabletSpecificPage)
	{
		var pageIDs=["A","B","C","D","E"];
		PrecApp.BASE_PAGE_ID=pageIDs[navID];		
		PrecApp.initTopLevel();
		
		var suffix = "";
		
		// optional if we want to target seperate tablet htmls
		if (tabletSpecificPage && PrecApp.IS_TABLET) // important to verify we are actually on a tablet at this stage!
			suffix="_tablet";
	
		PrecApp.loadTopLevelView("page_"+PrecApp.BASE_PAGE_ID+"_0"+suffix+".html");
	},
	
	loadTopLevelView:function(pageURL)
	{
		
		console.log("loadTopLevelView"+pageURL);
		
		// I've added this to return the position to 0 if you're loading a top view
		// from a drilled down page. It's not necessary in older versions
		 if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
	        $("#ui_scroll_view_0").animate({ "left": "0", useTranslate3d: true }, { queue: true, duration: 0, easing: PrecApp.ANIM_EASING, complete: PrecApp.showBack });
	    } else {
	        var cssobj = {};
	        cssobj[csstransition] = csstransform + " 0 linear";
	        cssobj[csstransform] = "translate3d(0px,0,0)";
	        $("#ui_scroll_view_0").css(cssobj); //PrecApp.showBack
	    }
	    
		PrecApp.HTML_PAGE_NAMES.push(pageURL);
		pageRequested(pageURL, PrecApp.PAGE_LOAD_STATES.topLevel);
		
		$("#PrecAppBasePageContent_"+PrecApp.TOP_LEVEL_UNIQUE_NUM).remove();
		PrecApp.TOP_LEVEL_UNIQUE_NUM++;
		
		//create the drillDown object
		var str="";
		str+='<div class="full_wrap" id="PrecAppBasePageContent_'+PrecApp.TOP_LEVEL_UNIQUE_NUM+'"></div>';
		$("#topLevelBasePageHolder").append(str);
		
		
		$("#PrecAppBasePageContent_"+PrecApp.TOP_LEVEL_UNIQUE_NUM).load(pageURL, PrecApp.topLevelViewLoadComplete);
		
		PrecApp.createIScroll();

	},
	
	topLevelViewLoadComplete:function()
	{
		
		topLevelViewLoadComplete();
		PrecApp.I_SCROLL.refresh();
	},

	// this happens on initial page load and window resize
	iScrollUpdate:function()
	{
		// setup / refresh the iScroll
		$("#ui_scroll_view_"+PrecApp.CURRENT_PAGE_ID).css("height",PrecApp.AVAILABLE_SCROLL_H);				
		$("#ui_scroll_view_"+PrecApp.CURRENT_PAGE_ID).css("top",PrecApp.HEADER_HEIGHT);	

		if (!PrecApp.I_SCROLL_STACK.length)
			PrecApp.createIScroll();
		else
			PrecApp.I_SCROLL.refresh();

	},

	destroyIScroll:function()
	{
		if (PrecApp.I_SCROLL_STACK.length)
			PrecApp.I_SCROLL_STACK.pop();
	
		if (PrecApp.I_SCROLL!=null)
			PrecApp.I_SCROLL.destroy();
	},
	
	
	
	// creates an iScroll with scroll event listeners and appends it to the I_SCROLL_STACK
	createIScroll:function(ignoreStack)
	{
		PrecApp.I_SCROLL = new iScroll('ui_scroll_view_'+PrecApp.CURRENT_PAGE_ID, { 
			
			hScrollbar: false,
			hScroll:false,
			hideScrollbar:true, /* fades out scroll bar */
			onRefresh: function(){
				onRefresh();
			},		
			onScrollStart: function(e) {
				onScrollStart(e);
			},
			onScrollMove: function(e) {				
				onScrollMove(e);
			},
			onScrollEnd: function(e) {				
				onScrollEnd(e);
			}		
		});
		
		if (ignoreStack)
		{
			
		}
		else
		{
			PrecApp.I_SCROLL_STACK.push(PrecApp.I_SCROLL);
		}
	},
	
	refreshIScroll:function()
	{
		if (PrecApp.I_SCROLL)
			PrecApp.I_SCROLL.refresh();
	},

	// note: this happens on window resize
	drillDownUpdate:function()
	{
	
		console.log("PrecApp.CURRENT_PAGE_ID :" + PrecApp.CURRENT_PAGE_ID);
		if (PrecApp.CURRENT_PAGE_ID>0)
		{
			if (PrecApp.IS_TABLET)
				var left = (Math.ceil(PrecApp.SCREEN_W*PrecApp.TABLET_PAGE_WIDTH_PERCENT));
			else 
				var left = PrecApp.SCREEN_W;
				
			if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
        		$("#ui_scroll_view_0").css({"left":left});
		    } else {
			        var cssobj = {};
			        cssobj[csstransition] = csstransform + " 0 linear";
			        cssobj[csstransform] = "translate3d(-"+left+"px,0,0)";
			        cssobj["width"] = "100%";
			        //cssobj["left"] = left +"px"; //this one is right, left on top level pages is always 0
			        $("#ui_scroll_view_0").css(cssobj); //PrecApp.showBack
		    }
			    														
			//$("#ui_scroll_view_0").css({"left":-(PrecApp.SCREEN_W*PrecApp.CURRENT_PAGE_ID)});					
				
			$("#ui_scroll_view_0").css("height",PrecApp.AVAILABLE_SCROLL_H);
			
			// drill downs are "1 indexed"
			var l = PrecApp.TO_PAGE_ID+1;
			console.log("lorem :" + l);
			
			for (var i=1;i<l;i++)
			{
				var translateLeft = left;
				var dd = $("#drillDown_"+i);
				console.log("PrecApp.drillDownUpdate:drillDown_"+i); // note without console.log this does not work on the iPad emulator!!!!
								
				//current page
				if (PrecApp.TO_PAGE_ID==i) // adjust position and width
				{					
					//width = left; //not sure if  we need to do anything
				}
				else 
				{
					translateLeft *=2;
				}	
				var cssobj = {};
		        cssobj[csstransition] = csstransform + " 0 linear";
		        cssobj[csstransform] = "translate3d(-"+translateLeft+"px,0,0)";
		        cssobj["width"] = "100%";		
		        cssobj["left"] = left +"px";        
				dd.css(cssobj);			
					
					$("#ui_scroll_view_"+i).css("height",PrecApp.AVAILABLE_SCROLL_H);					
				
			}
		}
		else
		{
			if (PrecApp.IS_TABLET)
				$("#ui_scroll_view_0").css({"left":(Math.ceil(PrecApp.SCREEN_W*(1-PrecApp.TABLET_PAGE_WIDTH_PERCENT)))});
			else
				$("#ui_scroll_view_0").css({"left":0});
		}			
		
		for (var i=0;i<PrecApp.I_SCROLL_STACK.length;i++){
			console.log("refreshing:"+i);
			PrecApp.I_SCROLL_STACK[i].refresh();
		}
	},

	goForward:function(pageURL, requiresConnection)
	{
		if (requiresConnection)
		{
			var connectionOkay = PrecApp.testConnection();			
			if (!connectionOkay)
				return;
		}
		
		if(PrecApp.LOCK_DRILLDOWN_CREATION)
			return;
			
		PrecApp.HTML_PAGE_NAMES.push(pageURL);
		pageRequested(pageURL, PrecApp.PAGE_LOAD_STATES.goingForward);
			
		PrecApp.LOCK_DRILLDOWN_CREATION=true;
		
		PrecApp.FROM_PAGE_ID=PrecApp.CURRENT_PAGE_ID;
		PrecApp.TO_PAGE_ID=PrecApp.CURRENT_PAGE_ID+1;
	
		//create the drillDown object
		var str="";
		str+='<div class="drillDown" id="drillDown_'+PrecApp.TO_PAGE_ID+'"></div>';
		$("#drillDownHolder").append(str);
		
		if (PrecApp.IS_TABLET)
			$("#drillDown_"+PrecApp.TO_PAGE_ID).css("width",Math.ceil(PrecApp.SCREEN_W*PrecApp.TABLET_PAGE_WIDTH_PERCENT));
			
		$("#drillDown_"+PrecApp.TO_PAGE_ID).css({"left":PrecApp.SCREEN_W});
		$('#drillDown_'+PrecApp.TO_PAGE_ID).load(pageURL, PrecApp.processDrillDown);	
	},
	
	// if overidden , ensure it does at least this
	goBack:function()
	{
		onGoBackStart();
		
		//if we are on android, we want the back button just to close the popover
		if (PrecApp.POPOVER_OPEN) {
			PrecAppComponents.closePopOver();
			return;
		}
		// if we are on android, we want the back button just to slide it up
		if (PrecAppComponents.slided){
			PrecAppComponents.slideHeader(true);
			return;
		}
		// for Android - this is the expected behavior. if we are on page_a_0, close the app.
		// this is app specific. Override the method goBackFromTopPage on the js file of the project. (PerthArena.js, appHelper.js, RichmondEvents.js, etc..)
		if (PrecApp.CURRENT_PAGE_ID==0){				
			goBackFromTopPage();
			
		}

		PrecApp.drillUp();
		PrecAppComponents.slideHeader(true);
		PrecAppComponents.closePopOver();			
		
		
		var current = PrecApp.HTML_PAGE_NAMES.pop();			
		pageRequested(PrecApp.HTML_PAGE_NAMES[PrecApp.HTML_PAGE_NAMES.length-1], PrecApp.PAGE_LOAD_STATES.goingBack);
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE == "an"){
			console.log(current);
			if (current == undefined || current.lastIndexOf("page_A_0", 0) === 0){ //if undefined or page_A_0..html exit the app			
				 navigator.app.exitApp();
			}
		}
		
	},
	
	// set your home page as required in the PrecApp.HOME_PAGE global
	goHome:function()
	{
		if (PrecApp.POPOVER_OPEN)
			PrecAppComponents.closePopOver();
			
		PrecApp.initTopLevel();
		PrecApp.loadTopLevelView(PrecApp.HOME_PAGE);
			
	},

	processDrillDown:function()
	{
		if (PrecApp.IS_TABLET)
			var xPos = -(Math.ceil(PrecApp.SCREEN_W*PrecApp.TABLET_PAGE_WIDTH_PERCENT)); 
		else
			var xPos = -(PrecApp.SCREEN_W); // animating onto screen from right
		// !important rename the new_ui_scroll_view
		$('#new_ui_scroll_view').attr('id','ui_scroll_view_'+PrecApp.TO_PAGE_ID);
	
		// implement iScroll for the new_ui_scroll_view
		$("#ui_scroll_view_"+PrecApp.TO_PAGE_ID).css("height",PrecApp.AVAILABLE_SCROLL_H);
		
		PrecApp.CURRENT_PAGE_ID=PrecApp.TO_PAGE_ID;
	
		// create iScroll
		PrecApp.createIScroll();
		
		
	
		if (PrecApp.FROM_PAGE_ID==0)
		{
			var cssobj = {};
			//console.log(xPos);
			cssobj[csstransition] = csstransform+" 0.3s linear";
		    cssobj[csstransform] = "translate3d("+xPos+"px,0,0)"; 
				
		    //console.log(cssobj);
		    if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
		        $("#ui_scroll_view_0").animate({"left": "+=" + xPos, useTranslate3d:true},{queue:true, duration:PrecApp.ANIM_DURATION, easing:PrecApp.ANIM_EASING, complete:PrecApp.showBack});
		    } else {
		    	//console.log("here");
		    	$("#ui_scroll_view_0").css(cssobj);
		    }
		}
	
		$("#drillDown_"+PrecApp.TO_PAGE_ID).css("zIndex", PrecApp.TO_PAGE_ID+1);
		
		
		var callbackFunc = null;

		for (var i=PrecApp.FROM_PAGE_ID;i<PrecApp.TO_PAGE_ID+1;i++)
		{
			var newPos = xPos;
			
			//if it's the current one, go twice. Every page stays once to the left of the screen
			if (i == PrecApp.FROM_PAGE_ID && i>0)
				newPos*=2;
			
			if (i==PrecApp.TO_PAGE_ID) {
				callbackFunc = PrecApp.purgeLock;
				PrecApp.iScrollUpdate();
				$("#drillDown_"+i).bind("transitionend webkitTransitionEnd oTransitionEnd",
					drillDownSubpageTransitionEnd); 			
			}
			
			//console.log("*!="+i,newPos);
			
			if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
			    $("#drillDown_" + i).animate({ "left": "+="+ xPos, useTranslate3d: true, leaveTransforms: false }, { queue: false, duration: PrecApp.ANIM_DURATION, easing: PrecApp.ANIM_EASING, complete: callbackFunc });
			} else {
			    var cssobj = {};
			    cssobj[csstransition] = csstransform + " 0.3s linear";
			    cssobj[csstransform] = "translate3d(" + newPos + "px,0,0)";
			    $("#drillDown_" + i).css(cssobj); //complete:callbackFunc			
			}			
		}
		
		PrecAppComponents.headerUpdate();
	},
	
	showBackAndPurgeLock:function()
	{
		PrecAppComponents.showBack();
		PrecApp.purgeLock();
	},
	
	// Always finally called when the new drilldown has animated in
	purgeLock:function()
	{
		// !important to force iScroll refresh, on Android we can see blank pages as the useTranslate3d:true on the animation method can cause blank pages
		//PrecApp.I_SCROLL.scrollTo(0,1); 
		PrecApp.LOCK_DRILLDOWN_CREATION=false;
		onPageForwardComplete();
	},

	drillUp:function()
	{
		PrecApp.FROM_PAGE_ID=PrecApp.TO_PAGE_ID;
	
		PrecApp.TO_PAGE_ID--;
	
		if (PrecApp.TO_PAGE_ID<0)
			PrecApp.TO_PAGE_ID=0;
		
		PrecApp.CURRENT_PAGE_ID=PrecApp.TO_PAGE_ID;

		if (PrecApp.TO_PAGE_ID==0)
		{
			if (PrecApp.IS_TABLET) {
				    if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
				        $("#ui_scroll_view_0").animate({ "left": Math.ceil(PrecApp.SCREEN_W * (1 - PrecApp.TABLET_PAGE_WIDTH_PERCENT)), useTranslate3d: true }, { queue: false, duration: PrecApp.ANIM_DURATION, easing: PrecApp.ANIM_EASING, complete: null });
				    }
				    else {
				        var left = Math.ceil(PrecApp.SCREEN_W * (1 - PrecApp.TABLET_PAGE_WIDTH_PERCENT));
				        var cssobj = {};
				        cssobj[csstransition] = csstransform + " 0.3s linear";
				        cssobj[csstransform] = "translate3d(" + left + "px,0,0)";
				        $("#ui_scroll_view_0").css(cssobj); //complete:null		
				    }
				}
				else {
				    if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
				        $("#ui_scroll_view_0").animate({"left": "0px", useTranslate3d:true},{queue:false, duration:PrecApp.ANIM_DURATION, easing:PrecApp.ANIM_EASING, complete:null});
				    } else {
				        var cssobj = {};
				        cssobj[csstransition] = csstransform + " 0.3s linear";
				        cssobj[csstransform] = "translate3d(0px,0,0)";
				        $("#ui_scroll_view_0").css(cssobj); //complete:null
				    }
			}
					
		}
		
		if (PrecApp.IS_TABLET)
			var xPos = Math.ceil(PrecApp.SCREEN_W*PrecApp.TABLET_PAGE_WIDTH_PERCENT); // animating back onto screen from left
	    else
	    	var xPos = (PrecApp.SCREEN_W); // animating back onto screen from left
	
		var func = null;
	
		for (var i=PrecApp.TO_PAGE_ID;i<PrecApp.FROM_PAGE_ID+1;i++)
		{
			var newPos = xPos;			
			var drillDownIndex = i;
		
			if (i==PrecApp.FROM_PAGE_ID){
				func = PrecApp.destroyDrillDown;
				$("#drillDown_"+i).bind("transitionend webkitTransitionEnd oTransitionEnd",drillUpSubpageTransition); 			
			}
			else
				func = null;
				
			if (i == PrecApp.TO_PAGE_ID && i>0){
				newPos = -xPos;
				console.log("true",newPos);				
			}

			if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE === "wp8") {
			    $("#drillDown_" + drillDownIndex).animate({ "left": "+=" + xPos, useTranslate3d: true }, { queue: false, duration: PrecApp.ANIM_DURATION, easing: PrecApp.ANIM_EASING, complete: func });
			} else {
			    var cssobj = {};
			    cssobj[csstransition] = csstransform + " 0.3s linear";
			    cssobj[csstransform] = "translate3d(" + newPos + "px,0,0)";
			    $("#drillDown_" + drillDownIndex).css(cssobj); //complete:func	
			}
		}
	},
	
	// destroys the contents of a drillDown
	destroyDrillDown:function()
	{	
		//alert("destroyDrillDown"+PrecApp.FROM_PAGE_ID);
		// destroy the existing iScroll
		PrecApp.destroyIScroll();
		
		$('#drillDown_'+PrecApp.FROM_PAGE_ID).html("");		
		$("#drillDown_"+PrecApp.FROM_PAGE_ID).css({"left":0});
		$("#drillDown_"+PrecApp.FROM_PAGE_ID).empty();
		$("#drillDown_"+PrecApp.FROM_PAGE_ID).remove();

		//re-assert the iScroll on the current page
		//PrecApp.createIScroll(true);
		//PrecApp.I_SCROLL_STACK[PrecApp.TO_PAGE_ID].refresh();
		PrecApp.I_SCROLL = PrecApp.I_SCROLL_STACK[PrecApp.TO_PAGE_ID];
	
		PrecApp.HEADER_TITLES.pop();
	
		PrecAppComponents.headerUpdate();
		
		if(PrecApp.TO_PAGE_ID==0)
		{
			PrecAppComponents.hideBack();
		}
		
		onPageBackComplete();
	},    
	
	// purges and create a new top level DOM structure
	createTopLevelPage:function()
	{
		PrecApp.initTopLevel();
		//$("#drillDowns").html(PrecApp.getTopLevelDrillDownStructure());
	},
	
	getTopLevelDrillDownStructure:function()
	{
		var ui_str='<div id="drillDownHolder"></div>';
		ui_str+='<div id="ui_scroll_view_0" class="iScrollWrapper">';
		ui_str+='<div class="ui_scroll_view">';
		ui_str+='<div class="content_wrap" id="PrecAppBasePageContent"></div>';
		ui_str+='</div></div>';
		
		return ui_str;
	},

	// title is the title of an "alternative stylesheet"
	setActiveStylesheet:function(title)
	{
		var cacheobj=[""];
		
		if(PrecApp.ACTIVE_STYLESHEET)
		{
			try
			{
				document.getElementsByTagName('head')[0].removeChild(PrecApp.ACTIVE_STYLESHEET);
			}
			catch(e){}
		}
			
		for(var i=0; (cacheobj=document.getElementsByTagName("link")[i]); i++) 
		{
			
			if(cacheobj.getAttribute("rel").toLowerCase()=="alternate stylesheet" && cacheobj.getAttribute("title")) 
			{
				cacheobj.disabled = true;
		
				if(cacheobj.getAttribute("title") == title)
				{ 
					cacheobj.disabled = false;
					PrecApp.ACTIVE_STYLESHEET = document.createElement('link');
					PrecApp.ACTIVE_STYLESHEET.rel = 'stylesheet';
					PrecApp.ACTIVE_STYLESHEET.type = 'text/css';
					
					if(cacheobj.media)
						PrecApp.ACTIVE_STYLESHEET.media = cacheobj.media;
					
					PrecApp.ACTIVE_STYLESHEET.href = cacheobj.href;
					document.getElementsByTagName('head')[0].appendChild(PrecApp.ACTIVE_STYLESHEET);
				}
			}
		}
	},
	preventDoubleClick:function(){

	    $("a").live("click", function(e) {
	        var click_x = e["pageX"], click_y = e["pageY"], click_time = e["timeStamp"];
	        if (click_x && click_y && click_time &&
	            (Math.abs(click_x - PrecApp.last_click_x) < 10) &&
	            (Math.abs(click_y - PrecApp.last_click_y) < 10) &&
	            (click_time - PrecApp.last_click_time) < 1000) {
	                e.stopImmediatePropagation();
	                return false;
	        }    
	        PrecApp.last_click_x = click_x;
	        PrecApp.last_click_y = click_y;
	        PrecApp.last_click_time = click_time;
	    });
	  

	},
  	doubleClickPrevented:false
	,
	quickPreventDoubleClick:function(){
		if (PrecApp.doubleClickPrevented){			
		   return false;
		 }
		else{			
			PrecApp.doubleClickPrevented = true;
			
			setTimeout(function(){
			PrecApp.doubleClickPrevented = false;			
			},500);
			
			return true;
		} 
		
	},
	
	handleClick:function()
	{
		if (!PrecApp.quickPreventDoubleClick())
			return;
		else
			{
			//var fn = eval(func);
			var args = arguments;
			var evaled = eval(args[0]);
		}	
	},
	handleClickWithArguments:function(funcToCall){
		console.log("Hey");
		arguments.shift();
		funcToCall.call(arguments);
		
	},
	
	getCurrentHTMLPageName:function()
	{
		return PrecApp.HTML_PAGE_NAMES[PrecApp.CURRENT_PAGE_ID];
	}
};


//fix for classList in old phones
if (typeof document !== "undefined" && !("classList" in document.documentElement)) {

(function (view) {

"use strict";

if (!('HTMLElement' in view) && !('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.className)
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.className = this.toString();
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		var index = checkTokenAndGetIndex(this, token);
		if (index !== -1) {
			this.splice(index, 1);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, forse) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			forse !== true && "remove"
		:
			forse !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	return !result;
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

var csstransform = getsupportedprop(['transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform'],["transform","-moz-transform","-webkit-transform","-ms-transform","-o-transform"]);
var csstransition = getsupportedprop(['transition', 'MozTransition', 'WebkitTransition', 'msTransition', 'OTransition'],["transition","-moz-transition","-webkit-transition","-ms-transition","-o-transition"]);


    function getsupportedprop(proparray,retarray) {
        var root = document.documentElement;//reference root element of document
        for (var i = 0; i < proparray.length; i++) {//loop through possible properties
            if (proparray[i] in root.style) {//if property exists on element (value will be string, empty string if not set)
            	if (retarray)
            		return retarray[i];
                return proparray[i]; //return that string
            }
        }
    }


function drillDownSubpageTransitionEnd(e){
		//if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE != "an")		
		PrecApp.showBackAndPurgeLock();
		$(this).unbind("transitionend webkitTransitionEnd oTransitionEnd",drillDownSubpageTransitionEnd);				
}

function drillUpSubpageTransition(e){
	PrecApp.destroyDrillDown();
	$(this).unbind("transitionend webkitTransitionEnd oTransitionEnd",drillUpSubpageTransition);
	
}