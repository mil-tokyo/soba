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

		contourDesicionFunction: function(x_min, x_max, y_min, y_max, func, func_){
			var decision_func;
			if (typeof func === 'function') {
				decision_func = func;
				args = {};
			} else {
				decision_func = func_;
				args = func;
			}
			this.data.push({
				data: [x_min, x_max, y_min, y_max, decision_func, args],
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
			var x_min = data[0], x_max = data[1], y_min = data[2], y_max = data[3], decisionFunction = data[4], args = data[5];
			var x_bins = 100, y_bins = 100;
			var mesh = new Array(x_bins);
			var xmap = new Array(x_bins);
			var ymap = new Array(x_bins);
			var mesh_min = null, mesh_max = null;
			for (var ix=0 ; ix<x_bins ; ix++) {
				mesh[ix] = new Array(y_bins);
				xmap[ix] = new Array(y_bins);
				ymap[ix] = new Array(y_bins);
				for (var iy=0 ; iy<y_bins ; iy++) {
					var x = x_min + (x_max-x_min)*ix/x_bins;
					var y = y_min + (y_max-y_min)*iy/y_bins;
					var val = decisionFunction(x, y);
					mesh[ix][iy] = val;
					if (mesh_max===null || mesh_max < val) mesh_max = val;
					if (mesh_min===null || mesh_min > val) mesh_min = val;
					xmap[ix][iy] = x;
					ymap[ix][iy] = y;
				}
			}

			// Determine levels
			var levels;
			if (args.levels) {
				levels = args.levels;
			} else {
				var n_levels = 10;
				var levels = new Array(n_levels);
				for (var i=0 ; i<n_levels ; i++) {
					levels[i] = mesh_min + (mesh_max-mesh_min)*i/(n_levels-1);
				}
				/*
				var levels = [];
				for (var i=Math.ceil(mesh_min) ; i<=Math.floor(mesh_max) ; i++) {
					levels.push(i);
				}
				*/
			}

			// Colors
			var domain = new Array(6);
			for (var i=0 ; i<6 ; i++) {
				domain[i] = mesh_min + (mesh_max-mesh_min)*i/6;
			}
			var color = d3.scale.linear()
			.domain(domain)
			.range(["#0a0", "#6c0", "#ee0", "#eb4", "#eb9", "#fff"]);

			function findPathInGrid(edges, level) {
				var points = [];
				for (var i=0; i<edges.length; i++) {
					var i2 = (i+1)%edges.length;
					if ((edges[i][2]-level) * (edges[i2][2]-level) < 0) {
						var offset = (level-edges[i][2])/(edges[i2][2]-edges[i][2]);
						points.push([
							edges[i][0] + (edges[i2][0]-edges[i][0])*offset,
							edges[i][1] + (edges[i2][1]-edges[i][1])*offset
						]);
					}
				}
				return points;
			}

			var level = 0; // tmp
			var svg = this.svg;
			var edges = new Array(4);
			levels.forEach(function(level){
				var level_color = color(level);
				// Scan and draw lines
				for (var ix=0 ; ix<x_bins-1 ; ix++) {
					for (var iy=0 ; iy<y_bins-1 ; iy++) {
						edges[0] = [xmap[ix  ][iy  ], ymap[ix  ][iy  ], mesh[ix  ][iy  ]];
						edges[1] = [xmap[ix+1][iy  ], ymap[ix+1][iy  ], mesh[ix+1][iy  ]];
						edges[2] = [xmap[ix+1][iy+1], ymap[ix+1][iy+1], mesh[ix+1][iy+1]];
						edges[3] = [xmap[ix  ][iy+1], ymap[ix  ][iy+1], mesh[ix  ][iy+1]];

						points = findPathInGrid(edges, level);

						if (points.length == 2) {
							var line = d3.svg.line()
							.x(function(d){
								return xScale(d[0]);
							})
							.y(function(d){
								return yScale(d[1]);
							})
							.interpolate('linear');

							var path = svg.append('path')
							.datum(points)
							.attr('d', line)
							.attr('fill', 'none')
							.attr('stroke', level_color)
							.attr('stroke-width', 2);
						}
					}
				}

			});
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