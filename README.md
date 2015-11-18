# TheAaronSheet
A facade for Sheet Worker Tasks and Utility Functions

## Usage
To use The Aaron Sheet, just copy the contents of TheAaronSheet.js into the top of your `<script type="text/worker">` section.  This will make the TAS variable available within that tag.  As confirmation that it is working, you should see the following log entry in the javascript console for your game:

```
-=> TheAaronSheet v0.1.0 <=-  [Wed Nov 18 2015 08:15:02 GMT-0600 (CST)]
```

Once it is active, you can reference the included functions off of the `TAS` object.


## Reference

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

All provided utility functions are referenced from the `util` property of the `TAS` object.

```javascript
var ex = TAS.util.uniq( arg );
```

#### `TAS.util.unique( argument )`
This utility function returns an array comprised of only the unique values from the argument.
```javascript
var uNames = TAS.util.unique( allNames );
```

#### `TAS.util.uniqueToLower( argument )`
This utility function is just like `TAS.util.unique()` except that it first lowercases the values then provides a unique set values.
```javascript
var uNamesLower = TAS.util.unique( allCaseNames );
```

## Examples

### Example 1: `TAS.repeatingSimpleSum()`

This is a simple total operation for a named field in a repeating group. For the full working source, see [Example1: repeatingSimpleSum()](examples/example1_repeatingSimpleSum.html).

```html
<fieldset class="repeating_inventory">
    <table>			
		<tr border="1">	
			<td width="220px"><input type="text" name="attr_item" placeholder="item name" title="item name" /></td>	
			<td><input type="text" style="width:50px" name="attr_weight" value="0" title="item's weight" /></td>
		</tr>
	</table>
</fieldset>
<input type="text" name="attr_total_weight_carried" value="0" style="width:42%" title="total equipment weight" /> 

<script type='text/worker'>

// [ Contents of TheAaronSheet.js ] //


on('change:repeating_inventory', function(){
    TAS.repeatingSimpleSum('inventory','weight','total_weight_carried');
});

</script>
```



