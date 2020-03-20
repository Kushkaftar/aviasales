const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');
//buttonSearch = document.querySelector('.button button__search');

const cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');


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

const sortNumb = (arr) => {
    arr.sort((a, b) => {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;

    });
}

const renderChiapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML ='<h2>Самый дешевый билет на выбранную дату</h2>';
   const ticket = createCard(cheapTicket[0]);
   cheapestTicket.append(ticket);
}

// sort
const renderChiapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML ='<h2>Самые дешевые билеты на другие даты</h2>';
    sortNumb(cheapTickets);

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

const getNaveCity = (code) => {
    const objCity = city.find((item) => item.code === code);
    return objCity.name;

}

const getCanges = (num) => {
    if (num) {
        return num === 1 ? '1 change' : '2 change'
    }else {
        return 'not change'
    }
}

const  getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const createCard =(data) =>{
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep =`
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNaveCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)} г.</div>
                </div>
        
                <div class="block-right">
                <div class="changes">${getCanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNaveCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3> Not ticets </h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep)
    return ticket;
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
    event.preventDefault();



    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value
    }
    if (formData.from && formData.to) {
    console.log(formData);

    const requestData = '?dapart_date=' + formData.when + '&origin=' + formData.from.code + '&destination=' + formData.to.code
        + '&one_way=true&token=' + API_KEY;
    getData(proxy + calendar + requestData, (response) => {
        console.log(JSON.parse(response));
        renderChiap(response, formData.when)
    })
}else {
        alert('incorrect name city')
    }
})

getData(proxy + citiesAPI, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    /*  console.log(JSON.parse(data)); */
});


