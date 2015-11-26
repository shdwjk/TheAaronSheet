/* ---- BEGIN: TheAaronSheet.js ---- */
// Github:   https://github.com/shdwjk/TheAaronSheet/blob/master/TheAaronSheet.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TAS = TAS || (function(){
    'use strict';

    var version = '0.2.0',
        lastUpdate = 1448523710,

		queuedUpdates = {}, //< Used for delaying saves till the last momment.

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

    prepareUpdate = function( attribute, value ){
        queuedUpdates[attribute]=value;
    },

    applyQueuedUpdates = function() {
      setAttrs(queuedUpdates);
      queuedUpdates = {};
    },

	namesFromArgs = function(args,base){
        return _.chain(args)
            .reduce(function(memo,attr){
                if('string' === typeof attr) {
                    memo.push(attr);
                } else if(_.isArray(args) || _.isArguments(args)){
                    memo = namesFromArgs(attr,memo);
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
            var pname=(_.contains(['S','F','I','D'],prop) ? '_'+prop : prop),
			    full_pname = fullname || prop,
                pvalue=value;

            _.each(['S','I','F'],function(p){
                if( !_.has(obj,p)){
                    Object.defineProperty(obj, p, {
                        value: {},
                        enumerable: false,
                        readonly: true
                    });
                }
            });
            if( !_.has(obj,'D')){
                Object.defineProperty(obj, 'D', {
                    value: _.reduce(_.range(10),function(m,d){
                            Object.defineProperty(m, d, {
                                value: {},
                                enumerable: true,
                                readonly: true
                            });
                            return m;
                        },{}),
                    enumerable: false,
                    readonly: true
                });
            }


            // Raw value
			Object.defineProperty(obj, pname, {
                enumerable: true,
				set: function(v){
					pvalue=v;
                    prepareUpdate(full_pname,v);
				},
				get: function(){
					return pvalue;
				}
			});
            
            // string value
			Object.defineProperty(obj.S, pname, {
                enumerable: true,
				set: function(v){
                    var val=v.toString();
					pvalue=val;
                    prepareUpdate(full_pname,val);
				},
				get: function(){
					return pvalue.toString();
				}
			});

            // int value
			Object.defineProperty(obj.I, pname, {
                enumerable: true,
				set: function(v){
                    var val=parseInt(v,10) || 0;
					pvalue=val;
                    prepareUpdate(full_pname,val);
				},
				get: function(){
					return parseInt(pvalue,10) || 0;
				}
			});

            // float value
			Object.defineProperty(obj.F, pname, {
                enumerable: true,
				set: function(v){
                    var val=parseFloat(v) || 0;
					pvalue=val;
                    prepareUpdate(full_pname,val);
				},
				get: function(){
					return parseFloat(pvalue) || 0;
				}
			});
            _.each(_.range(10),function(d){
                Object.defineProperty(obj.D[d], pname, {
                    enumerable: true,
                    set: function(v){
                        var val=(parseFloat(v) || 0).toFixed(d);
                        pvalue=val;
                        prepareUpdate(full_pname,val);
                    },
                    get: function(){
                        return (parseFloat(pvalue) || 0).toFixed(d);
                    }
                });
            });

		}());
	},
	
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
			repReduce = function(func, initial, final, context) { 
				operations.push({
                    type: 'reduce',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    memo: (_.isUndefined(initial) && 0) || initial,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
				return this;
			},
			repMap = function(func, final, context) {
				operations.push({
                    type: 'map',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
				return this;
			},
            repEach = function(func, final, context) {
				operations.push({
                    type: 'each',
                    func: (func && _.isFunction(func) && func) || _.noop,
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
				return this;
            },
            repTap = function(final, context) {
				operations.push({
                    type: 'tap',
                    final: (final && _.isFunction(final) && final) || _.noop,
                    context: context || {}
                });
				return this;
            },
			repExecute = function(){
				var rowSet = {},
					attrSet = {},
					fieldIds = [],
					fullFieldNames = [];

				// call each operation per row.
				// call each operation's final
				getSectionIDs("repeating_"+sectionName,function(ids){
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

                        _.each(operations,function(op){
                            var res;
                            switch(op.type){
                                case 'tap':
                                    _.bind(op.final,op.context,rowSet,attrSet)();
                                    break;

                                case 'each':
                                    _.each(rowSet,function(r){
                                        _.bind(op.func,op.context,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,rowSet,attrSet)();
                                    break;

                                case 'map':
                                    res = _.map(rowSet,function(r){
                                        return _.bind(op.func,op.context,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,res,rowSet,attrSet)();
                                    break;

                                case 'reduce':
                                    res = op.memo;
                                    _.each(rowSet,function(r){
                                        res = _.bind(op.func,op.context,res,r,attrSet,r.id,rowSet)();
                                    });
                                    _.bind(op.final,op.context,res,rowSet,attrSet)();
                                    break;
                            }
                        });

                        // finalize attrs
                        applyQueuedUpdates();
					});
				});
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
				collect: repMap,

				each: repEach,
                forEach: repEach,

                tap: repTap,
                'do': repTap,

				execute: repExecute,
				go: repExecute,
				run: repExecute
			};
		}(section));
	},


    repeatingSimpleSum = function(section, field, destination){
        repeating(section)
            .attr(destination)
            .field(field)
            .reduce(function(m,r){
                return m + (r.F[field]);
            },0,function(t,r,a){
                a[destination]=t;
            })
            .execute();
    };

    console.log('-=> TheAaronSheet v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');

    return {
        repeatingSimpleSum: repeatingSimpleSum,
		repeating: repeating
    };
}());

/* ---- END: TheAaronSheet.js ---- */

