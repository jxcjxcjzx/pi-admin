( function () {
  _$construct( 'exports', {}, module );
  module.exports.prototype._$init = function () {
    this.menu.push( { text: "Intro", template: "#/intro" } );
    this.menu_bottom.push( { text: "About", template: "#/about" } );
    this.menu_bottom.push( { text: "Help", template: "#/help" } );
  };
} ) ();