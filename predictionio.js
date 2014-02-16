PredictionIO = {};

function checkId(params, fieldName){
	var id = params[ fieldName ];

	check(id, String);

	if(!/^[^\t,]*$/.test(id)){
		throw new Error('Invalid param ' + fieldName + ':' + id + '\nMust not contain tab or comma.');
	}
}

function checkPair(params, fieldName){
	var pair = params[ fieldName ];

	check(pair, String);

	if(pair.split(',').length !== 2){
		throw new Error('Invalid param ' + fieldName + ', should be comam separated pair.');
	}

}

function checkDate(params, fieldName){
	var ts = params[ fieldName ];
	if((typeof ts !== 'number') && !(ts instanceof Date)){
		throw new Error('Invalid param' + fieldName + ', must be timestamp in millis or ISO date');
	}
}

function checkInteger(params, fieldName, low, high){
	var num = params[ fieldName];
	if(typeof num !== 'number'){
		throw new Error('Invalid param' + fieldName + ', must be a number');
	}

	if(low && high && (low>num || high < num)){
		throw new Error('Invalid param' + fieldName + ', must be in range [' + low + ',' + high + ']');
	}
}

PredictionIO.Client = function(options){
	this.appUrl = options.appUrl || 'http://localhost:8080';

	this.baseParams = {
		pio_appkey: options.appKey
	};
};

PredictionIO.Client.prototype.createUser = function(params, cb){
	if(!params.pio_uid){
		throw new Error('pio_uid is required.');
	}

	checkId(params, 'pio_uid');

	if(params.pio_latlng){
		checkPair(params, 'pio_latlng');
	}

	if(params.pio_inactive){
		check(params.pio_inactive, Boolean);
	}

	return HTTP.post(this.appUrl + '/users.json', { params: _.extend(this.baseParams, params) }, cb);
};

PredictionIO.Client.prototype.getUser = function(params, cb){
	checkId(params, 'pio_uid');
	return HTTP.get(this.appUrl + '/users/' + params.pio_uid + '.json', { params: this.baseParams }, cb);
};

PredictionIO.Client.prototype.deleteUser = function(params, cb){
	checkId(params, 'pio_uid');
	return HTTP.del(this.appUrl + '/users/' + params.pio_uid + '.json', { params: this.baseParams }, cb);
};

PredictionIO.Client.prototype.createItem = function(params, cb){
	if(!params.pio_iid){
		throw new Error('pio_iid is required.');
	}

	if(!params.pio_itypes){
		throw new Error('pio_itypes is required.');
	}
	
	checkId(params, 'pio_iid');
	checkPair(params, 'pio_itypes');

	if(params.pio_latlng){
		checkPair(params, 'pio_latlng');
	}

	if(params.pio_inactive){
		check(params.pio_inactive, Boolean);
	}

	if(params.pio_itypes){
		checkPair(params, 'pio_itypes');
	}

	if(params.pio_startT){
		checkDate(params, 'pio_startT');
	}

	if(params.pio_endT){
		checkDate(params, 'pio_endT');
	}

	if(params.pio_price){
		check(params.pio_price, Number);
	}

	if(params.pio_profit){
		check(params.pio_profit, Number);
	}

	return HTTP.post(this.appUrl + '/items.json', { params: _.extend(this.baseParams, params) }, cb);
};

PredictionIO.Client.prototype.getItem = function(params, cb){
	checkId(params, 'pio_iid');
	return HTTP.get(this.appUrl + '/items/' + params.pio_iid + '.json', { params: this.baseParams }, cb);
};

PredictionIO.Client.prototype.deleteItem = function(params, cb){
	checkId(params, 'pio_iid');
	return HTTP.del(this.appUrl + '/items/' + params.pio_iid + '.json', { params: this.baseParams }, cb);
};

PredictionIO.Client.prototype.userToItem = function(params, cb){
	if(!params.pio_uid){
		throw new Error('pio_uid is required.');
	}
	if(!params.pio_iid){
		throw new Error('pio_iid is required.');
	}
	if(!params.pio_action){
		throw new Error('pio_action is required.');
	}

	checkId(params, 'pio_uid');
	checkId(params, 'pio_iid');
	check(params.pio_action, String);

	if(params.pio_action === 'rate'){
		if(!params.pio_rate){
			throw new Error('pio_rate is required when pio_action is \'rate\'.');
		}
		checkInteger(params, 'pio_rate', 1, 5);
	}

	if(params.pio_latlng){
		checkPair(params, 'pio_latlng');
	}

	if(params.pio_endT){
		checkDate(params, 'pio_t');
	}

	return HTTP.post(this.appUrl + '/actions/u2i.json', { params: _.extend(this.baseParams, params) }, cb);
};

PredictionIO.Client.prototype.getRecItemsTopN = function(params, cb){
	if(!params.engine_name){
		throw new Error('engine_name is required.');
	}
	if(!params.pio_uid){
		throw new Error('pio_uid is required.');
	}
	if(!params.pio_n){
		throw new Error('pio_n is required.');
	}

	var engineName = params.engine_name;
	delete params.engine_name;

	checkId(params, 'pio_iid');
	check(engineName, String);
	check(params.pio_n, Number);

	if(params.pio_itypes){
		checkPair(params, 'pio_itypes');
	}

	if(params.pio_latlng){
		checkPair(params, 'pio_latlng');
	}

	if(params.pio_within){
		check(params.pio_within, Number);
	}

	if(params.pio_unit && !_.contains(['km', 'mi'], params.pio_unit)){
		throw new Error('pio_unit must either be \'km\' or \'mi\'.');
	}

	return HTTP.get(this.appUrl + '/engines/itemrec/' + engineName + '/topn.json', { params: _.extend(this.baseParams, params) }, cb);
};

PredictionIO.Client.prototype.getSimilarItemsTopN = function(params, cb){
	if(!params.engine_name){
		throw new Error('engine_name is required.');
	}
	if(!params.pio_iid){
		throw new Error('pio_iid is required.');
	}
	if(!params.pio_n){
		throw new Error('pio_n is required.');
	}

	var engineName = params.engine_name;
	delete params.engine_name;

	checkId(params, 'pio_iid');
	check(engineName, String);
	check(params.pio_n, Number);

	if(params.pio_itypes){
		checkPair(params, 'pio_itypes');
	}

	if(params.pio_latlng){
		checkPair(params, 'pio_latlng');
	}

	if(params.pio_within){
		check(params.pio_within, Number);
	}

	if(params.pio_unit && !_.contains(['km', 'mi'], params.pio_unit)){
		throw new Error('pio_unit must either be \'km\' or \'mi\'.');
	}

	return HTTP.get(this.appUrl + '/engines/itemsim/' + engineName + '/topn.json', { params: _.extend(this.baseParams, params) }, cb);
};

// if we're not running in Meteor (eg. in mocha), use CJS
if (typeof(exports) !== 'undefined') {
  exports.PredictionIO = PredictionIO;
}