// enable debug logging
TAS.config({logging.debug: true});

(function(){
	'use strict';

	var string ='This is a string!',
		integer = 8675309,
		decimal = 3.14159265359,
		bool = true,
		namedFunction = function DoStuffWithThings(things){return things+'stuff';},
		anonymousFunction = function(test){return test+test;},
		array = [ 1, 2, 3, 'orange', 'apple', 'avacado', function thing(a){ return a+a; }],
		object = { fruit: 'tomato', number: 42 };

	
	console.log('==> Logging Types <====================================');
	TAS.log('TAS.log() for general messages');
	TAS.notice('TAS.notice() for messages you want to notice that are not errors.');
	TAS.info('TAS.info() for documenting things like status changes.');
	TAS.warn('TAS.warn() for things that might be problems or indicate potential issues.');
	TAS.error('TAS.error() for errors you need to be sure to notice.');
	TAS.debug('TAS.debug() other things you want to keep track of while editing.');

	console.log('==> Type Logging <=====================================');
	TAS.debug(string);
	TAS.debug(integer);
	TAS.debug(decimal);
	TAS.debug(bool);
	TAS.debug(NaN);
	TAS.debug(null);
	TAS.debug(undefined);
	TAS.debug(namedFunction);
	TAS.debug(anonymousFunction);
	TAS.debug(array);
	TAS.debug(arguments);
	TAS.debug(object);

	console.log('==> Multiple Argument Support <=====================================');
	TAS.debug(string,integer,NaN,anonymousFunction,arguments);

}(1,2,'taco',['water','wine']));
