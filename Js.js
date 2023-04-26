//const username = "kirstyr"; 
const baseUrl = "https://restcountries.com/v3.1/name/";


function getData(baseUrl){
//window.location.href="countriesInfo.html"; 
const searchInput = document.getElementById("search").value; 
if (searchInput !== ""){ 
    getCoords(baseUrl, searchInput)
    .catch(function (error) {
        console.log(error); 
        alert("Invalid Search"); 
    })
    }
//}

const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 


    const results = await fetch(URL);
    try{
        const data = await results.json(); 
        console.log(data); 
        return data;
    }
    catch (error){
        alert("error");
    }

}; 

let displayCountryInfo = {
    name: '', 
    capital: '', 
    population: '', 
    language: '', 
    flag: '', 

}

countryInfo.forEach(element => {
    let info = element.info; 

    displayCountryInfo.name = element.name; 
})
}




