var Trinity = {};

(function($M){
	Trinity = function(selector) {
		this.padding = {
			left: 30,
			right: 20,
			top: 20,
			bottom: 20,
		};
		var parent = d3.select(selector);
		this.w = Trinity.getStyle(parent[0][0], 'width');
		this.h = Trinity.getStyle(parent[0][0], 'height');
		this.w = this.w.replace('px', '');
		this.h = this.h.replace('px', '');
		var svg = parent
			.append("svg")
			.attr('width', this.w)
			.attr('height', this.h)
			;
		this.svg = svg;
		this.clf();
	};

	Trinity.prototype = {
		clf: function() {
			this.data = [];
			this.svg.selectAll('*').remove();
		},

		plot: function(x, y, option) {
			this.data.push({
				data: [x.clone(),y.clone(),option],
				show: this._show_plot
			})
		},

		scatter: function(x, y, color) {
			this.data.push({
				data: [x.clone(), y.clone(), color],
				show: this._show_scatter
			})
		},

		xlim: function(x_range) {
			if (!(0 in x_range) || !(1 in x_range)) {
				throw new TypeError('x_range must be an array and contain 2 elements');
			}
			this.x_range = x_range;
		},

		ylim: function(y_range) {
			if (!(0 in y_range) || !(1 in y_range)) {
				throw new TypeError('y_range must be an array and contain 2 elements');
			}
			this.y_range = y_range;
		},

		show: function() {
			var data = this.data;

			// Determine the ranges
			var x_range = null, y_range = null;
			data.forEach(function(d){
				var x = d.data[0], y = d.data[1];
				if (x_range) {
					if (this.x_range) {
						x_range = [this.x_range[0]!==null ? this.x_range[0] : Math.min(x_range[0],$M.min(x)), this.x_range[1]!==null ? this.x_range[1] : Math.max(x_range[1],$M.max(x))];
					} else {
						x_range = [Math.min(x_range[0],$M.min(x)), Math.max(x_range[1],$M.max(x))];
					}
					if (this.y_range) {
						y_range = [this.y_range[1]!==null ? this.y_range[1] : Math.max(y_range[0],$M.max(y)), this.y_range[0]!==null ? this.y_range[0] : Math.min(y_range[1],$M.min(y))];
					} else {
						y_range = [Math.max(y_range[0],$M.max(y)), Math.min(y_range[1],$M.min(y))];
					}
				} else {
					if (this.x_range) {
						x_range = [this.x_range[0]!==null ? this.x_range[0] : $M.min(x), this.x_range[1]!==null ? this.x_range[1] : $M.max(x)];
					} else {
						x_range = [$M.min(x), $M.max(x)];
					}
					if (this.y_range) {
						y_range = [this.y_range[1]!==null ? this.y_range[1] : $M.max(y), this.y_range[0]!==null ? this.y_range[0] : $M.min(y)];
					} else {
						y_range = [$M.max(y), $M.min(y)];
					}
				}
			});

			var xScale = d3.scale.linear()
				.domain(x_range)
				.range([this.padding.left, this.w - this.padding.right]);

			var yScale = d3.scale.linear()
				.domain(y_range)
				.range([this.padding.top, this.h-this.padding.bottom]);

			var t = this;
			data.forEach(function(d){
				d.show.call(t, d.data, xScale, yScale);
			});

			this.drawAxis(xScale, yScale);
		},

		_show_plot: function(data, xScale, yScale) {
			var x = data[0], y = data[1], option = data[2];
			option = option ? option : '';
			var xArray = $M.toArray(x);

			if (option.indexOf('o') >= 0) {
				this.svg.append('g').selectAll("circle")
					.data(xArray)
					.enter()
					.append("circle")
					.attr("cx", function(d, i){
						return xScale(d);
					})
					.attr('cy', function(d, i){
						return yScale(y.get(i,0));
					})
					.attr('fill', this.parseColor(option))
					.attr('r', 2);

			}
			if (option.indexOf('-') >= 0 || option.indexOf(':') >= 0) {
				var line = d3.svg.line()
					.x(function(d, i){
						return xScale(d);
					})
					.y(function(d, i){
						return yScale(y.get(i,0));
					})
					.interpolate('linear');

				var path = this.svg.append('path')
					.datum(xArray)
					.attr('d', line)
					.attr('fill', 'none')
					.attr('stroke', this.parseColor(option))
					.attr('stroke-width', 2);

				if (option.indexOf('--') >= 0) {
					path.attr('stroke-dasharray', '5,5');
				} else if (option.indexOf('-.') >= 0) {
					path.attr('stroke-dasharray', '4,6,2,6');
				} else if (option.indexOf(':') >= 0) {
					path.attr('stroke-dasharray', '2,3');
				}
			}
		},

		_show_scatter: function(data, xScale, yScale) {
			var x = data[0], y = data[1], color = data[2];

			var color_list = d3.scale.category20();

			var xArray = $M.toArray(x);

			this.svg.append('g').selectAll("circle")
				.data(xArray)
				.enter()
				.append("circle")
				.attr("cx", function(d, i){
					return xScale(d);
				})
				.attr('cy', function(d, i){
					return yScale(y.get(i,0));
				})
				.attr('fill', function(d, i){
					return color instanceof $M ? color_list(color.get(i,0)) : color_list(1);
				})
				.attr('r', 2);
		},

		drawAxis: function(xScale, yScale) {
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.ticks(5)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.ticks(5)
				.orient("left");

			this.svg.append('g')
				.attr("class", "axis")
				.attr('transform', 'translate(0,'+(this.h-this.padding.bottom)+')')
				.call(xAxis);
			this.svg.append('g')
				.attr("class", "axis")
				.attr('transform', 'translate('+this.padding.left+', 0)')
				.call(yAxis);
		},

		parseColor: function(option) {
			if (!option) return 'blue';
			var colors = {
				b: 'blue',
				g: 'green',
				r: 'red',
				c: 'cyan',
				m: 'magenta',
				y: 'yellow',
				k: 'black',
				w: 'white'
			}
			for (var key in colors) {
				if (option.indexOf(key) >= 0) {
					return colors[key];
				}
			}
			return 'blue';
		}

	};

	/* Static methods */
	Trinity.getStyle = function(el, prop) {
		if (el.currentStyle) {
			return el.currentStyle[prop];
		} else if (window.getComputedStyle) {
			return document.defaultView.getComputedStyle(el, null).getPropertyValue(prop);
		}
		return null;
	}
	
	Trinity.createModal = function(width, height, title) {
		var counter = 0;
		return function(width, height, title) {
			if (typeof title === 'undefined') title = 'AgentSmithVisualizer';

			var id = "visualizer_" + (counter++);
			// create wrapper div and pallet div
			var wrapper_div_id = id + '_wrapper_div';
			var title_div_id = id + '_title';
			var close_span_id = id + '_close';
			$(document.body).append($('<div>').attr('id', wrapper_div_id).html('\
				<div id="' + title_div_id + '">'+ title +'<span id="' + close_span_id + '">x</span></div>\
				<div id="'+ id + '"></div>\
				'));
			// set css
			$('#' + wrapper_div_id).css({
				'border' : '1px solid #aaa',
				'position' : 'absolute',
				'z-index' : '9999'
			});
			$('#' + title_div_id).css({
				'background-color' : '#fdc',
				'position' : 'relative',
				'cursor' : 'move'
			});
			$('#' + close_span_id).css({
				'cursor' : 'pointer',
				'right' : '0',
				'margin' : '0',
				'position' : 'absolute',
			});
			$('#' + id).css({
				'width' : width + 'px',
				'height' : height + 'px',
				'background-color' : 'white'
			});

			var wx, wy;
			wx = $(document).scrollLeft() + ($(window).width() - $('#' + wrapper_div_id).outerWidth()) / 2;
			if (wx < 0) wx = 0;
			wy = $(document).scrollTop() + ($(window).height() - $('#' + wrapper_div_id).outerHeight()) / 2;
			if (wy < 0) wy = 0;
			$('#' + wrapper_div_id).css({ top: wy, left: wx });
			$('#' + close_span_id).click(function() {$('#' + wrapper_div_id).fadeOut(100);});
			$('#' + title_div_id).mousedown(function(e) {
				var mx = e.pageX;
				var my = e.pageY;
				$(document).on('mousemove.' + wrapper_div_id, function(e) {
					wx += e.pageX - mx;
					wy += e.pageY - my;
					$('#' + wrapper_div_id).css({top: wy, left: wx});
					mx = e.pageX;
					my = e.pageY;
					return false;
				}).one('mouseup', function(e) {
					$(document).off('mousemove.' + wrapper_div_id);
				});
				return false;
			});
			return id;
		};
	}();

	Trinity.createModalPlot = function(width, height, title){
		if (typeof width === 'undefined') width = 320;
		if (typeof height === 'undefined') height = 240;
		return new Trinity("#" + Trinity.createModal(width, height, title));
	};


})(AgentSmith.Matrix);