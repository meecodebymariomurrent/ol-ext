/** SVG filter 
 * @param {string | *} attributes a list of attributes or fe operation
 *  @param {string} attributes.feoperation filter primitive tag name
 */
ol.ext.SVGOperation = function(attributes) {
  if (typeof(attributes)==='string') attributes = { feoperation: attributes };
  if (!attributes || !attributes.feoperation) {
    console.error('[SVGOperation]: no operation defined.')
    return;
  }
  ol.Object.call(this);
  this._name = attributes.feoperation;
  this.element = document.createElementNS( this.NS, this._name );
  this.setProperties(attributes);
  if (attributes.operations instanceof Array) this.appendChild(attributes.operations);
};
ol.ext.inherits(ol.ext.SVGOperation, ol.Object);
ol.ext.SVGOperation.prototype.NS = "http://www.w3.org/2000/svg";
/** Get filter name
 * @return {string}
 */
ol.ext.SVGOperation.prototype.getName = function() {
  return this._name;
};
/** Set Filter attribute
 * @param {*} attributes
 */
ol.ext.SVGOperation.prototype.set = function(k, val) {
  if (!/^feoperation$|^operations$/.test(k)) {
    ol.Object.prototype.set.call(this, k, val);
    this.element.setAttribute( k, val );
  }
};
/** Set Filter attributes
 * @param {*} attributes
 */
ol.ext.SVGOperation.prototype.setProperties = function(attributes) {
  attributes = attributes || {};
  for (var k in attributes) {
    this.set(k, attributes[k])
  }
};
/** Get SVG  element
 * @return {Element}
 */
ol.ext.SVGOperation.prototype.geElement = function() {
  return this.element;
};
/** Append a new operation
 * @param {ol.ext.SVGOperation} operation
 */
ol.ext.SVGOperation.prototype.appendChild = function(operation) {
  console.log(operation)
  if (operation instanceof Array) {
    operation.forEach(function(o) { this.appendChild(o) }.bind(this));
  } else {
    if (!(operation instanceof ol.ext.SVGOperation)) operation = new ol.ext.SVGOperation(operation);
    this.element.appendChild( operation.geElement() );
  }
};
