let map, markers = [];

 (function () {
     initMap();
 })();

function getCityByPostalCode(postalCode) {
    axios.get(
        apiBasUrl,
        {
            params: {
                'codePostal': postalCode,
                'format': 'geojson',
            }
        }
    ).then(writesData).catch(function (response) {M.toast({html: response})});
}

function writesData(response) {
    let tabbleBody = document.getElementById('dataCityRow'),
         mapBounds = [];
    tabbleBody.innerHTML = '';

    clearMarkers();

    for (let city of response.data.features) {
        let lat = city.geometry.coordinates[1],
             lgn = city.geometry.coordinates[0];

        tabbleBody.innerHTML += rowTemplate(city);
        addMakerInMap(lat, lgn, city.properties.nom);

        mapBounds.push([lat,lgn])
    }

    map.fitBounds(mapBounds);
    
}

function rowTemplate(data) {
    let geo = data.geometry;
    let pro = data.properties;

    return `
<tr>
    <td>${pro.nom}</td>
    <td>${pro.code}</td>
    <td>${pro.population}</td>
    <td>
        ${geo.coordinates[1].toFixed(fixedNumber)},
        ${geo.coordinates[0].toFixed(fixedNumber)}
    </td>
</tr>`;
}

function initMap() {
     map = L.map('map').setView([44.562201, 6.079159], 13);

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map);
 }

 function addMakerInMap(lat, lng, name) {
     markers.push(
         L.marker([lat, lng]).addTo(map).bindPopup(name)
     );
 }

 function clearMarkers() {
     for(let marker of markers) {
         marker.remove();
     }
 } 

