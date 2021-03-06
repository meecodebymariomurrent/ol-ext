/*	Copyright (c) 2019 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** A source for INSEE grid
 * @constructor
 * @extends {ol.source.Vector}
 * @param {Object} options ol.source.VectorOptions + grid option
 *  @param {ol.source.Vector} options.source Source
 *  @param {number} [options.size] size of the grid in meter, default 200m
 *  @param {function} [options.geometryFunction] Function that takes an ol.Feature as argument and returns an ol.geom.Point as feature's center.
 *  @param {function} [options.flatAttributes] Function takes a bin and the features it contains and aggragate the features in the bin attributes when saving
 */
ol.source.InseeBin = function (options) {
  options = options || {};
  this._grid = new ol.InseeGrid({ size: options.size });
  ol.source.BinBase.call(this, options);
};
ol.ext.inherits(ol.source.InseeBin, ol.source.BinBase);
/** Set grid size
 * @param {number} size
 */
ol.source.InseeBin.prototype.setSize = function (size) {
  if (this.getSize() !== size) {
    this._grid.set('size', size);
    this.reset();
  }
};
/** Get grid size
 * @return {number} size
 */
ol.source.InseeBin.prototype.getSize = function () {
  return this._grid.get('size');
};
/** Get the grid geometry at the coord 
 * @param {ol.Coordinate} coord
 * @returns {ol.geom.Polygon} 
 * @api
 */
ol.source.InseeBin.prototype.getGridGeomAt = function (coord) {
  return this._grid.getGridAtCoordinate(coord, this.getProjection());
};
/** Get grid extent 
 * @param {ol.ProjectionLike} proj
 * @return {ol.Extent}
 */
ol.source.InseeBin.prototype.getGridExtent = function (proj) {
  return this._grid.getExtent(proj);
};
