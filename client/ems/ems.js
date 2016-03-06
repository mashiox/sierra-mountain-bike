Template.ems.helpers({
    
})

Template.ems.events({
    'click li': function(event){
        event.preventDefault();
        $("div#displayTable").hide();
        $("div.table"+event.currentTarget.id).show();
    }
})