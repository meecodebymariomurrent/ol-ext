/** An interaction to check the current map.
 * It will fire a 'focus' event on the map when map is focused (use mapCondition option to handle the condition when the map is focused).
 * @constructor
 * @fires focus
 * @param {*} options
 *  @param {function} condition a function that takes a mapBrowserEvent and returns true if the map must be activated, default always true
 *  @param {function} onKeyDown a function that takes a keydown event is fired on the active map
 *  @param {function} onKeyPress a function that takes a keypress event is fired on the active map
 *  @param {function} onKeyUp a function that takes a keyup event is fired on the active map
 * @extends {ol.interaction.Interaction}
 */
ol.interaction.CurrentMap = function(options) {
  options = options || {};
  var condition = options.condition || function() {
    return true;
  }
  // Check events on the map
  ol.interaction.Interaction.call(this, {
    handleEvent: function(e) {
      if (condition(e)) {
        if (!this.isCurrentMap()) {
          this.setCurrentMap(this.getMap());
          this.dispatchEvent({ type: 'focus', map: this.getMap() });
          this.getMap().dispatchEvent({ type: 'focus', map: this.getMap() });
        }
      }
      return true;
    }.bind(this)
  });
  // Add a key listener
  if (options.onKeyDown) { 
    document.addEventListener('keydown', function(e) {
      if (this.isCurrentMap() && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        options.onKeyDown ({ type: e.type, map: this.getMap(), originalEvent: e });
      }
    }.bind(this));
  }
  if (options.onKeyPress) { 
    document.addEventListener('keydown', function(e) {
      if (this.isCurrentMap() && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        options.onKeyPress ({ type: e.type, map: this.getMap(), originalEvent: e });
      }
    }.bind(this));
  }
  if (options.onKeyUp) { 
    document.addEventListener('keydown', function(e) {
      if (this.isCurrentMap() && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        options.onKeyUp ({ type: e.type, map: this.getMap(), originalEvent: e });
      }
    }.bind(this));
  }
};
ol.ext.inherits(ol.interaction.CurrentMap, ol.interaction.Interaction);
/** The current map */
ol.interaction.CurrentMap.prototype._currentMap = undefined;
/** Check if is the current map 
 * @return {boolean}
 */
ol.interaction.CurrentMap.prototype.isCurrentMap = function() {
  return this.getMap() === ol.interaction.CurrentMap.prototype._currentMap;
};
/** Get the current map
 * @return {ol.Map}
 */
ol.interaction.CurrentMap.prototype.getCurrentMap = function() {
  return ol.interaction.CurrentMap.prototype._currentMap;
};
/** Set the current map
 * @param {ol.Map} map
 */
ol.interaction.CurrentMap.prototype.setCurrentMap = function(map) {
  ol.interaction.CurrentMap.prototype._currentMap = map;
};
