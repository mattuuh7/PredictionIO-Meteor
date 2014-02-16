var options = {
	appKey: "g1WwyFBOStK26TPsx4jFcMgMjYgq97vsn6lOGfzGZiEpRzADDCeMQ1OYk80yTVVU",
	appUrl: "http://localhost:8001"
};

var startT = new Date().getTime();
var endT = new Date().getTime() + 1000;

var pio = new PredictionIO.Client(options);

Tinytest.add('Initialize', function(test){
	test.equal(pio.baseParams.pio_appkey, options.appKey);
	test.equal(pio.appUrl, options.appUrl);
});

Tinytest.add('UserApiCreateUserInvalidLatLng', function(test){
	try{
		var response = pio.createUser({
			pio_uid: "randomUid",
			pio_latlng: "1234.567",
		});
	}catch(err){
		return console.error(err.message);
	}

	test.throws(function(){
		console.log('Error: Should have thrown exception on invalid pio_latlng.');
	});
});

Tinytest.add('UserApiCreateUser', function(test){
	var response = pio.createUser({
		pio_uid: "randomUid",
		pio_latlng: "12.34,5.67",
		pio_inactive: false,
		custom_field: "customVal"
	});
	test.equal(response.data, { message: "User created."}, "Expect the user to be created");
});

Tinytest.add('UserApiGetUserInvalidUidWithComma', function(test){
	try{
		var response = pio.getUser({ pio_uid: "asdv,weofk"});
	}catch(err){
		return console.error(err.message);
	}

	test.throws(function(){
		console.error('Error: Should have thrown exception on invalid pio_uid.');
	});
});

Tinytest.add('UserApiGetUserInvalidUidWithHorizontalTab', function(test){
	try{
		var response = pio.getUser({ pio_uid: "asdv\tweofk"});
	}catch(err){
		return console.error(err.message);
	}

	test.throws(function(){
		console.error('Error: Should have thrown exception on invalid pio_uid.');
	});
});

Tinytest.add('UserApiGetUserVerifyUid', function(test){
	var response = pio.getUser({ pio_uid: "randomUid"});
	test.equal(response.data.pio_uid, "randomUid", "Expect the pio_uid to be equal");
});

Tinytest.add('UserApiGetUserVerifyLatLng', function(test){
	var response = pio.getUser({ pio_uid: "randomUid"});
	test.equal(response.data.pio_latlng, [12.34,5.67], "Expect Geo Info");
});

Tinytest.add('UserApiGetUserVerifyInactive', function(test){
	var response = pio.getUser({ pio_uid: "randomUid"});
	test.isFalse(response.data.pio_inactive, "Expect inactive to be false");
});

Tinytest.add('UserApiGetUserVerifyCustomField', function(test){
	var response = pio.getUser({ pio_uid: "randomUid"});
	test.equal(response.data.custom_field, "customVal", "Expect custom_field");
});

Tinytest.add('UserApiDeleteUser', function(test){
	pio.createUser({ pio_uid: "tempId"});
	var response = pio.deleteUser({ pio_uid: "tempId"});
	test.equal(response.data, { message: "User deleted."}, "Expect the user to be deleted");
});

Tinytest.add('ItemApiCreateItemInvalidType', function(test){
	try{
		var response = pio.createItem({
			pio_iid: "randomIid",
			pio_itypes: "invalid\ttype"
		});
	}catch(err){
		return console.error(err.message);
	}

	test.throws(function(){
		console.log('Error: Should have thrown exception on invalid pio_itypes.');
	});
});

Tinytest.add('ItemApiCreateItem', function(test){
	var response = pio.createItem({
		pio_iid: "randomIid",
		pio_itypes: "shoe,umbrella",
		pio_startT: startT,
		pio_endT: endT,
		pio_price: 90.25,
		pio_profit: 40.13
	});

	test.equal(response.data, { message: "Item created."}, "Expected item to be created.");
});

Tinytest.add('UserApiGetItemrVerifyIid', function(test){
	var response = pio.getItem({ pio_iid: "randomIid"});
	test.equal(response.data.pio_iid, "randomIid", "Expect the pio_iid to be equal");
});

Tinytest.add('UserApiGetItemrVerifyEndT', function(test){
	var response = pio.getItem({ pio_iid: "randomIid"});
	test.equal(response.data.pio_endT, endT, "Expect the pio_endT to be equal");
});

Tinytest.add('UserApiDeleteItem', function(test){
	pio.createItem({
		pio_iid: "tempId",
		pio_itypes: "shoe,umbrella"
	});
	var response = pio.deleteItem({ pio_iid: "tempId"});
	test.equal(response.data, { message: "Item deleted."}, "Expect the item to be deleted");
});

Tinytest.add('UserToItemApiUserToItemMissingRate', function(test){
	try{
		var response = pio.userToItem({
			pio_uid: "randomUid",
			pio_iid: "randomIid",
			pio_action: "rate"
		});
	}catch(err){
		return console.error(err.message);
	}
	
	test.throws(function(){
		console.log('Error: Should have thrown exception when pio_rate is required.');
	});
});

Tinytest.add('UserToItemApiUserToItem', function(test){
	var response = pio.userToItem({
		pio_uid: "randomUid",
		pio_iid: "randomIid",
		pio_action: "rate",
		pio_rate: 5
	});

	test.equal(response.statusCode, 201, 'Expect 201 Created response code.');
});

Tinytest.add('ItemRecApiGetRecItemsTopNNotFound', function(test){
	try{
		var response = pio.getRecItemsTopN({
			engine_name: "itemrec",
			pio_iid: "randomIid",
			pio_n: 5
		});
	}catch(err){
		return console.error(err.message);
	}
});

Tinytest.add('ItemSimApiGetSimilarItemsTopNNotFound', function(test){
	try{
		var response = pio.getSimilarItemsTopN({
			engine_name: "itemsim",
			pio_iid: "randomIid",
			pio_n: 5
		});
	}catch(err){
		return console.error(err.message);
	}
});

