$(function () {
  $('#check-in').datepicker({
    numberOfMonths: 1,
    dateFormat: 'DD,d MM,yy',
    onSelect: function (selectdate) {
      var dt = new Date(selectdate);
      dt.setDate(dt.getDate() + 1)
      $('#check-out').datepicker("option", "minDate", dt);
    }
  });
  $('#check-out').datepicker({
    numberOfMonths: 1,
    dateFormat: 'DD,d MM,yy',
    onSelect: function (selectdate) {
      var dt = new Date(selectdate);
      dt.setDate(dt.getDate() - 1)
      $('#check-in').datepicker("option", "maxDate", dt);
    }
  });
});

const header = document.querySelector("header");
const main = document.querySelector(".bienvenidos");


const sectionOneOptions = {
  //Adding some margin to my navbar so that applies the effect before hits .bienvenidos div
  rootMargin: "-100px 0px 0px 0px"
}
//todo: Nav animation
const sectionOneObserver = new IntersectionObserver(function (entries, sectionOneObserver) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        console.log('scroll')
        $('header').addClass('nav-scrolled');
      } else {
        console.log('no scrol')
        $('header').removeClass('nav-scrolled');
      }
    });
  },
  sectionOneOptions);
sectionOneObserver.observe(header);


//todo: Nav bar animation ul HOME
$('.navigation .item .enlace').on('click', function () {
  $('.enlace').removeClass('active')
  $(this).addClass('active')
})

//todo: services animation
const portfolioItems = document.getElementsByClassName('descrip-servicio')
Object.keys(portfolioItems).forEach(elem => {
  portfolioItems[elem].addEventListener('mouseover', () => {
    portfolioItems[elem].classList.add('darken--description');
  })
  portfolioItems[elem].addEventListener('mouseout', () => {
    portfolioItems[elem].classList.remove('darken--description');
  })
})
$('.bedroom-nav a:first').addClass('active-item');
$('.bedroom-nav a').on('click', function () {
  $('.bedroom-nav a').removeClass('active-item');
  $(this).addClass('active-item');
})

// Animation hotel rooms
$(function () {
  //Removing class hide, so its showing first element
  $('.content-info-array .content-info').hide()
  $('.content-info-array .content-info:first').show()
  $('.bed-items li a').on('click', function () {
    $('.content-info-array .content-info').hide()
    var enlace = $(this).attr('href');
    $(enlace).removeClass('hide-panel');
    $(enlace).show(200);

    return false //Not to load again the page after click on a tag
  })
})

//todo: Reservation animation
$('.reservation-wrapper-reservation').hide()
// $('.reservation-wrapper-ticket').hide()
$(function () {
  $('.reservation-wrapper-details #btn-make').on('click', function () {
    $('.reservation-wrapper-details').hide()
    $('.reservation-wrapper-reservation').show(500)
  })
})

//todo: In case of success ticket
$(function(){
  if ($('.reservation-wrapper div').hasClass('ticket-active')){
    $('.reservation-wrapper-details').hide(100);
  }
  return false;
})

$(function () {
  $('.reservation-wrapper-reservation #btn-back').on('click', function () {
    $('.reservation-wrapper-reservation').hide();
    $('.reservation-wrapper-details').show(500);
    return false
  })
})

$(function(){
  $('.ticket-active #total').hide()
  $('.ticket-active #total:last').show()
  return false;
})

$(function(){
  $('.ticket-active #ticket').hide()
  $('.ticket-active #ticket:last').show()
  return false
})

$(function(){
  $('.ticket-active button').on('click',function(){
    $('.ticket-active').hide();
    $('.reservation-wrapper-details').show(500);
  })
  return false;
})


//Json states
try {
  window.onload = function () {
      var select_state = document.getElementById("select-state");
      //Cargar json 
      fetch('/json/US_States_and_Cities.json').then(function (res) {
          return res.json();
      }).then(function (data) {
          //Mostrar lista de estados en select
          for (x in data) {
              option = document.createElement('option');
              option.text = x;
              option.value = x;
              select_state.add(option);
          }
      });
  };
} catch (error) {
}
//Json cities
try {
  document.getElementById('select-state').addEventListener('input', function () {
      var select_state = document.getElementById("select-state");
      var value_state = document.getElementById("select-state").value;
      if (value_state != '') {
          var select_city = document.getElementById("select-city");
          //Remover ciudades de select - options al elegir nuevo estado
          for (var i = select_city.length; i >= 1; i--) {
              select_city.remove(i);
          }
          fetch('/json/US_States_and_Cities.json').then(function (res) {
              return res.json();
          }).then(function (data) {
              var data_state = data[value_state];
              for (j = 0; j < data_state.length; j++) {
                  option = document.createElement('option');
                  option.text = data_state[j];
                  option.value = data_state[j];
                  select_city.add(option);
              }
          });
      }
  });
} catch (error) {
}