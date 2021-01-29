/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** @typedef {Object} FilterPencilSketchOptions
 * @property {number} blur blur value in pixel, default 8
 * @property {number} value intensity value [0,1], default .8
 */
/** Colorize map or layer
 * Original idea: https://www.freecodecamp.org/news/sketchify-turn-any-image-into-a-pencil-sketch-with-10-lines-of-code-cf67fa4f68ce/
 * @constructor
 * @requires ol.filter
 * @extends {ol.filter.Base}
 * @param {FilterPencilSketchOptions} options
 */
ol.filter.PencilSketch = function(options) {
  options = options || {};
  ol.filter.Base.call(this, options);
  this.set('blur', options.blur || 8);
  this.set('intensity', options.intensity || .8);
};
ol.ext.inherits(ol.filter.PencilSketch, ol.filter.Base);
/** @private 
 */
ol.filter.PencilSketch.prototype.precompose = function(/* e */) {
};
/** @private 
 */
ol.filter.PencilSketch.prototype.postcompose = function(e) {
  // Set back color hue
  var ctx = e.context;
  var canvas = ctx.canvas;
  var w = canvas.width;
  var h = canvas.height;
  // Grayscale image
  var bwimg = document.createElement('canvas');
  bwimg.width = w;
  bwimg.height = h;
  var bwctx = bwimg.getContext('2d');
  bwctx.filter = 'grayscale(1) invert(1) blur('+this.get('blur')+'px)';
  bwctx.drawImage(canvas, 0,0);
  ctx.save();
    if (!this.get('color')) {
      ctx.filter = 'grayscale(1)';
      ctx.drawImage(canvas, 0,0);
    } else {
      ctx.globalCompositeOperation = 'darken';
      ctx.globalAlpha = .3;
      ctx.drawImage(canvas, 0,0);
    }
    ctx.globalCompositeOperation = 'color-dodge';
    ctx.globalAlpha = this.get('intensity');
    ctx.drawImage(bwimg, 0,0);
  ctx.restore();
};
