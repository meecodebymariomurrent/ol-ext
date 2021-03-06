/*	Copyright (c) 2017 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** A simple gauge control to display level information on the map.
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} options Control options.
 *  @param {String} options.className class of the control
 *  @param {String} options.title title of the control
 *  @param {number} options.max maximum value, default 100;
 *  @param {number} options.val the value, default 0
 */
ol.control.Gauge = function(options) {
  options = options || {};
  var element = ol.ext.element.create('DIV', {
    className: ((options.className||"") + ' ol-gauge ol-unselectable ol-control').trim()
  });
  this.title_ = ol.ext.element.create('SPAN', {
    parent: element
  });
  var div =  ol.ext.element.create('DIV', {
    parent: element
  });
  this.gauge_ = ol.ext.element.create('BUTTON', {
    type: 'button',
    style: { width: '0px' },
    parent: div
  });
  /*
  var element = document.createElement("div");
  element.className = ((options.className||"") + ' ol-gauge ol-unselectable ol-control').trim();
  this.title_ = document.createElement("span");
  element.appendChild(this.title_);
  this.gauge_ = document.createElement("button");
  this.gauge_.setAttribute('type','button');
  element.appendChild(document.createElement("div").appendChild(this.gauge_))
  this.gauge_.style.width = '0px';
  */
  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
  this.setTitle(options.title);
  this.set("max", options.max||100);
  this.val(options.val);
};
ol.ext.inherits(ol.control.Gauge, ol.control.Control);
/** Set the control title
* @param {string} title
*/
ol.control.Gauge.prototype.setTitle = function(title) {
  this.title_.innerHTML = title||"";
  if (!title) this.title_.display = 'none';
  else this.title_.display = '';
};
/** Set/get the gauge value
* @param {number|undefined} v the value or undefined to get it
* @return {number} the value
*/
ol.control.Gauge.prototype.val = function(v) {
  if (v!==undefined) {
    this.val_ = v;
    this.gauge_.style.width = (v/this.get('max')*100)+"%";
  }
  return this.val_;
};
