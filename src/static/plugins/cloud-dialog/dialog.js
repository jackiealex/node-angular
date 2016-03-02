(function  () {
	var dialogIDPrefix = 'cloud-bx-dialog-';
	var dialogCount = 0;

	var dialogTemplate = [
		'<div id="" class="cloud-bx-dialog-mask">',
		'    <div class="cloud-bx-dialog">',
		'        <div class="dialog-header">',
		'            <p class="title"></p>',
		'            <button tabindex="1" class="close" title="cancel">×</button>',
		'        </div>',
		'        <div class="dialog-body">',
		'        </div>',
		'        <div class="dialog-footer">',
		// '            <button>取消</button>',
		// '            <button class="positive">确定</button>',
		'        </div>',
		'    </div>',
		'</div>',
	].join('');

	function Dialog (opts) {
		this.options = $.extend({
			title: '',
			quickClose: false,
			content: '确认要删除当前报销单模版?',
			width: 240,
			offset: {
				left: 0,
				top: 0
			},
			className: 'text-align',
			buttonAlign: 'center',
			buttons: [
				// {
				// 	text: '1',
				// 	disabled: false
				// 	handler: function  () {
				// 	}
				// }
			],
			ok: function  () {
				return true;
			},
			cancel: function  () {
				return true;
			},
			onShow: function  () {
				// body...
			},
			onHide: function  () {
				// body...
			},
			onDestroy: function  (argument) {
				
			},
			okDisabled: false,
			okValue: '确定',
			cancelDisabled: false,
			cancelValue: '取消'
		}, opts);
		this.$mask = $(dialogTemplate);
		this.$el = this.$mask.find('.cloud-bx-dialog');
		this.$title = this.$el.find('.dialog-header .title');
		this.$content = this.$el.find('.dialog-body');
		this.$footer = this.$el.find('.dialog-footer');
		this.init();
	};


	$.extend(Dialog.prototype, {
		init: function  (e) {
			// init title
			if(!this.options.title) {
				this.$title.addClass('none');
			} else {
				this.title(this.options.title);
			}

			// init content
			this.content(this.options.content);

			this.$mask.appendTo(document.body);
			this.$el.attr('id', dialogIDPrefix+dialogCount++);

			this._bindEvents();
			this.addButtons()
		},
		addButtons: function () {
			var buttons = this.options.buttons;

			if(this.options.cancel) {
				var cancelButton = {
					text: this.options.cancelValue,
					disabled: this.options.cancelDisabled,
					handler: this.options.cancel
				}
				buttons.push(cancelButton);
			}

			if(this.options.ok) {
				var okButton = {
					text: this.options.okValue,
					handler: this.options.ok,
					disabled: this.options.okDisabled,
					className: 'positive'
				}
				buttons.push(okButton);
			}

			for(var i=0;i<buttons.length;i++) {
				var button = buttons[i];
				var $button = $('<button>').text(button['text']);
				$button.addClass(button.className || '');
				if(button.disabled) {
					$button.attr('disabled', true);
					$button.attr('tabindex', i+2);
				}
				if(i==buttons.length-1) {
					$button.addClass('last')
				}
				this.$footer.append($button);
			}
		},
		show: function  () {
			this.$mask.addClass('none').show();
			this.$el.addClass('animated zoomIn')
			this.options.onShow.call(this);
			$(window).trigger('resize');
			return this;
		},
		showModal: function  () {
			this.$mask.addClass('animated fadeIn').show();
			this.$el.addClass('animated zoomIn')
			this.options.onShow.call(this);
			$(window).trigger('resize');
			return this;
		},
		close: function  (isDestroy) {
			this.$mask.hide();
			this.options.onHide.call(this);
			if(isDestroy) {
				this.$mask.remove()
				this.options.onDestroy.call(this);
			}
			return this;
		},
		desotry: function  () {
			this.$mask.remove()
			this.options.onDestroy.call(this);
			return this;
		},
		title: function (title) {
			if(title) {
				this.$el.find('.dialog-header .title').html(this.options.title);
			} else {
				return this.$el.find('.dialog-header .title').html();
			}
			return this;
		},
		content: function  (content) {
			if(content) {
				this.$el.find('.dialog-body').html(content);
			} else {
				return this.$el.find('.dialog-body').html();
			}
			return this;
		},
		_bindEvents: function  () {
			var _self = this;
			this.$el.on('click', function  (e) {
				e.stopPropagation();
			});
			this.$el.on('click', '.close', function  (e) {
				_self.close(true);
			});

			this.$el.on('click', '.dialog-footer button', function  (e) {
				var index = $(this).parent().find('button').index(e.currentTarget);
				var handler = _self.options.buttons[index].handler || function  () {
					// body...
				};
				if(handler.call(_self, e)) {
					_self.$el.find('.close').trigger('click');
				}
			});

			// can quick close
			this.$mask.on('click', function  (e) {
				_self.options.quickClose && _self.close(true);
			});

			$(document).on('keyup', function  (e) {
				//esc key
				if(e.keyCode == 27) {
					if(_self.$mask.is(':visible')) {
						_self.$el.find('.close').trigger('click');
					}
				}
				if(e.keyCode == 13) {
					_self.$footer.find('button[focus]').trigger('click');
				}
			})

			$(window).on('resize', function (e) {
				var width = window.innerWidth || document.body.clientWidth;
				var height = window.innerHeight || document.body.clientHeight;
				_self.$mask.width(width);
				_self.$mask.height(height);

				_self.$el.css({
					left: (width - _self.$el.width()) /2,
					top: (height - _self.$el.height()) /2
				})
			});
		}
	});

	window.CloudDialog = Dialog;
})()