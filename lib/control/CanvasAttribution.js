/*	Copyright (c) 2015 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * @classdesc 
 *   OpenLayers 3 Attribution Control integrated in the canvas (for jpeg/png 
 * @see http://www.kreidefossilien.de/webgis/dokumentation/beispiele/export-map-to-png-with-scale
 *
 * @constructor
 * @extends {ol.control.Attribution}
 * @param {Object=} options extend the ol.control.Attribution options.
 * 	@param {ol.style.Style} options.style  option is usesd to draw the text.
 */
ol.control.CanvasAttribution = function(options) {
  if (!options) options = {};
  ol.control.Attribution.call(this, options);
  // Draw in canvas
  this.setCanvas(!!options.canvas);
  // Get style options
  if (!options) options={};
  if (!options.style) options.style = new ol.style.Style();
  this.setStyle (options.style);
}
ol.ext.inherits(ol.control.CanvasAttribution, ol.control.Attribution);
/**
 * Draw attribution on canvas
 * @param {boolean} b draw the attribution on canvas.
 */
ol.control.CanvasAttribution.prototype.setCanvas = function (b) {
  this.isCanvas_ = b;
  if (b) this.setCollapsed(false);
  this.element.style.visibility = b ? "hidden":"visible";
  if (this.map_) this.map_.renderSync();
};
/** Get map Canvas
 * @private
 */
ol.control.CanvasAttribution.prototype.getContext = ol.control.CanvasBase.prototype.getContext;
/**
 * Change the control style
 * @param {ol.style.Style} style
 */
ol.control.CanvasAttribution.prototype.setStyle = function (style) {
  var text = style.getText();
  this.font_ = text ? text.getFont() : "10px sans-serif";
  var stroke = text ? text.getStroke() : null;
  var fill = text ? text.getFill() : null;
  this.fontStrokeStyle_ = stroke ? ol.color.asString(stroke.getColor()) : "#fff";
  this.fontFillStyle_ = fill ? ol.color.asString(fill.getColor()) : "#000";
  this.fontStrokeWidth_ = stroke ? stroke.getWidth() : 3;
  if (this.getMap()) this.getMap().render();
};
/**
 * Remove the control from its current map and attach it to the new map.
 * Subclasses may set up event handlers to get notified about changes to
 * the map here.
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.control.CanvasAttribution.prototype.setMap = function (map) {
  ol.control.CanvasBase.prototype.getCanvas.call(this, map);
  var oldmap = this.getMap();
  if (this._listener) ol.Observable.unByKey(this._listener);
  this._listener = null;
  ol.control.ScaleLine.prototype.setMap.call(this, map);
  if (oldmap) oldmap.renderSync();
  // Get change (new layer added or removed)
  if (map) {
    this._listener = map.on('postcompose', this.drawAttribution_.bind(this));
  }
  this.map_ = map;
  this.setCanvas (this.isCanvas_);
};
/** 
 * Draw attribution in the final canvas
 * @private
 */
ol.control.CanvasAttribution.prototype.drawAttribution_ = function(e) {
  if (!this.isCanvas_) return;
  var ctx = this.getContext(e);
  if (!ctx) return;
  var text = "";
  Array.prototype.slice.call(this.element.querySelectorAll('li'))
    .filter(function(el) {
      return el.style.display !== "none";
    })
    .map(function(el) {
      text += (text ? " - ":"") + el.textContent;
    });
  // Retina device
  var ratio = e.frameState.pixelRatio;
  ctx.save();
  ctx.scale(ratio,ratio);
  // Position
  var eltRect = this.element.getBoundingClientRect();
  var mapRect = this.getMap().getViewport().getBoundingClientRect();
  var sc = this.getMap().getSize()[0] / mapRect.width;
  ctx.translate((eltRect.left-mapRect.left)*sc, (eltRect.top-mapRect.top)*sc);
  var h = this.element.clientHeight;
  var w = this.element.clientWidth;
  var left = w/2 + this.element.querySelectorAll('button')[0].clientWidth;
  // Draw scale text
  ctx.beginPath();
    ctx.strokeStyle = this.fontStrokeStyle_;
    ctx.fillStyle = this.fontFillStyle_;
    ctx.lineWidth = this.fontStrokeWidth_;
    ctx.textAlign = "center";
    ctx.textBaseline ="middle";
    ctx.font = this.font_;
    ctx.strokeText(text, left, h/2);
    ctx.fillText(text, left, h/2);
  ctx.closePath();
  ctx.restore();
};
