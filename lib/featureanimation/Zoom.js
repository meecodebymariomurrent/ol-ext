/*
  Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL license (http://www.cecill.info/).
*/
/** Zoom animation: feature zoom in (for points)
 * @constructor
 * @extends {ol.featureAnimation}
 * @param {ol.featureAnimationZoomOptions} options
 *  @param {bool} options.zoomOut to zoom out
 */
ol.featureAnimation.Zoom = function(options){
  options = options || {};
  ol.featureAnimation.call(this, options);
  this.set('zoomout', options.zoomOut);
}
ol.ext.inherits(ol.featureAnimation.Zoom, ol.featureAnimation);
/** Zoom animation: feature zoom out (for points)
 * @constructor
 * @extends {ol.featureAnimation}
 * @param {ol.featureAnimationZoomOptions} options
 */
ol.featureAnimation.ZoomOut = function(options) {
  options = options || {};
  options.zoomOut = true;
  ol.featureAnimation.Zoom.call(this, options);
}
ol.ext.inherits(ol.featureAnimation.ZoomOut, ol.featureAnimation.Zoom);
/** Animate
* @param {ol.featureAnimationEvent} e
*/
ol.featureAnimation.Zoom.prototype.animate = function (e) {
  var fac = this.easing_(e.elapsed);
  if (fac) {
    if (this.get('zoomout')) fac  = 1/fac;
    var style = e.style;
    var i, imgs, sc=[]
    for (i=0; i<style.length; i++) {
      imgs = style[i].getImage();
      if (imgs) {
        sc[i] = imgs.getScale();
        // ol >= v6
        if (e.type==='postrender') imgs.setScale(sc[i]*fac/e.frameState.pixelRatio);
        else imgs.setScale(sc[i]*fac);
      }
    }
    this.drawGeom_(e, e.geom);
    for (i=0; i<style.length; i++) {
      imgs = style[i].getImage();
      if (imgs) imgs.setScale(sc[i]);
    }
  }
/*
  var sc = this.easing_(e.elapsed);
  if (sc)
  {	e.context.save()
    console.log(e)
      var ratio = e.frameState.pixelRatio;
      var m = e.frameState.coordinateToPixelTransform;
      var dx = (1/(sc)-1)* ratio * (m[0]*e.coord[0] + m[1]*e.coord[1] +m[4]);
      var dy = (1/(sc)-1)*ratio * (m[2]*e.coord[0] + m[3]*e.coord[1] +m[5]);
      e.context.scale(sc,sc);
      e.context.translate(dx,dy);
      this.drawGeom_(e, e.geom);
    e.context.restore()
  }
*/
  return (e.time <= this.duration_);
}
