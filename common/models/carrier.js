'use strict';

module.exports = function(Carrier) {

    Carrier.getRoundtripLoads = function(msg, cb){
        var roundTrips = [];

        cb(null, '{"msg":"getting suggestions"}');
    }

     Carrier.getNearbyLoads = function(msg, cb){
        var nearbyLoads = [];
        
        cb(null, '{"msg":"getting suggestions"}');
    }

    Carrier.remoteMethod('getRoundtripLoads',{
        accepts: {arg: 'msg', type:'Object'},
        returns: {arg: 'roundtripLoads', type:'array'}
    });

    Carrier.remoteMethod('getNearbyLoads',{
        accepts: {arg: 'msg', type:'Object'},
        returns: {arg: 'nearbyLoads', type:'array'}
    });



};
