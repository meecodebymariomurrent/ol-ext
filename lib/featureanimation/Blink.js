/*
  Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL license (http://www.cecill.info/).
*/
/** Blink a feature
 * @constructor
 * @extends {ol.featureAnimation}
 * @param {ol.featureAnimationOptions} options
 *  @param {Number} options.nb number of blink, default 10
 */
ol.featureAnimation.Blink = function(options) {
  ol.featureAnimation.call(this, options);
  this.set('nb', options.nb || 10)
}
ol.ext.inherits(ol.featureAnimation.Blink, ol.featureAnimation);
/** Animate: Show or hide feature depending on the laptimes
* @param {ol.featureAnimationEvent} e
*/
ol.featureAnimation.Blink.prototype.animate = function (e) {	
  if (!(Math.round(this.easing_(e.elapsed)*this.get('nb'))%2)) {
    this.drawGeom_(e, e.geom);
  }
  return (e.time <= this.duration_);
}
