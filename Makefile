# Makefile for project pi-admin

MODULES = sn-core sn-props sn-approute connect
CLEAN_THESE_FILES = css/bootstrap.css css/bootstrap.min.css css/bootstrap-theme.css css/bootstrap-theme.min.css \
  js/bootstrap.js js/bootstrap.min.js js/jquery.js js/underscore-min.js js/backbone-min.js js/handlebars.js \
  js/sn-core.js fonts ./pi-admin
BOOTSTRAP_VERSION = 3.0.3
JQUERY_VERSION = 1.10.2
HANDLEBARS_VERSION = 1.3.0
SNCORE_VERSION = 0.0.11

default: ./node_modules ./build

clean:
	rm -rf ./node_modules
	rm -rf ./build
	( cd static; rm -rf $(CLEAN_THESE_FILES) )

./node_modules :
	mkdir -p ./node_modules
	npm install $(MODULES)

./build : ./build/bootstrap.zip ./build/sn-core.tar.gz
	( cd build; unzip -o bootstrap.zip )
	( cd build; tar xzvf sn-core.tar.gz )
	( cd static; cp -r ../build/dist/* . )
	( cd static; cp ../build/sn-core-$(SNCORE_VERSION)/sn-core.js js/sn-core.js )
	( cd static/js ; wget -O jquery.js https://code.jquery.com/jquery-$(JQUERY_VERSION).min.js )
	( cd static/js ; wget -O underscore-min.js http://underscorejs.org/underscore-min.js )
	( cd static/js ; wget -O backbone-min.js http://backbonejs.org/backbone-min.js )
	( cd static/js ; wget -O handlebars.js http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v$(HANDLEBARS_VERSION).js )
	ln -s /usr/bin/sn-app ./pi-admin

./build/bootstrap.zip : ./builddir
	( cd build; wget -O bootstrap.zip https://github.com/twbs/bootstrap/releases/download/v$(BOOTSTRAP_VERSION)/bootstrap-$(BOOTSTRAP_VERSION)-dist.zip )

./build/sn-core.tar.gz : ./builddir
	( cd build; wget -O sn-core.tar.gz https://github.com/smithee-us/sn-core/archive/v$(SNCORE_VERSION).tar.gz )

./builddir :
	mkdir -p ./build

install-deb :
	npm install -g sn-app
	if [ -d /etc/init.d ]; then \
    cp init/pi-admin /etc/init.d; chmod 755 /etc/init.d/pi-admin; \
    if [ -e /etc/init.d/.depend.start ]; then \
      insserv pi-admin; else \
      update-rc.d pi-admin defaults; \
    fi \
  fi
