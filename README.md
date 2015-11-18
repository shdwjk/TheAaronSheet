# TheAaronSheet
A facade for Sheet Worker Tasks and Utility Functions


## Examples

### `TAS.repeatingSimpleSum()`

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
