/**
 *  Flexible form validator in less than 3.5 kb and 1.5 kb gzipped.
 *  By Masquerade Circus
 *  christian@masquerade-circus.net
 *  https://github.com/Masquerade-Circus/flexible-form-validator
 */
 (function ($) {
 	$.fn.FormValidator = function (o) {
 		var emptyFunction = function(){},
 		undefinedvar = []._,
 		untruth = false,
 		truth = true,
 		options = $.extend({
 				error : emptyFunction, // The error function to call on every field that has errors, the field object will be passed as this. Defaults to empty function.
 				success : emptyFunction, // The success function to call on every field that hasn't errors, the field object will be passed as this. Defaults to empty function.
 				validations : [], // Custom validations, array of field objects
 				result : emptyFunction, // Function to call on every validate event with the errors array passed as first argument. Defaults to empty function.
 				types : { // Object with custom types and its custom regex to match on every field
 					email : /^([a-z0-9]{3,}[\.|\-|\_]?)+@([a-z0-9]{3,}[\.|\-|\_]?)+(\.[a-z]{2,7})$/g,
 					password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/g,
 					date : /^\d{1,4}\W?\w{1,3}\W?\d{1,4}$/g,
 					time : /^[am|pm]*\s*([0-2]?[0-9]):([0-5][0-9])\s*[am|pm]*$/gi,
 					url : /^http[s]*\:\/\/[\w|\d|\\|-|\.]+\.(\w){2,7}(\S*)?$/g,
 					number : /^\d+$/g,
 					currency : /^(\$)?\s?(\d{1,3}(\,\d{3})*|\d+)(\.\d{2,})?$/g,
 					tel : /^(\()?\d{3}(\))?-?\s?\d{3}-?\s?\d{4}$/g
 				},
 				lang : {
 					thisField : 'This field', // Language customization
 					required : 'is required', // Language customization
 					match : 'doesn\'t match the pattern', // Language customization
 					sameAs : 'should be the same as', // Language customization
 					types : {
 						email : "isn't a valid email",
 						password : "must be at least 8 characters long and contain a number and an uppercase letter",
 						date : "isn't a valid dd/mm/yyyy date",
 						time : "isn't a valid time",
 						url : "isn't a valid url",
 						number : "must be only numbers",
 						currency : "isn't a valid currency value",
 						tel : "isn't a valid phone number"
 					}
 				},
 				onBlur : untruth, // Validate field on blur. Defaults to false.
 				onKeyup : untruth, // Validate field on key up. Defaults to false.
 				onChange : untruth, // Validate field on key up. Defaults to false.
				onFocus : untruth, // Validate field on focus. Defaults to false.
 				onSubmit : truth // Validate and prevent on submit. Defaults to true.
 			}, o);

 		return (function(){
 			var form = $(this),
 				ths = this,
 				validateField = function(errorMsgs, key){
 					var field = $.extend({
 								selector : '', // The main selector of the field element
 								required : untruth, // If the item is required or not
 								error : options.error, // The error function to call on every field that has errors, the field object will be passed as this. Defaults to options.error.
 								success : options.success, // The success function to call on every field that hasn't errors, the field object will be passed as this. Defaults to options.success.
 								sameAs : untruth, // Selector of the element that need to match
 								match : untruth, // Custom Regexp
 								name : undefinedvar, // Custom name of the field
 								matchError : undefinedvar, // Custom message on match error
 								requiredError : undefinedvar, // Custom message on required error
 								sameAsError : undefinedvar // Custom message on sameAs error
 							}, ths.fields[key]),
 						sameAs = $(field.sameAs),
 						obj = {
 							name : field.name || options.lang.thisField,
 							field : field
 						},
 						msg = obj.name + ' ',
 						val = field.element.val();

 						if (field.element.length > 0) {
							if ((field.required == true || field.required == 'required')){
								if(
									((field.type == 'radio' || field.type == 'checkbox') && $(field.selector+':checked').length == 0) ||
									(val == null || val.length <= 0)
								) {
										obj.attribute = 'required';
		 								obj.msg = msg + (field.requiredError || options.lang.required);
		 								field.error.call(field, obj);
		 								errorMsgs.push(obj);
		 								return errorMsgs;
								}
							}
 							if ((field.required == true || field.required == 'required') && (val == null || val.length <= 0)) {
 								obj.attribute = 'required';
 								obj.msg = msg + (field.requiredError || options.lang.required);
 								field.error.call(field, obj);
 								errorMsgs.push(obj);
 								return errorMsgs;
 							}
 							if (field.match !== untruth && val.search(field.match) == -1) {
 								obj.attribute = 'match';
 								obj.msg = msg + (field.matchError || options.lang.match);
 								field.error.call(field, obj);
 								errorMsgs.push(obj);
 								return errorMsgs;
 							}
 							if (sameAs.length > 0 && field.element.val() != sameAs.val()) {
 								obj.attribute = 'sameAs';
 								obj.sameAs = ths.fields[field.sameAs].name || field.sameAs;
 								obj.msg = msg + (field.sameAsError || options.lang.sameAs + ' ' + obj.sameAs);
 								field.error.call(field, obj);
 								errorMsgs.push(obj);
 								return errorMsgs;
 							}
 							field.success.call(field);
 						}
 						return errorMsgs;
 				};

 			ths.fields = {};

 			ths.validate = function(key) {
 				var errorMsgs = [],
 				i;
 				if (key != undefinedvar)
 					id = key.attr ? key.attr('id') : key, errorMsgs = validateField(errorMsgs, '#'+id);
 				else
 					for (i in ths.fields)
 						errorMsgs = validateField(errorMsgs,i);

 				options.result(errorMsgs);

 				return errorMsgs.length === 0;
 			};

 			(function(){
				if (!form[0].hasAttribute("novalidate"))
					form.attr('novalidate', 'novalidate');

 				form.find('input, select, textarea').each(function () {
 					var element = $(this),
 						id = '#' + (element.attr('id') || element.attr('id', element.attr('name') || (0 | Math.random() * 9e6).toString(36)) && element.attr('id')),
 						type = element.data('type') || element.attr('type') || 'text',
 						o = {
 							selector : id,
 							required : element.attr('required') || untruth,
							type : type,
 							sameAs : element.data('sameas') || untruth,
 							match : options.types[type] || untruth,
 							name : element.attr('title') || element.siblings('label').text() || element.attr('placeholder') || ' id: ' + id,
 							element : form.find(element),
 							matchError : element.data('matcherror') || options.lang.types[type],
 							requiredError : element.data('requirederror') || options.lang.required,
 							sameAsError : element.data('sameaserror') || options.lang.sameAs
 						},
 						pattern = element.attr('pattern') || untruth;

 					if (pattern !== untruth)
 						o.match = pattern;

 					ths.fields[o.selector] = o;

 					element.on('blur keyup change focus', function(e){
 						if (e.type == 'blur' && options.onBlur)
 							ths.validate(id.substr(1));

 						if (e.type == 'keyup' && options.onKeyup)
 							ths.validate(id.substr(1));

 						if (e.type == 'change' && options.onChange)
 							ths.validate(id.substr(1));

						if (e.type == 'focus' && options.onFocus)
	 						ths.validate(id.substr(1));
 					});

 				});

 				for (i in options.validations) {
 					var element = options.validations[i].element = form.find(options.validations[i].selector);
 					if (options.validations[i].element.length > 0) {
 						var type = options.validations[i].type || element.data('type') || element.attr('type') || 'text';
 						ths.fields[options.validations[i].selector] = $.extend({
 							required : element.attr('required') || untruth,
 							sameAs : element.data('sameas') || untruth,
 							match : options.types[type] || untruth,
 							name : element.attr('title') || element.siblings('label').text() || element.attr('placeholder') || ' id: ' + id,
 							matchError : element.data('matcherror') || options.lang.types[type],
 							requiredError : element.data('requirederror') || options.lang.required,
 							sameAsError : element.data('sameaserror') || options.lang.sameAs
 						}, options.validations[i]);
 					}
 				}

				console.log(ths.fields);

 				if (options.onSubmit)
 					form.on('submit', function () {
 						return ths.validate();
 					});
 			})();
 			return ths;
 		}).call(this);
 	};

 })(jQuery);
