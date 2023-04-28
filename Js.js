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
    const URL = `${baseUrl}${searchInput}?fullText=true`; 
    console.log(URL); 

    //fetch call to get data from api
    const results = await fetch(URL);
        //convert data to json format
        const data = await results.json(); 
        console.log(data); 

        let li = '';
        
        //let unknownKey = Object.keys(country.languages)[0];

        
        //loops through data and pulls out specific information
        data.forEach((country) => {
            let unknownKey = Object.keys(country.languages)[0];

            li += `
            <tr>
            <th>Name</th>
            <td>${country.name.official}</td>
            </tr>
            <tr>
            <th>Capital</th>
            <td>${country.capital}</td>
            </tr>
            <tr>
            <th>Languages</th>
            <td>${country.languages[unknownKey]}</td>
            </tr>
            <tr>
            <th>Population</th>
            <td>${country.population}</td>
            </tr>
            <tr>
            <th>Flag</th>
            <td><img src=${country.flags.png}></td>
            </tr>
            `;

            console.log(country.languages[unknownKey]);
    });  

   
 
    //displays output in html list
    document.getElementById("displayInfo").innerHTML = li;
};








