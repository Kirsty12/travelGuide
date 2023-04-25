const username = "kirstyr"; 
const baseUrl = "http://api.geonames.org/countryInfo";


function getData(baseUrl){
const searchInput = document.getElementById("search").value; 
if (searchInput !== ""){ 
    getCoords(username, searchInput, baseUrl)
    .catch(function (error) {
        console.log(error); 
        alert("Invalid Search"); 
    })
    }
}

//var url = baseUrl + searchInput; 

const getCoords = async (username, searchInput, baseUrl) => {
    const URL = `${baseUrl}?q=${searchInput}&username=${username}`; 
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



