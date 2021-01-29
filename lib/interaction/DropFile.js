/** Extend DragAndDrop choose drop zone + fires loadstart, loadend
 * @constructor
 * @extends {ol.interaction.DragAndDrop}
 * @fires loadstart, loadend, addfeatures
 * @param {*} options
 *  @param {string} options.zone selector for the drop zone, default document
 *  @param{ol.projection} options.projection default projection of the map
 *  @param {Array<function(new:ol.format.Feature)>|undefined} options.formatConstructors Format constructors, default [ ol.format.GPX, ol.format.GeoJSONX, ol.format.GeoJSONP, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON ]
 *  @param {Array<string>|undefined} options.accept list of eccepted format, default ["gpx","json","geojsonx","geojsonp","geojson","igc","kml","topojson"]
 */
ol.interaction.DropFile = function(options) {
  options = options||{};
  ol.interaction.DragAndDrop.call(this, {});
  var zone = options.zone || document;
  zone.addEventListener('dragenter', this.onstop );
  zone.addEventListener('dragover', this.onstop );
  zone.addEventListener('dragleave', this.onstop );
  // Options
  this.formatConstructors_ = options.formatConstructors || [ ol.format.GPX, ol.format.GeoJSONX, ol.format.GeoJSONP, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON ];
  this.projection_ = options.projection;
  this.accept_ = options.accept || ["gpx","json","geojsonx","geojsonp","geojson","igc","kml","topojson"];
  var self = this;
  zone.addEventListener('drop', function(e){ return self.ondrop(e);});
};
ol.ext.inherits(ol.interaction.DropFile, ol.interaction.DragAndDrop);
/** Set the map
*/
ol.interaction.DropFile.prototype.setMap = function(map) {
  ol.interaction.Interaction.prototype.setMap.call(this, map);
};
/** Do something when over
*/
ol.interaction.DropFile.prototype.onstop = function(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}
/** Do something when over
*/
ol.interaction.DropFile.prototype.ondrop = function(e) {
  e.preventDefault();
  if (e.dataTransfer && e.dataTransfer.files.length) {
    var self = this;
    // fetch FileList object
    var files = e.dataTransfer.files; // e.originalEvent.target.files ?
    // process all File objects
    var file;
    var pat = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/;
    for (var i=0; file=files[i]; i++) {
      var ex = file.name.match(pat)[0];
      self.dispatchEvent({ type:'loadstart', file: file, filesize: file.size, filetype: file.type, fileextension: ex, projection: projection, target: self });
      // Load file
      var reader = new FileReader();
      var projection = this.projection_ || (this.getMap() ? this.getMap().getView().getProjection() : null);
      var formatConstructors = this.formatConstructors_
      //if (!projection) return;
      var tryReadFeatures = function (format, result, options) {
        try {
          return format.readFeatures(result, options);
        } catch (e) { /* ok */ }
      }
      var theFile = file;
      reader.onload = function(e) {
        var result = e.target.result;
        var features = [];
        var i, ii;
        for (i = 0, ii = formatConstructors.length; i < ii; ++i) {
          var formatConstructor = formatConstructors[i];
          var format = new formatConstructor();
          features = tryReadFeatures(format, result, { featureProjection: projection });
          if (features && features.length > 0) {
            self.dispatchEvent({ type:'addfeatures', features: features, file: theFile, projection: projection, target: self });
            self.dispatchEvent({ type:'loadend', features: features, file: theFile, projection: projection, target: self });
            return;
          }
        }
        self.dispatchEvent({ type:'loadend', file: theFile, target: self });
      };
      reader.readAsText(file);
    }
  }
  return false;
};
