Template.vendor.helpers({
})

Template.vendor.events({
})

Template.vendorTable.helpers({
	AllVendorsViewSettings: function () {
		return {
			collection: Vendors,
			rowsPerPage: 5,
			showFilter: true,
			fields: ["Name", "Address", "Status",
				{ key: 'options', label: 'Options', tmpl: Template.vendorOptionsColumn }
			]
		}
	}
})

Template.vendorTable.events({
	'click button#btnAddVendor': function (event) {
		event.preventDefault();

		bootbox.dialog({
			title: "Create new vendor...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditVendor),
			buttons: {
				success: {
					label: "Create",
					className: "btn-success",
					callback: function () {
						var name = $('#txtEditVendorName').val().trim();
						var address = $('#txtEditVendorAddress').val().trim();
						var status = $('#txtEditVendorStatus').val().trim();

						if (name == '' || address == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						var match = Vendors.findOne({ Name: new RegExp('^' + name + '$', "i") })
						if (match) {
							swal('Oops...', 'That vendor already exists!', 'error');
							return false;
						}

						Vendors.insert({
							Name: name,
							Address: address,
							Status: status
						});

						swal('Success!', 'Vendor added!', 'success');
						return true;
					}
				}
			}
		});
	},

	'click button#btnEditVendor': function (event) {
		event.preventDefault();

		var obj = this; // need to store this reference to process the update operation

		bootbox.dialog({
			title: "Update vendor...",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditVendor),
			buttons: {
				success: {
					label: "Update",
					className: "btn-success",
					callback: function () {
						var name = $('#txtEditVendorName').val().trim();
						var address = $('#txtEditVendorAddress').val().trim();
						var status = $('#txtEditVendorStatus').val().trim();

						if (name == '' || address == '') {
							swal('Oops...', 'All fields must be filled out!', 'error');
							return false;
						}

						if (name == obj.Name && address == obj.Address && status == obj.Status) {
							swal('Oops...', 'No fields were changed', 'warning');
							return false;
						}

						var match = Vendors.findOne({ Name: new RegExp('^' + name + '$', "i") })
						if (match && match._id != obj._id) {
							swal('Oops...', 'That vendor already exists!', 'error');
							return false;
						}

						Vendors.update({ _id: obj._id }, { $set: { Name: name, Address: address, Status: status } });

						swal('Success!', 'Vendor updated!', 'success');
						return true;
					}
				}
			}
		});

		document.getElementById('txtEditVendorName').value = this.Name;
		document.getElementById('txtEditVendorAddress').value = this.Address;
		document.getElementById('txtEditVendorStatus').value = this.Status;
	}
})

var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}