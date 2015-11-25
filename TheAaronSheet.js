/* ---- BEGIN: TheAaronSheet.js ---- */
// Github:   https://github.com/shdwjk/TheAaronSheet/blob/master/TheAaronSheet.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TAS = TAS || (function(){
    'use strict';

    var version = '0.1.1',
        lastUpdate = 1448405980,

		queuedUpdates = {},

	log = function(){
        _.each(arguments,function(m){
            switch(typeof m){
                case 'string':
                    console.log('<TAS> :: '+m);
                    break;
                case 'number':
                    console.log('<TAS> :: [number]: '+m);
                    break;
                default:
                    console.log('<TAS> :: ['+typeof m +']:');
                    console.log(m);
                    console.log('<TAS> :: =========================================================');
            }
        });
	},

//	each = function(set,cb,ctx){
//		var idx,len,keys;
//		if(isIterable(set)) {
//			for (idx = 0, len = set.length; idx<len; ++idx) {
//				cb.apply(ctx,[set[idx],idx,set]);
//			}
//		} else {
//			keys = Object.keys(set);
//			for (idx = 0, len = keys.length; idx<len; ++idx) {
//				cb.apply(ctx,[set[keys[idx]],keys[idx],set]);
//			}
//		}
//		return set;
//	},
//
//	map = function(set,cb,ctx){
//		var idx,len,keys,results=[];
//		if(isIterable(set)) {
//			for (idx = 0, len = set.length; idx<len; ++idx) {
//				results.push(cb.apply(ctx,[set[idx],idx,set]));
//			}
//		} else {
//			keys = Object.keys(set);
//			for (idx = 0, len = keys.length; idx<len; ++idx) {
//				results.push(cb.apply(ctx,[set[keys[idx]],keys[idx],set]));
//			}
//		}
//		return results;
//	},
//
//	reduce = function(set,cb,memo,ctx){
//		var idx,len,keys,m = memo;
//		if(isIterable(set)) {
//			for (idx = 0, len = set.length; idx<len; ++idx) {
//				m = cb.apply(ctx,[m,set[idx],idx,set]);
//			}
//		} else {
//			keys = Object.keys(set);
//			for (idx = 0, len = keys.length; idx<len; ++idx) {
//				m = cb.apply(ctx,[m,set[keys[idx]],keys[idx],set]);
//			}
//		}
//		return m;
//	},

	namesFromArgs = function(args,base){
        return _.chain(args)
            .reduce(function(memo,attr){
			if(_.isArray(args) || _.isArguments(args)){
                memo = namesFromArgs(attr,memo);
			} else if('string' === typeof attr) {
				memo.push(attr);
			}
            return memo;
		},(_.isArray(base) && base) || [])
        .uniq()
        .value();
	},

	addId = function(obj,value){
		Object.defineProperty(obj,'id',{
			value: value,
			writeable: false,
			enumerable: false
		});
	},

	addProp = function(obj,prop,value,fullname){
		(function(){
            var pname=prop,
			    full_pname = fullname || prop,
                pvalue=value;
			Object.defineProperty(obj, pname, {
				set: function(v){
					var o = {};
					pvalue=v;
					o[full_pname]=v;
					setAttrs(o);
					
					log('setting '+pname+'['+full_pname+'] to value '+v);
				},
				get: function(){
					return pvalue;
				}
			});
		}());
	},
	
	/*

	 TAS.repeating('inventory')
		.attrs(['strength'])
		.fields(['qty','weight']
		.reduce(function(memo,row,attrs,id,full){
			return memo;
		},
		function(result,attrs,full){
			
		},0)
		.map(function(row,attrs,id,full){
			//stuff
		})
		.execute()

	 TAS.repeating('inventory')
		.columns(['qty','weight','cost'])  // or .fields or .column or .field
		.operation({
			sum: {func: function(memo, fields){return memo+(fields.qty*fields.weight)}, memo: 0},
			subtotal: function(memo, fields){return fields.qty*fields.weight;}
			})
		.set({
				{func: 'sum', attr: 'total_weight', fields: ['qty','weight']},
				{func: 'sum', attr: 'total_cost', fields: ['qty','cost']},
				{func: 'subtotal', attr: { row: 'total_weight'}, fields: ['qty','weight']},
				{func: 'subtotal', attr: { row: 'total_cost'}, fields: ['qty','cost']}
			})
		.execute();
	 
	 */


	repeating = function( section ) {
		return (function(s){
			var sectionName = s,
				attrNames = [],
				fieldNames = [],
				operations = [],
			
			repAttrs = function(){
				attrNames = namesFromArgs(arguments,attrNames);
				return this;
			},
			repFields = function(){
				fieldNames = namesFromArgs(arguments,fieldNames);
				return this;
			},
			repReduce = function(func, memo, final, context) { 
				operations.push({type: 'reduce', func: func, memo: memo, final: final, context:context});
				return this;
			},
			repMap = function(func, final, context) {
				operations.push({type: 'map', func: func, final: final, context:context});
				return this;
			},
			repExecute = function(){
				var rowSet = {},
					attrSet = {},
					fieldIds = [],
					fullFieldNames = [];

				// begin collection of attrs
				// collect attrs
				// collect fields
				// build row set
				// call each operation per row.
				// call each operation's final
				getSectionIDs("repeating_"+sectionName,function(ids){
					var request = [];
					fieldIds = ids;
					fullFieldNames = _.reduce(fieldIds,function(memo,id){
						return memo.concat(_.map(fieldNames,function(name){
							return 'repeating_'+sectionName+'_'+id+'_'+name;  
						}));
					},[]);
					getAttrs( _.uniq(attrNames.concat(fullFieldNames)), function(values){
						_.each(attrNames,function(aname){
							if(values.hasOwnProperty(aname)){
								addProp(attrSet,aname,values[aname]);
							}
						});

						rowSet = _.reduce(fieldIds,function(memo,id){
							var r={};
							addId(r,id);
							_.each(fieldNames,function(name){
								var fn = 'repeating_'+sectionName+'_'+id+'_'+name;  
								addProp(r,name,values[fn],fn);
							});

							memo[id]=r;

							return memo;
						},{});

                        debugger;



					});
				});
				// finalize attrs
			};
				
			return {
				attrs: repAttrs,
				attr: repAttrs,

				column: repFields,
				columns: repFields,
				field: repFields,
				fields: repFields,

				reduce: repReduce,
				inject: repReduce,
				foldl: repReduce,

				map: repMap,
				each: repMap,
				collect: repMap,


				execute: repExecute,
				go: repExecute,
				run: repExecute
			};
		}(section));
	},


    repeatingSimpleSum = function(section, field, destination){
        getSectionIDs("repeating_"+section,function(ids){
            getAttrs( ids.map(function(i){
                return 'repeating_'+section+'_'+i+'_'+field;  
            }),function(res){
                var sum = {},p;
                sum[destination]=0;
                for(p in res) {
                    if(res.hasOwnProperty(p)){
                       sum[destination] += parseFloat(res[p]) || 0;
                    }
                }
                setAttrs(sum);
            });
        });
    };

    console.log('-=> TheAaronSheet v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

    return {
        repeatingSimpleSum: repeatingSimpleSum,
		repeating: repeating
    };
}());

/* ---- END: TheAaronSheet.js ---- */

