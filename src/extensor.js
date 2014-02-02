( function () {
  var path = require( 'path' );
  var fs   = require( 'fs' );
  var sar  = require( 'sn-approute' );

  var client = "";
  var extensions = {};
  var routes = [];
  var menu = [];
  var menu_bottom = [];

  function extensor( app, props, facilities ) {

    props.extensions && props.extensions._$each( function ( e ) {
      /* Append the extension's client code to client */
      try {
        client += fs.readFileSync( e + path.sep + 'client.js' ).toString() + "\n";
        // todo: add a DEBUG logging message here
      } catch( err ) {
        // Quietly continue if there's an error. todo: replace this with a DEBUG logging message
      }

      /* Load templates for the extension */
      try {
        var re = /\_/g;
        var templates = fs.readdirSync( [ e, 'templates' ].join( path.sep ) );
        templates && templates._$each( function( f ) { 
          facilities.templates.templates[ f.split('.')[0].replace( re, '/' ) ] =
            fs.readFileSync( [ e, 'templates', f ].join( path.sep ) ).toString();
        } );
      } catch( err ) {
        // Quietly continue if there's an error. todo: replace this with a DEBUG logging message
      }

      /* Load the code for the extension */
      try {
        extensions[ e ] = new ( require( [ process.cwd(), e, 'module' ].join( path.sep ) ) ) ( { facilities: facilities, routes: routes, menu: menu, menu_bottom: menu_bottom } );
      } catch( err ) {
        // Quietly continue if there's an error. todo: replace this with a DEBUG logging message
        console.log( err.toString() );
      }      

    } );

    client += 'console.log( "loaded extensor" );\n';

    menu_bottom._$each( function( e ) {
      menu.push( e );
    } );

    routes.push ( {
      route: "/extensor",
      get: function( callback ) {
        this.body.out = client;
        this.headers.out.push( [ 'content-type', 'text/javascript' ] );
        callback._$nextTick( this );
      }
    } );

    routes.push ( {
      route:"/menu",
      get: function( callback ) {
        this.body.out = { menu: menu };
        callback._$nextTick( this );
      }
    } );

    (new sar( { routes: routes } )).init( function( middleware_function ) {
      app.use( "/api", middleware_function );
    } );

  }

  module.exports = extensor;
} )();