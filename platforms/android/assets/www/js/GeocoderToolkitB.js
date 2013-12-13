// note: needs google maps js before this



//override this in your main HTML
function findMapAddressFromLatLongComplete(addressObj)
{


}

function findMapPositionFromAddressComplete(lat1, lng1)
{

}

function markerPinUpdating(lat, lng)
{


}

function markerPinFinishedUpdating(lat,lng)
{


}

var GeocoderToolkitB = 
{	
	DOUBLE_TAP:false,
	MY_GOOGLE_MAP:null,

	// This is all Google map stuff
	// zl , 0 = maximum zoom out
	showMap:function (map_canvas, lat, lng, zl, pinInfo)
	{
		var map_style = 
		[
			{
				featureType: "administrative.country",
				elementType: "geometry.stroke",
				stylers: [
					{ hue: "#000000" },
					{ saturation:100 }
				]
			},
			{
				featureType: "water",
				elementType: "geometry.fill",
				stylers: [
					{ hue: "#3366cc" },
					{ saturation:100 }
				]
			},
			{
				featureType: "administrative.country",
				elementType: "labels",
				stylers: [
					{ hue: "#000000" },
					{ saturation:50 }
				]
			},
			{
				featureType: "landscape",
				stylers: [
					{ invert_lightness:false},
					{ color: "#ffffff" },
					{ hue: "#ffffff" },
					{ saturation: 0 }, 
					{ lightness: 0 }
				]
			}
		];
	
		if (zl==null)
		{
			zl = GeocoderToolkitB.MY_GOOGLE_MAP.getZoom();
		}
 
		var mapOptions = {
			zoom : zl,
			styles:map_style,
			center : new google.maps.LatLng(lat, lng),
			zoomControl: true,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true // switches off the default map controls
			/*,
			mapTypeControlOptions: {
				 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				 position: google.maps.ControlPosition.BOTTOM_RIGHT
			      }*/
		};
		
		var mapCanvas = document.getElementById(map_canvas);
		GeocoderToolkitB.MY_GOOGLE_MAP = new google.maps.Map(mapCanvas, mapOptions);
		
		if (pinInfo!=null)
		{
             GeocoderToolkitB.dropAPin(lat, lng, pinInfo);
		}
		else
		{
			  //DO NOTHING
		}
		
		google.maps.event.addListener(GeocoderToolkitB.MY_GOOGLE_MAP, 'mousedown', function(event) {
				PrecApp.I_SCROLL.disable();			
		});
		google.maps.event.addListener(GeocoderToolkitB.MY_GOOGLE_MAP, 'mouseup', function(event) {
				PrecApp.I_SCROLL.enable();
			    

		});
	},
	
	getMapCenter:function()
	{
		var coords = GeocoderToolkitB.MY_GOOGLE_MAP.getCenter();
		return coords;
	},
	
	dropAPin:function(lat, lng, pinInfo, animate)
	{
    	var image = new google.maps.MarkerImage("images/icons/icon-pin.png", null, null, null, new google.maps.Size(15,27));
	    //var shadow = new google.maps.MarkerImage("shadow.png", null, null, null, new google.maps.Size(20,30));
		
		var animation = null;
		
		if (animate)
		{
			animation = google.maps.Animation.DROP;
		}
		
		var myLatLng = new google.maps.LatLng(lat, lng);

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: GeocoderToolkitB.MY_GOOGLE_MAP,
			animation:animation,
			draggable: pinInfo.draggable,
			clickable: pinInfo.clickable,
			title: pinInfo.title,
			icon: image,
			flat:true,
			optimized: false
		});
	   
		if (pinInfo.draggable)
		{
			 google.maps.event.addListener(marker, 'drag', function(event) {
			  console.debug('new position is '+event.latLng.lat()+' / '+event.latLng.lng()); 
			  markerPinUpdating(event.latLng.lat(), event.latLng.lng());

			});

			google.maps.event.addListener(marker, 'dragend', function(event) {
			  console.debug('final position is '+event.latLng.lat()+' / '+event.latLng.lng()); 
			  markerPinFinishedUpdating(event.latLng.lat(), event.latLng.lng());
			});
		}
		
		
		if (pinInfo.clickable)
		{
			var myOptions = {
							content: "<div>" + pinInfo.markerContent+ "</div>"
						
						};

			var infoWindow = new google.maps.InfoWindow(myOptions);
			
	
			infoWindow.setOptions({maxWidth:260});
			

			
			google.maps.event.addListener(marker, 'click', function(event) {
			  	
				if(!GeocoderToolkitB.DOUBLE_TAP) // for PhoneGap work around
				{
					GeocoderToolkitB.DOUBLE_TAP=true;
					
		
					
					infoWindow.open(GeocoderToolkitB.MY_GOOGLE_MAP, marker);
					
			
					
					var t = setTimeout(GeocoderToolkitB.purgeDoubleTap, 200);
				}
			});
		}
	},
	
	purgeDoubleTap:function()
	{
		GeocoderToolkitB.DOUBLE_TAP=false;
	},
	
	findMapPositionFromAddress:function(map_canvas, address, zoomLevel, pinInfo)
	{
	
		var geocoder = new google.maps.Geocoder();
		
		// convert location into longtitude and latitude
		
		geocoder.geocode({
		address:address}, function(locResult){
			var lat1 = locResult[0].geometry.location.lat();
			var lng1 = locResult[0].geometry.location.lng();
			
			GeocoderToolkitB.showMap(map_canvas, lat1, lng1, zoomLevel, pinInfo);
			
			findMapPositionFromAddressComplete(lat1, lng1);
		});
		
	},
	
	// returns object with street, town, postcode, country
	findMapAddressFromLatLong: function(lat,lng)
	{
		var street;
		var postcode;
		var town;
		var country;
		
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lat,lng);
		
		// converts lat / lng into address
        geocoder.geocode({
            location: latLng
        }, 
		function(locResult) 
		{
			
			
			for (var n=0;n<locResult.length;n++)
			{
				for (var i=0;i<locResult[n].address_components.length;i++)
				{
					var types = locResult[n].address_components[i].types;
					
					for (var k=0;k<types.length;k++)
					{
						var typeLCS = types[k].toLowerCase();

						if (typeLCS=="administrative_area_level_1")
						{
							country = locResult[n].address_components[i].long_name;
						}
					}
				}
			}
			
			
			// fetch the details from the 1st record
			for (var i=0;i<locResult[0].address_components.length;i++)
			{
				var types = locResult[0].address_components[i].types;
				
				for (var n=0;n<types.length;n++)
				{
					// type as lowercase string
					var typeLCS = types[n].toLowerCase();
					

					if (typeLCS=="route")
					{
						street = locResult[0].address_components[i].long_name;
					}
					else if (typeLCS=="postal_code" || typeLCS=="postal_code_prefix")
					{
						postcode = locResult[0].address_components[i].long_name;
						
					}
					else if (typeLCS=="postal_town")
					{
						town = locResult[0].address_components[i].long_name;
						
						
					}
				}
			}
				
		
			findMapAddressFromLatLongComplete({street:street, town:town, postcode:postcode, country:country});
			

        });
		
		
	
	} // end function
};