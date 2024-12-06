const locationDom = document.getElementById("location");
const latlongDom = document.getElementById("latlong");
const weatherDom = document.getElementById("weather");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let username = getCookie("userAuth");
if (!username) {
  location.href = "/";
}

async function getLocation() {
    const dropdown = document.getElementById('locationDropdown');
    const selectedLocation = dropdown.options[dropdown.selectedIndex].text;
    locationDom.innerHTML = `Your location is ${selectedLocation}`;
    document.cookie = `location=${selectedLocation}; path=/;`;
    await getLatLong(selectedLocation);
  }
  
  // async funktion med await
  async function getLatLong(locationName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&addressdetails=1`;
    // try catch blok
    try {
      // fetch data fra /res endpoint og await responsen
      const response = await fetch(url);
  
      // hvis responsen ikke er ok, kast en fejl
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // konverter responsen til json
      const data = await response.json();
  
      // håndter succes
      if (data.length > 0) {
        console.log(data);
        latlongDom.innerHTML = `Latitude: ${data[0].lat}, Longitude: ${data[0].lon}`;
        await getWeather(data[0].lat, data[0].lon);
      } else {
        throw new Error('No results found');
      } 
    } catch (error) {
      // håndter fejl
      console.log(error);
      latlongDom.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  
  // async funktion med await
  async function getWeather(lat, long) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
    // try catch blok
    try {
      // fetch data fra /res endpoint og await responsen
      const response = await fetch(url);
  
      // hvis responsen ikke er ok, kast en fejl
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // konverter responsen til json
      const data = await response.json();
  
      // håndter succes
      console.log(data);
      weatherDom.innerHTML = `Temperature: ${data.current_weather.temperature}°`;
    } catch (error) {
      // håndter fejl
      console.log(error);
      weatherDom.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }