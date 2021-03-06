const nexTripHandler = require('./nexTrip/nexTripHandler');



    const args = process.argv.slice(2); // remove first 2 arguments 
    //  first argument is the path to nodejs, 
    // second argument is the location of the script you're executing.

    if (args.length < 3) // if less than 3 agruments process cannot be continued. 
        console.error("Enter all 3 arguments   (Ex :node nexTrip.js '<bus route>' '<bus stop name>' '<direction>'")
    else {
        let busRoute    = args[0]; // first argument is BusRoute
        let busStop     = args[1]; // Second argument in bus top
        let direction   = args[2]; // Third argument would be direction.
        
        // Handler function (nextBusTime) , to get the time in minutes of next bus.
        let nextBusTime = nexTripHandler.nextBusTime(busRoute, busStop, direction)

        nextBusTime.then((result) => {            
            console.log(result) //will log results.
        });



    }


