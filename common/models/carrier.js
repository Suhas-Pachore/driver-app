'use strict';
var loopback = require('loopback');
var geolib = require('geolib');
module.exports = function(Carrier) {

    Carrier.getRoundtripLoads = function(msg, cb){
        var msg = msg.body;
        var load = loopback.findModel('Load');
        var self = this;
        var result = [];
        load.find({},function(error, allLoads){
            
        var len = allLoads.length;
        for(var i = 0 ;i<len ;i++){
                            var neardist = Math.abs(msg.latitude - allLoads[i].SourceLatitude) + Math.abs(msg.longitude - allLoads[i].SourceLongitude);
            if(neardist < 0.3){
                var originaldist = Math.abs(msg.latitude - allLoads[i].DestinationLatitude) + Math.abs(msg.longitude - allLoads[i].DestinationLongitude);
                console.log("------got near pickup-------");
                console.log(allLoads[i].LoadId+" "+originaldist +" near dist:"+neardist);
                for(var j=0;j<len;j++){
                    var neardist = Math.abs(allLoads[i].DestinationLatitude - allLoads[j].SourceLatitude) + Math.abs(allLoads[i].DestinationLongitude - allLoads[j].SourceLongitude);
                    console.log("--------------new near dist--------------");
                    console.log(neardist);
                    if(neardist < 0.3){
                    var currentDist = Math.abs(allLoads[j].DestinationLatitude - msg.latitude)+
                    Math.abs(allLoads[j].DestinationLongitude - msg.longitude);
                        console.log("*************"+currentDist);
                    if(originaldist >= currentDist){
                        console.log("------got drop pickup-------");
                        console.log(allLoads[j].LoadId +" "+currentDist);
                        result[i] = {
                            source : allLoads[i],
                            drops:[allLoads[i]]
                        };
                        result[i].drops.push(allLoads[j]);
                    }}
                
                }}
            }
            console.log(result);
            cb(error,result);
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
        accepts: {arg: 'msg', type:'Object','http': {source: 'req'}},
        returns: {arg: 'roundtripLoads', type:'array'}
    });

    Carrier.remoteMethod('getNearbyLoads',{
        accepts: {arg: 'msg', type: 'Object', 'http': {source: 'req'}},
        returns: {arg: 'nearbyLoads', type:'array'}
    });



};
