/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Add a composite filter on a layer
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
 * @constructor
 * @requires ol.filter
 * @extends {ol.filter.Base}
 * @param {Object} options
 *   @param {string} options.operation composite operation
 */
ol.filter.Composite = function(options) {
  ol.filter.Base.call(this, options);
  this.set("operation", options.operation || "source-over");
}
ol.ext.inherits(ol.filter.Composite, ol.filter.Base);
/** Change the current operation
*	@param {string} operation composite function
*/
ol.filter.Composite.prototype.setOperation = function(operation) {
  this.set('operation', operation || "source-over");
}
ol.filter.Composite.prototype.precompose = function(e) {
  var ctx = e.context;
  ctx.save();
  ctx.globalCompositeOperation = this.get('operation');
}
ol.filter.Composite.prototype.postcompose = function(e) {
  e.context.restore();
}
