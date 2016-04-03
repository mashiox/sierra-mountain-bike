/**
 * Establishes "root" user, given no accounts exist.
 */
Meteor.startup(function(){
    if ( !Accounts.users.findOne({}) ){
        console.log("Running first-run routines...");
        Accounts.createUser({
            email: "root@smbc.com",
            password: "root",
            username: "root",
            profile: {
                // TODO: Populate with correct data.
                name: "root",
                ein: 0,
                title: "Root",
                access: 100
            }
        });
    }
})