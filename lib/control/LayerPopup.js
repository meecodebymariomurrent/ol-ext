/*	Copyright (c) 2015 Jean-Marc VIGLINO, 
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/**
 * OpenLayers Layer Switcher Control.
 *
 * @constructor
 * @extends {ol.control.LayerSwitcher}
 * @param {Object=} options Control options.
 */
ol.control.LayerPopup = function(options) {
  options = options || {};
	options.switcherClass="ol-layerswitcher-popup";
	if (options.mouseover!==false) options.mouseover=true;
	ol.control.LayerSwitcher.call(this, options);
};
ol.ext.inherits(ol.control.LayerPopup, ol.control.LayerSwitcher);
/** Disable overflow
*/
ol.control.LayerPopup.prototype.overflow = function(){};
/** Render a list of layer
 * @param {elt} element to render
 * @layers {Array{ol.layer}} list of layer to show
 * @api stable
 */
ol.control.LayerPopup.prototype.drawList = function(ul, layers) {	
  var self=this;
	var setVisibility = function(e) {
    e.preventDefault(); 
		var l = self._getLayerForLI(this);
		self.switchLayerVisibility(l,layers);
		if (e.type=="touchstart") self.element.classList.add("ol-collapsed");
	};
	layers.forEach(function(layer) {
    if (self.displayInLayerSwitcher(layer)) {
      var d = ol.ext.element.create('LI', {
        html: layer.get("title") || layer.get("name"),
        on: { 'click touchstart': setVisibility },
        parent: ul
      });
      self._setLayerForLI(d, layer);
			if (self.testLayerVisibility(layer)) d.classList.add("ol-layer-hidden");
			if (layer.getVisible()) d.classList.add('ol-visible');
		}
	});
};
