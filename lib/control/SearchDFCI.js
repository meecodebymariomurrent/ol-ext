/*	Copyright (c) 2017 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * Search on DFCI grid.
 *
 * @constructor
 * @extends {ol.control.Search}
 * @fires select
 * @param {Object=} Control options. 
 *	@param {string} options.className control class name
 *	@param {Element | string | undefined} options.target Specify a target if you want the control to be rendered outside of the map's viewport.
 *	@param {string | undefined} options.label Text label to use for the search button, default "search"
 *	@param {string | undefined} options.placeholder placeholder, default "Search..."
 *	@param {number | undefined} options.typing a delay on each typing to start searching (ms), default 300.
 *	@param {integer | undefined} options.minLength minimum length to start searching, default 1
 *	@param {integer | undefined} options.maxItems maximum number of items to display in the autocomplete list, default 10
 *
 *	@param {string | undefined} options.property a property to display in the index, default 'name'.
 *	@param {function} options.getTitle a function that takes a feature and return the name to display in the index, default return the property 
 *	@param {function | undefined} options.getSearchString a function that take a feature and return a text to be used as search string, default geTitle() is used as search string
 */
ol.control.SearchDFCI = function(options) {
  if (!options) options = {};
  options.className = options.className || 'dfci';
  options.placeholder = options.placeholder || 'Code DFCI';
  ol.control.Search.call(this, options);
};
ol.ext.inherits(ol.control.SearchDFCI, ol.control.Search);
/** Autocomplete function
* @param {string} s search string
* @return {Array<any>|false} an array of search solutions or false if the array is send with the cback argument (asnchronous)
* @api
*/
ol.control.SearchDFCI.prototype.autocomplete = function (s) {
  s = s.toUpperCase();
  s = s.replace(/[^0-9,^A-H,^K-N]/g,'');
  if (s.length<2) {
    this.setInput(s);
    return [];
  }
  var i;
  var proj = this.getMap().getView().getProjection();
  var result = [];
  var c = ol.coordinate.fromDFCI(s, proj);
  var level = Math.floor(s.length/2)-1;
  var dfci = ol.coordinate.toDFCI(c, level, proj);
  dfci = dfci.replace(/[^0-9,^A-H,^K-N]/g,'');
  // Valid DFCI ?
  if (!/NaN/.test(dfci) && dfci) {
    console.log('ok', dfci)
    this.setInput(dfci + s.substring(dfci.length, s.length));
    result.push({ coordinate: ol.coordinate.fromDFCI(dfci, proj), name: dfci });
    if (s.length===5) {
      c = ol.coordinate.fromDFCI(s+0, proj);
      dfci = (ol.coordinate.toDFCI(c, level+1, proj)).substring(0,5);
      for (i=0; i<10; i++) {
        result.push({ coordinate: ol.coordinate.fromDFCI(dfci+i, proj), name: dfci+i });
      }
    }
    if (level === 2) {
      for (i=0; i<6; i++) {
        result.push({ coordinate: ol.coordinate.fromDFCI(dfci+'.'+i, proj), name: dfci+'.'+i });
      }
    }
  }
  return result;
};