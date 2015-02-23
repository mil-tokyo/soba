var data = [
	[1, 1],
	[0, 1],
	[1, 1],
	[1, 2],
	[-1, -2],
	[1, 0.1],
	[2, 2],
	[1, 2],
	[9, 7],
	[13, 10],
	[10, 7],
	[10, 8],
];

// Extract columns representing x and y
var x = new Array(), y = new Array();
data.forEach(function(d){
    x.push(d[0]); y.push(d[1]);
});

var plt = new Soba("#scatter");
plt.scatter(x, y);
plt.legend(['Scatter']);
plt.xlabel('x');
plt.ylabel('y');
plt.show();