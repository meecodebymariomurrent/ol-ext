/*	Copyright (c) 2017 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Control overlay for OL3
 * The overlay control is a control that display an overlay over the map
 *
 * @constructor
 * @extends {ol.control.Control}
 * @fire change:visible
 * @param {Object=} options Control options.
 *	@param {String} options.className class of the control
*	@param {String|Element} options.content
*	@param {bool} options.hideOnClick hide the control on click, default false
*	@param {bool} options.closeBox add a closeBox to the control, default false
*/
ol.control.Overlay = function(options) {
  if (!options) options={};
/*
  var element = document.createElement("div");
  element.classList.add('ol-unselectable', 'ol-overlay');
  //if (options.className) element.classList.add(options.className);
*/
  var element = ol.ext.element.create('DIV', {
    className: 'ol-unselectable ol-overlay '+(options.className||''),
    html: options.content
  });
  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
  var self = this;
  if (options.hideOnClick) element.addEventListener("click", function(){self.hide();});
  this.set("closeBox", options.closeBox);
  this._timeout = false;
  this.setContent (options.content);
};
ol.ext.inherits(ol.control.Overlay, ol.control.Control);
/** Set the content of the overlay
* @param {string|Element} html the html to display in the control
*/
ol.control.Overlay.prototype.setContent = function (html) {
  var self = this;
  if (html) {
    var elt = this.element;
    if (html instanceof Element) {
      elt.innerHTML='';
      elt.appendChild(html)
    }
    else if (html!==undefined) elt.innerHTML = html;
    if (this.get("closeBox")) {
      var cb = document.createElement("div");
      cb.classList.add("ol-closebox");
      cb.addEventListener("click", function(){self.hide();});
      elt.insertBefore(cb, elt.firstChild);
    }
  }
};
/** Set the control visibility
* @param {string|Element} html the html to display in the control
* @param {ol.coordinate} coord coordinate of the top left corner of the control to start from
*/
ol.control.Overlay.prototype.show = function (html, coord) {
  var self = this;
  var elt = this.element;
  elt.style.display = 'block';
  if (coord) {
    this.center_ = this.getMap().getPixelFromCoordinate(coord);
    elt.style.top = this.center_[1]+'px';
    elt.style.left = this.center_[0]+'px';
  } else {
    //TODO: Do fix from  hkollmann pull request
    this.center_ = false;
    elt.style.top = "";
    elt.style.left = "";
  }
  if (html) this.setContent(html);
  if (this._timeout) clearTimeout(this._timeout);
  this._timeout = setTimeout(function() {
    elt.classList.add("ol-visible")
    elt.style.top = "";
    elt.style.left = "";
    self.dispatchEvent({ type:'change:visible', visible:true, element: self.element });
  }, 10);
};
/** Show an image
 * @param {string} src image url
 * @param {*} options
 *  @param {string} options.title
 *  @param {ol.coordinate} coordinate
 */
ol.control.Overlay.prototype.showImage = function (src, options) {
  options = options || {};
  var content = ol.ext.element.create('DIV', {
    className: 'ol-fullscreen-image'
  });
  ol.ext.element.create('IMG', {
    src: src,
    parent: content
  });
  if (options.title) {
    content.classList.add('ol-has-title');
    ol.ext.element.create('P', { 
      html: options.title,
      parent: content
    });
  }
  this.show(content, options.coordinate);
};
/** Set the control visibility hidden
*/
ol.control.Overlay.prototype.hide = function () {
  var elt = this.element;
  this.element.classList.remove("ol-visible");
  if (this.center_) {
    elt.style.top = this.center_[1]+'px';
    elt.style.left = this.center_[0]+'px';
    this.center_ = false;
  }
  if (this._timeout) clearTimeout(this._timeout);
  this._timeout = setTimeout(function(){ elt.style.display = 'none'; }, 500);
  this.dispatchEvent({ type:'change:visible', visible:false, element: this.element });
};
/** Toggle control visibility
*/
ol.control.Overlay.prototype.toggle = function () {	
  if (this.getVisible()) this.hide();
  else this.show();
}
/** Get the control visibility
* @return {boolean} b
*/
ol.control.Overlay.prototype.getVisible = function () {
  return ol.ext.element.getStyle(this.element, 'display') !== 'none';
};
/** Change class name
* @param {String} className a class name or a list of class names separated by a space
*/
ol.control.Overlay.prototype.setClass = function (className) {
  var vis = this.element.classList.contains('ol-visible');
  this.element.className = ('ol-unselectable ol-overlay '+(vis ? 'ol-visible ' : '')+className).trim();
};
