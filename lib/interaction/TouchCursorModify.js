/*	Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
  (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/
/** TouchCursor interaction + ModifyFeature
 * @constructor
 * @extends {ol.interaction.TouchCursor}
 * @param {olx.interaction.InteractionOptions} options Options
 *  @param {string} options.className cursor class name
 *  @param {ol.coordinate} options.coordinate cursor position
 *	@param {ol.source.Vector} options.source a source to modify (configured with useSpatialIndex set to true)
 *	@param {ol.source.Vector|Array<ol.source.Vector>} options.sources a list of source to modify (configured with useSpatialIndex set to true)
 *  @param {ol.Collection.<ol.Feature>} options.features collection of feature to modify
 *  @param {function|undefined} options.filter a filter that takes a feature and return true if it can be modified, default always true.
 *  @param {number} pixelTolerance Pixel tolerance for considering the pointer close enough to a segment or vertex for editing, default 10
 *  @param {ol.style.Style | Array<ol.style.Style> | undefined} options.style Style for the sketch features.
 *  @param {boolean} options.wrapX Wrap the world horizontally on the sketch overlay, default false
 */
ol.interaction.TouchCursorModify = function(options) {
  options = options || {};
  var drag = false;       // enable drag
  var dragging = false;   // dragging a point
  var del = false;        // deleting a point
  // Modify interaction
  var mod = this._modify = new ol.interaction.ModifyFeature ({ 
    source: options.source,
    sources: options.sources,
    features: options.features,
    pixelTolerance: options.pixelTolerance,
    filter: options.filter,
    style: options.style || [ 
      new ol.style.Style({
        image: new ol.style.RegularShape ({
          points: 4,
          radius: 10,
          radius2: 0,
          stroke: new ol.style.Stroke({
            color: [255,255,255, .5],
            width: 3
          })
        })
      }),
      new ol.style.Style({
        image: new ol.style.RegularShape ({
          points: 4,
          radius: 10,
          radius2: 0,
          stroke: new ol.style.Stroke({
            color: [0, 153, 255, 1],
            width: 1.25
          })
        })
      })
    ],
    wrapX: options.wrapX,
    condition: function(e) {
      return e.dragging || dragging;
    },
    deleteCondition: function() {
      return del;
    }
  });
  ol.interaction.TouchCursor.call(this, {
    className: ('disable '+options.className).trim(),
    coordinate: options.coordinate,
    buttons: [{
        // Dragging button
        className: 'ol-button-move', 
        on: { 
          pointerdown: function() { drag = true; },
          pointerup: function() { drag = false; }
        }
      }, { 
        // Add a new point to a line
        className: 'ol-button-add', 
        click: function() { 
          dragging = true;
          mod.handleDownEvent(this._lastEvent);
          mod.handleUpEvent(this._lastEvent);
          dragging = false;
        }.bind(this)
      }, { 
        // Remove a point
        className: 'ol-button-remove', 
        click: function() { 
          del = true;
          mod.handleDownEvent(this._lastEvent); 
          del = false;
        }.bind(this)
      }
    ]
  });
  // Show when modification is active
  mod.on('select', function(e) {
    if (e.selected.length) {
      this.getOverlayElement().classList.remove('disable')
    } else {
      this.getOverlayElement().classList.add('disable')
    }
  }.bind(this));
  // Handle dragging, prevent drag outside the control
  this.on('dragstart', function() {
    if (drag) {
      mod.handleDownEvent(this._lastEvent);
    }
  }.bind(this));
  this.on('dragging', function(e) {
    if (drag) mod.handleDragEvent(e);
  });
  this.on('dragend', function(e) {
    mod.handleUpEvent(e);
    drag = false;
  });
};
ol.ext.inherits(ol.interaction.TouchCursorModify, ol.interaction.TouchCursor);
/**
 * Remove the interaction from its current map, if any,  and attach it to a new
 * map, if any. Pass `null` to just remove the interaction from the current map.
 * @param {_ol_Map_} map Map.
 * @api stable
 */
ol.interaction.TouchCursorModify.prototype.setMap = function(map) {
  if (this.getMap()) {
    this.getMap().removeInteraction(this._modify);
  }
  if (map) {
    map.addInteraction(this._modify);
  }
  ol.interaction.TouchCursor.prototype.setMap.call (this, map);
};
/**
 * Activate or deactivate the interaction.
 * @param {boolean} active Active.
 * @param {ol.coordinate|null} position position of the cursor (when activating), default viewport center.
 * @observable
 * @api
 */
ol.interaction.TouchCursorModify.prototype.setActive = function(b, position) {
  ol.interaction.TouchCursor.prototype.setActive.call (this, b, position);
  this._modify.setActive(b);
};
/**
 * Get the modify interaction.
 * @retunr {ol.interaction.ModifyFeature} 
 * @observable
 * @api
 */
ol.interaction.TouchCursorModify.prototype.getInteraction = function() {
  return this._modify;
};
