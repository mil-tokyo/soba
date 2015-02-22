#Introduction

Soba Javascript Library is a javascript 2D plotting library which is designed to draw high quality figures for scientific computation easily like matplotlib (http://matplotlib.org/).
Soba Javascript Library is written in javascript so that it can work on web browsers in any environment and can coordinate with Sushi (https://github.com/mil-tokyo/sushi) and Tempura (https://github.com/mil-tokyo/tempura).

#How to use
## Clone the repo or download the files
On a console, type
```
git clone git@github.com:mil-tokyo/soba.git
```
or simply download the file from 
https://github.com/mil-tokyo/soba/archive/master.zip

src/soba.js and src/soba.css are core files.

## Include files in your HTML
Soba works with HTML in web browsers and depends on d3.js (http://d3js.org/).
Please include d3.js and Soba codes in your HTML file like:

```HTML
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="soba.js"></script>
<link rel="stylesheet" href="soba.css">
```

## Create an instance of Soba class to draw figure in a DOM object
Soba draws a figure as a SVG object in a DOM object.
For example, Soba creates and initialize a SVG object in a DOM object whose id is "figure1" by the following code:

```javascript
var plt = new Soba('#figure1');
```

Soba uses d3.js to handle SVG objects.

## Draw Graph on the figure
Now, let's draw graphs!
For example, plot() plots continuous points and connects those points by line if a specific option given like this:
```javascript
plt.plot(x,y,options);
plt.show();
```
Here, variables x and y represent the locations of the points and the styles of the points and the line can be controlled by options as a string.
