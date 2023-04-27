//const username = "kirstyr"; 
const baseUrl = "https://restcountries.com/v3.1/name/";

//get data from search input and pass to getCoords
function getData(baseUrl){

const searchInput = document.getElementById("search").value; 
if (searchInput !== ""){ 
    getCoords(baseUrl, searchInput)
    .catch(function (error) {
        console.log(error); 
        alert("Invalid Search"); 
    })
    }
   // window.location.href="countriesInfo.html"; 
}

let countries = {

    name: '',
    capital: '', 
    languages: '',
    population: 0,
    flag: '',
}

//pass base url and search input to getCoords to get data from api. 
    const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 

    //fetch call to get data from api
    const results = await fetch(URL);
        //convert data to json format
        const data = await results.json(); 
        console.log(data); 


    data.forEach(element => {

        let info = element.info;
    
        countries.name = element.name.official;
        countries.capital.capitalName = element.capital[0];
        countries.languages.capitalName = element.capital[0];

    });  

    let formattedNUmber = numberFormatter(informationAboutCountry.population);

    let areaNumber = numberFormatter(informationAboutCountry.area);

    $('#officialName').html(informationAboutCountry.name);

    $('#capital').html(informationAboutCountry.capital.capitalName);
    $('#population').html(formattedNUmber);
    $('#area').html(areaNumber).append(' square km');
    $('#currency').html(informationAboutCountry.currency);
    $('#timez').html(informationAboutCountry.timezones);
    $('#flag').attr("src", informationAboutCountry.flag);

}; 

function displayData(data) {
    document.getElementById("displayInfo").innerHTML = JSON.stringify(data);
}

//document.getElementById("displayInfo").innerHTML = data[0];










