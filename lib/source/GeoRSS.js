/*	Copyright (c) 2019 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** ol.source.GeoRSS is a source that load Wikimedia Commons content in a vector layer.
 * @constructor 
 * @extends {ol.source.Vector}
 * @param {*} options source options
 *  @param {string} options.url GeoRSS feed url
 */
ol.source.GeoRSS = function(options) {
  options = options || {};
  options.loader = this._loaderFn;
  ol.source.Vector.call (this, options);
};
ol.ext.inherits(ol.source.GeoRSS, ol.source.Vector);
/** Loader function used to load features.
* @private
*/
ol.source.GeoRSS.prototype._loaderFn = function(extent, resolution, projection){
  // Ajax request to get source
  ol.ext.Ajax.get({
    url: this.getUrl(),
    dataType: 'XML',
    error: function(){ console.log('oops'); },
    success: function(xml) {
      var features = (new ol.format.GeoRSS()).readFeatures(xml, { featureProjection: projection });
      this.addFeatures(features);
    }.bind(this)
  });
};
