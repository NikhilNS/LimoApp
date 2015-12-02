$(document).ready(function(){
	var city;
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
function onSuccess(position) {
    //$("#CurrentGeoLocation").html("Latitude: "+position.coords.latitude+"<br/>Longitude: "+position.coords.longitude);
    var element = document.getElementById('geolocation');
    var lat = position.coords.latitude;
    var lang = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(lat, lang);
    var mapOptions = {
        zoom: 8,
        center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    getCityName(lat,lang);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
    $("#FromGeoLat").val(lat);
    $("#FromGeoLang").val(lang);
    getTo(lat,lang);
}

    function onError(error) {
            alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    }

	$("#starting_point").val(city);
	$("#book_my_taxi").click(function(){
		var email=localStorage.email;
		var fullname=$("#fullname").val();
		var mobile=$("#mobile").val();
		var starting_point=$("#FromAddress").val();
		var end_point=$("#ToAddress").val();
		var dataString="fullname="+fullname+"&mobile="+mobile+"&starting_point="+starting_point+"&end_point="+end_point+"&email="+email+"&book_my_taxi=";
		$.ajax({
			type: "POST",
			url: "http://dhrupal.esy.es/book_my_taxi.php",
			data: dataString,
			crossDomain: true,
			cache: false,
			beforeSend: function(){ $("#book_my_taxi").html('Connecting...');},
			success: function(data){
				console.log(data);
        data1=data;
				if(data1="success")
				{
					console.log("success condition");
          alert("Your Taxi has been booked");
					$("#book_my_taxi").html('Book My Taxi');
				}
				else
				{
          console.log("failed" + data);
					alert("something went wrong");
					$("#book_my_taxi").html('Book My Taxi');

				}
			}
		});
	});
function getCityName(latitude,longitude)
{
var geocoder;
geocoder = new google.maps.Geocoder();
var latlng = new google.maps.LatLng(latitude, longitude);
geocoder.geocode(
    {'latLng': latlng}, 
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add= results[0].formatted_address ;
                    var  value=add.split(",");

                    count=value.length;
                    country=value[count-1];
                    state=value[count-2];
                    city=value[count-3];
                    street=value[count-4];
                    road=value[count-5];
                    //$("#CurrentCity").html(street+", "+city);
                    $("#FromAddress").val(street+", "+city);
                    var wurl="http://api.openweathermap.org/data/2.5/weather?q="+city+","+state+"&appid=2de143494c0b295cca9337e1e96b00e0";
                    $.getJSON(wurl,function(data){
                      //var Jdata=JSON.stringify(data);
                      $("#weather1").html(data.main.temp-273.15);
                    });
                }
                else  {
                    alert("address not found");
                }
        }
         else {
            alert("Geocoder failed due to: " + status);
        }
    }
);
}

		function calculateDuration(FromGeoLat,FromGeoLang,ToGeoLat,ToGeoLong)
		{
		var origin = new google.maps.LatLng( FromGeoLat, FromGeoLang); // using google.maps.LatLng class
		var destination = ToGeoLat + ',' + ToGeoLong; // using string
		var directionsService = new google.maps.DirectionsService();
		var request = {
		    origin: origin, // LatLng|string
		    destination: destination, // LatLng|string
		    travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		directionsService.route( request, function( response, status ) {
		    if ( status === 'OK' ) {
		        var point = response.routes[0].legs[0];
            var dist=point.distance.text;
            var distA=dist.split(" ");
            var cost;
            if(distA[1]=="m"){
              distance=distA[0]/1000;
              cost=distance*1;
            }
            else
            {
              distance=distA[0];
              cost=distance*1;
            }
            console.log(distA[0]);
		        $("#distance").val(distance +" KM");
            $("#cost").val("$"+cost+" USD");
		        $("#duration").val(point.duration.text);
		    }
		});
		}

        function getTo(lat,longi)
          {
              $('#somecomponent').locationpicker({
              location: {latitude: lat, longitude: longi}, 
              radius: 0,
              inputBinding: {
                latitudeInput: $('#ToGeoLat'),
                longitudeInput: $('#ToGeoLong'),
                locationNameInput: $('#ToAddress')        
              },
              enableAutocomplete: true,
              onchanged: function(currentLocation, radius, isMarkerDropped) {
                  var FromGeoLat=$("#FromGeoLat").val();
                  var FromGeoLang=$("#FromGeoLang").val();
                  var ToGeoLat=$("#ToGeoLat").val();
                  var ToGeoLong=$("#ToGeoLong").val();
                  calculateDuration(FromGeoLat,FromGeoLang,ToGeoLat,ToGeoLong);
              }});
          }
});