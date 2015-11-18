// ---- BEGIN: TheAaronSheet.js ---- //
// Github:   https://github.com/shdwjk/
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TAS = TAS || (function(){
    'use strict';

    var version = '0.1.0',
        lastUpdate = 1447855342,

    unique = function (arr) {
        var a = [],i,l;
        for (i=0, l=arr.length; i<l; i++) {
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '') {
                a.push(arr[i]);
            }
        }
        return a;
    },
    uniqueToLower = function(arr) {
            return unique(arr.map(function(s){ return (s.toLowerCase && s.toLowerCase());}));
    },

    repeatingSimpleSum = function(section, field, destination){
        getSectionIDs("repeating_"+section,function(ids){
            ids = uniqueToLower(ids);
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
        util: {
            unique: unique,
            uniqueToLower: uniqueToLower
        },
        repeatingSimpleSum: repeatingSimpleSum
    };
}());

// ---- END: TheAaronSheet.js ---- //
