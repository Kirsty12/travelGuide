//const username = "kirstyr"; 
const baseUrl = "https://restcountries.com/v3.1/name/";


function getData(baseUrl){
const searchInput = document.getElementById("search").value; 
if (searchInput !== ""){ 
    getCoords(baseUrl, searchInput)
    .catch(function (error) {
        console.log(error); 
        alert("Invalid Search"); 
    })
    }
}

const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 


    const results = await fetch(URL);
    try{
        const data = await results.json(); 
        console.log(data); 
        displayCountriesInfo(data);
    }
    catch (error){
        alert("error");
    }

    window.location.href="countriesInfo.html"; 

}; 

function displayCountriesInfo() {
    let countryInfo = ""; 

    data.data.forEach((itemcountryInfo) => {
        countryInfo += "<tr>"; 
        countryInfo += "<td>" + itemcountryInfo.name + "</td>"
    }
}


