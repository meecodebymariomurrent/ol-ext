/** SVG filter 
 * @param {*} options
 *  @param {ol.ext.SVGOperation} option.operation
 *  @param {string} option.color color interpolation filters, linear or sRGB
 */
ol.ext.SVGFilter = function(options) {
  options = options || {};
  ol.Object.call(this);
  if (!ol.ext.SVGFilter.prototype.svg) {
    ol.ext.SVGFilter.prototype.svg = document.createElementNS( this.NS, 'svg' );
    ol.ext.SVGFilter.prototype.svg.setAttribute('version','1.1');
    ol.ext.SVGFilter.prototype.svg.setAttribute('width',0);
    ol.ext.SVGFilter.prototype.svg.setAttribute('height',0);
    ol.ext.SVGFilter.prototype.svg.style.position = 'absolute';
    document.body.appendChild( ol.ext.SVGFilter.prototype.svg );
  }
  this.element = document.createElementNS( this.NS, 'filter' );
  this._id = '_ol_SVGFilter_' + (ol.ext.SVGFilter.prototype._id++);
  this.element.setAttribute( 'id', this._id );
  if (options.color) this.element.setAttribute( 'color-interpolation-filters', options.color );
  if (options.operation) this.addOperation(options.operation);
  ol.ext.SVGFilter.prototype.svg.appendChild( this.element );
};
ol.ext.inherits(ol.ext.SVGFilter, ol.Object);
ol.ext.SVGFilter.prototype.NS = "http://www.w3.org/2000/svg";
ol.ext.SVGFilter.prototype.svg = null;
ol.ext.SVGFilter.prototype._id = 0;
/** Get filter ID
 * @return {string}
 */
ol.ext.SVGFilter.prototype.getId = function() {
  return this._id;
};
/** Remove from DOM
 */
ol.ext.SVGFilter.prototype.remove = function() {
  this.element.remove();
};
/** Add a new operation
 * @param {ol.ext.SVGOperation} operation
 */
ol.ext.SVGFilter.prototype.addOperation = function(operation) {
  if (operation instanceof Array) {
    operation.forEach(function(o) { this.addOperation(o) }.bind(this));
  } else {
    if (!(operation instanceof ol.ext.SVGOperation)) operation = new ol.ext.SVGOperation(operation);
    this.element.appendChild( operation.geElement() );
  }
};
