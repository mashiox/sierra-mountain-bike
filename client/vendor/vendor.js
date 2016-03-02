Template.vendor.helpers({
    
})

Template.vendor.events({
    
})


Template.vendorTable.events({
    'click tbody tr': function(event){
        event.preventDefault();
        console.log(event);
        Router.go("/vendor/"+event.currentTarget.getAttribute("vendorid"));
    }
})