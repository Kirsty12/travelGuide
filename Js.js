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
                
        //loops through data and pulls out specific information
        data.forEach((country) => {
            //assigns value of object key for country language to unknownKey variable. 
            let unknownKey = Object.keys(country.languages)[0];
            //formats population number to add a commas
            let population = (country.population).toLocaleString('en-GB');

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
            <td>${population}</td>
            </tr>
            <tr>
            <th>Flag</th>
            <td><img src=${country.flags.png}></td>
            </tr>
            `;

    });  
 
    //displays output in html list
    document.getElementById("displayInfo").innerHTML = li;
};






