// Gaussian distribution
var plt = new Soba('#contour-df');
plt.contourDesicionFunction(-3, 3, -3, 3, function(x,y){
	var z = Math.exp(-(x*x+y*y)/2)/(2*Math.PI);
	return z;
});
plt.colorbar();
plt.xlabel('x');
plt.ylabel('y');
plt.show();