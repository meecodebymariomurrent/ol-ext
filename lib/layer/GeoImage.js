/*	Copyright (c) 2019 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * @classdesc
 * Image layer to use with a GeoImage source and return the extent calcaulted with this source.
 * @extends {ol.layer.Image}
 * @param {Object=} options Layer Image options.
 * @api
 */
ol.layer.GeoImage = function(options) {
  ol.layer.Image.call(this, options);
}
ol.ext.inherits (ol.layer.GeoImage, ol.layer.Image);
/**
 * Return the {@link module:ol/extent~Extent extent} of the source associated with the layer.
 * @return {ol.Extent} The layer extent.
 * @observable
 * @api
 */
ol.layer.GeoImage.prototype.getExtent = function() {
  return this.getSource().getExtent();
}
