Template.ems.helpers({
    
})

Template.ems.events({
    'click li': function (event) {
		paginationClickHelper(event);
	}
})

Template.employees.helpers({
	all_employees: function () {
		return {
			collection: Employees,
			rowsPerPage: 5,
			showFilter: true,
			fields: [ 'Name', 'Address', 'City', 'State', 'Zip']
		}
	}
})

 Template.schedule.helpers({
            options: function() {
        return {
            header: {
                left: '',
                center: 'title',
                right: 'today month,agendaWeek,agendaDay prev,next'
            },
            class: "mainCalendar",
            height: 600,
            handleWindowResize:true
        };
        }
    });
  
  Template.schedule.events({
    'click .addEvent': function () {
      /*  Events.insert({
            date: new Date()
        })
        */
        window.alert("add event clicked");
    },
    'click .removeEvent':function() {
        /*var event = Events.findOne();
        if(event) {
            Events.remove(event._id);
        }*/
        window.alert("remove event clicked");
    }
});


Template.employees.events({
	'click button#btnAddEmployee': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new employee...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditEmployee),
			buttons: {
				success: {
					label: "Add",
					className: "btn-success",
					callback: function () {
						var name = $('#txtEditEmployeeName').val().trim();
						var ssn = $('#txtEditEmployeeSSN').val().trim();
						var address = $('#txtEditEmployeeAddress').val().trim();
						var city = $('#txtEditEmployeeCity').val().trim();
						var state = $('#txtEditEmployeeState').val().trim();
						var zip = $('#txtEditEmployeeZip').val().trim();

						if (ssn.length < 9) {
							swal('Oops...', 'SSN must be 9 characters long!', 'error');
							return false;
						}

						if (zip.length < 5) {
							swal('Oops...', 'Zip must be 5 characters long!', 'error');
							return false;
						}

						if (name == '' || ssn == '' || address == '' || city == '' ||
							state == '' || zip == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						var match = Employees.findOne({ SSN: new RegExp('^' + ssn + '$', "i") });
						if (match) {
							swal('Oops...', 'That employee already exists!', 'error');
							return false;
						}

						Employees.insert({
							Name: name,
							SSN: ssn,
							Address: address,
							City: city,
							State: state,
							Zip: zip,
						});

						swal('Success!', 'Employee added!', 'success');
						return true;
					}
				}
			}
		});
	}
})

var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}