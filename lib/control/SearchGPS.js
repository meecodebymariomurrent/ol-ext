/*	Copyright (c) 2019 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * Search on GPS coordinate.
 *
 * @constructor
 * @extends {ol.control.Search}
 * @fires select
 * @param {Object=} Control options. 
 *  @param {string} options.className control class name
 *  @param {Element | string | undefined} options.target Specify a target if you want the control to be rendered outside of the map's viewport.
 *  @param {string | undefined} options.label Text label to use for the search button, default "search"
 *  @param {string | undefined} options.placeholder placeholder, default "Search..."
 *  @param {number | undefined} options.typing a delay on each typing to start searching (ms), default 300.
 *  @param {integer | undefined} options.minLength minimum length to start searching, default 1
 *  @param {integer | undefined} options.maxItems maximum number of items to display in the autocomplete list, default 10
 */
ol.control.SearchGPS = function(options) {
  if (!options) options = {};
  options.className = (options.className || '') + ' ol-searchgps';
  options.placeholder = options.placeholder || 'lon,lat';
  ol.control.Search.call(this, options);
  // Geolocation
  this.geolocation = new ol.Geolocation({
    projection: "EPSG:4326",
    trackingOptions: {
      maximumAge: 10000,
      enableHighAccuracy: true,
      timeout: 600000
    }
  });
  ol.ext.element.create ('BUTTON', {
    className: 'ol-geoloc',
    title: 'Locate with GPS',
    parent: this.element,
    click: function(){
      this.geolocation.setTracking(true);
    }.bind(this)
  })
  // DMS switcher
  var dms = ol.ext.element.create('LABEL', {
    className: 'ol-switch',
    parent: this.element
  });
  ol.ext.element.create('TEXT', {
    html: 'decimal',
    parent: dms
  });
  ol.ext.element.create('INPUT', {
    type: 'checkbox',
    parent: dms,
    on: {
      'change': function(e) {
        if (e.target.checked) this.element.classList.add('ol-dms');
        else this.element.classList.remove('ol-dms');
      }.bind(this)
    }
  });
  ol.ext.element.create ('SPAN', {
    parent: dms
  });
  ol.ext.element.create('TEXT', {
    html: 'DMS',
    parent: dms
  });
  this._createForm();
  // Move list to the end
  var ul = this.element.querySelector("ul.autocomplete");
  this.element.appendChild(ul);
};
ol.ext.inherits(ol.control.SearchGPS, ol.control.Search);
/** Create input form
 * @private
 */
ol.control.SearchGPS.prototype._createForm = function () {
  // Value has change
  var onchange = function(e) {
    if (e.target.classList.contains('ol-dms')) {
      lon.value = (lond.value<0 ? -1:1) * Number(lond.value) + Number(lonm.value)/60 + Number(lons.value)/3600;
      lon.value = (lond.value<0 ? -1:1) * Math.round(lon.value*10000000)/10000000;
      lat.value = (latd.value<0 ? -1:1) * Number(latd.value) + Number(latm.value)/60 + Number(lats.value)/3600;
      lat.value = (latd.value<0 ? -1:1) * Math.round(lat.value*10000000)/10000000;
    }
    if (lon.value||lat.value) {
      this._input.value = lon.value+','+lat.value;
    } else {
      this._input.value = '';
    }
    if (!e.target.classList.contains('ol-dms')) {
      var s = ol.coordinate.toStringHDMS([Number(lon.value), Number(lat.value)]);
      var c = s.replace(/(N|S|E|W)/g,'').split('″');
      c[1] = c[1].trim().split(' ');
      lond.value = (/W/.test(s) ? -1 : 1) * parseInt(c[1][0]);
      lonm.value = parseInt(c[1][1]);
      lons.value = parseInt(c[1][2]);
      c[0] = c[0].trim().split(' ');
      latd.value = (/W/.test(s) ? -1 : 1) * parseInt(c[0][0]);
      latm.value = parseInt(c[0][1]);
      lats.value = parseInt(c[0][2]);
    }
    this.search();
  }.bind(this);
  function createInput(className, unit) {
    var input = ol.ext.element.create('INPUT', {
      className: className,
      type:'number',
      step:'any',
      lang: 'en',
      parent: div,
      on: {
        'change keyup': onchange
      }
    });
    if (unit) {
      ol.ext.element.create('SPAN', {
        className: 'ol-dms',
        html: unit,
        parent: div,
      });
    }
    return input;
  }
  // Longitude
  var div = ol.ext.element.create('DIV', {
    className: 'ol-longitude',
    parent: this.element
  });
  ol.ext.element.create('LABEL', {
    html: 'Longitude',
    parent: div
  });
  var lon = createInput('ol-decimal');
  var lond = createInput('ol-dms','°');
  var lonm = createInput('ol-dms','\'');
  var lons = createInput('ol-dms','"');
  // Latitude
  div = ol.ext.element.create('DIV', {
    className: 'ol-latitude',
    parent: this.element
  })
  ol.ext.element.create('LABEL', {
    html: 'Latitude',
    parent: div
  });
  var lat = createInput('ol-decimal');
  var latd = createInput('ol-dms','°');
  var latm = createInput('ol-dms','\'');
  var lats = createInput('ol-dms','"');
  // Focus
  this.button.addEventListener("click", function() {
    lon.focus();
  });
  // Change value on click
  this.on('select', function(e){
    lon.value = e.search.gps[0];
    lat.value = e.search.gps[1];
  }.bind(this));
  // Change value on geolocation
  this.geolocation.on('change', function(){
    this.geolocation.setTracking(false);
    var coord = this.geolocation.getPosition();
    lon.value = coord[0];
    lat.value = coord[1];
    this._triggerCustomEvent('keyup', lon);
  }.bind(this));
};
/** Autocomplete function
* @param {string} s search string
* @return {Array<any>|false} an array of search solutions
* @api
*/
ol.control.SearchGPS.prototype.autocomplete = function (s) {
  var result = [];
  var c = s.split(',');
  c[0] = Number(c[0]);
  c[1] = Number(c[1]);
  // Name
  s = ol.coordinate.toStringHDMS(c)
  if (s) s= s.replace(/(°|′|″) /g,'$1');
  // 
  var coord = ol.proj.transform ([c[0], c[1]], 'EPSG:4326', this.getMap().getView().getProjection());
  result.push({ gps: c, coordinate: coord, name: s });
  return result;
};