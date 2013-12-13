/*!
 * Tuxedo v0.0.1 ~ Copyright (c) 2013 Jamie Lemon, Caio Ricci https://github.com/caiocpricci2/Tuxedo/blob/master/LICENSE
 */

var TuxedoCore = function (){
	
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
		tabletViewWidthPercent: 1 //0.67					
	}
	
	var _config = {	
		//Height of the screen
		screenHeight:0,
		//Width of the screen
		screenWidth:0,
		//Screen orientation
		orientation:enums.orientation.PORTRAIT,
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
	}
	
	var _elements = {
		drilldownHolder:null,
		mainContainer: null
	
	}	

	
	var _pageStack =[];
	
	
	
	
	this.init(params){
		that = this;
		for (i in params) config[i] = params[i];
		
		var w = $(window).width();
		var h = $(window).height();
	
		_config.screenHeight=h;
	    _config.screenWidth=w;
	
		_config.orientation = w > h ? enums.orientation.LANDSCAPE : enums.orientation.PORTRAIT; 
	    
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
	    //drillDownUpdate();
		//iScrollUpdate();		
		//Phonegap API for listener "deviceready" or website bypass
		
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="un") //we' dont know where we are
		{
			docReady();
			appReady();
		}
		else
		{
			docReady();
			document.addEventListener("deviceready", PrecApp.onDeviceReady, false);
		}
		
	}

	
	function _setAvailableSCrollHeight(){
		_config.availableScrollHeight = _config.screenHeight - config.headerHeight - config.toolbarHeight;		
	}
	
	function _createDrillDownHolder(){
		_elements.mainContainer = $('#tux_mainContainer');
	
		var $drillDowns = $(document.createElement('div'));
		$drillDowns.attr("id","tux_drillDowns")	
		
		var $holder = $(document.createElement('div'));
		$holder.attr("id","tux_drillDownHolder")
		
		$drillDowns.append($holder);
		
		var $uiScrollView = $(document.createElement('div'));
		$uiScrollView.attr("id","tux_uiScrollView0")
						.addClass("iScrollWrapper");
		
		var $topLevelViewHolder = $(document.createElement('div'));
		$topLevelViewHolder.attr("id","tux_topLevelViewHolder").
							.addClass("ui_scroll_view");
							
		$uiScrollView.append($opLevelViewHolder);
		
		$drillDowns.append($uiScrollView);
		
		_elements.mainContainer.prepend($drillDowns);
	}
	
	
	this.enums = {
	
		orientation :{
			PORTRAIT :0,
			LANDSCAPE:1
		}
	
	}
	
	this.localStorageKeys = {
		isTablet : "TUX_IS_TABLET",
	
	}
	
}
