on('change:repeating_inventory', function(){
    TAS.repeatingSimpleSum('inventory','weight','total_weight');
    TAS.repeatingSimpleSum('inventory','weight_max','total_max_weight');
    TAS.repeatingSimpleSum('inventory','cost','total_cost');
});
