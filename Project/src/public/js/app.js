//Funcion para la barra de navegación, se despliega al dar click a la barra del header
var parent = document.getElementsByClassName('nav-link');
for (var i = 0; i < parent.length; i++) {
    parent[i].addEventListener('click', function () {
        this.classList.toggle('active');
    });
};
//Funcion para contenido y cuerpo
document.getElementById('bar').addEventListener('click', function () {
    if (document.getElementById('bar-nav').classList.contains('inactive-nav')) {
        document.getElementById('bar-nav').classList.remove('inactive-nav');
        document.getElementById('bar-nav').classList.add('active-nav');
        document.getElementById('body-cotainer').classList.remove('inactive-nav');
        document.getElementById('body-cotainer').classList.add('active-nav');
    } else {
        document.getElementById('bar-nav').classList.add('inactive-nav');
        document.getElementById('bar-nav').classList.remove('active-nav');
        document.getElementById('body-cotainer').classList.add('inactive-nav');
        document.getElementById('body-cotainer').classList.remove('active-nav');
    }
});
//Funcion para placeholder
var div_placeholder = document.getElementsByClassName('form-control');
for (var j = 0; j < div_placeholder.length; j++) {
    if (div_placeholder[j].value) {
        div_placeholder[j].parentNode.classList.add('placeholder-active');
    }
}

$('.form-control').focus(function () {
    $(this).parent().addClass('placeholder-active');
}).blur(function () {
    if ($(this).val() === '') {
        $(this).parent().removeClass('placeholder-active');
    }
});
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

//Select roomtype-capacity
try {
    [document.getElementById('bedtype'), document.getElementById('nbeds')].forEach(item => {
        item.addEventListener('input', () => {
            var btype = document.getElementById('bedtype').value;
            var nbeds = document.getElementById('nbeds').value;
            if (btype === 'Single') {
                var val = 1 * nbeds;
                document.getElementById('roomcapacity').setAttribute('value', val);
                document.getElementById('roomcapacity').parentNode.classList.add('placeholder-active');
            }
            else {
                var val = 2 * nbeds;
                document.getElementById('roomcapacity').setAttribute('value', val);
                document.getElementById('roomcapacity').parentNode.classList.add('placeholder-active');
            }
        });
    });
} catch (error) {
}

//Hide overlay
try {
    const close = document.getElementById('close-1');
    close.addEventListener('click', () => {
        document.getElementById("overlay").remove();
    })
} catch (error) {
}

//View password
try {
    document.getElementById('password').addEventListener('mousedown', () => {
        var x = document.getElementById("inp-password");
        if (x.type === "password") {
            x.type = "text";
            document.getElementById('password').parentNode.classList.add('active-ph');
        } else {
            x.type = "password";
            document.getElementById('password').parentNode.classList.remove('active-ph');
        }
    })
} catch (error) {
}

