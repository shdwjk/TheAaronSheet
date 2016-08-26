[![Gitter](https://badges.gitter.im/shdwjk/Roll20API.svg)](https://gitter.im/shdwjk/Roll20API?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# TheAaronSheet
A facade for Sheet Worker Tasks and Utility Functions

## Usage
To use The Aaron Sheet, just copy the contents of TheAaronSheet.js into the top of your `<script type="text/worker">` section.  This will make the TAS variable available within that tag.  As confirmation that it is working, you should see the following log entry in the javascript console for your game:

```
-=> TheAaronSheet v0.2.0 <=-  [Wed Nov 18 2015 08:15:02 GMT-0600 (CST)]
```

Once it is active, you can reference the included functions off of the `TAS` object.


## Reference

### `TAS.repeating( SectionName )`
This function provides an powerful interface to repeating sections.  After calling it with the name of the repeating section you want to use, you will configure it with the attributes you need access to, the fields inside the repeating group you want provided, and one or more operations you want to perform, then run all those operations.  Note that `SectionName` should not have the `repeating_` preface.

The term *Attribute* is used to refer to an attribute outside of a repeating group.

The term *Field* is used to refer to those attributes that are part of the repeating group.

#### Specifying Data

##### `.attrs( AttributeName [, AttributeName ...] )`  (Alias: `.attr()` )
This function specifies the names of attributes outside the repeating group that should be loaded for the operations.  You can provide the names of attributes as individual arguments, as arrays of names, or as seperate invocations of this function.  Note that `AttributeName` should not have the `attr_` prefix. All of the following are equivolent:
```javascript
TAS.repeating('inventory')
    .attrs('total_weight','total_cost')
    .execute();
```
```javascript
TAS.repeating('inventory')
    .attrs(['total_weight','total_cost'])
    .execute();
```
```javascript
TAS.repeating('inventory')
    .attr('total_weight')
    .attr('total_cost')
    .execute();
```
All of the attributes provided will be accessible inside each operation as part of an object provided as a parameter to the operation's function(s).


##### `.fields( FieldName [, FieldName ...] )` (Aliases: `.field()`, `.columns()`, `.column()`)
This function specifies the names of fields in the repeating group that should be loaded for the operations.  You can provide the names of fields as individual arguments, as arrays of names, or as seperate invocations of this function.  Note that you should not provide the `repeating_<section>_` prefix or the `attr_` prefix. All of the following are equivolent:
```javascript
TAS.repeating('inventory')
    .fields('weight','cost','quantity')
    .execute();
```
```javascript
TAS.repeating('inventory')
    .fields(['weight','cost'], 'quantity')
    .execute();
```
```javascript
TAS.repeating('inventory')
    .field('weight')
    .columns(['cost','quantity'])
    .execute();
```

All of the fields provided will be accessible inside each operation as part of an object provided as a parameter to the operation's function(s).

#### Operations
Operations are the heart of the `.repeating()` interface.  Each operation specifies one or more functions that will be called with the data from attributes and fields.  Operations are executed in the order they are defined and each operation completes fully before the next one is called.  Changes made to attributes and fields will be passed on to later operations.

##### Common Arguments to Operations
The following are arguments that are passed to the Operation functions.  You may omit any arguments you don't need or skip them by using `undefined`.

| Argument | Description |
| -------- | ----------- |
| `Func` | This is a function which is called for each row of the repeating group. |
| `Initial` | This is the initial value to be used as the `memo` for the `.reduce()` operation. |
| `Final` | This is a function which is called once, usually with the results of calling `func`, and with the `rowSet` and `attrSet` objects. |
| `Context` | The context argument will be the `this` object when any of the operation's functions are executed.|


##### Common Arguments to Operation Functions
The following arguments are passed to various of the operations' functions.

| Argument | Description |
| -------- | ----------- |
| `Row` | This represents the row of the repeating group.  Each of the fields requested will be a property on this object.  Additionally, it has the special `.id` property which will contain the repeating row's id.  `.id` does not show up in iteration. |
| `RowSet` | This object is a collection of all the `row` objects for the whole repeating group.  It has properties for each row id which contain the row. |
| `AttrSet` | This object contains each of the attributes requested as a property. |
| `ID` | Some functions will be passed the id of the row currently being operated on. |
| `Memo` | The reduce operation receives the result of the execution of the function on the previous row. |
| `Results` | An array of each of the values returned from calling the `Func` function. |

##### `.tap( Final [, Context] )` (Alias: `.do()`)
This is the simplist operation on the `.repeating()` interface.  The `Final` function will be called once with the parameters `RowSet`, `AttrSet`.
```javascript
TAS.repeating('inventory')
    .attrs('total_weight','total_cost')
    .fields('weight','cost','quantity')
    .tap(function(rowSet,attrSet){
        console.log('RowSet has keys: '+_.keys(rowSet).join(', '));
        console.log('AttrSet has keys: '+_.keys(attrSet).join(', '));
    })
    .execute();
```

##### `.each(Func [, Final [, Context] ] )` (Alias: `.forEach()`)
This operation will execute `Func` for each row of the repeating group with the arguments `Row`,`AttrSet`,`ID`,`RowSet`.  Afterwards, it will execute `Final` once with the arguments `RowSet`,`AttrSet`.
```javascript
TAS.repeating('inventory')
    .attrs('total_weight','total_cost')
    .fields('weight','cost','quantity')
    .each(function(row,attrSet,id,rowSet){
        console.log('Row ID: '+id);
    },function(rowSet,attrSet){
        console.log('all Row IDs: '+_.keys(rowSet).join(', '));
    })
    .execute();
```

##### `.map(Func [, Final [, Context] ] )` (Alias: `.collect()`)
This operation will execute `Func` for each row of the repeating group with the arguments `Row`,`AttrSet`,`ID`,`RowSet`, collecting the return value each time into an array.  Afterwards, it will execute `Final` once with the arguments `Results`, `RowSet`,`AttrSet`.

```javascript
TAS.repeating('inventory')
    .attrs('total_weight','total_cost')
    .fields('weight','cost','quantity')
    .each(function(row,attrSet,id,rowSet){
        console.log('Row ID: '+id);
        return row.weight;
    },function(results,rowSet,attrSet){
        console.log('all weights: '+results.join(', '));
    })
    .execute();
```

##### `.reduce(Func [, Initial [, Final [, Context] ] ] )` (Aliases: `.inject()`, `.foldl()`)
This operation will execute `Func` for each row of the repeating group with the arguments `Memo`, `Row`,`AttrSet`,`ID`,`RowSet`.  `Memo` will start with the value of `Initial`, but will then have the value of whatever is returned from `Func`.  Afterwards, it will execute `Final` once with the arguments `Memo`, `RowSet`,`AttrSet`.

```javascript
TAS.repeating('inventory')
    .attrs('total_weight','total_cost')
    .fields('weight','cost','quantity')
    .reduce(function(memo,row,attrSet,id,rowSet){
        memo.push('weight: '+row.weight);
        return memo;
    },[], function(memo,rowSet,attrSet){
        console.log('all weights: '+memo.join(','));
    })
    .execute();
```

#### `.execute()` (Aliases: `.go()`, `.run()`)
When you have configured all of your Attributes, Fields, and Operations, you call `.execute()` to do all of the work.  Nothing will be done until this function is called.  It takes no arguments and returns nothing, but is responsible for doing all the work of getting and setting attributes and fields, and calling each of the operations' functions.  All of the sets will be batched and executed as a single `setAttrs()` at the end of `execute()`, which should provide a preformance increase.

#### Using `AttrSet` and `Row`
Asside from `Row`'s readonly `.id` property representing which repeating group row it corresponds to, `AttrSet` and `Row` are the same.  

##### Reading Values

Reading values is as simple as referencing the property.  You don't use the `attr_` prefix or the `repeating_<section name>_` prefix:
```javascript
console.log(row.weight);
console.log(attrSet.total_weight);

```

Most of the time, you need the value in a specific format, such as a String, Integer, or Floating-Point Number. You can control the format by adding a format specifier between the `Row`/`AttrSet` and the property:
```javascript
console.log( 'Weight (String): '+ row.S.weight );
console.log( 'Weight (Integer): '+ row.I.weight );
console.log( 'Weight (Float): '+ row.F.weight );
```

You can also get a Fixed-Point Number representation:
```javascript
console.log( 'Weight (3 decimal places): '+ row.D[3].weight );
console.log( 'Weight (9 decimal places): '+ row.D[9].weight );
console.log( 'Weight (0 decimal places): '+ row.D[0].weight );
```

You can use 0-9 to specify how many decimal places you want.  *Note:* this returns a string representation and is intended for presentation.  You should use the `.F` specifier if you want to perform mathematical calculations.

| Format Specifier | Description |
| ---------------- | ----------- |
| `.S` | String format.  Whatever value is stored in the property is converted to a string. |
| `.I` | Integer format. The equivolent of `parseInt( value, 10 )`.  For numbers like 1.53, this will truncation the .53, use a Floating-Point format. |
| `.F` | Floating-Point format.  The equivolent of `parseFloat( value )`.  Good for math, but see the Decimal fomrat for presentation. |
| `.D[#]` | Decimal format.  The result will be a number with the given amount of decimal places from 0-9.  The type will be a string, so use Floating-Point format if you need to do math. |

##### Writing Values
Writing values is exactly like you would expect, you simply set the property.
```javascript
attrSet.total_weight = row.I.quantity * row.F.weight;
```

You can use the format specifiers when setting a property to cause it to be stored in that format:
```javascript
attrSet.D[3].total_weight += row.I.quantity * row.F.weight;
```

Because of the way the `.repeating()` interface works, all the `setAttrs()` operations are saved until the last and handled as a single operation.  This prevents redundant writing and saves bandwidth gaining speed and performance.


### `TAS.repeatingSimpleSum( RepeatingName, ValueField, SumAttribute )`
This function will find all the attributes with the name `ValueField` in the repeating section with `RepeatingName` and add them together, storing their sum in the `SumAttribute`.

| Argument | Description |
| -------- | ----------- |
| `RepeatingName` | This is the name of the repeating group.  Leave off the `repeating_` preface.  If your repeating section is `<fieldset class="repeating_weapons">`, you would simply use `'weapons'`. |
| `ValueField` | This is the name of the attribute you are adding up for each row.  Leave off the `attr_` preface.  If your attribute is `name="attr_cost"`, you would simply use `'cost'`. |
| `SumAttribute` | This is the attribute to fill with the sum of all the `ValueField`s.  Leave off the `attr_` preface.  If your attribute is `name="attr_spentbudget"`, you would simply use `'spentbudget'`. |

#### Example
Assuming you were creating a list of weapons and totaling the amount spent on them, you might have this:
```javascript
on('change:repeating_weapons',function(){
    TAS.repeatingSimpleSum('weapons','cost','spentbudget');
});
```


### Utility Functions
Currently, no utility functions are needed as we now have access to underscore.js.


## Examples

### Example 1: `TAS.repeatingSimpleSum()`

This is a simple total operation for a named field in a repeating group. For the full working source, see [Example1: repeatingSimpleSum()](examples/example1_repeatingSimpleSum.html).

```html
<script type="text/worker">

// [ Contents of TheAaronSheet.js ] //


on('change:repeating_inventory', function(){
    TAS.repeatingSimpleSum('inventory','weight','total_weight_carried');
});

</script>
```



### Example 2: `TAS.repeating()` -- a Trivial Example

This is a trivial example showing just the setting up of attributes and fields.  It will write the IDs and attrbute names to the console using the `.tap()` operation. See [Example2: TAS.repeating() -- a Trivial Example](examples/example2_repeatingSimpleExample.html).

```html
<script type="text/worker">

// [ Contents of TheAaronSheet.js ] //


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

</script>
```

### Example 3: `TAS.repeating()` -- a Complex Example

This is a complex example that is using each of the 4 possible operations.  See [Example 3: TAS.repeating() -- a Complex Example](examples/example3_repeatingComplexExample.html).

```html
<script type="text/worker">

// [ Contents of TheAaronSheet.js ] //


on('change:repeating_inventory', function(){

// all of these operations could likely have been done in a single reduce operation, but
// doing them in multiple operations shows that this is something that can be done.

    TAS.repeating('inventory')
        .attrs('total_weight','total_cost','summary')  //< getting the attributes for the totals
        .fields('item','quantity','weight','totalweight','cost','runningtotal') //< specifying the fields we care about
        .tap(function(rows,attrs){
			attrs.summary=_.pluck(_.values(rows),'item').join(', ');  //< grabing all the names of items and setting summary
        })
		.each(function(r){
			r.D[3].totalweight=(r.I.quantity*r.F.weight);  //< for each row, set the total weight with 3 decimal places (use integer quantity and floating weight)
		})
		.map(function(r){
			return r.F.weight*r.I.quantity; //< calculate the weight for the row (could have used the totalweight)
		},function(m,r,a){
            a.D[3].total_weight=_.reduce(m,function(m,v){ //<sum the array of total weights and set it on the total weight attribute
				return m+v;
			},0);
		})
		.reduce(function(m,r){
			m+=(r.I.quantity*r.F.cost); //< Generate a running cost
			r.D[2].runningtotal=m; //< set it for the current row (the running part)
			return m;
		},0,function(m,r,a){
			a.D[2].total_cost=m;  //< take the final sum and set it on the total cost attribute
		})
        .execute();  //< begin executing the above operations

});

</script>
```


### Example 4: `TAS.repeating()` -- a Complex Example Rewritten

This is Example 3 rewritten to use only a single operation, `.reduce()`.  See [Example 4: TAS.repeating() -- a Complex Example Rewritten](examples/example4_repeatingComplexExampleRewritten.html).

```html
<script type="text/worker">

// [ Contents of TheAaronSheet.js ] //


on('change:repeating_inventory', function(){

    TAS.repeating('inventory')
        .attrs('total_weight','total_cost','summary')  
        .fields('item','quantity','weight','totalweight','cost','runningtotal') 
        .reduce(function(m,r){
            m.weight+=(r.F.weight*r.I.quantity);
            r.D[3].totalweight=(r.F.weight*r.I.quantity);
            m.cost+=(r.F.cost*r.I.quantity);
            r.D[2].runningtotal=m.cost;
            m.desc.push(r.item+(r.I.quantity>1 ? ' (x'+r.S.quantity+')' : ''));
            return m;
            
        },{weight:0,cost:0, desc: []},function(m,r,a){
            a.summary=m.desc.join(', ');
            a.D[3].total_weight=m.weight;
            a.D[2].total_cost=m.cost;
        })
        .execute(); 

});

</script>
```
