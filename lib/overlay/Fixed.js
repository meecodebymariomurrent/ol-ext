/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * @classdesc
 * An overlay fixed on the map. 
 * Use setPosition(coord, true) to force the overlay position otherwise the position will be ignored.
 *
 * @example
var popup = new ol.Overlay.Fixed();
map.addOverlay(popup);
popup.setposition(position, true);
*
* @constructor
* @extends {ol.Overlay}
* @param {} options Extend Overlay options 
* @api stable
*/
ol.Overlay.Fixed = function (options) {
  ol.Overlay.call(this, options);
};
ol.ext.inherits(ol.Overlay.Fixed, ol.Overlay);
/** Prevent modifying position and use a force argument to force positionning.
 * @param {ol.coordinate} position
 * @param {boolean} force true to change the position, default false
 */
ol.Overlay.Fixed.prototype.setPosition = function(position, force) {
  if (this.getMap() && position) {
    this._pixel = this.getMap().getPixelFromCoordinate(position);
  }
  ol.Overlay.prototype.setPosition.call(this, position)
  if (force) {
    ol.Overlay.prototype.updatePixelPosition.call(this);
  } 
};
/** Update position according the pixel position
 */
ol.Overlay.Fixed.prototype.updatePixelPosition = function() {
  if (this.getMap() && this._pixel && this.getPosition()) {
    var pixel = this.getMap().getPixelFromCoordinate(this.getPosition())
    if (Math.round(pixel[0]*1000) !== Math.round(this._pixel[0]*1000) 
      || Math.round(pixel[0]*1000) !== Math.round(this._pixel[0]*1000) ) {
      this.setPosition(this.getMap().getCoordinateFromPixel(this._pixel));
    }
  }
};
