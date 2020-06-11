$(document).ready(function(){
    function load_json(statename, city, zip){
        var html_option_state='';
        $.getJSON('usaData-min.json',function(data){
            html_option_state+='<option value="'+stateid+'">statename</option>';
        });
    }
});