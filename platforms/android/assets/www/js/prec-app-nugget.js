function PrecAppNugget(){
	
    var DEBUG = false;

	//Local Storage Strings
	var LS_APP_ID ="NUGGET_APP_ID";
	var LS_COUNT = "NUGGET_COUNT";
	var LS_DOWNLOAD_DATE = "NUGGET_DOWNLOAD_DATE"	;
	var LS_USAGE_TIMESTAMPS = "NUGGET_USAGE_TIMESTAMPS";
	var NUGGET_APP_OPEN = "app:open";
	var count = 0;
	
	var actions = {
			app:"app",
			device:"device",
			countUsage:	"usage"		
	};
	var that = this;
	var baseUrl = "http://staging.mobappanalytics.precedenthost.co.uk/service.aspx?action=";
	var appId = -1;
	var online = false;		
	var deviceUUID = "";
	var dbDeviceId = -1;
    var country = "undefined";
    var os = "";
    var osVersion ="";
    var brand = undefined;
    var versionCode = 1;
    var versionNumber =1;
	var appPackage = "";
	var downloadedDateTimestamp = 0;
	var nuggetLoadStatus = -1; // -1 before nugget starts fetching variables and if we are offline, 0 while it's fetching variables from the server, 1 after it's completely loaded 
    var timestampAppOpen = new Date().getTime();
    
    this.DEVICE_PLATFORM_SHORTCODE ="";    
    
    
    
    
    //Page class to store
    var Page = function(name,timestamp){    	
    	return {Name:name,Timestamp:timestamp};	
    };
    
	/**
	 * Set the app ID, build the URL and send it.
	 * 
	 */
	this.init = function(){			
		
							
		//get or set the downloaded date 
		downloadedDateTimestamp = Number(window.localStorage.getItem(LS_DOWNLOAD_DATE));
		if (downloadedDateTimestamp==0){
			downloadedDateTimestamp = new Date().getTime();
			window.localStorage.setItem(LS_DOWNLOAD_DATE,downloadedDateTimestamp); 
		}
		
		//populate the variables we can
		var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad"
					: (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone"
							: (navigator.userAgent.match(/Android/i)) == "Android" ? "Android"
									: (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry"
                                        : (navigator.userAgent.match(/windows phone 8/i)) == "Windows Phone 8" ? "Windows Phone 8"
											: "unknown";
		os = deviceType.toLowerCase();
		that.DEVICE_PLATFORM_SHORTCODE = os.substring(0, 2);
		if (that.DEVICE_PLATFORM_SHORTCODE == "wi")
		    that.DEVICE_PLATFORM_SHORTCODE = "wp8";
		try{
			osVersion = device.version;
		} catch(error){
			osVersion = "1";
		}
		getDeviceNativeInfo();
		if (DEBUG) console.log("NUGGET => getting gettingAppPackage");
		getAppPackage();
		
		
		
		
				
	};
		
	/**
	 * Call the native layer to retrieve the application package/build identifier
	 * 
	 * @async
	 * @private
	 */
	function getAppPackage(){
		//hardcode app packages. wp8, bb and  other platforms need it so there's no point in trying to be smart here		
		 that.gotAppPackage("co.uk.precedent.yacwa");
	}
	
	/**
	 *  
	 */
	this.gotAppPackage = function(appPack){
		if (DEBUG) console.log("NUGGET => gotAppPackage:"+appPack);	
		appPackage = appPack;		 
	
		if (isUserOnline()){
			nuggetLoadStatus =0;			
			getAppId(NUGGET_APP_OPEN);
			
		} else {

			var usageTimestamps = window.localStorage.getItem(LS_USAGE_TIMESTAMPS);
			
			if (usageTimestamps == null){
				usageTimestamps = [];				
			}
			else
				usageTimestamps  = $.parseJSON(usageTimestamps);
			
			var appOpenTimestamp = new Page(NUGGET_APP_OPEN,timestampAppOpen);
			usageTimestamps.push(appOpenTimestamp);
			window.localStorage.setItem(LS_USAGE_TIMESTAMPS,JSON.stringify(usageTimestamps));
		}	
	};
	
	/**
	 * If the appId is not set yet, set the app ID.
	 * 
	 * @private 
	 */
	function getAppId(pageName){		
		if (DEBUG) console.log("NUGGET => gettingAPpId");
		if (appId == -1) //if it's not set yet, try to fetch from local storage
			appId = window.localStorage.getItem(LS_APP_ID);

		if (appId != null && appId != undefined && appId != "null" && appId != "undefined"  && appId != -1 && appId != ""){ //if there was something stored, that's great, we don't need to fetch it.
			if (DEBUG) console.log("NUGGET => sendingAnalytics with local appId:"+appId);
			registerOrUpdateDevice();
			return;
		}
					
		 
		 var url = baseUrl + actions.app + "&package=" + appPackage;		 
		 if (DEBUG) console.log("NUGGET => fetching online appId using:" + url);
		 $.ajax({
				url : url,							
				success : function(data) {
					
					
					if (DEBUG) console.log("NUGGET => " + data);				
					appId = Number(data);										
					if (DEBUG) console.log("NUGGET => fetched online appId:" + data +" now sending analytics with online appId");
					window.localStorage.setItem(LS_APP_ID,data);
					registerOrUpdateDevice();
					
				},
				error : function() {
					
					if (DEBUG) console.log("NUGGET => Failed getting app ID, retrying in 60 seconds"); //if we fail here smt is wrong because we are sure the user is online.
					window.setTimeout(function(){setAppId(appPackage);},60000);
				}
			});
	}
	
	

	/**
	 * Set the id and brand, or call the native layer to do it;
	 * 
	 * @async
	 * @private
	 * 
	 */		 
	function getDeviceNativeInfo(){
		if (that.DEVICE_PLATFORM_SHORTCODE == "an"){
			window.AndroidLayer.getDeviceNativeInfo();			
		} else 
			
			if (that.DEVICE_PLATFORM_SHORTCODE == "ip"){
				//TODO add method to get version name and code
				deviceUUID = device.uuid;
				brand = "Apple";
			}
			else if (that.DEVICE_PLATFORM_SHORTCODE == "bb"){
				deviceUUID = device.uuid;
				brand ="Blackberry";
			}
			else if (that.DEVICE_PLATFORM_SHORTCODE == "wp8") {
			    deviceUUID = device.uuid;
			    brand = "Windows";
			}
			else{ 
				deviceUUID = "chrome";
				brand ="chrome";
			}			
	}
	
	/**
	 * callback from the native layer to set id and brand
	 * 
	 * @param {string} id  Device unique id
	 * @param {string} bra Device brand
	 */
	this.gotDeviceNativeInfo = function(id,bra,vCode,vName){ //got android device id
		deviceUUID = id;		
		brand = bra;
		versionCode = vCode;
    	versionNumber =vName;
	};
	
		
	
	/**
	 * Return the appID
	 * 
	 * @public 
	 */
	this.getAppId = function(){
		return getAppId();		
	}		;
		
	
	function registerOrUpdateDevice(){
		if (brand == undefined){ //if we got here but the callbacks haven't returned yet wait for a while and  run it again later.
			if (DEBUG) console.log("NUGGET => brand is undefined, retrying in 5");
			window.setTimeout(registerOrUpdateDevice,5000);
			return;			
		}	
		var timestamp = new Date().getTime();
				
		var url = baseUrl + actions.device + 
		"&appid="+appId +
		"&deviceuuid="+deviceUUID + 	
		"&lat="+0+ //TODO
		"&lng="+0+			
		"&os="+os + 
		"&osversion="+osVersion +
		"&brand="+brand +
		"&versionCode="+versionCode +
		"&versionNumber="+versionNumber + 
		"&utctimestamp="+timestamp+						
		"&downloadeddate="+downloadedDateTimestamp;
		if (DEBUG) console.log("NUGGET => Prepared url:" + url);
		 $.ajax({
				url : url,
				type : "get",
				dataType : 'text',
				success : function(data) {				
					dbDeviceId = Number(data);	
					if (DEBUG) console.log("NUGGET => Successfully registered:" + data);
					nuggetLoadStatus = 1; //all loaded here
					countUsage(NUGGET_APP_OPEN);
				},
				error : function() {										
					if (DEBUG) console.log("NUGGET => Register Device Failed ");					
				}
			});
		
		
	}
	
	function countUsage(pageName){
		if (brand == undefined){ //if we got here but the callbacks haven't returned yet wait for a while and  run it again later.
			if (DEBUG) console.log("NUGGET => brand is undefined, retrying in 5");
			window.setTimeout(countUsage,5000);
			return;			
		}
		//if for any reason we don't have the dbDeviceId here we need to fetch it. registerOrUpdate will call countUsage after saving dbDeviceID 
		if (dbDeviceId == -1 || dbDeviceId == undefined){
			if (DEBUG) console.log("NUGGET => DbDeviceId:" + dbDeviceId);
			registerOrUpdateDevice();
			return;
		}
		//get the timestamp		
		if (pageName == NUGGET_APP_OPEN){
			//use the appOpen timestamp if we're sending appOpen. If we calculate the timestamp now we might get other pages timestamps before NUGGET_APP_OPEN		
			var timestamp = timestampAppOpen;
		}
		else {
			var timestamp = new Date().getTime();
		}
			
		if (DEBUG) console.log("NUGGET => CountingUsage "+pageName+" - " + timestampAppOpen);
		var objToSend = {};
		var tss = window.localStorage.getItem(LS_USAGE_TIMESTAMPS);
		if (tss != null ){
			var parsed = $.parseJSON(tss);			
			parsed.push(new Page(pageName,timestamp)); 
			objToSend.previousVisits = JSON.stringify(parsed);
		} else 
			objToSend.previousVisits = JSON.stringify([(new Page(pageName,timestamp))]); //need to send an array		
		if (DEBUG) console.log(objToSend);
		
		
		
			
		var url = baseUrl + actions.countUsage + 
		"&appid="+appId +
		"&deviceid="+dbDeviceId;								
		if (DEBUG) console.log("NUGGET => Prepared url:" + url);							
		 $.ajax({
				url : url,
				type : "POST",				
				data : objToSend,
				success : function(data) {
					if (DEBUG) console.log("NUGGET => CountUsage Success :" + data);
					window.localStorage.removeItem(LS_USAGE_TIMESTAMPS);
				},
				error : function() {										
					if (DEBUG) console.log("NUGGET => CountUsage Failed");					
				}
			});
	}
	
	this.trackPage = function (pageName,pageLoadState){	
		if (DEBUG) console.log("NUGGET => TrackginPage:"+ pageName + " - pageLoadState:" + pageLoadState);
		// if (pageLoadState == 1 || pageLoadState == 3) //this is different on newer versions of precapp.
			// return;
				
		if (isUserOnline() && nuggetLoadStatus == -1){
			//if we got here and we havent started loading variables yet means we were offline  but now we are online
			if (DEBUG) console.log("NUGGET => Fetching APP ID");
			getAppId(pageName);
			if (DEBUG) console.log("ran after getAPpId");
		} else	if (!isUserOnline() || nuggetLoadStatus == 0){ //if we are offline or if we don't have all the variables yet
		    //just store it so we can use it later
			storePage(pageName,pageLoadState);
					
		} else if (isUserOnline() && nuggetLoadStatus == 1){				
			countUsage(pageName);
			}						
			else {
				console.error("NUGGET ERROR => Invalid status on track page. It should never reach this line");				
			}
	};
	
	function storePage(pageName,pageLoadState){		
		var usageTimestamps = window.localStorage.getItem(LS_USAGE_TIMESTAMPS);
			
			if (usageTimestamps == null){
				usageTimestamps = [];				
			}
			else
				usageTimestamps  = $.parseJSON(usageTimestamps);
			
			var appOpenTimestamp = new Page(pageName,new Date().getTime());
			usageTimestamps.push(appOpenTimestamp);
			window.localStorage.setItem(LS_USAGE_TIMESTAMPS,JSON.stringify(usageTimestamps));
			if (DEBUG) console.log(usageTimestamps);	
	}
	
	
	function isUserOnline(){		
		try {
			var networkState = navigator.network.connection.type;	
			online = !(networkState == Connection.UNKNOWN || networkState == Connection.NONE) ;
		} catch(e){
			
			online = false; //if running from browser
		}
		return online;
	}
			
			
} 
var Nugget = new PrecAppNugget();
