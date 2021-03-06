/*	Copyright (c) 2016 Jean-Marc VIGLINO,
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** A simple push button control
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} options Control options.
 *  @param {String} options.className class of the control
 *  @param {String} options.title title of the control
 *  @param {String} options.name an optional name, default none
 *  @param {String} options.html html to insert in the control
 *  @param {function} options.handleClick callback when control is clicked (or use change:active event)
 */
ol.control.Button = function(options){
  options = options || {};
  var element = document.createElement("div");
  element.className = (options.className || '') + " ol-button ol-unselectable ol-control";
  var self = this;
  var bt = this.button_ = document.createElement(/ol-text-button/.test(options.className) ? "div": "button");
  bt.type = "button";
  if (options.title) bt.title = options.title;
  if (options.html instanceof Element) bt.appendChild(options.html)
  else bt.innerHTML = options.html || "";
  var evtFunction = function(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (options.handleClick) {
      options.handleClick.call(self, e);
    }
  };
  bt.addEventListener("click", evtFunction);
  bt.addEventListener("touchstart", evtFunction);
  element.appendChild(bt);
  // Try to get a title in the button content
  if (!options.title && bt.firstElementChild) {
    bt.title = bt.firstElementChild.title;
  }
  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
  if (options.title) {
    this.set("title", options.title);
  }
  if (options.title) this.set("title", options.title);
  if (options.name) this.set("name", options.name);
};
ol.ext.inherits(ol.control.Button, ol.control.Control);
/** Set the control visibility
* @param {boolean} b 
*/
ol.control.Button.prototype.setVisible = function (val) {
  if (val) ol.ext.element.show(this.element);
  else ol.ext.element.hide(this.element);
};
/**
 * Set the button title
 * @param {string} title
 * @returns {undefined}
 */
ol.control.Button.prototype.setTitle = function(title) {
  this.button_.setAttribute('title', title);
};
/**
 * Set the button html
 * @param {string} html
 * @returns {undefined}
 */
ol.control.Button.prototype.setHtml = function(html) {
  ol.ext.element.setHTML (this.button_, html);
};
/**
 * Get the button element
 * @returns {undefined}
 */
ol.control.Button.prototype.getButtonElement = function() {
  return this.button_;
};
