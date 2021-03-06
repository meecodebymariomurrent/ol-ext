/** 
 * @classdesc
 * Application dialog
 * @extends {ol.control.Control}
 * @constructor
 * @param {*} options
 *  @param {string} options.className
 *  @param {ol.Map} options.map the map to place the dialog inside
 *  @param {Element} options.target target to place the dialog
 *  @param {boolean} options.zoom add a zoom effect
 *  @param {boolean} options.closeBox add a close button
 *  @param {boolean} options.hideOnClick close dialog when click the background
 *  @param {boolean} options.noSubmit Prevent closing the dialog on submit
 */
ol.control.Dialog = function(options) {
  options = options || {};
  // Constructor
  var element = ol.ext.element.create('DIV', {
    className: ((options.className || '') + (options.zoom ? ' ol-zoom':'') + ' ol-ext-dialog').trim(),
    click: function() {
      if (this.get('hideOnClick')) this.close();
    }.bind(this)
  });
  // form
  var form = ol.ext.element.create('FORM', {
    on: {
      submit: this._onButton('submit')
    },
    parent: element
  });
  // Title
  ol.ext.element.create('H2', {
    parent: form
  });
  // Close box
  ol.ext.element.create('DIV', {
    className: 'ol-closebox',
    click: this._onButton('cancel'),
    parent: form
  });
  // Content
  ol.ext.element.create('DIV', {
    className: 'ol-content',
    parent: form
  });
  // Buttons
  ol.ext.element.create('DIV', {
    className: 'ol-buttons',
    parent: form
  });
  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
  this.set('closeBox', options.closeBox);
  this.set('zoom', options.zoom);
  this.set('hideOnClick', options.hideOnClick);
  this.set('className', options.className);
  this.set('closeOnSubmit', options.closeOnSubmit);
};
ol.ext.inherits(ol.control.Dialog, ol.control.Control);
/** Show a new dialog 
 * @param { * | Element | string } options options or a content to show
 *  @param {Element | string} options.content dialog content
 *  @param {string} options.title title of the dialog
 *  @param {Object} options.buttons a key/value list of button to show 
 */
ol.control.Dialog.prototype.show = function(options) {
  if (options instanceof Element || typeof(options) === 'string') {
    options = { content: options };
  }
  this.setContent(options);
  this.element.classList.add('ol-visible');
  this.dispatchEvent ({ type: 'show' });
};
/** Open the dialog
 */
ol.control.Dialog.prototype.open = function() {
  this.show();
};
/** Set the dialog content
 * @param {*} options
 *  @param {Element | String} options.content dialog content
 *  @param {string} options.title title of the dialog
 *  @param {string} options.className dialog class name
 *  @param {Object} options.buttons a key/value list of button to show 
 */
ol.control.Dialog.prototype.setContent = function(options) {
  if (!options) return;
  this.element.className = 'ol-ext-dialog' + (this.get('zoom') ? ' ol-zoom' : '');
  if (options.className) {
    this.element.classList.add(options.className);
  } else if (this.get('className')) {
    this.element.classList.add(this.get('className'));
  }
  var form = this.element.querySelector('form');
  if (options.content instanceof Element) ol.ext.element.setHTML(form.querySelector('.ol-content'), '');
  ol.ext.element.setHTML(form.querySelector('.ol-content'), options.content || '');
  // Title
  form.querySelector('h2').innerText = options.title || '';
  if (options.title) {
    form.classList.add('ol-title');
  } else {
    form.classList.remove('ol-title');
  }
  // Closebox
  if (options.closeBox || (this.get('closeBox') && options.closeBox !== false)) {
    form.classList.add('ol-closebox');
  } else {
    form.classList.remove('ol-closebox');
  }
  // Buttons
  var buttons = this.element.querySelector('.ol-buttons');
  buttons.innerHTML = '';
  if (options.buttons) {
    form.classList.add('ol-button');
    for (var i in options.buttons) {
      ol.ext.element.create ('INPUT', {
        type: (i==='submit' ? 'submit':'button'),
        value: options.buttons[i],
        click: this._onButton(i),
        parent: buttons
      });
    }
  } else {
    form.classList.remove('ol-button');
  }
};
/** Do something on button click
 * @private
 */
ol.control.Dialog.prototype._onButton = function(button) {
  // Dispatch a button event
  var fn = function(e) {
    e.preventDefault();
    if (button!=='submit' || this.get('closeOnSubmit')!==false) this.hide();
    var inputs = {};
    this.element.querySelectorAll('form input').forEach (function(input) {
      if (input.className) inputs[input.className] = input;
    });
    this.dispatchEvent ({ type: 'button', button: button, inputs: inputs });
  }.bind(this);
  return fn;
};
/** Close the dialog 
 */
ol.control.Dialog.prototype.hide = function() {
  this.element.classList.remove('ol-visible');
  this.dispatchEvent ({ type: 'hide' });
};
/** Close the dialog 
 * @method Dialog.close
 * @return {bool} true if a dialog is closed
 */
ol.control.Dialog.prototype.close = ol.control.Dialog.prototype.hide;
/** The dialog is shown
 * @return {bool} true if a dialog is open
 */
ol.control.Dialog.prototype.isOpen = function() {
  return (this.element.classList.contains('ol-visible'));
};
