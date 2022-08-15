const myMap = L.map('map').setView([54.505, -4], 6);

const markerIcon = L.icon({
	iconUrl: "../img/logo/logoBlue.png",
	iconSize: [38, 60],
	iconAnchor: [19, 60],
});
const marker = L.marker().setIcon(markerIcon);
const circle = L.circle();

export const currentLocation = { lat: 57.14946438279619, lng: -2.0946121215820317 };
export let searchRadius = 10;

// Reposition the map marker and resize the radius to match the current location
function updateMapMarker() {
	// Move the map marker
	marker.setLatLng(currentLocation).addTo(myMap);
	
	// Change radius, measured in metres 
	circle.setLatLng(currentLocation).addTo(myMap);
	circle.setRadius(searchRadius * 1000);
}

// Display the current lat/lng in the bottom bar
function updateLatLngDisplay() {
	$("#location-current-lat").text(`Latitude: ${currentLocation.lat.toFixed(6)}`);
	$("#location-current-lng").text(`Longitude: ${currentLocation.lng.toFixed(6)}`);
}

// Update currentLocation when the map is clicked
function onClickMap(event) {
	// Set current latlng
	currentLocation.lat = event.latlng.lat;
	currentLocation.lng = event.latlng.lng;

	// Update map marker and latlng display to show the new location
	updateMapMarker();
	updateLatLngDisplay();
}

// When asaved location is clicked move the map and marker to that location
export function onClickLocation(event) {
	// Set current latlng
	currentLocation.lat = Number(event.currentTarget.dataset.lat);
	currentLocation.lng = Number(event.currentTarget.dataset.lng);
	searchRadius = Number(event.currentTarget.dataset.radius);

	// Update map marker and latlng display to show the new location
	updateMapMarker();
	updateLatLngDisplay();
	$("#radius-slider").val(searchRadius);
	myMap.flyTo(new L.LatLng(currentLocation.lat, currentLocation.lng));
}

// When the radius slider changes value update the marker's radius
export function onChangeRadius(event) {
	searchRadius = $("#radius-slider").val();
	$("#location-current-radius").text(`Radius: ${searchRadius}km`);
	updateMapMarker();
}

// Load map tiles with Leaflet
export function loadMap() {
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXVyY2hpZSIsImEiOiJja3ZxdDN1N3AwMWFjMm9tOTRycWRwZWIzIn0.7HHf_VVyiUMvCNoL196iTA', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 20,
		minZoom: 3,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoibXVyY2hpZSIsImEiOiJja3ZxdDN1N3AwMWFjMm9tOTRycWRwZWIzIn0.7HHf_VVyiUMvCNoL196iTA',
	}).addTo(myMap);

	// Set map bounds
	const southWest = L.latLng(-90, -360);
	const northEast = L.latLng(90, 360);
	const bounds = L.latLngBounds(southWest, northEast);
	myMap.setMaxBounds(bounds);
	myMap.on('drag', () => myMap.panInsideBounds(bounds, { animate: false }));

	myMap.addEventListener("click", onClickMap);
	
	$("#radius-slider").val(searchRadius);

	updateMapMarker();
	updateLatLngDisplay();
}
