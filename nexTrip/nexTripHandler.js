// import modules 
const nexTripFunctions = require('./nexTripFunctions');


/*
Function    : Next bus time.
Arguments   : 1) Bus route given by user (Ex : METRO Green Line ).
			  2) Bus stop name given by user (Ex : Target Field Station Platform 1 ).
			  3) Direction (Ex :'east')
Output      : Time in minutes or No bus .
*/
async function nextBusTime(busRoute, busStop, direction) {
    try {
		
		// Function to get route data. (Input : busroute )
        let responseRouteData = await nexTripFunctions.checkRoute(busRoute); 
        if (responseRouteData) { // If there is any response route  data 
			
			// Function to get direction value. (Input : routeId(o/p = checkRoute function) , direction  )
            let responseDirectionValue = await nexTripFunctions.getDirection(responseRouteData.Route, direction);
            if (responseDirectionValue) { // If there is any Direction value.
				
                // Function to get stop value. (Input :  routeId(o/p =checkRoute function), direction value(o/p =getDirection function) ,busStop ) 
		let responseStopValue = await nexTripFunctions.getStops(responseRouteData.Route, responseDirectionValue.Value, busStop)
                if (responseStopValue) { // If there is any StopValue .
                    
					// Function to get stop value. (Input :  routeId(o/p = checkRoute function), direction value(o/p = getDirection function) ,stopValue(o/p = getStops function) ) 
		    let time = await nexTripFunctions.getTimepoint(responseRouteData.Route, responseDirectionValue.Value , responseStopValue.Value)
                    if (time) { // If there is time.
                        return time;
                    } else {
                        return "last bus for the day has already left";
                    }
                } else {
                    return "There is no stop(" + busStop + ") for this route(" + busRoute + ") and direction(" + direction + ").";
                }
            } else {
                return "This direction(" + direction + ") is not valid for this route(" + busRoute + ") .";
            }
        } else {
            return "This route(" + busRoute + ") is not in service for this Day ."
        }




    } catch (err) {
        console.log('fetch failed for nextBusTime , please try again ', err);
    }
}


module.exports = {
    nextBusTime: nextBusTime
}
