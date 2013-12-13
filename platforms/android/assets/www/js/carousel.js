

function Carousel() {
	
	var container;
	var scrollContainer 
	var pager;
	var opt;
	var self;
	var items;
	var firstRun = true;
	
	this.initialize = function(params,cont,scroll) {
		self = this;
		container = $('#'+cont);
		scrollContainer = scroll;
		opt = {
				content:[{
					html:"",
					onClick:null
				}], // array with the content and an optional click function for the whole cell
				hasPager: false,
				extraClasses: "",
				pagerContainer:$('#pager'),
				pagerSize:20,				
				height: 70,
				width: 300, // note this is the item width not the carousel width
				margin:10,
				paddingLeft:0 //padding left for the first Item				
		};
		
		for (i in params) opt[i] = params[i];
		
		opt.items = opt.content.length;
		container.height(opt.height);
				 		
		//if hasPager
		if (opt.hasPager) { 
			pager = opt.pagerContainer;
			this.renderCarouselDots(opt.items);
		}
		
		//set the width of the container
		container.empty();   //originally #scroller. again might need to change?
		container.width(( (opt.width + (2*opt.margin)) * opt.items) + (1* opt.paddingLeft)  +opt.margin) ; // including margin and padding
		var screenW = 320;
		
		
		if (container.width() <= screenW){			
			
			container.width( container.width() + ( (screenW+10) - container.width()));
			
		}
					
  };
		
    //now we can override it the way we need		
	this.layoutCarousel = function() {
			//add the items on the cointainer
			
		for (var i = 0; i < opt.items; i++) {
			var itemToAdd; 	
			
			var func = opt.content[i].onClick;
				
			if (i==0)
				itemToAdd = '<div onClick="'+func+'"><div class="first untouched carouselItem '+opt.extraClasses+'" id="carouselItem'+i+'">'; //add IDS to add click
			else if (i== (opt.items -1))
				itemToAdd = '<div onClick="'+func+'"><div class="last untouched carouselItem '+opt.extraClasses+'" id="carouselItem'+i+'">'; //add IDS to add click
			else 
				itemToAdd = '<div onClick="'+func+'"><div class="untouched carouselItem '+opt.extraClasses+'" id="carouselItem'+i+'">'; //add IDS to add click
			
			itemToAdd += opt.content[i].html;		
			itemToAdd += '</div></div>';
			container.append(itemToAdd);							
		}
		
		var carouselItem = $(container.selector + " .carouselItem"); // get all the items		
		carouselItem.width(opt.width); // and set the propper width
		carouselItem.css('margin','0 '+opt.margin+'px');
		$('#'+scrollContainer).css("padding-left",opt.paddingLeft);
		
					
		//create the scroll
		H_SCROLL = new iScroll(scrollContainer, {  
					snap : false,
					momentum : true,
					hScrollbar : false,
					onScrollStart:function(){
						
					},
					onScrollEnd : function() {
						
					    self.updateCurrentCarouselDot();
					}
				});
		
		// now its ready - show it!
		container.css("opacity",1);		
	};
	
	

	this.renderCarouselDots = function(numDots)
			{
				pager.show();
				pager.width(numDots* opt.pagerSize);			
				pager.height(opt.pagerSize);					 
				this.highlightCarouselDot(0, numDots,true);
				
			};
				
			
	//render the correct number of dots and highlight the indexed one
	this.highlightCarouselDot=function(dotIndex, numDots,firstRun)
		{
			// remove tudo e coloca de novo so o que precisa!
		 if (firstRun) {	
		 	this.firstRun = false;
		 	
			var ui_str="";
			
			for (var i=0;i<numDots;i++)
			{
												
					ui_str+='<div class="carouselDot" id="carouselDot'+i+'"></div>';
			}
						
			pager.html(ui_str);
			
			var carouselDots = $(pager.selector + " .carouselDot");
			
			carouselDots.css('background',opt.pagerImage);
			carouselDots.width(opt.pagerSize);
			carouselDots.height(opt.pagerSize);
			carouselDots.on('click',function(){  //replace with touch				
				self.scrollCarouselTo(this.id[this.id.length-1],self.items);
			});
	    		$('#carouselDot'+dotIndex).addClass('selected');
		}
		 else {
		 
		 	$('.carouselDot').removeClass('selected');
		 	$('#carouselDot'+dotIndex).addClass('selected');
		 }
		 
			
		};
		
		this.scrollCarouselTo=function(dotIndex, numDots)
		{					
			H_SCROLL.scrollToPage(dotIndex, 0 , 300);
			//this.highlightCarouselDot(dotIndex, numDots); We don't need this because it will trigger on the end of the scroll anyway! 
		};
			
		this.updateCurrentCarouselDot=function()
		{
			this.highlightCarouselDot(H_SCROLL.currPageX, opt.items);
		};
};

