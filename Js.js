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

//pass base url and search input to getCoords to get data from api. 
    const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 

    //fetch call to get data from api
    const results = await fetch(URL);
        const data = results.json();

        let table = '';

        data.countries.forEach(function(country){
            table += `<tr>
                        <td>${country.altSpellings}</td>
                        <td>${country.capital}</td>
                        <td>${country.languages}</td>
                        <td>${country.population}</td>
                        <td>${country.flags}</td>
                     </tr>
                        `
        })
        document.getElementsById("displayInfo").innerHTML = table; 
}












