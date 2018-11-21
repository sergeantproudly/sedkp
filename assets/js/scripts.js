var __widthMobile = 1000;
var __widthMobileTablet = 1000;
var __widthMobileTabletMiddle = 760;
var __widthMobileSmall = 540;
var __isMobile = ($(window).width() <= __widthMobile);
var __isMobileTablet = ($(window).width() <= __widthMobileTablet);
var __isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
var __isMobileSmall = ($(window).width() <= __widthMobileSmall);
var __animationSpeed = 350;

function initElements(element) {
	$element=$(element ? element : 'body');

	$(window).on('resize',function(){
		onResize();
	});

	$.widget('app.selectmenu', $.ui.selectmenu, {
		_drawButton: function() {
		    this._super();
		    var selected = this.element
		    .find('[selected]')
		    .length,
		        placeholder = this.options.placeholder;

		    if (!selected && placeholder) {
		      	this.buttonItem.text(placeholder).addClass('placeholder');
		    } else {
		    	this.buttonItem.removeClass('placeholder');
		    }
		}
	});

	$.datepicker.regional['ru']={
           closeText: 'Закрыть',
           prevText: '&#x3c;Пред',
           nextText: 'След&#x3e;',
           currentText: 'Сегодня',
           monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
           monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
           dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
           dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
           dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
           weekHeader: 'Нед',
           dateFormat: 'dd.mm.yy',
           firstDay: 1,
           isRTL: false,
           showMonthAfterYear: false,
           yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);

	$element.find('select').each(function(i, select) {
		// editable select
		if ($(select).attr('editable')) {
			$(select).editableSelect({ 
				effects: 'fade',
				source: $(select).attr('source') ? $(select).attr('source') : false
			}).on('change.editable-select', function(e) {
				var $holder = $(e.target).closest('.input-holder');
				if ($holder.find('.es-input').val()) {
					$(e.target).closest('.input-holder').addClass('focused');
				} else {
					$(e.target).closest('.input-holder').removeClass('focused');
				}
			});

		// simple select
		} else {
			var offset = $(select).attr('data-offset');
			if ($(select).attr('data-pos') == 'right') {
				var data = {
					position: {my : "right"+(offset?"+"+offset:"")+" top-2", at: "right bottom"}
				}
			} else {
				var data = {
					position: {my : "left"+(offset?"+"+offset:"")+" top-2"}
				}
			}
			if ($(select).attr('placeholder')) {
				data['placeholder'] = $(select).attr('placeholder');
			}
			data['change'] = function(e, ui) {
				$(ui.item.element).closest('.input-holder').addClass('focused');
			}
			$(select).selectmenu(data);
			if ($(select).attr('placeholder')) {
				$(select).prepend('<option value="" disabled selected>' + data['placeholder'] + '</option>');
			}
		}
	});

	$element.find('.js-date').each(function(index,input){
		var datepicker_options = {
			inline: true,
			language: 'ru',
		    changeYear: true,
		    changeMonth: true,
		    showOtherMonths: true
		};
		var minYear=$(input).attr('data-min-year');
		if(minYear) datepicker_options.minDate='01.01.'+minYear;
		else minYear='c-10';
		var maxYear=$(input).attr('data-max-year');
		if(maxYear) datepicker_options.maxDate='01.01.'+maxYear;
		else maxYear='c+10';
		var defaultDate=$(input).attr('data-default-date');
		if(defaultDate) datepicker_options.defaultDate=defaultDate;
		datepicker_options.yearRange=[minYear,maxYear].join(':');
		
		$(input).attr('type','text').datepicker(datepicker_options).addClass('date').val($(input).attr('value')).after('<i></i>');
		$(input).next('i').click(function() {
			$(this).prev('input').datepicker('show');
			initElements($('#ui-datepicker-div'));
		});
	});

	$element.find('input[type="checkbox"], input[type="radio"]').checkboxradio(); 

	$element.find('.modal-close, .close-btn, .modal .cancel').click(function() {
		hideModal(this);
	});

	$element.find('.tabs, .js-tabs').lightTabs();

	$element.find('.js-scroll').each(function(index, block) {
		if ($(block).attr('data-max-height') && $(block).outerHeight() > $(block).attr('data-max-height')) {
			$(block).css('max-height', $(block).attr('data-max-height') + 'px').jScrollPane({
					showArrows: false,
					mouseWheelSpeed: 20
				}
			);
		}
	});

	$('body').mouseup(function(e) {
		if ($('.modal-fadeout').css('display') == 'block' && !$('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.contents').length && !$(e.target).closest('.ui-selectmenu-menu').length) {
				hideModal();
			}
		}
		if ($('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.menu-holder').length) {
				$('nav .close').click();
			}
		}

	}).keypress(function(e){
		if ($('.modal-fadeout').css('display') == 'block') {
			if (!e)e = window.event;
			var key = e.keyCode||e.which;
			if (key == 27){
				hideModal();
			} 
		}
		if ($('html').hasClass('html-mobile-opened')) {
			if (!e)e = window.event;
			var key = e.keyCode||e.which;
			if (key == 27){
				$('nav .close').click();
			}
		}
	});

	$element.find('.input-holder input').keydown(function() {
		if ($(this).val()) {
			$(this).parent('.input-holder').addClass('focused');
		}
	}).keyup(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).focusout(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).each(function(i, item) {
		if ($(item).val()) {
			$(item).parent('.input-holder').addClass('focused');
		}
	});

	$element.find('textarea.js-autoheight').each(function(i, textarea) {
		if (!$(textarea).data('autoheight-inited')) {
			$(textarea).attr('rows', 1);
			$(textarea).on('input', function() {
				$(this).css('height', 'auto');
        		$(this).css('height', $(this)[0].scrollHeight+'px');
			});
			if ($(textarea).css('display') != 'none') $(textarea).trigger('input');
			$(textarea).data('autoheight-inited', true);
		}
	});

	fadeoutInit();
}
function onResize() {
	__isMobile = ($(window).width() <= __widthMobile);
	__isMobileTablet = ($(window).width() <= __widthMobileTablet);
	__isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);

	fadeoutInit();
}

function parseUrl(url) {
	if (typeof(url) == 'undefined') url=window.location.toString();
	var a = document.createElement('a');
	a.href = url;

	var pathname = a.pathname.match(/^\/?(\w+)/i);	

	var parser = {
		'protocol': a.protocol,
		'hostname': a.hostname,
		'port': a.port,
		'pathname': a.pathname,
		'search': a.search,
		'hash': a.hash,
		'host': a.host,
		'page': pathname?pathname[1]:''
	}		

	return parser;
} 

function showModal(modal_id) {
	var $modal = $('#' + modal_id);
	$('.modal-fadeout').stop().fadeIn(300);
	$modal.stop().fadeIn(450).css({
		'display': __isMobileTablet ? 'block' : 'table',
		'top': $(window).scrollTop()
	});

	var oversize = $(window).height() < $modal.find('.contents').outerHeight();

	if ($modal.attr('data-long') || oversize) {
		$('html').addClass('html-modal-long');
	} else {
		$('html').addClass('html-modal');
	}

	//initElements($modal);
}

function hideModal(sender) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper[display!="none"]');
	$('.modal-fadeout').stop().fadeOut(300);
	$modal.stop().fadeOut(450, function() {
		$('html').removeClass('html-modal html-modal-long');
	});
}

function fadeoutInit(node) {
	$node = $(typeof(node) == 'undefined' ? 'body' : node);
	$node.find('.js-fadeout').each(function(i, block) {
		if (!$(block).data('inited')) {
			var $holder = $('<div class="fadeout-holder"></div>').insertAfter($(block));
			$holder.html($(block));
			$(block).data('inited', true);
		}

		if (typeof($(block).attr('data-nowrap')) != 'undefined' && $(block).attr('data-nowrap') != false) {
			$(block).addClass('nowrap');
		}
		$(block).scrollLeft(0);
		var w_child = 0;
		var range = document.createRange();

		$.each(block.childNodes, function(i, node) {
			if (node.nodeType != 3) {
				w_child += $(node).outerWidth(true);
			} else {
				if (typeof(range) != 'undefined') {
					range.selectNodeContents(node);
					var size = range.getClientRects();
					if (typeof(size) != 'undefined' && typeof(size[0]) != 'undefined' && typeof(size[0]['width'] != 'undefined')) w_child += size[0]['width'];
				}
			}
		});

		var maxWidth = $(block).attr('data-max-width');
		var cloneWidth = $(block).attr('data-clone-width');
		var mobileOnly = $(block).attr('data-mobile-only');

		if (!mobileOnly || (mobileOnly && __isMobileTablet)) {
			if (cloneWidth) {
				$(block).width($(cloneWidth).width());
			}
			var holderWidth = $(block).width();
			if (w_child > holderWidth && (!maxWidth || $(window).width() <= maxWidth)) {
				$(block).addClass('fadeout').removeClass('nowrap').swipe({
					swipeLeft: function(event, direction, distance) {
						var scroll_value = $(this).scrollLeft();
						var scroll_max = $(this).prop('scrollWidth') - $(this).width();
						var scroll_value_new = scroll_value - 0 + distance;
						$(this).stop().animate({
							scrollLeft: '+' + distance
						}, __animationSpeed, 'easeInOutQuart');
						if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
						else $(this).removeClass('scrolled-full')
					},
					swipeRight: function(event, direction, distance) {
						var scroll_value = $(this).scrollLeft();
						$(this).stop().animate({
							scrollLeft: '-' + distance
						}, __animationSpeed, 'easeInOutQuart');
						$(this).removeClass('scrolled-full');
					},
					threshold: 25
				});
			} else {
				$(block).removeClass('fadeout');
			}
		}
	});
}

function getOffsetSum(elem) {
	var t = 0, l = 0;
	while (elem) {
		t += t + parseFloat(elem.offsetTop);
		l += l + parseFloat(elem.offsetLeft);
		elem = elem.offsetParent;
	}
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect();
	var body = document.body;
	var docElem = document.documentElement;
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	var clientTop = docElem.clientTop || body.clientTop || 0;
	var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	var t  = box.top +  scrollTop - clientTop;
	var l = box.left + scrollLeft - clientLeft;
	return {top: Math.round(t), left: Math.round(l)};
}
function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		return getOffsetRect(elem);
	} else {
		return getOffsetSum(elem);
	}
}

// Animated scroll to target
function _scrollTo(target, offset) {
	var wh = $(window).height();
	if (typeof(offset) == 'undefined') offset = -Math.round(wh / 2);
	else if (offset === false) offset=0;
	$('html,body').animate({
		scrollTop: $(target).offset().top + offset
	}, 1000);
}

(function ($) {
	$.fn.lightTabs = function() {
		var showTab = function(tab, saveHash) {
			if (!$(tab).hasClass('tab-act')) {
				var tabs = $(tab).closest('.tabs');

				var target_id = $(tab).attr('href');
		        var old_target_id = $(tabs).find('.tab-act').attr('href');
		        $(target_id).show();
		        $(old_target_id).hide();
		        $(tabs).find('.tab-act').removeClass('tab-act');
		        $(tab).addClass('tab-act');

		        if (typeof(saveHash) != 'undefined' && saveHash) history.pushState(null, null, target_id);
			}
		}

		var initTabs = function() {
            var tabs = this;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();

                	showTab(this, true);
                	fadeoutInit();

                	return false;
                });
                if (i == 0) showTab(tab);                
                else $($(tab).attr('href')).hide();
            });			
        };

        return this.each(initTabs);
    };

	$(function () {
		initElements();
		onResize();

		// CHECK HASH FOR TABS
		var url_data = parseUrl();
		$('.tabs, .js-tabs').find('a').each(function(i, link) {
			if (url_data.hash == $(link).attr('href')) {
				$(link).click();
			}
		});

		// BURGER
		$('nav').click(function() {
			if (!$('html').hasClass('html-mobile-opened')) {
				if (!$(this).children('.close').data('inited')) {
					$(this).children('.close').click(function(e) {
						e.stopPropagation();
						$('html').removeClass('html-mobile-opened html-mobile-long');
						$('.modal-fadeout').stop().fadeOut(300);
					}).data('inited', true);				
				}

				$('html').addClass('html-mobile-opened');

				if ($(this).children('ul').outerHeight() > $(window).height()) {
					$('html').addClass('html-mobile-long');
				} else {
					$('html').removeClass('html-mobile-long');
				}

				$('.modal-fadeout').stop().fadeIn(300);
			}
		});

		// HEADER SEARCH
		$('#bl-controls .search').submit(function() {
			if ($(this).find('input:text').val()) {
				return true;
			}
			return false;
		});

		// MAILER
		if ($('#projects #doc-list').length) {
			$('#projects #doc-list>ul>li>.attachment>a').click(function(e) {
				e.preventDefault();
				showModal('modal-attachments');

				if ($('#modal-attachments .modal .js-scroll').outerHeight() > $('#modal-attachments .modal .js-scroll').attr('data-max-height')) {
					$('#modal-attachments .modal .js-scroll').addClass('long');
					initElements($('#modal-attachments'));
				}
			});
		}
		if ($('#doc-body .attachments').length) {
			$('#doc-body .attachments .menu>li>a').click(function(e) {
				e.preventDefault();

				if (!$(this).parent().hasClass('active')) {
					if ($(this).attr('href') && $(this).attr('href') != '#' && $(this).hasClass('embed')) {
						PDFObject.embed($(this).attr('href'), '#doc-body .attachments #attachment-frame');
						$('#doc-body .attachments #attachment-frame').stop().slideDown(__animationSpeed);
					} else {
						$('#doc-body .attachments #attachment-frame').stop().slideUp(__animationSpeed);
					}

					$(this).parent().addClass('active').siblings('li').removeClass('active');
				}
			});
			$('#doc-body .attachments .menu>li.active').removeClass('active').children('a').click();
		}
		$('.mailer .contents-link').click(function() {
			showModal('modal-document-contents');
			if ($('#modal-document-contents .modal .js-scroll').outerHeight() > $('#modal-document-contents .modal .js-scroll').attr('data-max-height')) {
				$('#modal-document-contents .modal .js-scroll').addClass('long');
				initElements($('#modal-document-contents'));
			}
		});
		$('#action-refuse').click(function() {
			showModal('modal-comment');
		});
		if ($('#document .attachments').length) {
			$('#document .attachments .menu>li>a').click(function(e) {
				e.preventDefault();

				if (!$(this).parent().hasClass('active')) {
					if ($(this).attr('href') && $(this).attr('href') != '#' && $(this).hasClass('embed')) {
						var frameId = $(this).closest('.menu').attr('data-for');
						PDFObject.embed($(this).attr('href'), frameId);
						$(frameId).stop().slideDown(__animationSpeed);
					} else {
						$(frameId).stop().slideUp(__animationSpeed);
					}

					$(this).parent().addClass('active').siblings('li').removeClass('active');
				}
			});
			$('#document .attachments .menu>li.active').removeClass('active').children('a').click();
		}

		// SEARCH
		$('#search .forms .btn-line .do').click(function(e) {
			// FIXME DEMO
			e.preventDefault();
			e.stopPropagation();

			$('#search-results').stop().slideDown(__animationSpeed);
			_scrollTo('#search-results', 0);
		});

	})
})(jQuery)