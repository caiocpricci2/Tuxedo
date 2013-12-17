/*!
 * Tuxedo v0.0.1 ~ Copyright (c) 2013 Jamie Lemon, Caio Ricci https://github.com/caiocpricci2/Tuxedo/blob/master/LICENSE
 */

var TuxedoCore = function (){
	
	
	//All enumerators go here 
	this.enums = {
	
		orientation :{
			PORTRAIT :0,
			LANDSCAPE:1
		},
		platform:{
			IOS:0,
			ANDROID:1,
			WP8:2,
			UNKNOWN:99
		}
	
	};
	
	//All internal local storage keys go here
	this.localStorageKeys = {
		isTablet : "TUX_IS_TABLET",
	
	};
	
	
	//Always references this instance of tuxedoCore
	var that;
	
	var config = {
		//Height of header on phones
		phoneHeaderHeight:50,
		//Height of header on tablets
		tabletHeaderHeight: 80,
		//Height of toolbar on phones
		toolbarHeight: 60,
		//Height of toolbar on tablets
		tabletToolbarHeight: 60,
		//Font size used on header texts
		headerFontsize: 0.9,
		//First view loaded once Tuxedo modules are loaded
		firstView: "main-view.html",
		//True if app requires connection to start
		requiresConnection: false,
		//Width of the main views on tablets. Used if you have a "always visible" side menu
		tabletViewWidthPercent: 1, //0.67
		//Callback triggered when the device orientation changes. Will be called with the new width and height values
		onOrientationChanged:null,
		//Callback triggered when tuxedo finishes loading
		onInitComplete:null,
		//Splash Screen url
		splashScreenUrl: "images/splash.jpg",
		//Min time the splash screen is displayed
		splashScreenTimer: 3000
				
	};
	
	var _config = {	
		//Height of the screen
		screenHeight:0,
		//Width of the screen
		screenWidth:0,
		//Screen orientation
		orientation:this.enums.orientation.PORTRAIT,
		//If it's tablet or not
		isTablet:false,
		//Syncs the creation of new drilldowns 
		lockDrilldownCreation:false,
		//Header height that is currently used, either phone or tablet. Is only updated on init and updateLayout
		headerHeight: config.phoneHeaderHeight,
		//Toolbar height that is currently used, either phone or tablet. Is only updated on init and updateLayout
		toolbarHeight: config.phoneToolbarHeight,
		//Screen space that is available for scrolling  (Usually it's screen size - headerHeight - toolbarHeight)
		availableScrollHeight:0,	
		//What platform are we on now
		platform:this.enums.platform.IOS,
		//Unique top level identifier,
		uniqueTopLevelId:0	
	};
	
	var _$elements = {
		drilldownHolder:null,
		mainContainer: null,
		splash:null

	
	};	

	//hold the current views on this stack
	var _viewStack =[];
		
	
	
	this.init = function(params){
		that = this;
		for (i in params) config[i] = params[i];
		
		var w = $(window).width();
		var h = $(window).height();				
		_config.screenHeight=h;
	    _config.screenWidth=w;
	
		_config.orientation = w > h ? this.enums.orientation.LANDSCAPE : this.enums.orientation.PORTRAIT;
		
		
		_setMainContainer();		
		_loadSplashScreen(); 
	    
		//for our purposes if we're on a device with a width over 600dp we can give them a tablet experience
		if (w>=600)
		{
			_config.isTablet = true;
			_config.headerHeight = config.tabletHeaderHeight;
			_config.toolbarHeight = config.tabletToolbarHeight;
		} 
		else 
		{
			_config.isTablet = false;
			_config.headerHeight = config.phoneHeaderHeight;
			_config.toolbarHeight = config.tabletToolbarHeight;
		}
		
		window.localStorage.setItem(that.localStorageKeys.isTablet, _config.isTablet);
		
		
		_setAvailableScrollHeight();		
		_createDrillDownHolder();
		_registerDebouncer();									
		document.addEventListener("deviceready", that._onDeviceReady, false);
			
	};
	
	function _loadSplashScreen(){
		_$elements.splash = $(document.createElement('div'));
		_$elements.splash.attr("id","tux_splashHolder");
		_$elements.splash.css({
			"width":"100%",
			"height":"100%",
			"position":"absolute",
			"top":"0",
			"left":"0",
			"z-index":10,
			"background":"url("+config.splashScreenUrl+") no-repeat center",
			"background-size":"cover"
		});
		_$elements.mainContainer.append(_$elements.splash);				
	}

	function _setMainContainer(){
		_$elements.mainContainer = $('#tux_mainContainer');
		console.log(_$elements.mainContainer);
		_$elements.mainContainer.css({
			"width":"100%",
			"height":"100%",
			"position":"absolute",
			"top":0,
			"left":0
			
		});
	}
	
	function _setAvailableScrollHeight(){
		_config.availableScrollHeight = _config.screenHeight - config.headerHeight - config.toolbarHeight;		
	}
	
	function _createDrillDownHolder(){
		
	
		var $drillDowns = $(document.createElement('div'));
		$drillDowns.attr("id","tux_drillDowns");
		
		var $holder = $(document.createElement('div'));
		$holder.attr("id","tux_drillDownHolder");
		
		$drillDowns.append($holder);
		
		var $uiScrollView = $(document.createElement('div'));
		$uiScrollView.attr("id","tux_uiScrollView0")
						.addClass("iScrollWrapper");
		
		var $topLevelViewHolder = $(document.createElement('div'));
		$topLevelViewHolder.attr("id","tux_topLevelViewHolder")
							.addClass("ui_scroll_view");
							
		$uiScrollView.append($topLevelViewHolder);
		
		$drillDowns.append($uiScrollView);
		
		_$elements.mainContainer.prepend($drillDowns);
	}
	
	
   this.loadTopLevelView = function(viewURL,viewObject){
   		 //clear the viewStack to remove any possible leftovers
   		 _viewStack = [];
   	   				
		// I've added this to return the position to 0 if you're loading a top view
		// from a drilled down view. It's not necessary in older versions
		
		//TODO replace this with jquery transit, it should remove the need for this if/else
		 if (_config.platofrm === that.enums.platform.WP8) {
	        $("#ui_scroll_view_0").animate({ "left": "0", useTranslate3d: true }, { queue: true, duration: 0, easing: PrecApp.ANIM_EASING, complete: PrecApp.showBack });
	    } else {	    	
	        var cssobj = {};
	        cssobj[csstransition] = csstransform + " 0 linear";
	        cssobj[csstransform] = "translate3d(0px,0,0)";
	        $("#ui_scroll_view_0").css(cssobj); //PrecApp.showBack
	    }
	    
		_viewStack.push(viewObject);
		pageRequested(pageURL, PrecApp.PAGE_LOAD_STATES.topLevel);
		
		$("#PrecAppBasePageContent_"+_config.uniqueTopLevelId).remove();
		_config.uniqueTopLevelId++;
		
		//create the drillDown object
		var str = '<div class="full_wrap" id="PrecAppBasePageContent_'+_config.uniqueTopLevelId+'"></div>';
		$("#tux_topLevelViewHolder").append(str);				
		$("#tux_pageContent"+_config.uniqueTopLevelId).load(pageURL, that._topLevelViewLoadComplete);
			
   	
   };
   
   function _topLevelViewLoadComplete(){
   		var topView = _viewStack[0]; //it's always 0 on a top level view.
   		
   		//initialize the topview
   		topView.init();   		
   	
   }
	
	function _onDeviceReady(){
		//TODO init localisation here
		_config.platform = _getCurrentPlatform();		
		_localisationComplete();		
	}
	
	function _localisationComplete(){
		if (typeof onInitComplete === "function")
			onInitComplete.call(this);
		
	}
	
	function _getCurrentPlatform(){
		var deviceType = "un";
			if (navigator.userAgent.toLowerCase().match(/android/)) {
			    deviceType = 'an';			
			}
			else if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {			
			    deviceType = 'ip';			
			}
			else if (navigator.userAgent.toLowerCase().match(/windows phone 8/)) {    
			    deviceType = 'wp8';
			    //TODO add wp8 special stylesheet			    
			    //$("head").append($("<link rel='stylesheet' href='css/wp8.css' type='text/css' media='screen' />"));
			}
													
			switch (deviceType){				
				case "an":
					return that.enums.platform.ANDROID;
					break;
				case "ip":
					return that.enums.platform.IOS;
					break; 		
				case "wp8":
					return that.enums.platform.WP8;
					break;
				default:
					return that.enums.platform.UNKNOWN;
					break;
			}
			
		
	}
	
	function _refreshIScrolls(){
		
		for (var i=0;i<_viewStack.length;i++)
			_viewStack[i].refreshIScroll();
		
	}
	
	function _updateDrillDowns(){
		
	}
	
	function _registerDebouncer(){
		$(window).resize(setTimeout( function ( e ) {
	           
		    var w = $(window).innerWidth();
		    var h = $(window).innerHeight();
		  
		    //Showing keyboard also triggers this event, let's prove it false. 
		    var isShowKeyboard = false; 
		
			if (w===_config.screenWidth)
			{
				isShowKeyboard=true;
			}
			if (!isShowKeyboard)
			{
				// source landscape and portrait
				if (h < _config.screenHeight)
					_config.orientation = that.enums.orientation.LANDSCAPE;
				else
					_config.orientation = that.enums.orientation.PORTRAIT;
															
				_config.screenHeight=w;
				_config.screenWidth=h;
				_setAvailableScrollHeight();
				_refreshIScrolls();
				_updateDrillDowns();				
				
				
				if (typeof _config.onOrientationChanged === 'function' )
					onOrientationChanged.call(this,_config.orientation,w,h);
			}	
	
		},500 ) );
		
	}
	
};


