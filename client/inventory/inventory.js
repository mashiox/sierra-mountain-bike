Template.inventory.onCreated(function(){
    Session.set("conditionFilter", 2);
    Session.set("categoryFilter", 4);
    Session.set("queryFilter", ".");
    if ( !Session.get("shoppingCart") ) Session.set("shoppingCart", new Array() );
})

Template.inventory.helpers({
    
})

Template.inventory.events({
    
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
    },
    
    'click a#inv_editItem': function(event, template){
        event.preventDefault();
        var id = template.find(event.currentTarget).rel;
        var item = Inventory.findOne({_id: id});
        Session.set("editProductId", id);
        if (item){
            bootbox.dialog({
                title: "Edit " + item.name,
                onEscape: true,
                backdrop: true,
                message: renderTmp( Template.dialogEditInventory ),
                buttons: {
                    success: {
                        label: "Update",
                        className: "btn-success",
                        callback: function(){
                            var quantityDelta = parseInt($("input#txtProductQuantity").val());
                            var price = parseInt($("input#txtEditProductCost").val())
                            var category = parseInt( $("select#txtEditProductCategory").val() );
                            var condition = parseInt( $("select#txtEditProductCondition").val() );
                            var desc = $("textarea#txtEditProductDesc").val();
                            
                            var product = Inventory.findOne({_id: Session.get("editProductId")});
                            if (product){
                                product.planned = quantityDelta;
                                product.cost = price;
                                product.category = category;
                                product.condition = condition;
                                product.description = desc;
                                Inventory.update({_id: product._id}, {
                                    $set: {
                                        cost: price,
                                        category: category,
                                        condition: condition,
                                        description: desc
                                    }
                                });
                                var item = Inventory.findOne({_id: product._id});
                                item.planned = quantityDelta;
                                var cart = Session.get("shoppingCart");
                                cart.push( item );
                                Session.set("shoppingCart", cart);
                                
                                swal("Success!", "Product updated!", 'success');
                                return true;
                            }
                        }
                    }
                }
            })
        }
    }
})

Template.dialogEditInventory.helpers({
    getProduct: function(){
        return Inventory.findOne({ _id: Session.get("editProductId") });
    }
})

Template.shoppingCart.helpers({
    shoppingCartExists: function(){
        return Session.get("shoppingCart").length > 0;
    },
    
    shoppingCartLength: function(){
        return Session.get("shoppingCart").length;
    }
})

Template.shoppingCart.events({
    'click button#inc_checkoutButton': function(event, template){
        event.preventDefault();
        bootbox.dialog({
            title: "Checkout",
            onEscape: true,
            backdrop: true,
            message: renderTmp( Template.dialogInventoryCheckout ),
            buttons: {
                success: {
                    label: "Checkout!",
                    className: "btn-success",
                    callback: function(){
                        var cart = Session.get("shoppingCart");
                        for ( var index = 0 ; index < cart.length ; index++ ){
                            var item = Inventory.findOne({_id: cart[index]._id });
                            if (item){
                                Inventory.update({ _id: item._id}, {
                                    $set: {
                                        quantity: ( item.quantity + cart[index].planned ),
                                        planned: 0
                                    }
                                })
                            }
                        }
                        Session.set("shoppingCart", new Array() );
                        swal("Success!", "Shopping Cart Updated!", 'success');
                        return true;
                    }
                }
            }
        })
    }
})

Template.dialogInventoryCheckout.helpers({
    getCart: function(){
        return Session.get("shoppingCart");
    },
    getItemCost: function(planned, cost){
        return planned*cost;
    },
    getSubtotal: function(){
        if ( Session.get("shoppingCart").length ){
            return Session.get("shoppingCart").map( function(item){
                return item.planned*item.cost;
            }).reduce( function(a,b){
                return a+b;
            });
        }
        else return 0;
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

var renderTmp = function(template, data){
    var node = document.createElement("div");
    document.body.appendChild(node);
    UI.renderWithData( template, data, node );
    return node;
}