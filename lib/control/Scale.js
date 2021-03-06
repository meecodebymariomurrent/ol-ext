/*	Copyright (c) 2017 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * Scale Control.
 * A control to display the scale of the center on the map
 *
 * @constructor
 * @extends {ol.control.Control}
 * @fires select
 * @fires change:input
 * @param {Object=} options
 *  @param {string} options.className control class name
 *  @param {string} options.ppi screen ppi, default 96
 * 	@param {string} options.editable make the control editable, default true
 */
ol.control.Scale = function(options) {
  if (!options) options = {};
  if (options.typing == undefined) options.typing = 300;
  var element = document.createElement("DIV");
  var classNames = (options.className||"")+ " ol-scale";
  if (!options.target) {
  classNames += " ol-unselectable ol-control";
  }
  this._input = document.createElement("INPUT");
  this._input.value = '-';
  element.setAttribute('class', classNames);
  if (options.editable===false) this._input.readOnly = true;
  element.appendChild(this._input);
  ol.control.Control.call(this, {
  element: element,
  target: options.target
  });
  this._input.addEventListener("change", this.setScale.bind(this));
  this.set('ppi', options.ppi || 96)
};
ol.ext.inherits(ol.control.Scale, ol.control.Control);
/**
 * Remove the control from its current map and attach it to the new map.
 * Subclasses may set up event handlers to get notified about changes to
 * the map here.
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.control.Scale.prototype.setMap = function (map) {
  if (this._listener) ol.Observable.unByKey(this._listener);
  this._listener = null;
  ol.control.Control.prototype.setMap.call(this, map);
  // Get change (new layer added or removed)
  if (map) {
    this._listener = map.on('moveend', this._showScale.bind(this));
  }
};
/** Display the scale
 */
ol.control.Scale.prototype._showScale = function () {
  var map = this.getMap();
  if (map) {
    var view = map.getView();
    var proj = view.getProjection();
    var center = view.getCenter();
    var px = map.getPixelFromCoordinate(center);
    px[1] += 1;
    var coord = map.getCoordinateFromPixel(px);
    var d = ol.sphere.getDistance(
      ol.proj.transform(center, proj, 'EPSG:4326'),
      ol.proj.transform(coord, proj, 'EPSG:4326'));
    d *= this.get('ppi')/.0254
    this._input.value = this.formatScale(d);
  }
};
/** Format the scale 1/d
 * @param {Number} d
 * @return {string} formated string
 */
ol.control.Scale.prototype.formatScale = function (d) {
  if (d>100) d = Math.round(d/100) * 100;
  else d = Math.round(d);
  return '1 / '+ d.toLocaleString();
};
/** Set the current scale (will change the scale of the map)
 * @param {Number} value the scale factor
 */
ol.control.Scale.prototype.setScale = function (value) {
  var map = this.getMap();
  if (map && value) {
    if (value.target) value = value.target.value;
    var fac = value;
    if (typeof(value)==='string') {
      fac = value.split('/')[1];
      if (!fac) fac = value;
      fac = fac.replace(/[^\d]/g,'');
      fac = parseInt(fac);
    }
    // Calculate new resolution
    var view = map.getView();
    var proj = view.getProjection();
    var center = view.getCenter();
    var px = map.getPixelFromCoordinate(center);
    px[1] += 1;
    var coord = map.getCoordinateFromPixel(px);
    var d = ol.sphere.getDistance(
      ol.proj.transform(center, proj, 'EPSG:4326'),
      ol.proj.transform(coord, proj, 'EPSG:4326'));
    d *= this.get('ppi')/.0254
    view.setResolution(view.getResolution()*fac/d);
  }
  this._showScale();
};
