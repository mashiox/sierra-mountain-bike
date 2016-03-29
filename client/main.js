paginationClickHelper = function (event) {
    event.preventDefault();
    
    try {
        if ($("li#" + event.currentTarget.id).hasClass("pagination").toString()) {
            $("div#displayTable").hide();
            $("div.table" + event.currentTarget.id).show();

            // update pagination
            var $listItems = $('li');
            $listItems.removeClass('active');
            $("li#" + event.currentTarget.id).addClass('active');
        }
    } catch (e) {
        // ignore this
    }
}

Router.configure({
    layoutTemplate: 'ApplicationLayout',
    
    waitOn: function(){
        // We will add Meteor-Mongo subscriptions here later...
        return;
    }
});

/**
 * Iron:Router
 * --- Index Page
 */
Router.route("/", function(){
    this.render("navbar", { to: "header"} );
    this.render("index", { to: "main"} );
});

/**
 * Iron:Router
 * --- Login/Registration Page
 */
Router.route("/login", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() ){
        this.render("index", { to: "main"} );
    }
    else { 
        this.render("registration", { to: "main"} );
    }
});

/**
 * Contact page
 */
Router.route("/contact", function(){
    this.render("navbar", { to: "header"} );
    this.render("contact", {to: "main"});
})

/**
 * Iron:Router
 * --- Employee Management System
 */
Router.route("/ems", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /*&& Meteor.user().profile.accessLevel >= 4*/ ){ 
        this.render("ems", { to: "main"} );
    }
    else{
        this.render("index", { to: "main"} );
    }
})

/**
 * Iron:Router
 * --- Employee Management System
 *     --- Employee Detail
 */
Router.route("/ems/:_id", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /* && Meteor.user().profile.accessLevel >= 1000 */ ){
        // var employee = Employee.findOne({_id: this.params._id});
        var employee = {_id: this.params._id};
        if ( employee ){
            Session.set("employeeId", this.params._id);
            this.render("emsDetail", { to: "main"} );
        }
        else {
            this.render("employeeNotFound", { to: "main"} );
        }
    }
    else {
        this.render("index", { to: "main"} );
    }
})

/**
 * Iron:Router
 * --- Inventory Management System
 */
Router.route("/inventory", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /* && Meteor.user().profile.accessLevel >= N */ ){
        this.render("inventory", { to: "main"} );
    }
    else {
        this.render("index", { to: "main"} );
    }
})

/**
 * Iron:Router
 * --- Repair Ticket Management System
 */
Router.route("/ticket", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /* && Meteor.user().profile.accessLevel >= 2 */){
        this.render("ticket", { to: "main"} );
    }
    else {
        // ???
        this.render("index", { to: "main"} );
    }
})

/**
 * Iron:Router
 * --- Repair Ticket Management System
 *     --- Ticket Detail
 */
Router.route("/ticket/:_id", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /* && Meteor.user().profile.accessLevel >= 2 */ ){
        // var ticket = Tickets.findOne({_id: this.params._id});
        var ticket = {_id: this.params._id};
        if ( ticket ){
            Session.set("ticketId", this.params._id);
            this.render("ticketDetail", { to: "main"} );
        }
        else {
            this.render("ticketNotFound", { to: "main"} );
        }
    }
    else {
        this.render("index", { to: "main"} );
    }
})


/**
 * Iron:Router
 * --- Vendor Managmenet System
 */
Router.route("/vendor", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() ){
        this.render("vendor", { to: "main"} );
    }
    else {
        this.render("index", { to: "main"} );
    }
})

/**
 * Iron:Router
 * --- Vendor Management System
 *      --- Vendor Detail
 */
Router.route("/vendor/:_id", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() ){
        this.render("vendorDetail", { to: "main"} );
    }
    else {
        this.render("index", { to: "main"} );
    }
})