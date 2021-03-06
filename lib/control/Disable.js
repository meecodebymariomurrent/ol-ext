/** A simple control to disable all actions on the map.
 * The control will create an invisible div over the map.
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} options Control options.
 *		@param {String} options.class class of the control
 *		@param {String} options.html html code to insert in the control
 *		@param {bool} options.on the control is on
 *		@param {function} options.toggleFn callback when control is clicked 
 */
ol.control.Disable = function(options)
{	options = options||{};
	var element = document.createElement("div");
			element.className = (options.className||""+' ol-disable ol-unselectable ol-control').trim();
	var stylesOptions = { top:"0px", left:"0px", right:"0px", bottom:"0px", "zIndex":10000, background:"none", display:"none" };
	Object.keys(stylesOptions).forEach(function(styleKey) {
		element.style[styleKey] = stylesOptions[styleKey];
	});
	ol.control.Control.call(this,
	{	element: element
	});
}
ol.ext.inherits(ol.control.Disable, ol.control.Control);
/** Test if the control is on
 * @return {bool}
 * @api stable
 */
ol.control.Disable.prototype.isOn = function()
{	return this.element.classList.contains("ol-disable");
}
/** Disable all action on the map
 * @param {bool} b, default false
 * @api stable
 */
ol.control.Disable.prototype.disableMap = function(b)
{	if (b) 
	{	this.element.classList.add("ol-enable").show();
	}
	else 
	{	this.element.classList.remove("ol-enable").hide();
	}
}
