/*	Copyright (c) 2017 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * Search places using the French National Base Address (BAN) API.
 *
 * @constructor
 * @extends {ol.control.Search}
 * @fires select
 * @param {Object=} Control options.
 *  @param {string} options.className control class name
 *  @param {Element | string | undefined} options.target Specify a target if you want the control to be rendered outside of the map's viewport.
 *  @param {string | undefined} options.label Text label to use for the search button, default "search"
 *  @param {string | undefined} options.placeholder placeholder, default "Search..."
 *  @param {number | undefined} options.typing a delay on each typing to start searching (ms), default 500.
 *  @param {integer | undefined} options.minLength minimum length to start searching, default 3
 *  @param {integer | undefined} options.maxItems maximum number of items to display in the autocomplete list, default 10
 *
 *  @param {string|undefined} options.url Url to BAN api, default "https://api-adresse.data.gouv.fr/search/"
 *  @param {boolean} options.position Search, with priority to geo position, default false
 *  @param {function} options.getTitle a function that takes a feature and return the text to display in the menu, default return label attribute
 * @see {@link https://adresse.data.gouv.fr/api/}
 */
ol.control.SearchBAN = function(options) {
  options = options || {};
  options.typing = options.typing || 500;
  options.url = options.url || 'https://api-adresse.data.gouv.fr/search/';
  options.className = options.className || 'BAN';
  options.copy = '<a href="https://adresse.data.gouv.fr/" target="new">&copy; BAN-data.gouv.fr</a>';
  ol.control.SearchPhoton.call(this, options);
};
ol.ext.inherits(ol.control.SearchBAN, ol.control.SearchPhoton);
/** Returns the text to be displayed in the menu
 * @param {ol.Feature} f the feature
 * @return {string} the text to be displayed in the index
 * @api
 */
ol.control.SearchBAN.prototype.getTitle = function (f) {
  var p = f.properties;
  return (p.label);
};
/** A ligne has been clicked in the menu > dispatch event
 * @param {any} f the feature, as passed in the autocomplete
 * @api
 */
ol.control.SearchBAN.prototype.select = function (f){
  var c = f.geometry.coordinates;
  // Add coordinate to the event
  try {
    c = ol.proj.transform (f.geometry.coordinates, 'EPSG:4326', this.getMap().getView().getProjection());
  } catch(e) { /* ok */ }
  this.dispatchEvent({ type:"select", search:f, coordinate: c });
};
