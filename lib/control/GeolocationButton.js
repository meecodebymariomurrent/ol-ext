/*	Copyright (c) 2016 Jean-Marc VIGLINO,
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Geolocation bar
 * The control bar is a container for other controls. It can be used to create toolbars.
 * Control bars can be nested and combined with ol.control.Toggle to handle activate/deactivate.
 *
 * @constructor
 * @fires tracking
 * @extends {ol.control.Toggle}
 * @param {Object=} options ol.interaction.GeolocationDraw option.
 *  @param {String} options.className class of the control
 *  @param {number} options.delay delay before removing the location in ms, delfaut 3000 (3s)
 */
ol.control.GeolocationButton = function(options) {
  if (!options) options = {};
  // Geolocation draw interaction
  options.followTrack = options.followTrack || 'auto';
  options.zoom = options.zoom || 16;
  //options.minZoom = options.minZoom || 16;
  var interaction = new ol.interaction.GeolocationDraw(options);
  ol.control.Toggle.call (this, {
    className: options.className = ((options.className || '') + ' ol-geobt').trim(),
    interaction: interaction,
    onToggle: function() {
      interaction.pause(true);
      interaction.setFollowTrack(options.followTrack || 'auto');
    }
  });
  this.setActive(false);
  interaction.on('tracking', function(e) {
    this.dispatchEvent({ type: 'position', coordinate: e.geolocation.getPosition() });
  }.bind(this));
  // Timeout delay
  var tout;
  interaction.on('change:active', function() {
    this.dispatchEvent({ type:'position' });
    if (tout) {
      clearTimeout(tout);
      tout = null;
    }
    if (interaction.getActive()) {
      tout = setTimeout(function() {
        interaction.setActive(false);
        tout = null;
      }.bind(this), options.delay || 3000);
    }
  }.bind(this));
};
ol.ext.inherits(ol.control.GeolocationButton, ol.control.Toggle);
