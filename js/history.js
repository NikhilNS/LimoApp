$(document).ready(function(){
	var email=localStorage.email;
	$.getJSON("http://dhrupal.esy.es/json.php",{mobile:email},function(result){
        $.each(result, function(i, field){
        	var starting_point=field.starting_point;
        	var ending_point=field.ending_point;
        	var datetime=field.datetime;
            $("#listView").append("<div class='item'>"+starting_point+" -> "+ending_point+"<p>"+datetime+"</p></div>");
        });
	});
});