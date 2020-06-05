$('#bar').click(function() {
        if ($("#bar").prop("checked")) { 
            $(".body-nav").addClass("body-nav-active");
            $(".body-content").addClass("body-content-active");
        } 
        else { 
            $(".body-nav").removeClass("body-nav-active");  
            $(".body-content").removeClass("body-content-active");      
        }
});
$(document).ready(function(){
    $(".body-nav-ul li:has(ul)").click(function(e){
        e.preventDefault(); 
        if($(this).hasClass("active")){
            $(this).children('span').removeClass("active-span");
            $(this).children('span').addClass("inactive-span");
            $(this).children('ul').slideUp();
            $(this).removeClass("active");    
        }
        else{
            $(this).children('span').addClass("active-span");
            $(this).children('span').removeClass("inactive-span");
            $(this).children('ul').slideDown();
            $(this).addClass("active");
        }
    })
});
$(document).ready(function(){
    $("#register").click(function(e){
        $( "#bar" ).prop( "checked", false );
        $(".body-nav").removeClass("body-nav-active");  
        $(".body-content").removeClass("body-content-active");   
        $("#overlay").removeClass("overlay-inactive");   
        $("#overlay").addClass("overlay");    
        $("#body-form").slideDown();
        $("#body-form").removeClass("body-form-inactive");
        $("#body-form").addClass("body-form");

        $(".head").addClass("disable-selection");
        $(".body-nav").addClass("disable-selection");
        $(".title").addClass("disable-selection");
        $(".body-table").addClass("disable-selection");
    })
});

$(document).ready(function(){
    $("#cancel").click(function(e){
        $("#overlay").removeClass("overlay");   
        $("#overlay").addClass("overlay-inactive");  
        $("#body-form").removeClass("body-form");
        $("#body-form").hide() 

        $(".head").removeClass("disable-selection");
        $(".body-nav").removeClass("disable-selection");
        $(".title").removeClass("disable-selection");
        $(".body-table").removeClass("disable-selection");        
    })
});
