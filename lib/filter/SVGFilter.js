/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Add a canvas Context2D SVG filter to a layer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
 * @constructor
 * @requires ol.filter
 * @extends {ol.filter.Base}
 * @param {ol.ext.SVGFilter|Array<ol.ext.SVGFilter>} filters
 */
ol.filter.SVGFilter = function(filters) {
  ol.filter.Base.call(this);
  this._svg = {};
  if (filters) {
    if (!(filters instanceof Array)) filters = [filters];
    filters.forEach(function(f) {
      this.addSVGFilter(f);
    }.bind(this));
  }
};
ol.ext.inherits(ol.filter.SVGFilter, ol.filter.Base);
/** Add a new svg filter
 * @param {ol.ext.SVGFilter} filter
 */
ol.filter.SVGFilter.prototype.addSVGFilter = function(filter) {
  var url = '#'+filter.getId();
  this._svg[url] = 1;
  this.dispatchEvent({ type: 'propertychange', key: 'svg', oldValue: this._svg });
};
/** Remove a svg filter
 * @param {ol.ext.SVGFilter} filter
 */
ol.filter.SVGFilter.prototype.removeSVGFilter = function(filter) {
  var url = '#'+filter.getId();
  delete this._svg[url]
  this.dispatchEvent({ type: 'propertychange', key: 'svg', oldValue: this._svg });
};
/**
 * @private
 */
ol.filter.SVGFilter.prototype.precompose = function() {
};
/**
 * @private
 */
ol.filter.SVGFilter.prototype.postcompose = function(e) {
  var filter = []
  // Set filters
  for (var f in this._svg) {
    filter.push('url('+f+')'); 
  }
  filter = filter.join(' ');
  var canvas = document.createElement('canvas');
  canvas.width = e.context.canvas.width;
  canvas.height = e.context.canvas.height;
  canvas.getContext('2d').drawImage(e.context.canvas,0,0);
  // Apply filter
  if (filter) {
    e.context.save();
    e.context.clearRect(0,0,canvas.width, canvas.height);
    e.context.filter = filter;
    e.context.drawImage(canvas, 0,0);
    e.context.restore();
  }
};
