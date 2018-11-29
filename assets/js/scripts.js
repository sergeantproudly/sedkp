var __widthMobile = 1000;
var __widthMobileTablet = 1000;
var __widthMobileTabletMiddle = 850;
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
		if (typeof($(select).attr('editable')) != 'undefined' && $(select).attr('editable') !== 'false') {
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
			if ($(select).offset().left + 370 > $(window).width()) {
				$(select).attr('data-pos', 'right');
			}

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
			data['appendTo'] = $(select).parent();
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
			//initElements($('#ui-datepicker-div'));
		});
	});

	$element.find('input[type="checkbox"], input[type="radio"]').checkboxradio(); 

	$element.find('.modal-close, .close-btn, .modal .js-cancel').click(function(e) {
		e.preventDefault();
		e.stopPropagation();

		if ($element.find('.modal-wrapper:visible').length > 1) {
			$element.find('.modal-wrapper[data-transparent]').stop().animate({'opacity': 1}, __animationSpeed);
			hideModal(this, true);
		} else {
			hideModal(this, false);
		}
	});

	$element.find('.tabs, .js-tabs').lightTabs();

	$element.find('.js-scroll').each(function(index, block) {
		if (!$(block).attr('data-on-demand')) {
			scrollInit(block);
		}
	});

	$('body').mouseup(function(e) {
		if ($('.modal-fadeout').css('display') == 'block' && !$('html').hasClass('html-mobile-opened')) {
			if (!$(e.target).closest('.contents').length && !$(e.target).closest('.ui-selectmenu-menu').length && !$(e.target).closest('.ui-datepicker').length) {
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

function showModal(modal_id, dontHideOthers) {
	var $modal = $('#' + modal_id);

	if (typeof(dontHideOthers) == 'undefined' || !dontHideOthers) $('.modal-wrapper:visible').not($modal).attr('data-transparent', true).stop().animate({'opacity': 0}, __animationSpeed);

	$('.modal-fadeout').stop().fadeIn(300);
	$modal.stop().fadeIn(450).css({
		'display': __isMobileTablet ? 'block' : 'table',
		'top': $(window).scrollTop()
	});

	var oversize = $(window).height() < $modal.find('.contents').outerHeight();

	if ($modal.attr('data-long') || oversize) {
		//$('html').addClass('html-modal-long');
	} else {
		$('html').addClass('html-modal');
	}

	$modal.find('.js-scroll').each(function(index, block) {
		scrollInit(block);
	});
}

function hideModal(sender, onlyModal) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper:visible');
	if (typeof(onlyModal) == 'undefined' || !onlyModal) {
		$('.modal-fadeout').stop().fadeOut(300);
		$modal.stop().fadeOut(450, function() {
			$('html').removeClass('html-modal html-modal-long');
		});
	} else {
		$modal.stop().fadeOut(450);
	}
}
function showModalConfirm(header, btn, action) {
	if (typeof(header) != 'undefined' && header) $('#modal-confirm>.modal>.contents>h1').text(header);
	if (typeof(btn) != 'undefined' && btn) $('#modal-confirm-action-btn').text(btn);
	if (typeof(action) == 'function') {
		$('#modal-confirm-action-btn').click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			action();
			hideModal(this, $('.modal-wrapper:visible').length > 1);
		});
	}
	showModal('modal-confirm', true);
}

function scrollInit(block) {
	if (!$(block).data('inited')) {
		var maxHeight = $(block).attr('data-max-height');
		if (maxHeight < 0) maxHeight = $(block).parent().height() - Math.abs(maxHeight);
		if (maxHeight && $(block).outerHeight() > maxHeight) {
			$(block).css('max-height', maxHeight + 'px').jScrollPane({
					showArrows: false,
					mouseWheelSpeed: 20,
					autoReinitialise: true
				}
			);
		}
		$(block).data('inited', true);
	}
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

function editableSelectReinit(select) {
	if (typeof(select) == 'string') var $select = $('#' + select);
	else $select = $(select);

	var id = $select.attr('id');
	$('#' + id + '_es').remove();
	$select.data('editable-select', false);
	$select.editableSelect({ 
		effects: 'fade',
		source: $select.attr('source') ? $select.attr('source') : false
	}).on('change.editable-select', function(e) {
		var $holder = $(e.target).closest('.input-holder');
		if ($holder.find('.es-input').val()) {
			$(e.target).closest('.input-holder').addClass('focused');
		} else {
			$(e.target).closest('.input-holder').removeClass('focused');
		}
	});
	$('#' + id + '_input').show();
	return true;
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

            $(tabs).swipe({
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
				$('header .menu-holder').scrollTop(0).find('.close').stop().show();

				if ($(this).children('ul').outerHeight() > $(window).height()) {
					$('html').addClass('html-mobile-long');
				} else {
					$('html').removeClass('html-mobile-long');
				}

				$('.modal-fadeout').stop().fadeIn(300);
			}
		});
		$('header .menu-holder').swipe({
			swipeDown: function(event, direction, distance) {
				if (__isMobile && $('html').hasClass('html-mobile-opened')) {
					var scrollValue = $(this).scrollTop() - distance;

					$(this).stop().animate({
						scrollTop: '-' + distance
					}, __animationSpeed, 'easeInOutQuart');

					if (scrollValue <= 0) {
						$('#menu-main>.close').stop().fadeIn(__animationSpeed*0.3);
					}
				}				
			},
			swipeUp: function(event, direction, distance) {
				if (__isMobile && $('html').hasClass('html-mobile-opened')) {
					var scrollValue = $(this).scrollTop() - 0 + distance;

					$(this).stop().animate({
						scrollTop: '+' + distance
					}, __animationSpeed, 'easeInOutQuart');

					if (scrollValue > 0) {
						$('#menu-main>.close').stop().fadeOut(__animationSpeed*0.3);
					}
				}		
			},
			threshold: 25
		});

		// MAILER
		if ($('#doc-list').length) {
			$('#doc-list>ul>li>.attachment>a').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				showModal('modal-attachments');

				if ($('#modal-attachments .modal .js-scroll').outerHeight() > $('#modal-attachments .modal .js-scroll').attr('data-max-height')) {
					$('#modal-attachments .modal .js-scroll').addClass('long');
					initElements($('#modal-attachments'));
				}
			});

			// FIXME DEMO
			$('#doc-list>ul>li>h3>a').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			$('#doc-list>ul>li').click(function() {
				if (!$(this).hasClass('active')) {
					$(this).addClass('active').siblings().removeClass('active');
				}

				if (__isMobileTabletMiddle) {
					$('.mailer .cols-holder>.side-col').hide();
					$('.mailer').addClass('nopadd');
					$('.mailer .bread-crumbs').stop().slideUp(__animationSpeed);
					$('.mailer .header-holder').stop().slideUp(__animationSpeed)
					$('.mailer .cols-holder>.main-col').show();
					history.pushState(null, null, '#' + $(this).children('h3').text());
					$('.mailer').data('mobile-main-triggered', true);
				}
			});

			// FIXME DEMO MOBILE
			window.addEventListener('popstate', function(e) {
				if (__isMobileTabletMiddle && $('.mailer').data('mobile-main-triggered')) {
					$('.mailer').removeClass('nopadd');
					$('.mailer .bread-crumbs').stop().slideDown(__animationSpeed).next('.holder').stop().slideDown(__animationSpeed);
					$('.mailer .cols-holder>.side-col').show();
					$('.mailer .cols-holder>.main-col').hide();
					$('.mailer').data('mobile-main-triggered', false);
				}
			});

		}
		if ($('#doc-body .attachments').length) {
			if (!PDFObject.supportsPDFs) {
				$('#doc-body .attachments .menu>li>a.embed').removeClass('embed');
				$('#doc-body .attachments').append('<div class="pdf-warning">Ваш браузер не поддерживает просмотр PDF-файлов</div>');
			}

			$('#doc-body .attachments .menu>li>a.embed').click(function(e) {
				e.preventDefault();
				e.stopPropagation();

				if (!$(this).parent().hasClass('active')) {
					if ($(this).attr('href') && $(this).attr('href') != '#' && $(this).hasClass('embed')) {
						var res = PDFObject.embed($(this).attr('href'), '#doc-body .attachments #attachment-frame');
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
			$('#document .attachments .menu>li>a.embed').click(function(e) {
				e.preventDefault();
				e.stopPropagation();

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

		// PLAN
		if ($('#doc-body .plan').length) {
			$('#plan-add-item').click(function() {
				showModal('modal-manage-plan-item');
			});

			// FIXME
			$('#plan-edit-item').click(function() {
				showModal('modal-manage-plan-item');
			});

			// FIXME
			$('#plan-delete-item').click(function() {
				$('#doc-body .plan .plan-table input:checkbox:checked').each(function(index, item) {
					showModalConfirm('Вы уверены, что хотите удалить записи?', 'Удалить', function() {
						$(item).closest('tr').stop().slideUp(__animationSpeed, function() {
							$(this).remove();
						});
					});
				});
			});

			$('#doc-body .plan .plan-table input:checkbox').change(function() {
				if ($('#doc-body .plan .plan-table input:checkbox:checked').length) {
					$('#plan-edit-item, #plan-delete-item').removeAttr('disabled');
				} else {
					$('#plan-edit-item, #plan-delete-item').attr('disabled', true);
				}
			});

			$('#add-plan-item-add-responsible').click(function() {
				showModal('modal-add-responsible');
			});
			$('#add-plan-item-responsible-list>li .action-remove').click(function() {
				var that = this;
				showModalConfirm('Вы уверены, что хотите удалить запись?', 'Удалить', function() {
					$(that).closest('li').stop().fadeOut(__animationSpeed*0.5, function() {
						$(that).remove();
					});
				});		
			});

			$('#add-plan-item-add-executors').click(function() {
				showModal('modal-add-executors');
			});
			$('#add-plan-item-executors-list>li .action-remove').click(function() {
				var that = this;
				showModalConfirm('Вы уверены, что хотите удалить запись?', 'Удалить', function() {
					$(that).closest('li').stop().fadeOut(__animationSpeed*0.5, function() {
						$(that).remove();
					});
				});	
			});

			$('#doc-body .plan').swipe({
				swipeLeft: function(event, direction, distance) {
					$(this).stop().animate({
						scrollLeft: '+' + distance
					}, __animationSpeed, 'easeInOutQuart');
					$(this).addClass('scrolled-touched');
				},
				swipeRight: function(event, direction, distance) {
					var scroll_value = $(this).scrollLeft() - distance;
					$(this).stop().animate({
						scrollLeft: '-' + distance
					}, __animationSpeed, 'easeInOutQuart');
					if (scroll_value <= 0) $(this).removeClass('scrolled-touched');
				},
				swipeUp: function(event, direction, distance) {
					var scroll_top_max = $(this)[0].scrollHeight - $(this).outerHeight();
					var scroll_value = $(this).scrollTop() - 0 + distance;

					if (scroll_value <= scroll_top_max) {
						$(this).stop().animate({
							scrollTop: '+' + distance
						}, __animationSpeed, 'easeInOutQuart');
					} else {
						$('#layout').stop().animate({
							scrollTop: '+' + distance
						}, __animationSpeed);
					}
				},
				swipeDown: function(event, direction, distance) {
					var scroll_value = $(this).scrollTop() - distance;

					if (scroll_value >= 0) {
						$(this).stop().animate({
							scrollTop: '-' + distance
						}, __animationSpeed, 'easeInOutQuart');
					} else {
						$('#layout').animate({
							scrollTop: '-' + distance
						}, __animationSpeed);
					}
				},
				threshold: 25
			});
		}

		function filterActorsList(keyword, $actorsList) {
			var tid;
			if (tid) clearTimeout(tid);
            tid = setTimeout(function() {
               	if (keyword) {
               		$actorsList.children('li').each(function(index, li) {
	                   	var name = $(li).children('label').text().toLowerCase();
	                   	if (name.indexOf(keyword) + 1) {
		                    $(li).show();
		                } else {
		                    $(li).hide();
		                }
	                });
               	} else {
               		$actorsList.children('li:hidden').show();
               	}
            }, 400);
		}

		if ($('#modal-add-responsible').length) {			
			$('#add-responsible-keyword').on('focusout keyup change', function() {
				filterActorsList($('#add-responsible-keyword').val().toLowerCase(), $('#modal-add-responsible .actors-list'));
			});
			filterActorsList($('#add-responsible-keyword').val().toLowerCase(), $('#modal-add-responsible .actors-list'));
		}

		if ($('#modal-add-executors').length) {			
			$('#add-executors-keyword').on('focusout keyup change', function() {
				filterActorsList($('#add-executors-keyword').val().toLowerCase(), $('#modal-add-executors .actors-list'));
			});
			filterActorsList($('#add-executors-keyword').val().toLowerCase(), $('#modal-add-executors .actors-list'));
		}

	})
})(jQuery)