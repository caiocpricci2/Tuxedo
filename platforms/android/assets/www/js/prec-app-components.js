/*!
 * PrecApp v 1.0 ~ Copyright (c) 2012 Precedent Communications, http://precedent.co.uk
 * 
 */


/**************************/
/*** PREC APP COMPONENTS ***/
/**************************/

// override 
function photoSuccess(imageURI)
{
	
}

function popOverClosed(myVar)
{
	
}

// we store all variables & functions for PrecApp in its own namespace
var PrecAppComponents ={
	
	
	
	/**
	 *Bind the touch events on the class to swap the background and  give a visual status to the user.
	 *  toggles the classes touched/untouched in the desired element 
	 * 
	 * Keep in mind that the element MUST HAVE the class untouched.
	 */			
	bindSwapBackgroundOnTouch:function (){
		$('.untouched').on('touchstart',function(){
																
			$(this).addClass("touched").removeClass("untouched");  	
		}).on('touchend',function(){
			
			$(this).removeClass("touched").addClass("untouched");
		}).on('touchmove',function(){
			$(this).removeClass("touched").addClass("untouched");
		});
		
	},
	/**
	 *Similar to the previous method, binds a callBackMethod 
	 * to any class touchstart/end events. Callback Method must accept
	 * a boolean parameter, true for touchstart false for touchend 
	 */
	bindTouchEvent:function(elementClass,callBackMethod){
		$('.'+elementClass).on('touchstart',function(){					
		callBackMethod($(this),true);
		}).on('touchend',function(){
		callBackMethod($(this),false);
		});
		
	},
		
		
		
	
	/**
	 * Add swipe detection to 4 directions. 
	 * @Params elementId : id of the element to add the detection#
	 * rightCallback : callBack method when swiped right
	 * leftCallback : callBack method when swiped left
	 * downCallback : callBack method when swiped down
	 * upCallback : callBack method when swiped up
	 */
	addSwipeMotionToElement:function(element,rightCallback,leftCallback,downCallback,upCallback) { 
	var touchXStart = 0;
	var touchYStart = 0;
	var touchXEnd = 0;
	var touchYEnd = 0;
	


	 
			element.addEventListener('touchstart', function(event) {
				  if (event.targetTouches.length == 1) {
				    var touch = event.targetTouches[0];		    
				    touchXStart = touch.pageX;
				    touchYStart = touch.pageY;		    
				  }
				},false);
			
			element.addEventListener('touchend', function(event) {		
				
				if (Math.abs(touchYEnd - touchYStart) <= 50){
					if (touchXEnd - touchXStart >= 150)
						rightCallback(element);
					else if (touchXEnd - touchXStart <= -150)
						leftCallback(element);			
				} else if (Math.abs(touchXEnd - touchXStart) <= 50){
					if (touchYEnd - touchYStart >= 150)
						downCallback(element);
					else if (touchYEnd - touchYStart <= -150)
						upCallback(element);			
				}
				
				},false);
			
			element.addEventListener('touchmove', function(event) {
				  if (event.targetTouches.length == 1) {
				    var touch = event.targetTouches[0];		    
				    touchXEnd = touch.pageX;
				    touchYEnd = touch.pageY;				    
				  }
				},false);
	},
		
	
	showHeader:function(show, animate)
	{
		
		if (animate)
		{
			if (show) //animate on
			{
				$("#header").css({"top": -PrecApp.HEADER_HEIGHT});
				$("#header").css({"display":"block"});
				$("#header").animate({"top": 0},{queue:false, duration:200, easing:"linear", complete:null});	
			}
			else // animate off
			{
				$("#header").animate({"top": -PrecApp.HEADER_HEIGHT},{queue:false, duration:200, easing:"linear", complete:null});
			}			
		}
		else
		{
			if (show)
				$("#header").css({"display":"block"});
			else
				$("#header").css({"display":"none"});
		}
	},

	// this happens on initial page load and window resize
	
	popOverOnScrollStart:function(touchEvent)
	{

	},
	
	popOverOnScrollEnd:function(touchEvent)
	{
		/*for (n in touchEvent)
		{
			
		}*/
	},
	
	popOverOnZoomEnd:function(touchEvent)
	{
		/*for (n in touchEvent)
		{
			
		}*/
	}, 
	
	
	/* UI widgets and display for Prec App */
	// sets header and font size for each page
	myHeader:function(params)	
	{
		
		var opt = {
			title: "Title",  //header tittle
			fs: PrecApp.DEFAULT_HEADER_FONTSIZE, //font size
			ignoreStack :false, //ignore stack should be false by default
			icon: null,
			height: PrecApp.HEADER_HEIGHT, //header height
			ignoreLeftRightButtonActions:false,
			rightButton: {
				show :false, //show right button
				background: "none", //background for right button
				text: "Button", //text for right button
				width: "auto",
				height:"auto",				
				color:"black",
				fontsize:1,
				extraCss: null
				
			},
			leftButton:{
						show:false,
						background:"none",
						text:"Back",
						width: "auto",
						height:"auto",				
						color:"black",
						fontsize:1,
						extraCss: null,
						leftButtonIsBack:true					
					}			
		}	
		
		for (i in params) opt[i] = params[i];
		
		var obj = {};
		obj.title = opt.title;
		obj.icon = opt.icon;
		
		$("#header").height(opt.height);
	    //$(".ui_scroll_view").css("top",opt.height + 5); //put a blank space in the top to push the content below the header.

		
		// var Buttons = {right:opt.rightButton,  We can make this automatic if needed. With 2 buttons i prefer to leave it manually for now.
			// back:opt.backButton};
		
		if (!opt.ignoreLeftRightButtonActions)
		{
			if (opt.rightButton.show){
				var right = $("#header .right");
				//right.css("background",opt.rightButton.background);
				right.css("color",opt.rightButton.color);
				right.css("font-size",opt.rightButton.fontsize+"em");
				right.html(opt.rightButton.text);
				right.width(opt.rightButton.width);
				right.height(opt.rightButton.height);
				//right.bind("touchstart", YACWAApp.headerRightButtonPressed);				

				if (opt.rightButton.extraCss) {

					right.css(opt.rightButton.extraCss);
				}

				PrecAppComponents.showHeaderRightButton(false,null,null);
			}	
			
			var left = $("#header .left");
			
			if (opt.leftButton.leftButtonIsBack)
			{
				left.css("color",opt.leftButton.color);
				left.css("font-size",opt.leftButton.fontsize+"em");
				left.html(opt.leftButton.text);
				left.width(opt.leftButton.width);
				left.height(opt.leftButton.height);
				left.click(opt.leftButton.onClick);	
				// do nothing else, as our PrecApp handles the display of this
			}
			else
			{
				if (opt.leftButton.show)
				{
					//left.css("background",opt.leftButton.background);
					left.css("color",opt.leftButton.color);
					left.css("font-size",opt.leftButton.fontsize+"em");
					left.html(opt.leftButton.text);
					left.width(opt.leftButton.width);
					left.height(opt.leftButton.height);
					left.click(opt.leftButton.onClick);				
					if (opt.leftButton.extraCss) {

						left.css(opt.leftButton.extraCss);
					}
					left.show();

					left.css('display', 'block');
				}
				else
				{
					var left = $("#header .left");
					left.hide();
					left.css('display', 'none');
				}
			}					
		}
	
		PrecAppComponents.setHeaderTitle(opt);
	},
	
	setHeaderTitle:function(opt)
	{
		var obj = {};
		obj.title = opt.title;
		obj.icon = opt.icon;
		
		if (opt.fs==null)
			obj.fontSize = PrecApp.DEFAULT_HEADER_FONTSIZE;
		else
			obj.fontSize = opt.fs;
			
		
		if (opt.ignoreStack) // used if we need to change the header title without stacking onto navigation hierarchy
		{
			var hIndex = PrecApp.HEADER_TITLES.length-1;
			PrecApp.HEADER_TITLES[hIndex]=obj; // overwrite current item in stack
			var titleSpan =$("#headerTitle"); 			
			titleSpan.css({"fontSize":obj.fontSize+"em" });
			titleSpan.html(obj.title);
			titleSpan.hide;
			
			if (obj.icon)
			{
				var titleIcon = $("#headerIcon");
				titleIcon.html("<img src='"+opt.icon +"'/>");
			}
			
		}
		else
		{
			PrecApp.HEADER_TITLES.push(obj);
			PrecAppComponents.headerUpdate();
			
			if (obj.icon)
			{
				var titleIcon =$("#headerIcon");
				titleIcon.html("<img src='"+opt.icon +"'/>");
			}
		}
	},
	

	// prints the header with the correct font size
	headerUpdate:function()
	{
		var hIndex = PrecApp.HEADER_TITLES.length-1;
		
		if (hIndex<0) 
			hIndex=0;
		
		var fontSize = PrecApp.HEADER_TITLES[hIndex].fontSize;

		if (fontSize!=null)
			$("#headerTitle").css({"fontSize":fontSize+"em"});
		else
			$("#headerTitle").css({"fontSize":PrecApp.DEFAULT_HEADER_FONTSIZE+"em"});
	
		$("#headerTitle").html(PrecApp.HEADER_TITLES[hIndex].title);
		
		if (PrecAppUtils.isNotNull(PrecApp.HEADER_TITLES[hIndex].icon))
			$("#headerImg").html("<img src='"+PrecApp.HEADER_TITLES[hIndex].icon+"'/>");
	},
	
	getHeaderText:function()
	{
		return $("#headerTitle").text();
	},
	getPageName:function()
	{
		return PrecApp.HTML_PAGE_NAMES[PrecApp.CURRENT_PAGE_ID];
	},

	hideBack:function()
	{
		$(".back").hide();
		$(".back").css('display', 'none');
	},

	showBack:function()
	{
		// platform check
		if (PrecApp.DEVICE_PLATFORM_SHORTCODE=="an" || PrecApp.DEVICE_PLATFORM_SHORTCODE=="bl")
		{
			PrecAppComponents.hideBack();
		}
		else
		{
	
			$(".back").show();
			$(".back").css('display', 'block');
		}	
	},
	
	hideHeaderRightButton:function(animate, ms, func)
	{
		if (animate)
		{
			if (ms==null)
				ms=300;
				
			var h = $("#header .right").height();
			$("#header .right").animate({"top": -h},{queue:false, duration:ms, easing:"linear", complete:func});
		}
		else
		{
			$("#header .right").hide();
		}
		
	},
	
	showHeaderRightButton:function(animate, ms, func)
	{		
		var right = $("#header .right")
		
		if (animate)
		{
			if (ms==null)
				ms=300;
				
			var h = right.height();
			right.css({"top":-h});
			right.animate({"top": 20},{queue:false, duration:ms, easing:"linear", complete:func});			
		}
		
		right.css('display', 'block');
	},
	
	
	closePopOver:function(myVar)
	{
		popOverClosed(myVar);
		console.log("closing popover: " + PrecApp.BLOCK_TOGGLE_OVERLAY);
		if (PrecApp.BLOCK_TOGGLE_OVERLAY)
			return;
		if (PrecApp.POPOVER_ISCROLL!=null)
		{
			PrecApp.POPOVER_ISCROLL.destroy();
			PrecApp.POPOVER_ISCROLL=null;
		}
		if (PrecApp.ANIMATE_POPOVER){
			$("#popOver").animate({"opacity": "0", useTranslate3d:true},{duration:"fast", easing:PrecApp.ANIM_EASING , complete: function(){$("#popOver").css({"display":"none"});}});
		}
		else 			
			$("#popOver").css({"display":"none"});
		setTimeout(function(){
		$('#popOverContent').removeClass("showSecond");
		$('#popOver').removeClass("loader");
		},1000);
		PrecApp.POPOVER_OPEN=false;
		PrecAppComponents.toggleDarkOverlay(false);
	},


	openPopOver:function()
	{
		PrecAppComponents.toggleDarkOverlay(true);
		if (PrecApp.ANIMATE_POPOVER) {
			
			$("#popOver").css({"display":"block",
							   "opacity":"0" });
			$("#popOver").animate({"opacity": "1", useTranslate3d:true},{duration:"fast", easing:PrecApp.ANIM_EASING});
		}
		else
			$("#popOver").css({"display":"block"});
			
		PrecApp.POPOVER_OPEN=true;
		PrecAppComponents.makePopOverScrollable();
		PrecApp.POPOVER_ISCROLL.refresh();
	},
	
	
	makePopOverScrollable:function()
	{
		// destroy any existing pop over
		if (PrecApp.POPOVER_ISCROLL!=null)
		{
			PrecApp.POPOVER_ISCROLL.destroy();
			PrecApp.POPOVER_ISCROLL=null;
		}
		
		PrecApp.POPOVER_ISCROLL = new iScroll('popOverPanel', {
			hScrollbar: false,
			hScroll:false,
			hideScrollbar:true, /* fades out scroll bar */
			
			onScrollStart: function(e) {
				PrecApp.SCROLL_MOVE=0;
				
			},
			
			onScrollMove: function(e) {
				PrecApp.SCROLL_MOVE++;
			},
			
			onScrollEnd: function(e) {
		//		PrecApp.popOverOnScrollEnd(e);
			}
		 });
	},
	
	makePopOverZoomable:function()
	{
		// destroy any existing pop over
		if (PrecApp.POPOVER_ISCROLL!=null)
		{
			PrecApp.POPOVER_ISCROLL.destroy();
			PrecApp.POPOVER_ISCROLL=null;
		} 
		
		PrecApp.POPOVER_ISCROLL = new iScroll('popOverPanel', { zoom:true, 
			
			onScrollStart: function(e) {
				PrecApp.popOverOnScrollStart(e);
			},
			
			onScrollEnd: function(e) {
				PrecApp.popOverOnScrollEnd(e);
			},
			
			onZoomEnd : function(e){
				PrecApp.popOverOnZoomEnd(e);
			}	
		 });
	},

    setPopOverStyleA:function()
	{
		var h = PrecApp.SCREEN_H;
		
		document.getElementById("popOver").className = "";		
		
		$("#popOver").css({"top":"0","height":h+"px"});
		
		if (PrecApp.IS_TABLET)
		{
			$("#popOverPanel").css({"top":"1%", "left":"33%", "width":"66%"});
		}
		else
		{
			$("#popOverPanel").css({"top":"1%", "left":"2%", "width":"96%"});
		}
		
	
		// popOverPanel & popOverBG to dark
		$("#popOverPanel").css({"background":"#252525", "opacity":1});
		$("#popOverBG").css({"background":"#000000", "opacity":0.5});
	
		$("#popOverBG").css({"height":h+"px"});
		$("#popOverPanel").css({"height":"98%"}); // !important
		$("#popOverClose").show();
	},
	
	setPopOverStyleB:function()
	{
		var h = PrecApp.SCREEN_H;
		
		document.getElementById("popOver").className = "";
		document.getElementById("popOver").classList.add("style_b");							
		
	},
	 setPopOverStyleC:function()
	{
		var h = PrecApp.SCREEN_H;
		
		document.getElementById("popOver").className = "";		
		
		
		$("#popOver").css({"top":"0","height":"100%"});
		if (PrecApp.IS_TABLET) {			
			$("#popOverPanel").css({"top":"10%", "left":"20%", "width":"60%","height":"80%"});
		} else {			
			$("#popOverPanel").css({"top":"10%", "left":"10%", "width":"80%","height":"80%"});
		}		
		$("#popOverBG").css({"background":"#000000", "opacity":0.5});
	
		$("#popOverPanel").css({"background":"#EDEDED"}); 
	
		$("#popOverBG").css({"height":h+"px"});		
		$("#popOverClose").show();
	},
	
	
	setPopOverStyleNote:function()
	{
		var h = PrecApp.SCREEN_H;
		
		$("#popOver").css({"top":"0","height":h+"px"});
		$("#popOverPanel").css({"top":"100px", "left":"2%", "width":"96%"});
	
		// popOverPanel & popOverBG to dark
		$("#popOverPanel").css({"background":"#252525", "opacity":1});
		$("#popOverBG").css({"background":"#000000", "opacity":0.5});
	
		$("#popOverBG").css({"height":h+"px"});
		$("#popOverPanel").css({"height":"350px"}); // !important
		$("#popOverClose").hide();
		
	},
	
	setPopOverStyleLoader:function(msg)
	{
		if (PrecAppUtils.isNull(msg))
			msg = ""; 
			
        PrecAppComponents.setPopOverStyleA();   
        var ui_str ="";
        
        ui_str+='<div class="centerDiv" style="width:300px;text-align:center;"><br/>';
        ui_str+= "<span id='loaderMsg'>"+msg+"</span>";
        ui_str+='<img src="images/loaders/loader-pling.gif" width=50% style="display:block; margin: 0 auto;"/></div>';
        document.getElementById("popOver").classList.add("loader");
        
   
        $("#popOverContent").html(ui_str);             
	}, 

	setPopOverStyleDialog : function() {
		var h = PrecApp.SCREEN_H;
		var w = PrecApp.SCREEN_W;
		var popH = 200;
		var popW = 300;
		var top = h/2 - popH/2;
		var left = w/2 - popW/2;
		
		$("#popOver").css({
			"top" : "0",
			"height" : h + "px"
		});
		
		$("#popOverPanel").css({
			"top" : top,
			"left" : left,
			"min-width" : popW,
			"width" : "20%",
			"height" : popH,
			"background" : "#252525",
			"opacity" : 1
		});
				
		$("#popOverBG").css({
			"background" : "#000000",
			"opacity" : 0.5,
			"height" : h + "px"
		});


		$("#popOverClose").show();
	},
	onSendComplete:function(success){
        
        var ui_str ="";

        ui_str+='<div class="centerDiv" style="width:300px;top:100px;position:relative;text-align:center;">';
        
        if (success)
        {
            ui_str+= Localisation.getStr("POST_SUCCESS");   
            POST_SUCCESS=true;  
        }
        else
        {   
            ui_str+= Localisation.getStr("POST_FAIL");
        }
        
        ui_str+="<div class='centerDiv' style='width:225px;'><input type='button' value='"+Localisation.getStr("CLOSE")+"' onClick='PrecApp.handleClick(\"PrecAppComponents.closePopOver()\")' class='fatButton'/></div>";
        //ui_str+='<a href="javaScript:PrecApp.handleClick(\'PrecAppComponents.closePopOver()\')"></a>';
        ui_str+='</div>'
        
        $("#popOverContent").html(ui_str);
    },
	
	makeHeaderMenuScrollable: function()
	{
		// destroy any existing pop over
		
		if (PrecApp.HEADER_ISCROLL!=null)
		{
			PrecApp.HEADER_ISCROLL.destroy();
			PrecApp.HEADER_ISCROLL=null;
		}
		if ($('#scrollRevealMenu').length > 0)
		PrecApp.HEADER_ISCROLL = new iScroll('scrollRevealMenu', {			
			bounce:true,
			onScrollStart: function(e) {
					
			},
			
			onScrollEnd: function(e) {
				
			}
		 });
		 
		 		
	},
		
		
	slideLock:false, // prevent changes on the slide		
	slided: false, // global indicator if it's shown or not
	//pxToSlide: 480, // drop_down_container height
	 slideHeader:function(shrink)
	 {
	
		 if (PrecAppComponents.slideLock)
			 	return;
		 
	 	if (shrink == true) //if we want to
	 		PrecAppComponents.slided = true; //Forces it to shrink the dropdown 
	 		
	 	
		if (!PrecAppComponents.slided) {
						
			$('.headerDropDown').height((PrecApp.SCREEN_H  - PrecApp.HEADER_HEIGHT) + "px");			  				 			
			PrecAppComponents.slided = true;
			PrecAppComponents.toggleDarkOverlay(true);			
		}  else   {			
			
			PrecAppComponents.toggleDarkOverlay(false);
				   			
		}		
		
		
		setTimeout(function(){
			 PrecAppComponents.makeHeaderMenuScrollable();
			},200);		
	},	 
	bindDarkOverlayTouchMethod:function(callback){
				
		$('#darkOverlay').on('touchend',callback);
	},
	toggleDarkOverlay:function(show){
		console.log("toggling overlay: " + PrecApp.BLOCK_TOGGLE_OVERLAY);
		if (PrecApp.BLOCK_TOGGLE_OVERLAY) {
			return;
		}
		if (show){
			$('#darkOverlay').show();
			PrecApp.I_SCROLL.disable();
		}
		else
		{	
			if (PrecAppComponents.slided ==true) { 						
				$('.headerDropDown').height(0);   		    				    				    		
				PrecAppComponents.slided = false;		
			}	
			$('#darkOverlay').hide();
			PrecApp.I_SCROLL.enable();
		}
	},
	
	// PHOTO API
	// common API for both Android and iOS
    getPicture:function()
    {

		// Retrieve image file location from specified source
		navigator.camera.getPicture(PrecAppComponents.onPhotoURISuccess, PrecAppComponents.onPhotoURIFail,
                                    { quality: 25, destinationType: navigator.camera.DestinationType.FILE_URI,
                                    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM});

    },
    
    onPhotoURIFail:function(error)
    {
        console.log("PrecAppComponents.onPhotoURIFail"+error.code);

    },

    onPhotoURISuccess:function(imageURI)
    {
		photoSuccess(imageURI);
		//PrecAppComponents.createFileEntry(imageURI);
    },

	createFileEntry:function(imageURI)
    {
        window.resolveLocalFileSystemURI(imageURI, PrecAppComponents.copyPhoto, PrecAppComponents.onCopyFail);    
    },

    copyPhoto:function(fileEntry)
    {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) { 
                                 fileSys.root.getDirectory("photos", {create: true, exclusive: false}, function(dir) { 
                                                           fileEntry.copyTo(dir, "file_photo.jpg", 
                                                            PrecAppComponents.onCopySuccess, PrecAppComponents.onCopyFail); 
                                                           }, PrecAppComponents.onCopyFail); 
                                 }, PrecAppComponents.onCopyFail); 
    },

    onCopyFail:function(entry)
    {
        console.log("PrecAppComponents.onCopyFail");
    },
    
    onCopySuccess:function(entry)
    {
        //$("#photoHolder").html("<img src='"+entry.fullPath+"'/>");
		photoSuccess(entry.fullPath);	
    },

	// END PHOTO API
	
	myCarousel:function(params,cont,scrollContainer){
			var tempCarousel = new Carousel();
			tempCarousel.initialize(params,cont,scrollContainer);
			return tempCarousel;
	},
	myList:function(params,cont,maxItems,isPullDown,isPullUp){
			var tempList = new List();
			tempList.initialize(params,cont,maxItems,isPullDown,isPullUp);
			return tempList;
	},
	populateRevealMenu:function(isTablet)
	{
		var locA = Localisation.getStr("MENU_ITEM_ONE");
		var locB = Localisation.getStr("MENU_ITEM_TWO");
		var locC = Localisation.getStr("MENU_ITEM_THREE");
		var locD = Localisation.getStr("MENU_ITEM_FOUR");
		var locE = Localisation.getStr("MENU_ITEM_FIVE");
		var locF = Localisation.getStr("MENU_ITEM_SIX");
		
		var ui_str="";				
		
		if (isTablet)
		{
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem0" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(0)"><span class="text ellipsis whiteText">'+locA+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem1" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(1)"><span class="text ellipsis whiteText">'+locB+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem2" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(2)"><span class="text ellipsis whiteText">'+locC+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem3" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(3)"><span class="text ellipsis whiteText">'+locD+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem4" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(4)"><span class="text ellipsis whiteText">'+locE+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem5" class="menuNavgItem untouched touched" onClick="PrecAppComponents.navigateTo(5)"><span class="text ellipsis whiteText">'+locF+'</span></div>';
		}
		else
		{
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem0" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(0)"><span class="text ellipsis greenText">'+locA+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem1" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(1)"><span class="text ellipsis greenText">'+locB+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem2" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(2)"><span class="text ellipsis greenText">'+locC+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem3" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(3)"><span class="text ellipsis greenText">'+locD+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem4" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(4)"><span class="text ellipsis greenText">'+locE+'</span></div>';
			ui_str += "<div class='hr'/>";
			ui_str+='<div id="menuNavgItem5" class="menuNavgItem untouched" onClick="PrecAppComponents.navigateTo(5)"><span class="text ellipsis greenText">'+locF+'</span></div>';
		}
		
		$("#revealMenu").html(ui_str);
        		
		PrecAppComponents.sizeRevealMenu(true);	
	},
	
	sizeRevealMenu:function()
	{
		var numItems = $('.menuNavgItem').length; // get the number of menu navg items
		
		var cellBorderHeight = 1; // this is the height of the grey border-top from css: .menuNavgItem!
		var h = Math.floor(PrecApp.AVAILABLE_SCROLL_H/numItems)-cellBorderHeight;

		$(".menuNavgItem").height(h);
		$(".menuNavgItem").css({"line-height":h+"px"});
		
		// upscale for tablet
		$(".menuNavgItem").css({"font-size":"22px"});
	},
	
	highlightMenuItem:function(index)
	{	
		if (PrecAppUtils.isNull(index))
			return;
			
		
		
		// unhighlight all, and highlight the index
		for (var i=0;i<9;i++)
		{
			if (i!=index)
				$("#menuNavgItem"+i).css({"background": "#141414"});
			else
				$("#menuNavgItem"+i).css({"background": "#252524"});	
		}
	},
	
	navigateTo:function(pageToGo){

		
		PrecAppComponents.slideHeader();
		  	
	},
	
		  

	disableElement:function(element){
		var el = $('#'+element); 
		el.css('opacity','0.6');		
		el.off('click');
		
	
	},
	
	enableElement:function(element,callback)
	{
				
		var el = $('#'+element);
		el.off('click');					
		el.css('opacity','1');		
		el.on('click',callback);	
			
	}
	

};
