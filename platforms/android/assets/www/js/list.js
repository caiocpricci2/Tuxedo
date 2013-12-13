function List() {
		
	
	this.self = this;
	this.items = 0;
	this.firstRun = true;
	this.container = null;
	this.containerName = null;
	this.totalItems = 0;
	this.maxResultsToDisplay = 0; //how many results we display on each search. WHen the user scrolls down we refresh to another number
	this.lastResultDisplayedId = 0; // the last id displayed on the search
	
	
	this.initialize = function(content,container,maxResults,isPullDown,isPullUp) {	
		this.containerName  = container;	
		this.container = $('#'+container);
		this.container.empty();			
		this.content = content;
		this.totalItems = this.content.length;
		this.maxResultsToDisplay = maxResults > 0 ? maxResults : this.totalItems;
		this.showNextResults();		
		
		showPullDown = isPullDown;
		showPullUp = isPullUp;
		// Small empty space to fix potential issues with hidden content because ISCROLL calculates the size of things wrong.
		var tinyBlankSpace = '<div class="listEmptySpace" style="height:5px; clear:both;"></div>';
		this.container.append(tinyBlankSpace);		
		var pullupId = container+'_pullUp';
		var pulldownId = container+'_pullDown';
		var pullUpUiStr = '<div id="'+pullupId+'" class="pullUp"><span class="pullUpIcon"></span><span class="pullUpLabel">Pull up to refresh...</span></div>';
		var pullDownUiStr = '<div id="'+pulldownId+'"><span class="pullDownIcon"></span><span class="pullDownLabel">Pull down to refresh...</span></div>';
		
		
		if (showPullUp && $('#'+pullupId).length==0){
						
			$(pullUpUiStr).insertAfter('#'+container);
			pullUpEl = document.getElementById(container+'_pullUp');
	        pullUpOffset = pullUpEl.offsetHeight;
		}
		if (showPullDown && $('#'+pulldownId).length==0){
			$(pullDownUiStr).insertBefore('#'+container);
		    pullDownEl = document.getElementById(container+'_pullDown');
	        pullDownOffset = pullDownEl.offsetHeight;
		}
        
          
	};
	
	this.showNextResults = function(){
		if(this.lastResultDisplayedId<= this.totalItems){ //if we already showed everything we can.			
			for (var i=this.lastResultDisplayedId;i<(this.lastResultDisplayedId+this.maxResultsToDisplay);i++) {	
					if (i>=this.totalItems){ //if we get to total items in the middle stop here.
						if (pullUpEl != undefined)
							pullUpEl.style.display = 'none';
						break;
					}
					var itemToAdd;
					var cellClass = this.content[i].cellClass;			
					if (cellClass==null || cellClass==undefined)
						cellClass="";			
							
					if (i == this.totalItems-1) //if it's the last item, add the class last
						itemToAdd = '<div class="listItem '+cellClass+' untouched last" id="'+this.containerName+'_cell_'+i+'">'; //add IDS to add click
					else if (i==0)
						itemToAdd = '<div class="listItem '+cellClass+' untouched first" id="'+this.containerName+'_cell_'+i+'">'; //add IDS to add click
					else					
						itemToAdd = '<div class="listItem '+cellClass+' untouched mid" id="'+this.containerName+'_cell_'+i+'">'; //add IDS to add click  
						 
				    itemToAdd += "<div class='text'>" + this.content[i].html + "</div>";
				    itemToAdd += "<div class='clearFix'></div>";
					itemToAdd += '</div>'; // close listItem
					
					this.container.append(itemToAdd); //original #scroller might change?														
			}
			this.lastResultDisplayedId+=this.maxResultsToDisplay;
		} else{
			if (pullUpEl != undefined)
				pullUpEl.style.display = 'none';
		}
		PrecApp.refreshIScroll();
	};

}




