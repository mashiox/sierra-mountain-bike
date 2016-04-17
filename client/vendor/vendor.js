Template.vendor.helpers({
})

Template.vendor.events({
	'click li': function (event) {
		paginationClickHelper(event);
	},

	'submit .new-search': function (event) {
		events.preventDefault();
		event.target.text.value = "";
	}
})




Template.vendors.helpers({
	AllVendorsViewSettings: function () {
		return {
			collection: Vendors,
			rowsPerPage: 5,
			showFilter: true,
			fields: ["Name", "Status",
				{ key: 'options', label: 'Options', tmpl: Template.vendorOptionsColumn }
			]
		}
	}
})

Template.vendors.events({
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
	},

	'click button#btnDeleteVendor': function (event) {
		event.preventDefault();

		var obj = this;

		swal({
			title: "Confirm",
			text: "Delete vendor: " + obj.Name,
			type: "info",
			showCancelButton: true,
			closeOnConfirm: true,
		},
		function () {
			Vendors.remove(obj._id);
		});
	},


})






Template.dialogEditVendorOrder.rendered = function () {
	$('#txtEditVendorOrderReceiptDate').datepicker({
		todayBtn: "linked",
		orientation: "bottom auto",
		autoclose: true,
		todayHighlight: true
	});
}




Template.dialogEditVendorOrder.helpers({
	All_Vendors: function () {
		return Vendors.find();
	}
})









Template.orders.helpers({
	AllOrdersViewSettings: function () {
		return {
			collection: VendorOrders,
			rowsPerPage: 5,
			showFilter: true,
			fields: [
				{
					key: 'VendorID',
					label: 'Vendor',
					fn: function (value, object, key) {
						return Vendors.findOne({ _id: value }).Name;
					}
				},


				{ key: 'Status', label: 'Status' },



				{
					key: 'ShippingType',
					label: 'Shipping',
					fn: function (value, object, key) {
						return "$" + FormatMoney(GetOrderShipping(value), 2);
					}
				},




				{
					key: '_id',
					label: 'Gross Total',
					fn: function (value, object, key) {
						return GetOrderGrossTotal(value);
					}
				},



				{ key: 'options', label: 'Options', tmpl: Template.vendorOrderOptionsColumn }
			]
		}
	}
})







Template.orders.events({
	'click button#btnAddVendorOrder': function (event) {
		event.preventDefault();

		var obj = this;

		bootbox.dialog({
			title: "Create new vendor order",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditVendorOrder),
			buttons: {
				success: {
					label: "Create",
					className: "btn-success",
					callback: function () {
						var vendorID = $('#selectEditVendorOrderVendorID').val();
						var deliveryAddress = $('#txtEditVendorOrderDeliveryAddress').val().trim();
						var shippingType = $('#selectEditVendorOrderShippingType').val();
						var receiptDateStr = $('#txtEditVendorOrderReceiptDate').val();
						var status = $('#selectEditVendorOrderStatus').val();

						var vendor = Vendors.findOne({ _id: vendorID });
						if (vendor == null) {
							swal('Oops...', 'Select a vendor!', 'error');
							return false;
						}

						if (deliveryAddress == '') {
							swal('Oops...', 'Enter a delivery address!', 'error');
							return false;
						}

						var receiptDate = new Date(receiptDateStr);
						if (isNaN(receiptDate)) {
							swal('Oops...', 'Enter a receipt date!', 'error');
							return false;
						}

						VendorOrders.insert({
							VendorID: vendorID,
							DeliveryAddress: deliveryAddress,
							ShippingType: shippingType,
							ReceiptDate: receiptDate,
							Status: status
						});

						swal('Success!', 'Vendor added!', 'success');
						return true;
					}
				}
			}
		});
	},




	


	'click button#btnEditVendorOrderSettings': function (event) {
		event.preventDefault();

		var obj = this;
		activeVendorOrderID = obj._id;

		bootbox.dialog({
			title: "Edit vendor order",
			onEscape: true,
			backdrop: true,
			message: renderTmp(Template.dialogEditVendorOrder),
			buttons: {
				success: {
					label: "Update",
					className: "btn-success",
					callback: function () {
						var vendorID = $('#selectEditVendorOrderVendorID').val();
						var deliveryAddress = $('#txtEditVendorOrderDeliveryAddress').val().trim();
						var shippingType = $('#selectEditVendorOrderShippingType').val();
						var receiptDateStr = $('#txtEditVendorOrderReceiptDate').val();
						var status = $('#selectEditVendorOrderStatus').val();

						var vendor = Vendors.findOne({ _id: vendorID });
						if (vendor == null) {
							swal('Oops...', 'Select a vendor!', 'error');
							return false;
						}

						if (deliveryAddress == '') {
							swal('Oops...', 'Enter a delivery address!', 'error');
							return false;
						}

						var receiptDate = new Date(receiptDateStr);
						if (isNaN(receiptDate)) {
							swal('Oops...', 'Enter a receipt date!', 'error');
							return false;
						}

						VendorOrders.update(
							{ _id: obj._id },
							{
								$set: {
									DeliveryAddress: deliveryAddress,
									ShippingType: shippingType,
									ReceiptDate: receiptDate,
									Status: status
								}
							});

						swal('Success!', 'Vendor added!', 'success');
						return true;
					}
				}
			}
		});

		document.getElementById('selectEditVendorOrderVendorID').value = this.VendorID;
		document.getElementById('selectEditVendorOrderVendorID').disabled = true;
		document.getElementById('txtEditVendorOrderDeliveryAddress').value = this.DeliveryAddress;
		document.getElementById('selectEditVendorOrderShippingType').value = this.ShippingType;
		document.getElementById('txtEditVendorOrderReceiptDate').value = this.ReceiptDate;
		document.getElementById('selectEditVendorOrderStatus').value = this.Status;

		if (!CanModifyOrder(activeVendorOrderID)) {
			document.getElementById('txtEditVendorOrderDeliveryAddress').disabled = true;
			document.getElementById('selectEditVendorOrderShippingType').disabled = true;
			document.getElementById('txtEditVendorOrderReceiptDate').disabled = true;
			//document.getElementById('selectEditVendorOrderStatus').disabled = true;
		}
	},






	'click button#btnEditVendorOrderItems': function (event) {
		event.preventDefault();

		var obj = this;

		activeVendorOrderID = obj._id;

		var order = VendorOrders.findOne({ _id: activeVendorOrderID });

		bootbox.dialog({
			title: "Vendor order status: " + order.Status,
			onEscape: true,
			backdrop: true,
			size: 'large',
			message: renderTmp(Template.dialogEditVendorOrderItems),
			buttons: {
				success: {
					label: "Done",
					className: "btn-success",
					callback: function () {

						return true;
					}
				}
			}
		});

		if (!CanModifyOrder(activeVendorOrderID))
		{
			document.getElementById('dialogEditVendorOrderItemsAddItemControls').style.visibility = "hidden";
			document.getElementById('dialogEditVendorOrderItemsAddItemControls').style.display = 'none';
		}

		UpdateOrderSubtotalHeader();
	},
})



Template.dialogEditVendorOrderItems.helpers({
	All_Inventory: function () {
		return Inventory.find();
	},

	DynamicVendorOrderItems: function () {
		return {
			collection: VendorOrderItems.find({ OrderID: activeVendorOrderID }),
			rowsPerPage: 5,
			showFilter: true,
			fields: [
				{
					key: 'ProductID',
					label: 'Name',
					fn: function (value, object, key) {
						var product = Inventory.findOne({ _id: value });
						return product.name;
					}
				},
				{
					key: 'ProductID',
					label: 'Unit Cost + Tax',
					fn: function (value, object, key) {
						return ProductSubtotal(value);
					}
				},
				{ key: 'Quantity', label: 'Quantity' },
				{ key: 'options', label: 'Options', tmpl: CanModifyOrder(activeVendorOrderID) ? Template.vendorOrderItemsOptionsColumn : null }
			]
		}
	}
})




Template.dialogEditVendorOrderItems.events({
	'click button#btnEditVendorOrderItemsAddItem': function (event) {
		event.preventDefault();
		
		var productID = $('#selectEditVendorOrderItemInventory').val();
		var itemQuantity = $('#txtEditVendorOrderItemsQuantity').val();

		if (productID == '') {
			swal('Oops...', 'Select an inventory product!', 'error');
			return false;
		}

		if (itemQuantity == '' || isNaN(itemQuantity)) {
			swal('Oops...', 'Enter a valid quantity!', 'error');
			return false;
		}

		VendorOrderItems.insert({
			OrderID: activeVendorOrderID,
			ProductID: productID,
			Quantity: itemQuantity
		});

		$('#txtEditVendorOrderItemsQuantity').val("");
		document.getElementById('selectEditVendorOrderItemInventory').selectedIndex = 0;

		swal({
			title: "Success",
			text: "Item added to order.",
			timer: 1200,
			showConfirmButton: false
		});

		UpdateOrderSubtotalHeader();
	},




	'click button#btnEditVendorOrderItemQuantity': function (event) {
		event.preventDefault();

		var obj = this;

		bootbox.prompt("Enter new quantity", function (result) {
			if (result === null || result == "") {
				return;
			}

			newQuantity = result.trim();

			if (!isNaN(newQuantity)) {
				VendorOrderItems.update({ _id: obj._id }, { $set: { Quantity: newQuantity } });
			}
		});

		UpdateOrderSubtotalHeader();
	},





	'click button#btnEditVendorOrderItemRemove': function (event) {
		event.preventDefault();

		var obj = this;

		swal({
			title: "Confirm",
			text: "Delete order item",
			type: "info",
			showCancelButton: true,
			closeOnConfirm: true,
		},
		function () {
			VendorOrderItems.remove(obj._id);
		});

		UpdateOrderSubtotalHeader();
	}
})


function CanModifyOrder(orderID) {
	var order = VendorOrders.findOne({ _id: orderID });

	if (order.Status == "Shipped")
	{
		return false;
	}

	if (order.Status == "Canceled") {
		return false;
	}

	if (order.Status == "Returned") {
		return false;
	}

	if (order.Status == "Completed") {
		return false;
	}

	return true;
}






function GetOrderShipping(shippingType) {
	switch(shippingType) {
		case "First-Class Mail (USPS)":
			return 30.35;
		case "Priority Mail Express (USPS)":
			return 25.45;
		case "Priority Mail (USPS)":
			return 15.12;
		case "Next Day Air (UPS)":
			return 18.74;
		case "Ground (UPS)":
			return 8.05;
	} 
}






function GetOrderItemTax(cost) {
	return cost * 0.75;
}


function GetItemTotal(cost, quantity) {
	return GetOrderItemTax(cost) * quantity;
}



function GetOrderSubtotal(orderID) {
	var total = 0;

	VendorOrderItems.find({ OrderID: orderID }).map(function (doc) {
		var product = Inventory.findOne({ _id: doc.ProductID });
		total += GetItemTotal(product.cost, doc.Quantity);
	});

	return total;
}




function GetOrderGrossTotal(orderID) {
	var order = VendorOrders.findOne({ _id: orderID });
	return "$" + FormatMoney(GetOrderSubtotal(orderID) + GetOrderShipping(order.ShippingType), 2);
}


function UpdateOrderSubtotalHeader() {
	document.getElementById('headerEditVendorOrderItemsSubtotal').innerHTML = "Subtotal = " + "$" + FormatMoney(GetOrderSubtotal(activeVendorOrderID));
}



function ProductSubtotal(productID)
{
	var product = Inventory.findOne({ _id: productID });
	return "$" + FormatMoney(GetOrderItemTax(product.cost), 2);
}


function FormatMoney(n, c) {
	var c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}





var activeVendorOrderID = null;







var renderTmp = function (template, data) {
	var node = document.createElement("div");
	document.body.appendChild(node);
	UI.renderWithData(template, data, node);
	return node;
}
