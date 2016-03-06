
on('change:repeating_inventory', function(){
    TAS.repeating('inventory')  //< set the repeating group we are using
        .attrs('total_weight')  //< specify we want access to the total_weight attribute
        .fields('item','weight') //< specify we want the item and weight repeating fields 
        .tap(function(rows,attrs){  //< tap just calls a function with the attributes and fields
            console.log(_.keys(rows));  //< log the ids for the rows
            console.log(_.keys(attrs)); //< log the names of the attributes
        })
        .execute();  //< tell TAS it has been configured and can run now.
});

