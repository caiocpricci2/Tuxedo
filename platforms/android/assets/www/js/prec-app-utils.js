/**************************/
/*** PREC APP INTERNALS ***/
/** *********************** */

// we store all variables & functions for PrecApp in its own namespace
var PrecAppUtils = {
	DEVICE_VERSION : null,
	DEVICE_PLATFORM : "unknown",
	DEVICE_PLATFORM_SHORTCODE : "un",
	DEVICE_NAME : null,
	USER_LAT: null,  //has the latest known user latitude
	USER_LNG: null,  //has the latest known user longitude
	COORD_TIMESTAMP:null, // timestamp when the last coordinates were acquired
	COORD_TIMESTAMP_RANGE:5 * 60000, //after 5 minutes we refresh the coordinates.
	

	getDeviceType : function() {		
		var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad"
				: (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone"
						: (navigator.userAgent.match(/Android/i)) == "Android" ? "Android"
								: (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry"
										: "null";
		var platform = deviceType.toLowerCase(); // PhoneGap

		PrecAppUtils.DEVICE_NAME = device.name;
		PrecAppUtils.DEVICE_VERSION = device.version;
		PrecAppUtils.DEVICE_PLATFORM = platform;
		PrecAppUtils.DEVICE_PLATFORM_SHORTCODE = PrecAppUtils.DEVICE_PLATFORM
				.substring(0, 2).toLowerCase(); // an=android, ip=iphone/ipad,
												// bl=blackberry		

	},
	
	cacheImage : function (imgStr){
		$("#IMAGE_CACHE").append("<img src='"+imgStr+"' width=0 height=0/>");
	},
	
	isNotNull : function(val) {

		if (val == null || val == undefined) {
			return false;
		} else {
			val = $.trim(val);
			val = val.toLowerCase();
			
			if (val == "" || val == "null" || val == "undefined") {
				return false;
			}
		}

		return true;
	},

	isNull : function(val) {
		if (val == null || val == undefined) {
			return true;
		} else {
			val = $.trim(val);
			val = val.toLowerCase();
			if (val == "" || val == "null" || val == "undefined") {
				return true;
			}
		}

		return false;
	},
	// returns a real boolean from string values or numerics
	getBooleanValue : function(val) {
		if (typeof val == "string")
			val = val.toLowerCase();

		if (val == "true" || val == "1" || val == 1 || val == true)
			return true;
		else
			return false;
	},

	getAFreshNumber : function() {			
		var r = (Math.random()) * 1000
		return r;
	},

	/** service functions * */
	verifyConnection : function(displayAlert,callback) {
		try {
			var networkState = navigator.network.connection.type;
		} catch (e) {
			return true; // fix for the browser, true for online, false for offline
		}

		if (PrecAppUtils.isNull(callback))
			callback = PrecAppUtils.testConnection;
		/*
		 * var states = {}; states[Connection.UNKNOWN] = "Unknown Connection";
		 * states[Connection.ETHERNET] = "Ethernet Connection";
		 * states[Connection.WIFI] = "WIFI Connection";
		 * states[Connection.CELL_2G] = "2G Connection";
		 * states[Connection.CELL_3G] = "3G Connection";
		 * states[Connection.CELL_4G] = "4G Connection"; states[Connection.NONE] =
		 * "No Connection";
		 */
		// navigator.notification.alert("Cordova is working:
		// network="+states[networkState]);
		console.log("networkState:" + networkState);
		console.log(Connection.UNKNOWN + " - " + Connection.ETHERNET + " - "
				+ Connection.WIFI + " - " + Connection.CELL_2G + " - "
				+ Connection.CELL_3G + " - " + Connection.CELL_4G + " - "
				+ Connection.NONE);
				
		if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) 
		{
			if (displayAlert)
			{
				navigator.notification.alert(
								"You have no internet connection - please check and try again.",
								callback, // callback
								"Connectivity problem", // title
								"Retry" // buttonName
						);
				
			}	
			return false;
		}
		return true;
	},

	testConnection : function() {
		var connectionOK = PrecAppUtils.verifyConnection();
		return connectionOK;
	},

	createFileEntry : function(imageURI) {
		window.resolveLocalFileSystemURI(imageURI, PrecAppUtils.copyPhoto,
				PrecAppUtils.onCopyFail);
	},

	copyPhoto : function(fileEntry) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(
				fileSys) {
			fileSys.root.getDirectory("photos", {
				create : true,
				exclusive : false
			}, function(dir) {
				fileEntry.copyTo(dir, "file_" + getAFreshNumber() + ".jpg",
						PrecAppUtils.onCopySuccess, PrecAppUtils.onCopyFail);
			}, PrecAppUtils.onCopyFail);
		}, PrecAppUtils.onCopyFail);
	},

	onCopyFail : function(entry) {
		alert("PrecAppUtils.onCopyFail");
	},

	onCopySuccess : function(entry) {

		// $("#photoHolder").html("<img src='"+entry.fullPath+"'/>");
	},

	/**
	 * String functions
	 */
	capitaliseFirstLetter : function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	openEmailWithSubjectAndBody : function(subject, body) {
        
		if (PrecAppUtils.isNull(subject))
			subject = "";
		
		var emailBody;
		
		if (PrecAppUtils.isNull(body))
			emailBody="";
		else
			emailBody = PrecAppUtils.brsToEmailLineBreak(body);
			
        var emailCompositionStr = "mailto:?subject=" + subject + "&body=" + emailBody;
        window.location.href = emailCompositionStr;
    },

	brsToEmailLineBreak : function (str)
	{
		str = str.replace(/<br \/>/g, "%0D%0A").replace(/<br\/>/g, "%0D%0A").replace(/<br>/g, "%0D%0A");
		return str;
	},

	/** These are used to validate HTML email compositions * */
	replaceQuotes : function(str) {
		// var n = str.replace("'", "&apos;"); //%27
		var n = str.replace(/'/g, "%27"); // g = global replacement
		n = n.replace(/"/g, "%27");
		n = n.replace(/&#39;/g, "%27");
		n = n.replace(/&apos;/g, "%27");
		n = n.replace(/&quot;/g, "%27");
		n = n.replace(/&rsquo;/g, "%27");

		return n;
	},

	removeQuotes : function(str) {
		var n = str.replace(/'/g, "");
		n = n.replace(/"/g, "");
		n = n.replace(/&apos;/g, "");
		n = n.replace(/&#39;/g, "");
		n = n.replace(/&quot;/g, "");
		n = n.replace(/&rsquo;/g, "");

		return n;
	},

	replaceNBSPAndAmp : function(str) {
		var n = str.replace(/&nbsp;/g, " ");
		n = n.replace(/&amp;/g, "%26");
		return n;
	},
	
	brToNewLines : function (str)
	{		
		str = str.replace(/<br>/g, "\n").replace(/<br>/g, "\r\n");
		str = str.replace(/<br\/>/g, "\n").replace(/<br\/>/g, "\r\n");
		str = str.replace(/<br \/>/g, "\n").replace(/<br \/>/g, "\r\n");
		
		return str;
	},
	
	newLinesToBrs : function (str)
	{
		str = str.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
		return str;
	},
	
	scrambleArray : function(arr) {
		for ( var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x)
			;
		return arr;
	},

	/** * DATE FUNCTIONS ** */
	// works with these types of date strings
	// 2012-12-12 12:00
	// 2013-02-16 10:45:00
	// 2015-12-01T15:01:00
	getDateAndTimeFromString : function(dateString, printMonthFormat) {
		
		var arr = dateString.split("-");
		var yyyy = arr[0];
		var mm = arr[1];
		var monthIndex = arr[1];
		
		var monthDouble = String(monthIndex);
		
		if (monthDouble.length<2)
			monthDouble = "0"+monthDouble;

		if (printMonthFormat == "long")
			mm = PrecAppUtils.getMonthLongName(Number(mm) - 1);
		else if (printMonthFormat == "short")
			mm = PrecAppUtils.getMonthShortName(Number(mm) - 1);

		var dd = arr[2].substring(0, 2);

		var t = arr[2].substring(3);
		
		var hh = t.substring(0,2);
		var minute = t.substring(3,5);
		
		return {
			year : yyyy,
			monthIndex:Number(monthIndex)-1, // ensure to zero index the month
			monthDouble:monthDouble,
			month : mm,
			day : dd,
			time : t,
			hour:hh,
			minute: minute
		}

	},

	getAmPmTime : function(time) {
		var arr = time.split(":");
		var hour = arr[0];
		var min = arr[1];
		var tm = 'am';
		var newHour = hour % 12;
		if (hour >= 12) {
			tm = 'pm'
			if (newHour == 0) // mid day is still 12
				newHour = 12;
		}

		return (newHour + ':' + min + "" + tm);

	},

	getAmPmTimeObject : function(time) {
		var arr = time.split(":");
		var hour = arr[0];
		var min = arr[1];
		var tm = 'am';
		var newHour = hour % 12;
		if (hour >= 12) {
			tm = 'pm'
			if (newHour == 0) // mid day is still 12
				newHour = 12;
		}

		return {
			hour : newHour,
			min : min,
			ampm : tm
		}

	},

	getDayShortName : function(index) {
		var ARR = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

		if (index > ARR.length - 1)
			index = 0;

		return ARR[index];
	},

	getMonthLongName : function(index) {
				
		var ARR = [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November",
				"December" ];

		if (index > ARR.length - 1)
			index = 0;

		return ARR[index];
	},

	getMonthShortName : function(index) {
		var ARR = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG",
				"SEP", "OCT", "NOV", "DEC" ];

		if (index > ARR.length - 1)
			index = 0;

		return ARR[index];
	},

	getLetterFromNumber : function(number) {
		var az = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return az.charAt(number);
	},

	getObjectLength : function(obj) {
		var count = 0;

		for (i in obj) {
			count++;
		}

		return count;
	},
	// this expects a date returned from PrecAppUtils.getDateTimeFromString();
	sortArrayByDate : function(ar) {
		var tArr = ar;
		tArr.sort(function(a, b) {
			
			var da = PrecAppUtils.getDateAndTimeFromString(a.dateString);//expected dateString object as e.g: 2015-12-01T15:01:00
			var db = PrecAppUtils.getDateAndTimeFromString(b.dateString);//expected dateString object as e.g: 2015-12-01T15:01:00
			
			a = (new Date(da.year, da.monthIndex, da.day, da.hour, da.minute)).getTime();
			b = (new Date(db.year, db.monthIndex, db.day, db.hour, db.minute)).getTime();
			return a < b ? -1 : a > b ? 1 : 0;
		});
		return tArr;
	},
	isAndroid2 : function() {
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE == "an")
			if (parseFloat(PrecAppUtils.DEVICE_VERSION) < 4.2)
				return true;
		return false;
	},
	prepareHandleClickString : function(f, paramsArray, initialEscape) {
		// parramsArray = [ 'string1',1,'string2',2 ..., 45];
		// intial escape : If the function is already surrounded by ' ' pass how
		// many times!
		var clickStr = "";
		for ( var i = 0; i < initialEscape; i++)
			clickStr += "\\";
		if (initialEscape > 0)
			clickStr += "'";
		clickStr += f + "(";
		for ( var i = 0; i < paramsArray.length; i++) {
			var param = paramsArray[i];
			if (typeof param == "string") {
				for ( var j = 0; j <= initialEscape; j++)
					clickStr += "\\";
				clickStr += "'" + param;
				for ( var j = 0; j <= initialEscape; j++)
					clickStr += "\\";
				clickStr += "'";
			} else
				clickStr += param;

			if (i != paramsArray.length - 1)
				clickStr += ",";

		}
		clickStr += ")";
		for ( var i = 0; i < initialEscape; i++)
			clickStr += "\\";
		if (initialEscape > 0)
			clickStr += "'";

		return clickStr;
	},
	sanitisePhoneNumber : function(num) {
		// strip out the non numbers and keep the +
		if (num == null || num == undefined)
			return "";
		var phoneNum = num.replace(/[^0-9+]/g, '');
		return phoneNum;
	},
	stripScripts : function(text) {

		var div = document.createElement('div');
		div.innerHTML = text;
		var scripts = div.getElementsByTagName('script');
		var i = scripts.length;
		while (i--) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
		return div.innerHTML;
	}, 
	searchInArray:function (toSearch,array){
	      for (var i=0;i<array.length;i++){
	          if (toSearch == array[i])
	              return true;
	      }
	      return false;
	},
	isPathOnTheInternet:function(url)
	{
		//sanity check the url for http://
		var substr = url.substring(0,4);
		
		// this will validate for http and https
		if (substr!="http")
			return true;
			
		return false;
	},
	
	isFunction:function(functionToCheck){		
		 var getType = {};
		 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';			
		
	},
	
	
	openExternalURL:function(url, exitApp)
	{    
		//sanity check the url for http://
		var substr = url.substring(0,4);
		
		// this will validate for http and https
		if (substr!="http")
			url = "http://"+url;
		
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="an")
		{
			window.AndroidLayer.openURL(url);
		}
		else
		{
			window.open(url, "_blank");
			/*
			if (exitApp)
				window.open(url, "_blank");
			else
				window.open("native:url:"+url, "_self");
				*/
		}
	},
	
	openSMS:function(smsBody)
	{
		if (PrecAppUtils.DEVICE_PLATFORM_SHORTCODE=="an")
		{
			AndroidLayer.sendSms(smsBody);
		}
		else
		{
			window.open("native:sms:"+smsBody, "_self");
		}
	},
		
	
	getUserLocation:function(callbackSuccess,callbackError){
		
				
		if ( PrecAppUtils.isNotNull(PrecAppUtils.USER_LAT) && PrecAppUtils.isNotNull(PrecAppUtils.USER_LNG)&& PrecAppUtils.isNotNull(PrecAppUtils.COORD_TIMESTAMP)) {
			
			if (new Date().getTime() - PrecAppUtils.COORD_TIMESTAMP > PrecAppUtils.COORD_TIMESTAMP_RANGE)
				if (PrecAppUtils.isFunction(callbackSuccess)){					
					setTimeout(callbackSuccess,1500); 
					return;
				}
		}
					
			navigator.geolocation.getCurrentPosition(
				function(position){  //success 
					console.log("success getting position: " + position.coords.latitude + ","+position.coords.longitude);
					PrecAppUtils.COORD_TIMESTAMP = new Date().getTime(); 
					PrecAppUtils.USER_LAT = position.coords.latitude;
					PrecAppUtils.USER_LNG = position.coords.longitude;
					
					if (PrecAppUtils.isFunction(callbackSuccess)){
						setTimeout(callbackSuccess,1000); 
											
					}
				},
				function(positionError){ //error 			
					console.log("Error fetching location:")
					for (key in positionError)
						console.log(positionError[key]);					
					if (PrecAppUtils.isFunction(callbackError))
						callbackError();
					
				}, //optional params
				{maximumAge: 300000, enableHighAccuracy: true, timeout:10000 });
		
	}, 
	
	getDistanceBetweenCoordinates:function(lat1,lng1,lat2,lng2,decimalPointNum){
		
		//bullet proofing
		if (PrecAppUtils.isNull(lat1) || PrecAppUtils.isNull(lng1) || PrecAppUtils.isNull(lat2)|| PrecAppUtils.isNull(lng2))
			return null;
		
		//console.log(lat1+","+lng1  + " ---- " + lat2+","+lng2); 
		var distance = (3958*3.1415926*Math.sqrt((lat2-lat1)*(lat2-lat1) + Math.cos(lat2/57.29578)*Math.cos(lat1/57.29578)*(lng2-lng1)*(lng2-lng1))/180);	
		//console.log("distance:" + distance);
		
		if (decimalPointNum!=null)
		{
			distance = distance.toFixed(decimalPointNum);
		}
		 
		return Number(distance); //ensure to cast back to number as toFixed stringifies ....
		
	}, getPhonegapPath:function(){		
	
		var path = window.location.pathname;
	    path = path.substr( path, path.length - 10 );
	    return 'file://' + path;		
		
	}
	
	 

}
