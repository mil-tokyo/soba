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
| o         | dotted line style   |

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
