// Sine data
var x_min=-3, x_max=3, nbins = 60;
var x = new Array(nbins), y = new Array(nbins);
for (var i=0 ; i<nbins ; i++) {
    x[i] = x_min + i*(x_max-x_min)/(nbins-1);
    y[i] = Math.sin(x[i]);
}

// plot
var plt = new Soba('#plot');
plt.plot(x,y,'b:');
plt.xlabel('x');
plt.ylabel('y');
plt.show();