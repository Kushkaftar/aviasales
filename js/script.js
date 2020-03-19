const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    buttonSearch = document.querySelector('.button button__search');



let city = [];

const citiesAPI = 'http://api.travelpayouts.com/data/ru/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'b2b0ad1ee13bd552eaca2de0bd08c605';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

const getData = (url, callBack) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callBack(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};



const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {

        const filterCity = city.filter((item) => {

            const fixItem = item.name.toLowerCase();
            // return fixItem.includes(input.value.toLowerCase())
            return fixItem.startsWith(input.value.toLowerCase())

        });
        sort(filterCity)
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__cities');
            li.textContent = item.name;
            list.append(li);
        });
    }
};

const handlerCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
}

const renderChiapDay = (cheapTicket) => {
    console.log(cheapTicket);
}

const sort = (arr) => {
    arr.sort(function (a, b) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
}

// sort
const renderChiapYear = (cheapTickets) => {

    sort(cheapTickets);

    console.log(cheapTickets);
}

const renderChiap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    })

    renderChiapDay(cheapTicketDay);
    renderChiapYear(cheapTicketYear);
}

inputCitiesFrom.addEventListener('input', () => { showCity(inputCitiesFrom, dropdownCitiesFrom) });
inputCitiesTo.addEventListener('input', () => { showCity(inputCitiesTo, dropdownCitiesTo) });

dropdownCitiesFrom.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name).code,
        to: city.find((item) => inputCitiesTo.value === item.name).code,
        when: inputDateDepart.value
    }
    console.log(formData);

    const requestDdata = '?dapart_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to
        + '&one_way=true&token=' + API_KEY;
    getData(proxy + calendar + requestDdata, (response) => {
        console.log(JSON.parse(response));
        renderChiap(response, formData.when)
    })
})

getData(proxy + citiesAPI, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    /*  console.log(JSON.parse(data)); */
});


