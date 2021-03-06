/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** @typedef {Object} FilterColorizeOptions
 * @property {ol.Color} color style to fill with
 * @property {string} operation 'enhance' or a CanvasRenderingContext2D.globalCompositeOperation
 * @property {number} value a value to modify the effect value [0-1]
 * @property {boolean} inner mask inner, default false
 */
/** Colorize map or layer
 * @constructor
 * @requires ol.filter
 * @extends {ol.filter.Base}
 * @author Thomas Tilak https://github.com/thhomas
 * @author Jean-Marc Viglino https://github.com/viglino
 * @param {FilterColorizeOptions} options
 */
ol.filter.Colorize = function(options) {
  ol.filter.Base.call(this, options);
  this.setFilter(options);
}
ol.ext.inherits(ol.filter.Colorize, ol.filter.Base);
/** Set options to the filter
 * @param {FilterColorizeOptions} [options]
 */
ol.filter.Colorize.prototype.setFilter = function(options) {
  options = options || {};
  switch (options) {
    case "grayscale": options = { operation:'hue', color: [0,0,0], value:1 }; break;
    case "invert": options = { operation:'difference', color: [255,255,255], value:1 }; break;
    case "sepia": options = { operation:'color', color: [153,102,51], value:0.6 }; break;
    default: break;
  }
  var color = options.color ? ol.color.asArray(options.color) : [ options.red, options.green, options.blue, options.value];
  this.set('color', ol.color.asString(color))
  this.set ('value', options.value||1);
  var v;
  switch (options.operation){
    case 'color':
    case 'hue':
    case 'difference':
    case 'color-dodge':
    case 'enhance': {
      this.set ('operation', options.operation);
      break;
    }
    case 'saturation': {
      v = 255*(options.value || 0);
      this.set('color', ol.color.asString([0,0,v,v||1]));
      this.set ('operation', options.operation);
      break;
    }
    case 'luminosity': {
      v = 255*(options.value || 0);
      this.set('color', ol.color.asString([v,v,v,255]));
      //this.set ('operation', 'luminosity')
      this.set ('operation', 'hard-light');
      break;
    }
    case 'contrast': {
      v = 255*(options.value || 0);
      this.set('color', ol.color.asString([v,v,v,255]));
      this.set('operation', 'soft-light');
      break;
    }
    default: {
      this.set ('operation', 'color');
      break;
    }
  }
}
/** Set the filter value
 * @param {ol.Color} options.color style to fill with
 */
ol.filter.Colorize.prototype.setValue = function(v) {
  this.set ('value', v);
  var c = ol.color.asArray(this.get("color"));
  c[3] = v;
  this.set("color", ol.color.asString(c));
}
/** Set the color value
 * @param {number} options.value a [0-1] value to modify the effect value
 */
ol.filter.Colorize.prototype.setColor = function(c) {
  c = ol.color.asArray(c);
  if (c) {
    c[3] = this.get("value");
    this.set("color", ol.color.asString(c));
  }
}
/** @private 
 */
ol.filter.Colorize.prototype.precompose = function(/* e */) {
}
/** @private 
 */
ol.filter.Colorize.prototype.postcompose = function(e) {
  // Set back color hue
  var ctx = e.context;
  var canvas = ctx.canvas;
  ctx.save();
    if (this.get('operation')=='enhance') {
      var v = this.get('value');
      if (v) {
        var w = canvas.width;
        var h = canvas.height;
        ctx.globalCompositeOperation = 'color-burn'
        ctx.globalAlpha = v;
        ctx.drawImage (canvas, 0, 0, w, h);
        ctx.drawImage (canvas, 0, 0, w, h);
        ctx.drawImage (canvas, 0, 0, w, h);
      }
    } else {
      ctx.globalCompositeOperation = this.get('operation');
      ctx.fillStyle = this.get('color');
      ctx.fillRect(0,0,canvas.width,canvas.height);  
    }
  ctx.restore();
}
