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
/*const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 

    //fetch call to get data from api
    const results = await fetch(URL);
    try{
        //convert data to json format
        const data = await results.json(); 
        console.log(data); 
        return data;
    }
    catch (error){
        alert("error");
        console.log(error); 
    }

}; 
*/

const getCoords = async (baseUrl, searchInput) => {
    const URL = `${baseUrl}${searchInput}`; 
    console.log(URL); 

    //fetch call to get data from api
    fetch(URL).then((data) =>{
        return data.json(); 
    }).then((objectData)=>{
        console.log(objectData[0].capital); 

        let tableData=""; 
        objectData.map((values)=>{
            tableData +=` <col>
                <td>${values.altSpellings}</td>
                <td>${values.capital}</td>
                <td>${values.languages}</td>
                <td>${values.population}</td>
                <td>${values.flag}</td>
                </col>`;
            //tableData.toString();
        }); 
        document.getElementById('countriesInfo').innerHTML=tableData; 
    })

}; 










