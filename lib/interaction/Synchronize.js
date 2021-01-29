/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** Interaction synchronize
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @param {*} options
 *  @param {Array<ol.Map>} options maps An array of maps to synchronize with the map of the interaction
 */
ol.interaction.Synchronize = function(options) {
  if (!options) options={};
  var self = this;
  ol.interaction.Interaction.call(this, {
    handleEvent: function(e) {
      if (e.type=="pointermove") { self.handleMove_(e); }
      return true;
    }
  });
  this.maps = options.maps;
};
ol.ext.inherits(ol.interaction.Synchronize, ol.interaction.Interaction);
/**
 * Remove the interaction from its current map, if any,  and attach it to a new
 * map, if any. Pass `null` to just remove the interaction from the current map.
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.interaction.Synchronize.prototype.setMap = function(map) {
  if (this._listener) {
    ol.Observable.unByKey(this._listener.center);
    ol.Observable.unByKey(this._listener.rotation);
    ol.Observable.unByKey(this._listener.resolution);
    this.getMap().getTargetElement().removeEventListener('mouseout', this._listener.mouseout);
  }
  this._listener = null;
  ol.interaction.Interaction.prototype.setMap.call (this, map);
  if (map) {
    this._listener = {};
    this._listener.center = this.getMap().getView().on('change:center', this.syncMaps.bind(this));
    this._listener.rotation = this.getMap().getView().on('change:rotation', this.syncMaps.bind(this));
    this._listener.resolution = this.getMap().getView().on('change:resolution', this.syncMaps.bind(this));
    this._listener.mouseout = this.handleMouseOut_.bind(this);
    if (this.getMap().getTargetElement()) {
      this.getMap().getTargetElement().addEventListener('mouseout', this._listener.mouseout);
    }
    this.syncMaps();
  }
};
/** Synchronize the maps
*/
ol.interaction.Synchronize.prototype.syncMaps = function(e) {
  var map = this.getMap();
  if (map.get('lockView')) return;
  if (!e) e = { type:'all' };
  if (map) {
    for (var i=0; i<this.maps.length; i++) {
      this.maps[i].set('lockView', true);
      switch (e.type) {
        case 'change:rotation': {
          if (this.maps[i].getView().getRotation() != map.getView().getRotation())
            this.maps[i].getView().setRotation(map.getView().getRotation()); 
          break;
        }
        case 'change:center': {
          if (this.maps[i].getView().getCenter() != map.getView().getCenter()) {
            this.maps[i].getView().setCenter(map.getView().getCenter()); 
          }
          break;
        }
        case 'change:resolution': {
          if (this.maps[i].getView().getResolution() != map.getView().getResolution()) {
            this.maps[i].getView().setResolution(map.getView().getResolution());
          }
          break;
        }
        default: {
          this.maps[i].getView().setRotation(map.getView().getRotation());
          this.maps[i].getView().setCenter(map.getView().getCenter());
          this.maps[i].getView().setResolution(map.getView().getResolution());
          break;
        }
      }
      this.maps[i].set('lockView', false);
    }
  }
};
/** Cursor move > tells other maps to show the cursor
* @param {ol.event} e "move" event
*/
ol.interaction.Synchronize.prototype.handleMove_ = function(e) {
  for (var i=0; i<this.maps.length; i++) {
    this.maps[i].showTarget(e.coordinate);
  }
  this.getMap().showTarget();
};
/** Cursor out of map > tells other maps to hide the cursor
* @param {event} e "mouseOut" event
*/
ol.interaction.Synchronize.prototype.handleMouseOut_ = function(/*e*/) {
  for (var i=0; i<this.maps.length; i++) {
    if (this.maps[i]._targetOverlay) this.maps[i]._targetOverlay.setPosition(undefined);
  }
};
/** Show a target overlay at coord
* @param {ol.coordinate} coord
*/
ol.Map.prototype.showTarget = function(coord) {
  if (!this._targetOverlay) {
    var elt = document.createElement("div");
    elt.classList.add("ol-target");
    this._targetOverlay = new ol.Overlay({ element: elt });
    this._targetOverlay.setPositioning('center-center');
    this.addOverlay(this._targetOverlay);
    elt.parentElement.classList.add("ol-target-overlay");
    // hack to render targetOverlay before positioning it
    this._targetOverlay.setPosition([0,0]);
  }
  this._targetOverlay.setPosition(coord);
};
/** Hide the target overlay
*/
ol.Map.prototype.hideTarget = function() {
  this.removeOverlay(this._targetOverlay);
  this._targetOverlay = undefined;
};