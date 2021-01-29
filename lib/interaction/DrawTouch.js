/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Interaction DrawTouch :
 * @constructor
 * @fires drawstart
 * @fires drawend
 * @fires drawabort
 * @extends {ol.interaction.CenterTouch}
 * @param {olx.interaction.DrawOptions} options
 *  @param {ol.source.Vector | undefined} options.source Destination source for the drawn features.
 *  @param {ol.geom.GeometryType} options.type Drawing type ('Point', 'LineString', 'Polygon') not ('MultiPoint', 'MultiLineString', 'MultiPolygon' or 'Circle'). Required.
 *	@param {boolean} options.tap enable on tap, default true
 *  @param {ol.style.Style|Array<ol.style.Style>} options.style Drawing style
 *  @param {ol.style.Style|Array<ol.style.Style>} options.sketchStyle Sketch style
 *  @param {ol.style.Style|Array<ol.style.Style>} options.targetStyle a style to draw the target point, default cross style
 *  @param {string} options.composite composite operation : difference|multiply|xor|screen|overlay|darken|lighter|lighten|...
 */
ol.interaction.DrawTouch = function(options) {
  options = options||{};
  options.handleEvent = function(e) {
    if (this.get('tap')) {
      this.sketch.setPosition(this.getPosition());
      switch (e.type) {
        case 'singleclick': {
          this.addPoint();
          break;
        }
        case 'dblclick': {
          this.addPoint();
          this.finishDrawing();
          return false;
          //break;
        }
        default: break;
      }
    }
    return true;
  }
  if (!options.sketchStyle) {
    options.sketchStyle = ol.style.Style.defaultStyle();
  }
  var sketch = this.sketch = new ol.layer.SketchOverlay(options);
  sketch.on(['drawstart', 'drawabort'], function(e) { this.dispatchEvent(e); }.bind(this));
  sketch.on(['drawend'], function(e) { 
    if (e.feature && e.valid && options.source) options.source.addFeature(e.feature);
    this.dispatchEvent(e); 
  }.bind(this));
  ol.interaction.CenterTouch.call(this, options);
  this._source = options.source;
};
ol.ext.inherits(ol.interaction.DrawTouch, ol.interaction.CenterTouch);
/**
 * Remove the interaction from its current map, if any,  and attach it to a new
 * map, if any. Pass `null` to just remove the interaction from the current map.
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.interaction.DrawTouch.prototype.setMap = function(map) {
  if (this._listener) {
    for(var l in this._listener) ol.Observable.unByKey(l);
  }
  this._listener = {};
  ol.interaction.CenterTouch.prototype.setMap.call (this, map);
  this.sketch.setMap(map);
  if (map){
    this._listener.center = map.on('postcompose', function() {
      if (!ol.coordinate.equal(this.getPosition(), this.sketch.getPosition() || [])) {
        this.sketch.setPosition(this.getPosition());
      }
    }.bind(this));
  }
};
/** Set geometry type
 * @param {ol.geom.GeometryType} type
 */
ol.interaction.DrawTouch.prototype.setGeometryType = function(type) {
  return this.sketch.setGeometryType(type);
};
/** Get geometry type
 * @return {ol.geom.GeometryType}
 */
ol.interaction.DrawTouch.prototype.getGeometryType = function() {
  return this.sketch.getGeometryType();
};
/** Start drawing and add the sketch feature to the target layer. 
 * The ol.interaction.Draw.EventType.DRAWEND event is dispatched before inserting the feature.
 */
ol.interaction.DrawTouch.prototype.finishDrawing = function() {
  this.sketch.finishDrawing(true);
};
/** Add a new Point to the drawing
 */
ol.interaction.DrawTouch.prototype.addPoint = function() {
  this.sketch.addPoint(this.getPosition());
};
/** Remove last point of the feature currently being drawn.
 */
ol.interaction.DrawTouch.prototype.removeLastPoint = function() {
  this.sketch.removeLastPoint();
};
/**
 * Activate or deactivate the interaction.
 * @param {boolean} active Active.
 * @observable
 * @api
 */
ol.interaction.DrawTouch.prototype.setActive = function(b) {
  ol.interaction.CenterTouch.prototype.setActive.call (this, b);
  this.sketch.abortDrawing();
  this.sketch.setVisible(b);
};
