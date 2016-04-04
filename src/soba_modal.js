// The MIT License (MIT)

// Copyright (c) 2014 Machine Intelligence Laboratory (The University of Tokyo)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

Soba.createModal = function(width, height, title) {
	var counter = 0;
	return function(width, height, title) {
		if (typeof title === 'undefined') title = 'AgentSmithVisualizer';

		var id = "soba_modal_" + (counter++);
		// create wrapper div and pallet div
		var wrapper_div_id = id + '_wrapper_div';
		var title_div_id = id + '_title';
		var close_span_id = id + '_close';
		$(document.body)
			.append(
				$('<div>').attr('id', wrapper_div_id).addClass('soba_modal')
				.append(
					$('<div>').attr('id', title_div_id).addClass('title').text(title)
					.append(
						$('<span>').attr('id', close_span_id).addClass('close').text('x')
					)
				)
				.append(
					$('<div>').attr('id', id).addClass('plotarea')
				)
			);
		// set css
		$('#' + id).css({
			'width' : width + 'px',
			'height' : height + 'px',
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

Soba.createModalPlot = function(width, height, title){
	if (typeof width === 'undefined') width = 320;
	if (typeof height === 'undefined') height = 240;
	return new Soba("#" + Soba.createModal(width, height, title));
};
