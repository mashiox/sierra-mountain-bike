Template.inventory.onCreated(function(){
    Session.set("conditionFilter", 2);
    Session.set("categoryFilter", 4);
    Session.set("queryFilter", ".");
})

Template.inventory.helpers({
    
})

Template.inventory.events({
    'keypress input#inv_SearchForm': function(event, template){
        if ( event.which === 13 ){
            
            var query = template.find("#inv_SearchForm").value;
            console.log ( query );
            
        }
    }
});

Template.inventoryTable.helpers({
    item: function(){
        return Inventory.find({
            $and: [
                {
                    category: categoryFilter()
                },
                {
                    condition: conditionFilter() 
                }
            ]
        }).fetch().filter( function( item ){
            return (
                item.description.match( new RegExp( Session.get("queryFilter"), "g" ) )
                || 
                item.name.match( new RegExp( Session.get("queryFilter"), "g" ) )
                ||
                item.cost.toString().match( new RegExp( Session.get("queryFilter"), "g" ) )
                ||
                item.quantity.toString().match( new RegExp( Session.get("queryFilter"), "g" ) )
            );
        });
    },
    conditionFilter: function(condition){
        return ( condition === 0 ? "New" : "Used" );
    },
    categoryFilter: function(category){
        var str = "Unknown";
        switch (category){
            case 0: 
                str = "Bikes";
                break;
            case 1:
                str = "Parts & Supplies";
                break;
            case 2:
                str = "Clothing";
                break;
            case 3:
                str = "Repair Parts & Supplies";
        }
        return str;
    }
})

Template.inventoryTable.events({
    'click ul#inv_conditionLink li a': function(event, template){
        event.preventDefault();
        var value = template.find(event.currentTarget).attributes.value.value;
        Session.set("conditionFilter", parseInt(value));
    },
    
    'click ul#inv_categoriesLink li a': function(event, template){
        event.preventDefault();
        var value = template.find(event.currentTarget).attributes.value.value;
        Session.set("categoryFilter", parseInt(value));
        console.log(value);
    },
    
    'keyup input#inv_query': function(event, template){
        event.preventDefault();
        var value = template.find(event.currentTarget).value;
        Session.set("queryFilter",
            ( value === "" ? "." : value ) 
        );
    }
})

var categoryFilter = function(){
    return ( Session.get("categoryFilter") >= 4 
        ? { $lte: Session.get("categoryFilter") } 
        : { $not: { $ne: Session.get("categoryFilter") } } 
    );
}

var conditionFilter = function(){
    return ( Session.get("conditionFilter") >= 2 
        ? { $lte: Session.get("conditionFilter") } 
        : { $not: { $ne: Session.get("conditionFilter") } } 
    );
}