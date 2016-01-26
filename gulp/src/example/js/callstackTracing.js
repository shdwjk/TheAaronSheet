
TAS.debugMode();

var callback1 = function StandAloneFunction(){
	TAS.debug('inside StandAloneFunction()');
	TAS.callstack();
	getAttrs(['total_weight'],TAS._fn('getAttrs( total_weight )',function InlineFunction(values){ 
		TAS.callstack();
		TAS.debug('InlineFunction(): got values',values); 
	}));
};

on('sheet:opened',TAS._fn('sheet:opened - first',callback1));
on('sheet:opened',TAS._fn('sheet:opened - second',callback1));
on('change:repeating_inventory',TAS._fn('change:repeating_inventory - test',callback1));


