/*
  Copyright (c) 2016 Jean-Marc VIGLINO, 
  released under the CeCILL license (http://www.cecill.info/).
*/
/** Do nothing 
 * @constructor
 * @extends {ol.featureAnimation}
 */
ol.featureAnimation.Null = function() {
  ol.featureAnimation.call(this, { duration:0 });
};
ol.ext.inherits(ol.featureAnimation.Null, ol.featureAnimation);
