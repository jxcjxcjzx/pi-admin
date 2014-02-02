********************************************************************************
If you add a templates clause in your properties file, sn-app will read that
directory looking for HTML fragments. Each of these fragments are loaded into
memory and served up to clients when they query "http://<whatever>/templates".
For example, if you had a properties file like this:
{
  "title": "whatever",
  "static": "static_files",
  "templates": "templates"
}

and you put these files in the tempates directory:
_main.html
_whatever.html

then when your client queries "/templates", it will get a JSON file containing
all the templates:
{
  "/main": "<p>This is just a template, it doesn't have to be a full file.</p>",
  "/whatever": "<p>w00t! content!</p>"
}

There's a sample Template class for the client in the app.js file in <static>/js
you can use to read and parse templates. For example, use this code to load the
templates:

var templates;
$(document).ready( function () {
  templates = new Template( "/templates", 'json' );
  templates.init( function () {
    // this will print the contents of the _main.html template to the console
    console.log( templates.get( "/main" ) );
  } );
} );

We use templates extensively with Handlebars.js to render content on the client
using JavaScript. You can use whatever templating system you want to use.
