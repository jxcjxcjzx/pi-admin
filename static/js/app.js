var templates, timer, menu, users;
var workspace_routes = [
  [ "", "root" ]
];
var workspace_options = {
  routes: {},
  root: function () {
    location.href = "#/intro";
  },
  def: function( path ) {
    $( '#contents' ).html( templates.get( "/" + path ) );
  }
};
var type_to_message = {
  danger: 'error!',
  warning: 'warning!',
  success: 'success!',
  info: 'information:'
};

$(document).ready ( function () {
  templates = new Template( '/templates', 'json' );
  templates.init( function ( data ) {
    workspace_routes.push( [ "*action", "def" ] );
    workspace_routes._$each( function( e ) { workspace_options.routes[ e[0] ] = e[1]; } );
    _get( "/api/menu", function( err, data ) {
      $('#menu').html( Handlebars.compile( templates.get( "menu" ) ) ( data ) );
    } );
    _get( "/api/user", function( err, data ) {
      users = data;
	    var AppRouter = Backbone.Router.extend( workspace_options );
      var approuter = new AppRouter();
      Backbone.history.start();
    } );
  } );

  var keys = [0,0,0,0,0,0,0,0,0,0];
  var index = 0;
  var konami = [38,38,40,40,37,39,37,39,65,66];

  $(document).on( 'keydown', function( e ) {
    keys[ index++ ] = e.which;
    index = (index % 10);
    var esc = true;

    for( var i = 0, il = konami.length; i < il; i++ ) {
      if( keys[ ( index + i ) % keys.length ] != konami[ i ] ) {
        esc = false;
        break;
      }
    }

    if( esc ) {
      var current = keys[ (index + i) % keys.length ];
      if( ( current != 65 ) && ( current != 66 ) ) {
        esc = false;
      }

      var current = keys[ (index + i + 1) % keys.length ];
      if( ( current != 65 ) && ( current != 66 ) ) {
        esc = false;
      }
    }

    if( esc ) {
      location.href = "/#easter";
    }
  } );
} );

function Template( url, type ) {
  this.url = url;
  this.type = type ? type : 'xml';
  this.items= {};
}

Template.prototype.init = function( _complete ) {
  var that = this;
  _get( this.url, _post_get, this.type );

  function _post_get( err, data ) {
    if( err ) { throw err; }
    that.items = data;
    _complete( data );
  }
};

Template.prototype.get = function ( key ) {
  return this.items[ key ] ? this.items[ key ] : "";
};

function _post( url, data, complete, dataType ) {
  return _query( u, 'POST', data, complete, dataType );
}

function _get( url, complete, dataType ) {
  return _query( url, 'GET', null, complete, dataType );
}

function _put( url, data, complete, dataType ) {
  return _query( u, 'PUT', data, complete, dataType );
}

function _delete( url, complete, dataType ) {
  return _query( u, 'DELETE', data, complete, dataType );
}

function _query( u, method, data, callback, dataType ) {
  $.ajax({
    url: u,
    cache: false,
    async: true,
    contentType: 'application/json',
    data: JSON.stringify( data ),
    dataType: ( dataType ? dataType:'json' ),
    type: method,
    success: function (data, textStatus, jqXHR ) {
      if( 'success' == textStatus ) {
        if( data && ( 'boolean' == typeof data.success ) && ( false == data.success ) ) {
          _raise_alert( 'danger', _error( data ) );
        } else {
          callback( null, data );
        }
      } else {
        _raise_alert( 'danger', textStatus );
      }
    },
    error: function ( jqXHR, textStatus, errorThrown ) {
      _raise_alert( 'danger', '(' + textStatus + ') ' + errorThrown );
      callback( new Error( textStatus + ' : ' + errorThrown ) );
    },
    timeout: 10000
  } );
}

function _raise_alert( type, message ) {
  var alert = type_to_message[ type ];
  var text = '<div class="fade in alert alert-' + type + '"><a class="close" data-dismiss="alert">&times;</a><strong>' + (alert?alert:"").toUpperCase() + '</strong> ' + message + '</div>';

  if( timer ) {
    clearTimeout( timer );
    $('.close').trigger('click');
  } 

  $('#alert').html( text );

  timer = setTimeout( function () {
    $('.close').trigger('click');
    timer = null;
  }, 7000 );
}

function _error( data ) {
  var text = '';

  if( data && data.error ) {
    text += data.error;
  }

  if( data && data.errno ) {
    text += ' (' + data.errno + ')';
  }

  if( data && data.moreinfo ) {
    text = '<a href="' + data.moreinfo + '">' + text + '</a>';
  }

  return( text );
}

function _cookie_get( name ) {
  var rv;
  _.each( document.cookie.split('; '), function( e ) {
    var tmp = e.split('=');
    if( tmp[0] == name) {
      rv = decodeURIComponent( tmp[1] );
    }
  } );
  return( rv );
}

function _cookie_set( name, value, expires ) {
  var cookie_string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + "; path=/";

  if( expires ) {
    cookie_string += "; expires=" + (new Date(expires)).toUTCString();
  }

  document.cookie=cookie_string;
}

function _cookie_delete( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function render_menu () {

}
