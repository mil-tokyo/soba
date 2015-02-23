# Methods

## Constructor
### Syntax
```javascript
var plt = new Soba(selector);
```
* *selector* : CSS selector to specify a DOM object which contains the figure drawn by the Soba instance

### Description
By constructor, Soba class creates and initialize a SVG object to draw figure in a DOM object which is specified by *selector*.

### Sample
```HTML
<div id="figure1"></div>
<script>
  var plt = new Soba('#figure1');
</script>
```

## plot()
### Syntax
```javascript
plt.plot(x, y, options);
```
* *x* : 1-dimentional Array or n-by-1 shaped Sushi.Matrix object which represents x-coordinates of data points
* *y* : 1-dimentional Array or n-by-1 shaped Sushi.Matrix object which represents y-coordinates of data points
* *options (default:"b-")* : String to specify styles of points and line. Supported styles are following. Combination of these characters representes the style.

| Character | Line Style          |
| --------- |--------------------:|
| -         | solid line style    |
| --        | dashed line style   |
| -.        | dash-dot line style |
| :         | dotted line style   |
| o         | circle marker       |

| Character | Color   |
| --------- |--------:|
| b         | blue    |
| g         | green   |
| r         | red     |
| c         | cyan    |
| m         | magenta |
| y         | yellow  |
| k         | black   |
| w         | white   |

### Description
This method plots continuous points and connects those points by line if a specific option given. The styles of points and line are controlled by *options* argument.

### Sample
```javascript
var x=..., y=...;
plt.plot(x,y,'k--');
```
Please see also http://mil-tokyo.github.io/soba/examples/index.html#plot

## scatter()
### Syntax
```javascript
plt.scatter(x, y, colors);
```
* *x* : 1-dimentional Array or n-by-1 shaped Sushi.Matrix object which represents x-coordinates of data points
* *y* : 1-dimentional Array or n-by-1 shaped Sushi.Matrix object which represents y-coordinates of data points
* *colors* : n-by-1 shaped Sushi.Matrix object which represents colors of data points. The elements of this matrix are integer (1,2,3,...).

### Description
This method make a scatter plot of x vs y. Colors of those are controlled by *colors* argument.

### Sample
```javascript
var x=new Sushi.Matrix(...), y=new Sushi.Matrix(...), colors=new Sushi.Matrix(...);
x=...; y=...; colors=...;
plt.scatter(x,y,colors);
```
Please see also http://mil-tokyo.github.io/soba/examples/index.html#scatter

## contourDesicionFunction()
### Syntax
```javascript
plt.contourDesicionFunction(x_min, x_max, y_min, y_max, callback);
plt.contourDesicionFunction(x_min, x_max, y_min, y_max, options, callback);
```
* *x_min* : x-coordinate of the left edge of the plotting area
* *x_max* : x-coordinate of the right edge of the plotting area
* *y_min* : y-coordinate of the botton edge of the plotting area
* *y_max* : y-coordinate of the top edge of the plotting area
* *options* : Object specifying some options like {option_name1: value1, option_name2: value2, ...}.Supported options are followings:

| Option name | Description   |
| ----------- |--------|
| levels      | Array containing the contour levels. If not provided, the contour levels are determined automatically.|
| colors      | Array containing the colors of contour lines. Colors are specified by the aliases described above(plot()). If not provided, colors are determined automatically. If the length of this array is shorter than that of levels, specified colors are repeated. |
| linestyles  | Array containing the line styles of contour lines. Line styles are specified by strings. 'solid' and 'dashed' are supported. If not provided, all lines are solid style. If the length of this array is shorter than that of levels, specified line styles are repeated.|
* *callback* : Callback function that takes 2 arguments *x* and *y* and returns function value to draw contour.

### Description
This method plots contours of a function that specified by *callback* function. The plotting area is specified by *x_min*, *x_max*, *y_min* and *y_max* and *callback* is called over lattice points in the plotting area to assign function values to each point.

### Sample
```javascript
plt.contourDesicionFunction(-3, 3, -3, 3, {levels: [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.], colors: ['m','b'], linestyles: ['dashed', 'solid']}, function(x,y){
  var z = Math.exp(-(x*x+y*y)/2)/(2*Math.PI); // Gaussian distribution
  return z;
});
```
Please see also http://mil-tokyo.github.io/soba/examples/index.html#contour-df

## xlim()
### Syntax
```javascript
plt.xlim([x_min, x_max]);
```
* *x_min (default: null)* : A number specifying the minimum of *x* axis. If null is given, it is determined automatically.
* *x_max (default: null)* : A number specifying the maximum of *x* axis. If null is given, it is determined automatically.

### Description
Set the *x* limits.

### Sample
```javascript
plt.xlim([0, null]);
```

## ylim()
### Syntax
```javascript
plt.ylim([y_min, y_max]);
```
(Arguments are similar to xlim())

### Description
Set the *y* limits.

### Sample
```javascript
plt.ylim([0, null]);
```

## legend()
### Syntax
```javascript
plt.legend(labels, location);
```
* *labels* : Array containing titles of figure elements
* *location (default:"upper right")* : String to specify the legend location. 'right', 'left, 'upper' and 'bottom' are supported. These can be combined such as 'bottom left'.

### Description
Place a legend in the figure.

### Sample
```javascript
plt.legend(['label1', 'label2', ...], "bottom left");
```

## xlabel()
### Syntax
```javascript
plt.xlabel(label, options);
```
* *label* : String representing *x* axis label
* *options* : Object specifying some options like {option_name1: value1, option_name2: value2, ...}.Supported options are followings:

| Option name | Description   |
| ----------- |--------|
| fontsize    | Integer specifying the font size|

### Sample
```javascript
plt.xlabel('x');
```

## ylabel()
### Syntax
```javascript
plt.ylabel(label, options);
```
(Arguments are same to xlabel())

### Description
Set the y axis label.

### Sample
```javascript
plt.ylabel('y');
```

## colorbar()
### Syntax
```javascript
plt.colorbar();
```

### Description
Add a colorbar to a plot correspoinding a contour.

### Sample
```javascript
plt.colorbar();
```

## show()
### Syntax
```javascript
plt.show();
```

### Description
Display a figure. Nothing is drawn until this method is called. This method MUST be called to draw a figure.

### Sample
```javascript
plt.show();
```

## clf()
### Syntax
```javascript
plt.clf();
```

### Description
Clear all figures before show() is called.

### Sample
```javascript
plt.clf();
```
