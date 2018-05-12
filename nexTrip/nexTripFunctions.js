//  The NexTrip API  
const API = 'http://svc.metrotransit.org/NexTrip/'


/*---------------------PUBLIC FUNCTIONS---------------------START------------------------------*/


/*
Function    : Check Route.
Arguments   : Bus route given by user (Ex : METRO Green Line ).
Output      : Route Information.
*/

async function checkRoute(busRoute) {
    try {
		// calls fetchContent function for routes to get json response.
        let route = await fetchContent(API + 'Routes?format=json') 
            .then(content => {
                return content.find(function(obj) {         // function to match a value in array of objects.
                    return obj.Description === busRoute;	// return if the route description matches <busRoute>.
                });
            });
        return route;
    } catch (err) {
        console.log('fetch failed for checkRoute ,  ERROR :  ', err);
    }
}


/*
Function    : get Direction.
Arguments   : 1) routeid from function ==> checkRoute() (Ex:902).
	      2) direction given by user (Ex : east ).
Output      : Valid direction information .
*/

async function getDirection(route, direction) {
    try {
		// calls fetchContent function for directions to get json response.
        let directionValue = await fetchContent(API + 'Directions/' + route + '?format=json') 
            .then(content => {
				direction = direction.toUpperCase(); // convert user given direction to uppercase. 
                direction += 'BOUND';				 // concat BOUND to direction (Ex : EASTBOUND).
                return content.find(data => data.Text === direction); // Check if user direction is valid and return value.
            });

        return directionValue;
    } catch (err) {
        console.log('fetch failed for getDirection ,  ERROR : ', err);
    }

}

/*
Function    : get Stops.
Arguments   : 1) routeid from function ==> checkRoute() (Ex:902) .
	      2) direction value from function ==> getDirection() (EX:1 ).
	      3) busStop given by user (Ex : Target Field Station Platform 1 ).
Output      : Valid direction information .
*/


async function getStops(route, directionValue, busStop) {
    try {
		 // calls fetchContent function for stops to get json response.
        let stopValue = await fetchContent(API + 'Stops/' + route + '/' + directionValue + '?format=json')
            .then(content => {				// function to match a value in array of objects.
                return content.find(data => data.Text === busStop); // Check if user bustop is in objects text.
            });

        return stopValue;
    } catch (err) {
        console.log('fetch failed for getStops ,  ERROR : ', err);
    }

}


/*
Function    : Get Time point.
Arguments   : 1) routeid from function ==> checkRoute() (Ex:902) .
	      2) direction value from function ==> getDirection() (Ex:1 ).
	      3) stopValue from function ==>  getStops() (Ex : 7SOL ).
Output      : Time in minutes until the next bus.
*/
async function getTimepoint(route, directionValue, stopValue) {
    try {
			// calls fetchContent function for stops to get json response.
        let timePoint = await fetchContent(API + route + '/' + directionValue + '/' + stopValue + '?format=json')
            .then(content => {
                if (content[0]) { // do operations if there is content in array .
                    let busTime = getTimeStamp(content[0].DepartureTime); // Get formatted departure epoch timestamp.
                    let gmtTime = Math.round((new Date()).getTime()); // Get epoch GMT time.
                    let localTime = gmtTime - 18000; // get local time of eastern US  , minus 18000 seconds  i.e ( - 5 hours)
                    let timeDiff = busTime - localTime;  //  calculate time difference.
                    timeDiff = Math.round(timeDiff / (1000 * 60)); // convert time difference to minutes.
                    return timeDiff + ' minutes.';
                } else {
                    return content[0];
                }
            });

        return timePoint;
    } catch (err) {
        console.log('fetch failed for getTimepoint , ERROR : ', err);
    }

}

/*---------------------PUBLIC FUNCTIONS---------------------END------------------------------*/


/*---------------------PRIVATE FUNCTIONS---------------------START------------------------------*/


/*
Function    : fetch content .
Arguments   : URL
Output      : Json response data.
*/

async function fetchContent(url) {
    const fetch = require('node-fetch'); //  npm node-fetch == > From native http to fetch API.

    let content = await fetch(url)
        .then(res => res.json())
        .then(body => {
            return body;
        });


    return content;
}

/*
Function    : Get timestamp  .
Arguments   : Departure time from function ==> getTimepoint()  (Ex : /Date(1526038800000-0500)/ ).
Output      : Json response data.
*/

const getTimeStamp = (timeString) => {
    timeString = timeString.substring(0, timeString.indexOf('-'));
    timeString = timeString.substring(timeString.indexOf("(") + 1);
    //console.log(timeString)
    return Number(timeString);
}

/*---------------------PRIVATE FUNCTIONS---------------------END------------------------------*/



/*  Export all modules ( name<publicly usable name>  : value <function name> ) */

module.exports = {
    checkRoute	: checkRoute,
    getDirection: getDirection,
    getStops	: getStops,
    getTimepoint: getTimepoint
}
