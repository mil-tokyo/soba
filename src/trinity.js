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
				x_range: [$M.min(x), $M.max(x)],
				y_range: [$M.min(y), $M.max(y)],
				show: this._show_plot
			})
		},

		scatter: function(x, y, color) {
			this.data.push({
				data: [x.clone(), y.clone(), color],
				x_range: [$M.min(x), $M.max(x)],
				y_range: [$M.min(y), $M.max(y)],
				show: this._show_scatter
			})
		},

		contourDesicionFunction: function(x_min, x_max, y_min, y_max, func){
			this.data.push({
				data: [x_min, x_max, y_min, y_max, func],
				x_range: [x_min, x_max],
				y_range: [y_min, y_max],
				show: this._show_contourDecisionFunction
			});
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
			var x_range_init = this.x_range, y_range_init = this.y_range;
			var x_range = null, y_range = null;
			data.forEach(function(d) {
				if (d.x_range) {
					if (x_range) {
						if (!x_range_init || x_range_init[0]===null) x_range[0] = Math.min(x_range[0], d.x_range[0]);
						if (!x_range_init || x_range_init[1]===null) x_range[1] = Math.max(x_range[1], d.x_range[1]);
					} else {
						if (x_range_init) {
							x_range = [x_range_init[0]!==null ? x_range_init[0] : d.x_range[0], x_range_init[1]!==null ? x_range_init[1] : d.x_range[1]];
						} else {
							x_range = d.x_range;
						}
					}
				}
				if (d.y_range) {
					if (y_range) {
						if (!y_range_init || y_range_init[0]===null) y_range[0] = Math.min(y_range[0], d.y_range[0]);
						if (!y_range_init || y_range_init[1]===null) y_range[1] = Math.max(y_range[1], d.y_range[1]);
					} else {
						if (y_range_init) {
							y_range = [y_range_init[0]!==null ? y_range_init[0] : d.y_range[0], y_range_init[1]!==null ? y_range_init[1] : d.y_range[1]];
						} else {
							y_range = d.y_range;
						}
					}
				}
			});
			y_range[1] = [y_range[0], y_range[0] = y_range[1]][0]; // Swap

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

		_show_contourDecisionFunction: function(data, xScale, yScale){
			var decisionFunction = data[4], x_min = data[0], x_max = data[1], y_min = data[2], y_max = data[3];
			var x_bins = 100, y_bins = 100;
			var mesh = new Array(x_bins);
			var mesh_min = null, mesh_max = null;
			for (var ix=0 ; ix<x_bins ; ix++) {
				mesh[ix] = new Array(y_bins);
				for (var iy=0 ; iy<y_bins ; iy++) {
					var x = x_min + (x_max-x_min)*ix/x_bins;
					var y = y_min + (y_max-y_min)*iy/y_bins;
					var val = decisionFunction(x, y);
					mesh[ix][iy] = val;
				}
			}
			var level = 0; // tmp

			function index2location(_ix, _iy) {
				return [x_min + (x_max-x_min)*_ix/x_bins, y_min+(y_max-y_min)*_iy/y_bins];
			}

			// Scan and draw lines
			for (var ix=0 ; ix<x_bins-1 ; ix++) {
				for (var iy=0 ; iy<y_bins-1 ; iy++) {
					var points = [];
					for (var k=0 ; k<4 ; k++) {
						var p0, p1;
						switch (k) {
							case 0: // Top
							p0 = index2location(ix, iy);   p0.push(mesh[ix][iy]);   p1 = index2location(ix+1,iy); p1.push(mesh[ix+1][iy]); break;
							case 1: // Left
							p0 = index2location(ix, iy);   p0.push(mesh[ix][iy]);   p1 = index2location(ix,iy+1); p1.push(mesh[ix][iy+1]); break;
							case 2: // Right
							p0 = index2location(ix+1, iy); p0.push(mesh[ix+1][iy]); p1 = index2location(ix+1,iy+1); p1.push(mesh[ix+1][iy+1]); break;
							case 3: // Bottom
							p0 = index2location(ix, iy+1); p0.push(mesh[ix][iy+1]); p1 = index2location(ix+1,iy+1); p1.push(mesh[ix+1][iy+1]); break;
						}
						if ((p0[2]-level) * (p1[2]-level) < 0) {
							var offset = (level-p0[2])/(p1[2]-p0[2]);
							var x = p0[0] + (p1[0]-p0[0])*offset;
							var y = p0[1] + (p1[1]-p0[1])*offset;
							points.push([x,y]);
						}
					}

					if (points.length == 2) {
						var line = d3.svg.line()
						.x(function(d){
							return xScale(d[0]);
						})
						.y(function(d){
							return yScale(d[1]);
						})
						.interpolate('linear');

						var path = this.svg.append('path')
						.datum(points)
						.attr('d', line)
						.attr('fill', 'none')
						.attr('stroke', 'black')
						.attr('stroke-width', 2);
					}
				}
			}
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

})(AgentSmith.Matrix);