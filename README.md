ablend
======

Combines 2 images (one on white and one on black) to produce a transparent version.

Based on my old screenshot tool for Linux [abscapture](http://blog.dt.in.th/2010/05/abscapture/) and
my Compiz 0.8 plugin [windowcapture](https://github.com/dtinth/compiz-windowcapture).
Inspired by Windows screenshot tool [Window Clippings](http://www.windowclippings.com/).

This app doesn't have screenshot facilities, just the ability to blend together two images to produce a transparent image.


Command-Line Usage
------------------

    Usage: ablend <black.png> <white.png> <result.png>

* `<black.png>` is the path to image on black background.
* `<white.png>` is the path to image on white background.
* `<result.png>` is the path to the resulting image.

API
---

    var ablend = require('ablend');

### exports.ablend(a, b, o, onprogress)

Blends the images `a` and `b` and save into `o`.

`a`, `b` and `o` must be an [ImageData][] object and have same dimensions.

* `a` - an [ImageData][] object representing an image on black background, read-only
* `b` - an [ImageData][] object representing an image on white background, read-only
* `o` - an [ImageData][] object representing the output image, write-only
* `onprogress` - `function(current, total)` will be fired every pixel processed


### exports.cblend(ca, cb, ba, bb, o)

Blends two colors `ca` and `cb` and save the result into `o`.

The color `o` will be set so that when it is displayed on `ba` will result in `ca` and when displayed on `bb` will result in `cb`.

* `ca` - the color object for the color that is displayed on `ba`.
* `cb` - the color object for the color that is displayed on `bb`.
* `ba` - the color object for first background color.
* `bb` - the color object for second background color.
* `o` - the color object for output.



#### Color Objects

    {
      "r": (red value from 0 to 255),
      "g": (green value from 0 to 255),
      "b": (blue value from 0 to 255),
      "a": (alpha value from 0 to 255)
    }


### exports.alpha(va, vb, ba, bb)

Given two colors and two backgrounds, compute the opacity.

* `va` - the value of the color on background A.
* `vb` - the value of the color on background B.
* `ba` - the value of the background color A.
* `ba` - the value of the background color B.
* __Returns__ the alpha value, between 0 and 1 inclusive.

#### Color Values

The value of a color is defined to be the sum of red, green and blue channel.

For example, the value of black is 0, and white is 765 (255*3).


### exports.value(va, vb, ba, bb, a)

* `va` - the value of the color on background A.
* `vb` - the value of the color on background B.
* `ba` - the value of the background color A.
* `bb` - the value of the background color A.
* `a` - the alpha value, returned by `exports.alpha`.
* __Returns__ the color value, that will result in `va` when displayed with opacity `a` on background color `ba`,
  and `vb` when displayed on background color `bb`.

#### Color Values

For this function, the value of the color is the value of each channel.





Dependencies
------------

The core algorithm (lib/ablend.js) doesn't depend on anything,
but the CLI script uses [learnboost/node-canvas](https://github.com/learnboost/node-canvas) to read and write images
and [substack/node-optimist](https://github.com/substack/node-optimist) to parse command-line arguments.


[ImageData]: http://dev.w3.org/html5/2dcontext/#imagedata
