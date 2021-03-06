/*	Copyright (c) 2018 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * OSM layer using the Ovepass API
 * @constructor ol.source.Overpass
 * @extends {ol.source.Vector}
 * @param {any} options
 *  @param {string} options.url service url, default: https://overpass-api.de/api/interpreter
 *  @param {Array<string>} options.filter an array of tag filters, ie. ["key", "key=value", "key~value", ...]
 *  @param {boolean} options.node get nodes, default: true
 *  @param {boolean} options.way get ways, default: true
 *  @param {boolean} options.rel get relations, default: false
 *  @param {number} options.maxResolution maximum resolution to load features
 *  @param {string|ol.Attribution|Array<string>} options.attributions source attribution, default OSM attribution
 *  @param {ol.loadingstrategy} options.strategy loading strategy, default ol.loadingstrategy.bbox
 */
ol.source.Overpass = function(options) {
	options = options || {};
	options.loader = this._loaderFn;
	/** Ovepass API Url */
	this._url = options.url || 'https://overpass-api.de/api/interpreter';
	/** Max resolution to load features  */
	this._maxResolution = options.maxResolution || 100;
	/** Default attribution */
	if (!options.attributions) {
    options.attributions = ol.source.OSM.ATTRIBUTION;
  }
	// Bbox strategy : reload at each move
  if (!options.strategy) options.strategy = ol.loadingstrategy.bbox;
  ol.source.Vector.call (this, options);
  this._types = {
    node: options.node!==false,
    way: options.way!==false,
    rel: options.rel===true
  };
  this._filter = options.filter;
};
ol.ext.inherits(ol.source.Overpass, ol.source.Vector);
/** Loader function used to load features.
* @private
*/
ol.source.Overpass.prototype._loaderFn = function(extent, resolution, projection) {
  if (resolution > this._maxResolution) return;
	var self = this;
  var bbox = ol.proj.transformExtent(extent, projection, "EPSG:4326");
  bbox = bbox[1] + ',' + bbox[0] + ',' + bbox[3] + ',' + bbox[2];
  // Overpass QL
  var query = '[bbox:'+bbox+'][out:xml][timeout:25];';
  query += '(';
  // Search attributes
  for (var t in this._types) {
    if (this._types[t]) {
      query += t;
      for (var n=0, filter; filter = this._filter[n]; n++) {
        query += '['+filter+']';
      }
      query += ';'
    }
  }
  query +=');out;>;out skel qt;'
  var ajax = new XMLHttpRequest();
	ajax.open('POST', this._url, true);
	ajax.onload = function () {
    var features = new ol.format.OSMXML().readFeatures(this.responseText,{featureProjection: projection});
    var result = [];
    // Remove duplicated features
    for (var i=0, f; f=features[i]; i++) {
      if (!self.hasFeature(f)) result.push(f);
    }
    self.addFeatures(result);
	};
	ajax.onerror = function () {
		console.log(arguments);
	};
  ajax.send('data='+query);
};
/**
 * Search if feature is allready loaded
 * @param {ol.Feature} feature
 * @return {boolean} 
 * @private
 */
ol.source.Overpass.prototype.hasFeature = function(feature) {
	var p = feature.getGeometry().getFirstCoordinate();
	var id = feature.getId();
	var existing = this.getFeaturesInExtent([p[0]-0.1, p[1]-0.1, p[0]+0.1, p[1]+0.1]);
	for (var i=0, f; f=existing[i]; i++) {
		if (id===f.getId()) {
      return true;
    }
	}
	return false;
};
