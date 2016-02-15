Template.index.helpers({
    isLoggedIn: function(){
        return userLoggedIn();
    }
})

Template.index.events({
    'click h3': function(event){
        event.preventDefault();
        alert("You clicked me");
        return;
    }
})