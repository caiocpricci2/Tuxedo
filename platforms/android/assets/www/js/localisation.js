/**************************/
// Localisation strings and methods
// Used for text labels and buttons withing the UI

// overridden by top level pages
function localisationComplete()
{
	
}

var Localisation={
    
    CURRENT_LANGUAGE:{name:"", shortcode:"", strings:{}},
	AVAILABLE_LANGUAGES:[{name:"", shortcode:"", strings:{}}],
	
	// inits the Localisation by retrieving the JSON set
	// or loading it from the local db
	init:function(url, alreadyHave, forceRefresh, inAppFile)
	{				
		
		if(alreadyHave)
		{
			// either we have been here before and we have the data
			if (PrecAppUtils.isNotNull(window.localStorage.getItem('LOCALISATION_JSON')))
			{
				if (!forceRefresh)
				{
					console.log("Use localisation local storage file");
                    var data = window.localStorage.getItem('LOCALISATION_JSON');
					Localisation.parseLocalisationJson(data);
					return;
				}
			}
			else // or not
			{
				
				// ..... continue
				
			}
		}
		
		//!important to purge this in order to prevent multiple online Localisation calls
		if (forceRefresh)
		{
			window.localStorage.setItem('FORCE_REFRESH', "false");
		}
		
		// connection check, because we can't fetch unless we are online
		var userIsOnline = PrecAppUtils.verifyConnection(false);
		if (!userIsOnline && !inAppFile)
		{
			var data = window.localStorage.getItem('LOCALISATION_JSON');
			Localisation.parseLocalisationJson(data);
			return;
		}
		
		if (inAppFile || url=="") //if we want to force it or if no url was specified
		{			
			url = "data/in-app-localisation.json";
		
		}
	
		Localisation.AVAILABLE_LANGUAGES=[];
		$.ajax(
			{				
				url: url,
				dataType: 'text',
				success: function(data)
				{									
														
                    console.log("Use localisation file:"+url);
                    Localisation.parseLocalisationJson(data);
                    window.localStorage.setItem('LOCALISATION_JSON',data);	
				},
				error: function(data)
				{
					
				}
			}
		);
	},
	
	parseLocalisationJson:function(data){
		
	
		var parsedLocalisationData = $.parseJSON(data);
		for (n in parsedLocalisationData)
		{
			var obj = parsedLocalisationData[n];
			
			var name = obj['Name'];
			var shortcode = (obj['LanguageCode']);

			
			var obj = obj['Strings'];
			var strings = [];
			
			// assign the name value pairs
			for (i in obj)
			{
				var newObj={};
		
				newObj.name = obj[i].Name;
				newObj.value = obj[i].Value;
				
				strings.push(newObj);
			}
			
			Localisation.AVAILABLE_LANGUAGES.push({name:name, shortcode:shortcode, strings:strings});	
		}
		
		var defaultLanguage = "EN";
		Localisation.setDefaultLanguage(defaultLanguage);  	
	},
		
	setDefaultLanguage:function(shortcode)
	{
		// check to see if the user has a language preference already
		var userLang = window.localStorage.getItem('languageShortcode');
		
		if (PrecAppUtils.isNull(userLang))
		{
			window.localStorage.setItem('languageShortcode', shortcode);
		}
		else
		{
			shortcode = window.localStorage.getItem('languageShortcode');
			
			// #1 error checking
			if (PrecAppUtils.isNull(shortcode))
				shortcode="EN";
				
			// #2 if the user has set Kilngon as a language , but Klingon not available for this event!!
			var langFoundInSet = false; // prove true

			for (var i=0;i<Localisation.AVAILABLE_LANGUAGES.length;i++)
			{	
				var langToGet = Localisation.AVAILABLE_LANGUAGES[i].shortcode.toUpperCase();

				if (langToGet==shortcode.toUpperCase())
					langFoundInSet=true;
			}

			if (!langFoundInSet)
				shortcode="EN";
		}

		Localisation.setLanguageFromShortcode(shortcode);
		localisationComplete();
	},
	
	// sets the current language according to user options
	setLanguageFromShortcode:function(shortcode)
	{
		window.localStorage.setItem('languageShortcode', shortcode);
		
		for (var i=0;i<Localisation.AVAILABLE_LANGUAGES.length;i++)
		{
			var currentShortcode = Localisation.AVAILABLE_LANGUAGES[i].shortcode;
			
			if (shortcode.toUpperCase()==currentShortcode.toUpperCase())
			{	
				Localisation.CURRENT_LANGUAGE=Localisation.AVAILABLE_LANGUAGES[i];
				return;
			}
		}
		
		//default to English in case for some reason there is no match
		Localisation.CURRENT_LANGUAGE = Localisation.AVAILABLE_LANGUAGES[0];
	},
	
	setCurrentLanguage:function(lang)
	{
		Localisation.CURRENT_LANGUAGE=lang;
	},
	
	getShortcode:function()
	{
		return Localisation.CURRENT_LANGUAGE.shortcode.toUpperCase();
	},
	
	// UI label gets
	getStr:function(label, forceEnglish)
	{
		label = label.toUpperCase();
		
		if (forceEnglish) // we can force it to search for English strings from the UI
		{
			var englishLanguageSet = [];
			
			for (var i=0;i<Localisation.AVAILABLE_LANGUAGES.length;i++)
			{
				var currentShortcode = Localisation.AVAILABLE_LANGUAGES[i].shortcode;

				if (currentShortcode.toUpperCase()=="EN")
				{
					englishLanguageSet=Localisation.AVAILABLE_LANGUAGES[i];
				}
			}
			
			for (var i = 0;i<englishLanguageSet.strings.length;i++)
			{
				var name = englishLanguageSet.strings[i].name;

				if (label==name.toUpperCase())
				{
					var value = englishLanguageSet.strings[i].value;
					return value;
				}
			}			
		}
		else
		{
			for (var i = 0;i<Localisation.CURRENT_LANGUAGE.strings.length;i++)
			{
				var name = Localisation.CURRENT_LANGUAGE.strings[i].name;

				if (label==name.toUpperCase())
				{
					var value = Localisation.CURRENT_LANGUAGE.strings[i].value;
					return value;
				}
			}
		}
		
		// default will return the original Localisation search string as uppercase
		return label;
	}
}
