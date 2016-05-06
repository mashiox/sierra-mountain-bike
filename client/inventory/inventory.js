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
                    // categoryFilter() the function, not the method
                    category: categoryFilter()
                },
                {
                    // conditionFilter() the function, not the method
                    condition: conditionFilter() 
                }
            ]
        }).fetch().filter( function( item ){
            return (
                item.description.match( new RegExp( Session.get("queryFilter"), "gi" ) )
                || 
                item.name.match( new RegExp( Session.get("queryFilter"), "gi" ) )
                ||
                item.cost.toString().match( new RegExp( Session.get("queryFilter"), "gi" ) )
                ||
                item.quantity.toString().match( new RegExp( Session.get("queryFilter"), "gi" ) )
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
        Session.set("conditionFilter", parseInt(value, 10));
    },
    
    'click ul#inv_categoriesLink li a': function(event, template){
        event.preventDefault();
        var value = template.find(event.currentTarget).attributes.value.value;
        Session.set("categoryFilter", parseInt(value, 10) );
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
                            var product = Inventory.findOne({_id: Session.get("editProductId")});
                            
                            var action = parseInt( $("input[name=action]:checked").val(), 10 );
                            var rtv = false;
                            var defective  = false;
                            if ( action ){
                                rtv = ( $("input#rtvCheckbox:checked").val() === undefined ? false : true );
                                defective = ( $("input#defectiveProd:checked").val() === undefined ? false : true );
                            }
                            
                            var quantityDelta = parseInt($("input#txtProductQuantity").val(), 10);
                            if ( isNaN(quantityDelta) || quantityDelta < 0 ){
                                swal("Oops...", "Enter a valid quantity!", 'error');
                                return false;
                            }
                            
                            var price = parseInt($("input#txtEditProductCost").val(), 10)
                            price = ( isNaN(price) ? product.cost : price );
                            
                            var category = parseInt( $("select#txtEditProductCategory").val(), 10 );
                            category = ( isNaN(category) ? product.category : category );
                            
                            var condition = parseInt( $("select#txtEditProductCondition").val(), 10 );
                            condition = ( isNaN(condition) ? product.condition : condition );
                            
                            var desc = $("textarea#txtEditProductDesc").val();
                            
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
                                item.rtv = rtv;
                                item.defective = defective;
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
    },
    
    'click button#inv_addNewProduct': function(event,template){
        event.preventDefault();
        bootbox.dialog({
            title: "Add New Inventory",
            onEscape: true,
            backdrop: true,
            message: renderTmp( Template.dialogNewInventory ),
            buttons: {
                success: {
                    label: "Update",
                    className: "btn-success",
                    callback: function(){
                        var name = $("input#txtProductName").val();
                        if ( !name.length ){
                            swal("Oops...", "Enter a product name!", "error");
                            return false;
                        }
                                                
                        var quantity = parseInt( $("input#txtProductOnHand").val(), 10 );
                        if ( isNaN(quantity) || quantity < 0 ){
                            swal("Oops...", "Enter a valid quantity!", 'error');
                            return false;
                        }
                        
                        var price = parseInt( $("input#txtProductPrice").val(), 10 );
                        if ( isNaN(price) || price < 0 ){
                            swal("Oops...", "Enter a valid price!", 'error');
                            return false;
                        }
                        
                        var category = parseInt( $("select#txtProductCategory").val(), 10 );
                        if ( isNaN(category) || category < 0 ){
                            swal("Oops...", "Select a valid category!", 'error');
                            return false;
                        }
                        
                        var condition = parseInt( $("select#txtProductCondition").val(), 10 );
                        if ( isNaN(condition) || condition < 0 ){
                            swal("Oops...", "Select a valid condition!", 'error');
                            return false;
                        }
                        
                        var desc = $("textarea#txtProductDesc").val();
                        
                        var item = Inventory.insert({
                            name: name,
                            description: desc,
                            cost: price,
                            quantity: quantity,
                            condition: condition,
                            category: category
                        });
                        
                        if ( item ){
                            swal("Success!", "New Item inserted!", "success");
                        }
                        else swal("Error", "Something went wrong...", 'error');
                        
                    }
                }
            }
        });
    }
})

Template.dialogEditInventory.onRendered(function(){
    var item = Inventory.findOne({ _id: Session.get("editProductId") });
    $("select#txtEditProductCategory option[value="+item.category+"]").attr("selected", "selected");
    $("select#txtEditProductCondition option[value="+item.condition+"]").attr("selected", "selected");
})

Template.dialogEditInventory.helpers({
    getProduct: function(){
        return Inventory.findOne({ _id: Session.get("editProductId") });
    }
})

Template.dialogEditInventory.events({
    'click input#actionRadioRm': function(event){
        $("input#rtvCheckbox").prop("disabled", function(i,v){return false;});
        $("input#defectiveProd").prop("disabled", function(i,v){return false;});
    },
    
    'click input#actionRadioSell': function(event){
        $("input#rtvCheckbox").prop("disabled", function(i,v){return true;});
        $("input#defectiveProd").prop("disabled", function(i,v){return true;});
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
                            
                            if ( cart[index].defective ){
                                SMBC.Ticket.addDefective(cart[index]);
                            }
                            
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
    isLoss: function(rtv, def){
        return rtv || def;
    },
    getLoss: function(planned, cost){
        return -planned*cost;
    },
    getSubtotal: function(){
        if ( Session.get("shoppingCart").length ){
            return Session.get("shoppingCart").map( function(item){
                if ( item.rtv || item.defective ) return -item.planned*item.cost; 
                return item.planned*item.cost;
            }).reduce( function(a,b){
                return a+b;
            });
        }
        else return 0;
    }
})

Template.dialogNewInventory.helpers({
    
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