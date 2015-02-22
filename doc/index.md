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

## Full simple example
Here, the whole code is shown to plot one sine curve.
```HTML
<!DOCTYPE html>
<html>
    <head>
        <title>Simple Soba sample</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="../src/soba.js"></script>
        <link rel="stylesheet" href="../src/soba.css">
    </head>
    <body>
        <div id="sine-curve" style="width: 640px; height: 480px;"></div>
        <script>
            // Sine data
            var x_min=-3, x_max=3, nbins = 60;
            var x = new Array(nbins), y = new Array(nbins);
            for (var i=0 ; i<nbins ; i++) {
                x[i] = x_min + i*(x_max-x_min)/(nbins-1);
                y[i] = Math.sin(x[i]);
            }

            // plot
            var plt = new Soba('#sine-curve');
            plt.plot(x,y,'b:');
            plt.show();
        </script>
    </body>
</html>
```

# Integration with Sushi
Soba can work with Sushi Javascript Library (https://github.com/mil-tokyo/sushi) which offers fast matrix calculation in javascript.
Sushi's matrix class *Sushi.Matrix* can be passed to Soba's methods.
For example, the sample code above can be written as following by using *Sushi.Matrix*:
```HTML
<!DOCTYPE html>
<html>
    <head>
        <title>Simple Soba sample</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="../sushi/src/sushi.js"></script>   <!-- Include sushi.js -->
        <script src="../src/soba.js"></script>
        <link rel="stylesheet" href="../src/soba.css">
    </head>
    <body>
        <div id="sine-curve" style="width: 640px; height: 480px;"></div>
        <script>
            // Sine data by Sushi.Matrix
            var x_min=-3, x_max=3, nbins = 60;
            var x = new Sushi.Matrix(nbins, 1);
            x.setEach(function(i){
                return x_min + i*(x_max-x_min)/(nbins-1);
            });
            var y = x.clone();
            y.map(function(d){
                return Math.sin(d);
            });

            // plot
            var plt = new Soba('#sine-curve');
            plt.plot(x,y,'b:');
            plt.show();
        </script>
    </body>
</html>
```
The plotting code is unchanged while the data passed to plot() method are changed to instances of *Sushi.Matrix* (and sushi.js is included).
