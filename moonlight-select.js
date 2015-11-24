/*
 *
 * moonlight-select.js
 * version 0.0.2
 *
 * Plugin for creating a responsive alternative to select boxes, mostly for mobile
 * but looks good and works great on any device/browser/screensize
 *
 * author:   Caleb Nance
 * date:     10/30/2015
 * modified: 11/12/2015
 *
 * dependants: jQuery
 * basic usage:
 * $('.mlSelect').moonlightSelect();
 *
 * param defaults: (so hip)
 *
 */

(function($) {
	$.fn.moonlightSelect = function(options){
    // this
    $moonlights = $(this);

		// default settings
		var settings = $.extend({
			debug:	false
		}, options);

    // parse through moonlights
    $.each($moonlights, function(i, ml){
      $select = $(ml);
      // is multiple
      var isMulti = $select.attr('multiple');
      isMulti = (typeof isMulti !== typeof undefined && isMulti !== false) ? true : false;

      // wrap it
      $select.wrap('<div class="mlSelect-wrapper"></div>');
      $moonlight = $select.closest('.mlSelect-wrapper');
      $('<div class="mlSelect-box"><div class="mlSelect-selected"/><div class="mlSelect-arrow"><i/></div></div><div class="mlSelect-dropdown"/>').prependTo($moonlight);

			// set it, and forget it
			$dropdown = $moonlight.find('.mlSelect-dropdown');

			// fill it
			$options = $moonlight.find('option');
			// do we have options?
			if($options.length) {
				var optgroupLabel;
				$.each($options, function(o, op){
					var option 	 = $(op)[0];
					var optgroup = $(op).parent()[0];
					// need optgroup support?
					if($(optgroup).is('optgroup')) {
						// is this the first of this optgroup?
						if(optgroupLabel != $(optgroup).attr('label')) {
							// set new label
							optgroupLabel = $(optgroup).attr('label');
							// add the optgroup before it's option(s)
							$dropdown.append('<div class="mlSelect-option mlSelect-optgroup">' + optgroupLabel + '</div>');
						}
					}
					// add selected
					var addSelected = $(option).attr('selected') ? ' mlSelected' : '';
					// add option
					$dropdown.append('<div class="mlSelect-option' + addSelected + '" data-value="' + option.value + '"><span class="mlSelect-option-check"/><span class="mlSelect-option-text">' + option.text + '</span></div>');
					// add text
					if(isMulti) {

					} else {
						// if set
						if(addSelected) {
							$moonlight.find('.mlSelect-selected').html(option.text);
						}
					}
				});
			} else {
				console.log('where do we go from here?');
			}

      // functions
      $moonlight.on('click', function(e){
				$mlClick   = $(e.target);
				$mlClickDd = $(this).find('.mlSelect-dropdown');

				// if this is hidden, hide others, show this dropdown
				if($mlClickDd.is(':hidden')) {
					// hide all the others
					$('.mlSelect-dropdown').hide();
					// show current one
					$mlClickDd.fadeIn(200);
					// remove active
					$('.mlSelect-wrapper').removeClass('mlActive');
					// add active
					$(this).addClass('mlActive');
				} else {
					// else, if it's not within the dropdown, hide all.
					if ($mlClick.closest('.mlSelect-box').length) {
						// hide all the others
						$('.mlSelect-dropdown').hide();
						// remove active
						$('.mlSelect-wrapper').removeClass('mlActive');
					}
				}

				// on click of items/options
				if(
					($mlClick.hasClass('mlSelect-option')
						|| $mlClick.parent().hasClass('mlSelect-option')
						|| $mlClick.parent('.mlSelect-option').length
					)
					&& !$mlClick.hasClass('mlSelect-optgroup')) {
						$mlClickOption = $mlClick.closest('.mlSelect-option');
						$mlSelectBox   = $(this).find('select');
						// is it single select?
						if(!isMulti) {
							// clear the previously selected option (within just this select)
							$(this).find('.mlSelect-option').removeClass('mlSelected');
						}

						// set selected value
						var mlSelectedValue = $mlClickOption.attr('data-value');

						// is it selected already?
						if($mlClickOption.hasClass('mlSelected')) {
							// remove the class
							$mlClickOption.removeClass('mlSelected');
							// if it's multi
							if(isMulti) {
								// set what was just selected first
								var multiSelected = [];
								// now we add all that were already selected
								$.each($mlClickDd.find('.mlSelect-option.mlSelected'), function(s, sel){
									// as long as it's not the one we are un-selecting
									if(mlSelectedValue != $(sel).attr('data-value')) {
										// push to mutliSelected array
										multiSelected.push($(sel).attr('data-value'));
									}
								});
								// set the array for mutli select
								$mlSelectBox.val(multiSelected);
								// if lenth of array is more than 1, we want to say % items selected
								if(multiSelected.length > 1) {
									// set text of selected
									$(this).find('.mlSelect-selected').html(multiSelected.length + ' items selected');
								} else if(multiSelected.length == 0) {
									// set text of selected
									$(this).find('.mlSelect-selected').html('');
								} else {
									// set text of selected
									$(this).find('.mlSelect-selected').html(multiSelected[0]);
								}
							}
						} else {
							// add class
							$mlClickOption.addClass('mlSelected');
							// if it's multi
							if(isMulti) {
								// set what was just selected first
								var multiSelected = [];
								// now we add all that were already selected
								$.each($mlClickDd.find('.mlSelect-option.mlSelected'), function(s, sel){
									// push to mutliSelected array
									multiSelected.push($(sel).attr('data-value'));
								});
								// set the array for mutli select
								$mlSelectBox.val(multiSelected);
								// if lenth of array is more than 1, we want to say % items selected
								if(multiSelected.length > 1) {
									// set text of selected
									$(this).find('.mlSelect-selected').html(multiSelected.length + ' items selected');
								} else {
									// set text of selected
									$(this).find('.mlSelect-selected').html(multiSelected[0]);
								}
							} else {
								// set the value for selected
								$mlSelectBox.val(mlSelectedValue);
								// set text of selected
								$(this).find('.mlSelect-selected').html(mlSelectedValue);
								// hide all the others
								$('.mlSelect-dropdown').hide();
							}
						}
				}
      });

      $moonlight.mouseover(function(e){
        //console.log('mouseover');
      });

      $moonlight.mouseout(function(e){
        //console.log('mouseout');
      });

      /*
      $moonlight.blur(function(e){
        console.log('blur');
      });

      $moonlight.focus(function(e){
        console.log('focus');
      });
      */

			// document bleh
			$(document).on('click', function(e){
				// close dropdown if click is not within the .mlSelect-wrapper
				if (!$(e.target).closest('.mlSelect-wrapper').length) {
						// hide all the others
			      $('.mlSelect-dropdown').hide();
						// remove active
						$('.mlSelect-wrapper').removeClass('mlActive');
			  }
			});

      // my memories of you, now that i am clean, the matador is no more and is dragged from you

    });
	};
})(jQuery);
