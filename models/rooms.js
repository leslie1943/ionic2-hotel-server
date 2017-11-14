var mongoose = require('mongoose');
var express = require('express');
var app = express();

//Object model
var Room = mongoose.model('rooms', {
    room_number: Number,
    type: String,
    beds: Number,
    max_occupancy: Number,
    cost_per_night: Number,
    reserved: [
        {
            from: String,
            to: String
        }
    ]
});

/**
 * Generate some test data, if no records exist already.
 * MAKE SURE TO REMOVE IN PROD ENVIRONMENT
 */

function getRandomInit(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Each time you restart the node server, all records will be wiped and regenerated.
//If want to keep the data, just get rid of the Room.remove(){}; call.

Room.remove({}, function (res) {
    console.log('Removed records.');
});

Room.count({}, function (err, count) {
    console.log('Rooms:' + count);

    if (count === 0) {
        var recordsToGenerate = 150;

        var roomsTypes = [
            'standard',
            'villa',
            'penthouse',
            'studio'
        ];

        // For testing purposes, all rooms will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018

        for (var i = 0; i < recordsToGenerate; i++) {
            var newRoom = new Room(
                {
                    room_number: i,
                    type: roomsTypes[getRandomInit(0, 3)],
                    beds: getRandomInit(1, 6),
                    max_occupancy: getRandomInit(1, 8),
                    cost_per_night: getRandomInit(50, 500),
                    reserved: [
                        { from: '1970-01-01', to: '1970-01-02' },
                        { from: '2017-04-18', to: '2017-04-23' },
                        { from: '2018-04-18', to: '2019-04-18' }
                    ]
                }
            );
            newRoom.save(function (err, doc) {
                console.log('Created test document' + doc._id);
            });
        }
    }
});

//Routes - room list
app.post('/api/rooms', function (req, res) {
    console.log("[LOG]: Search starting...");
    Room.find({
        type: req.body.type,
        beds: req.body.beds,
        // guests: req.body.guests,
        max_occupancy: { $gt: req.body.guests },
        cost_per_night: { $gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper },
        reserved: {

            //Check if any of the dates the room has been reserved for overlap with the requsted dates
            $not: {
                $elemMatch: { from: { $lt: req.body.to.substring(0, 10) }, to: { $gt: req.body.from.substring(0, 10) } }
            }

        }
    }, function (err, rooms) {
        if (err) {
            res.send(err);
        } else {
            console.log("[LOG]: " + "req.body.type - " + req.body.type);
            console.log("[LOG]: " + "req.body.beds - " + req.body.beds);
            console.log("[LOG]: " + "req.body.max_occupancy - " + JSON.stringify({ $gt: req.body.guests }));
            console.log("[LOG]: " + "req.body.cost_per_night - " + JSON.stringify({ $gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper }));
            console.log("[LOG]: " + "req.body.reserved - " + JSON.stringify({
                $not: {
                    $elemMatch: { from: { $lt: req.body.to.substring(0, 10) }, to: { $gt: req.body.from.substring(0, 10) } }
                }
            }));
            console.log("[LOG]: " + rooms.length + " be found.");
            res.json(rooms);
        }
    });

    console.log("[LOG]: Search finishing...");
});

//Routes - room reserved
// The second route is at /api/rooms/reserve and simply allows us to find an existing room, and push a new reservation to the reserved array.
app.post('/api/rooms/reserve', function (req, res) {
    console.log("[LOG]: Reserve starting...");
    console.log("[LOG]: req.body._id:" + req.body._id);
    Room.findByIdAndUpdate(req.body._id, {
        $push: {
            "reserved": {
                from: req.body.from,
                to: req.body.to
            }
        }
    }, {
            safe: true,
            new: true
        }, function (err, room) {
            if (err) {
                res.send(err);
            } else {
                res.json(room);
            }
        });

    console.log("[LOG]: Reserve finishing...");
});

//Routes - room created
app.post('/api/room', function (req, res) {
    console.log("[LOG]: Create starting...");
    
    var newRoom = new Room({
        type: req.body.type,
        beds: req.body.beds,
        max_occupancy: req.body.guests,
        cost_per_night: req.body.price,
        reserved: {
            from: req.body.from.substring(0, 10),
            to: req.body.to.substring(0, 10)
        }
    });

    // console.log("[DEBUG] newRoom:" + newRoom);
    newRoom.save(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.json(data); //MUST
            console.log("[LOG]: The new room id is: " + data._id);
        }
    });
    console.log("[LOG]: Create finishing...");
});

module.exports = app;