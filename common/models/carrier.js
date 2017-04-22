'use strict';
var loopback = require('loopback');
var geolib = require('geolib');
module.exports = function(Carrier) {

    Carrier.getRoundtripLoads = function(msg, cb){
        var load = loopback.findModel('Load');
        load.find(undefined, function(error, roundTrips){
            cb(error,roundTrips);
        });
    }

    Carrier.getNearbyLoads = function(msg, cb){
        var nearbyLoads = [];
		var region = msg.body;
		var load = loopback.findModel('Load');
        load.find({}, function(error, nearbyLoads){
			console.log(nearbyLoads);
            for(var i=0;i<nearbyLoads.length;i++){
				var flag = geolib.isPointInCircle(
					{latitude: nearbyLoads[i].SourceLatitude, longitude: nearbyLoads[i].SourceLongitude},
					{latitude: region.latitude, longitude: region.longitude},
					region.kmsValue
				);
				if(!flag)
				{
					nearbyLoads.splice(i,1);
					i--;
				}
			}
			cb(null,nearbyLoads);
        });
    }

    Carrier.remoteMethod('getRoundtripLoads',{
        accepts: {arg: 'msg', type:'Object'},
        returns: {arg: 'roundtripLoads', type:'array'}
    });

    Carrier.remoteMethod('getNearbyLoads',{
        accepts: {arg: 'msg', type: 'Object', 'http': {source: 'req'}},
        returns: {arg: 'nearbyLoads', type:'array'}
    });



};
