// Gaussian distribution
var plt = new Soba('#contour-df-styled');
plt.contourDesicionFunction(-3, 3, -3, 3, {levels: [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.], colors: ['m','b'], linestyles: ['dashed', 'solid']}, function(x,y){
	var z = Math.exp(-(x*x+y*y)/2)/(2*Math.PI);
	return z;
});
plt.legend(['gaussian']);
plt.xlabel('x');
plt.ylabel('y');
plt.show();