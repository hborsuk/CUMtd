let app = document.getElementById('app');
// Make a request for a user with a given ID
let stops = [
'GRN1ST:4',
'GRN2ND:3'
]
setInterval(wa,1000000)
function wa(){
    console.log('wa');
}
CUMtd()
setInterval(CUMtd,60000)
function CUMtd(){
    app.innerHTML = '';
    
    console.log('TEST');
    stops.forEach((stopId) => {
        axios.get(`https://developer.cumtd.com/api/v2.2/json/getdeparturesbystop?key=93f9279b46db4f9c94f078dbedd837a1&stop_id=${stopId}`)
            .then(function (response) {
                // handle success
                axios.get(`https://developer.cumtd.com/api/v2.2/json/getstop?key=93f9279b46db4f9c94f078dbedd837a1&stop_id=${stopId}`)
                    .then(function(stopResponse) {
                        if(response.data.departures.length > 0)
                            app.innerHTML += `<h2>${stopResponse.data.stops[0].stop_name}</h2>`;
                        response.data.departures.forEach((departure) => {
                            writeStopInfo(departure);
                        })
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                console.log(response);
                console.log(response.data.departures[0].expected_mins);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    });

    function writeStopInfo(departure) {
        let liveColor = '#000000';
        let busColor = '#000000';
        if(departure.is_monitored)
        {
            liveColor = '#b01726';
        }
        //
        departure.headsign.split(" ").forEach((word) => {
            if (isColor(word.toLowerCase())) {
                busColor = word.toLowerCase();
            }
        })
        function isColor(strColor){
            var s = new Option().style;
            s.color = strColor;
            return s.color == strColor;
          }

        app.innerHTML += `
            <div class="stopCard">
                <div class="stopCard--top">
                    <p class = "stopCardName" style="color: ${busColor}">${departure.headsign}</p><p class = "stopCardMins" style = "color: ${liveColor}">${departure.expected_mins}
                    <br><span>minutes</span></p>
                </div>
            </div>
        `;
    }

}

function goodTimeMaker() {
    axios.get('https://developer.cumtd.com/api/v2.2/json/getstops?key=93f9279b46db4f9c94f078dbedd837a1')
        .then((response) => {
            stops = response.data.stops.map((stop, index) => {
                if ( index < 26) {
                    return stop.stop_id;
                }
            })
        })
    CUMtd();
}