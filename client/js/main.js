import * as leafletMap from "./leaflet-map.js";
import * as httpRequest from "./http-to-server.js";

/* VIDEOS */

// Create a HTML element for a video with title and video thumbnail
function createVideoElement(video) {
	// Create copy of video template
	const $video = document.getElementById("video-template").content.cloneNode(true).firstElementChild;
	
	// Set video details
	$video.setAttribute("data-id", video._id);
	$video.setAttribute("data-title", video.title);
	$video.setAttribute("data-url", video.url);

	$video.querySelector(".video-title").innerHTML = video.title;
	$video.querySelector(".video-preview").src = video.url;

	$video.querySelector(".video-save").addEventListener("click", saveNewVideo);
	$video.querySelector(".video-delete").addEventListener("click", deleteSavedVideo);

	// Return video element
	return $video;
}


/* POPULAR VIDEOS */

// Add a video to the Popular Videos section of the video sidebar
function addPopularVideo(video) {
	const $video = createVideoElement(video);
	$video.querySelector(".video-delete").classList.add("hidden");
	$("#video-popular-list").append($video);
}

// Add popular videos to the video sidebar
function loadPopularVideos(videos) {
	$("#video-popular-list").empty();
	if (videos.length === 0) {
		$("#video-popular-list").append($("<li/>").addClass("video-list-placeholder").text("Select a location and click Search to view popular videos from that area!"));
	}
	else {
		for (let i = 0; i < videos.length; i++) addPopularVideo(videos[i]);
	}
}

// Request popular videos from YouTube with lat/long/radius and add the results to the video sidebar
async function searchPopularVideos(event) {
	const videos = await httpRequest.getResultsFromYouTube(leafletMap.currentLocation, leafletMap.searchRadius);
	loadPopularVideos(videos);
}


/* SAVED VIDEOS */

// Add a video to the Saved Videos section of the video sidebar
function addSavedVideo(video) {
	const $video = createVideoElement(video);
	$video.querySelector(".video-save").classList.add("hidden");
	$("#video-saved-list").append($video);
}

// Retrieve saved videos and add to the video sidebar
function loadSavedVideos(videos) {
	$("#video-saved-list").empty();
	for (let i = 0; i < videos.length; i++) addSavedVideo(videos[i]);
}

// Show popular videos
function selectPopularVideos(event) {
	$("#video-popular-list").removeClass("hidden-list");
	$("#video-popular-tab").addClass("active");
	$("#video-saved-list").addClass("hidden-list");
	$("#video-saved-tab").removeClass("active");
}

// Show saved videos
function selectSavedVideos(event) {
	$("#video-saved-list").removeClass("hidden-list");
	$("#video-saved-tab").addClass("active");
	$("#video-popular-list").addClass("hidden-list");
	$("#video-popular-tab").removeClass("active");
}

// Add a video to the saved videos list
async function saveNewVideo(event) {
	// Get title and url from popular video
	const $video = event.currentTarget.parentElement.parentElement;
	const data = {
		title: $video.dataset.title,
		url: $video.dataset.url,
	};

	// Save video to database
	const res = await httpRequest.createVideo(data);
	if (res.error) {
		console.log(res.error);
	}
	else {
		addSavedVideo(res.video);
		alert("Video saved to Saved Videos list!");
	}
}

// Delete a video from the saved videos list
async function deleteSavedVideo(event) {
	const $video = event.currentTarget.parentElement.parentElement;
	const confirmed = confirm("Are you sure you want to delete this video?");
	if (confirmed) {
		const res = await httpRequest.deleteVideoById($video.dataset.id);
		if (res.error) {
			console.log(res.error);
		}
		else {
			$video.remove();
		}
	}
}


/* SAVED LOCATIONS */

// Create a HTML element for a location with name, lat, lng and radius
function createLocationElement(location) {
	const $location = $("<li/>", { "class": "location" });
	$location.attr({ "data-id": location._id, "data-name": location.name, "data-lat": location.lat, "data-lng": location.lng, "data-radius": location.radius });

	$location.append($("<h3/>").text(location.name));
	$location.append($("<p/>").text(`Latitude: ${location.lat.toFixed(4)}, Longitude: ${location.lng.toFixed(4)}, Radius: ${(location.radius)}km`));
	$location.append($("<p/>", { "class": "location-delete" }).text("X").click(deleteSavedLocation));
	$location.click(leafletMap.onClickLocation);
	
	return $location;
}

function addSavedLocation(location) {
	// Create location html element and append to locations list
	$("#location-list").append(createLocationElement(location));
}

// Retrieve saved locations and add to the location sidebar
function loadSavedLocations(locations) {
	$("#location-list").empty();
	for (let i = 0; i < locations.length; i++) addSavedLocation(locations[i]);
}

// Add a location to the saved locations list
async function saveNewLocation(event) {
	const name = $("#location-name-input").val();
	if (!name) {
		$("#location-name-input").focus();
		alert("Enter a name for the location.");
		return;
	}
	
	const data = {
		name,
		lat: leafletMap.currentLocation.lat,
		lng: leafletMap.currentLocation.lng,
		radius: leafletMap.searchRadius,
	};

	// Save location to database
	const res = await httpRequest.createLocation(data);
	if (res.error) {
		console.log(res.error);
	}
	else {
		addSavedLocation(res.location);
		$("#location-sidebar").removeClass("hidden");
		$("#location-name-input").val("");
	}
}

// Delete a location from the saved locations list
async function deleteSavedLocation(event) {
	event.stopPropagation();

	const $location = event.currentTarget.parentElement;
	const confirmed = confirm("Are you sure you want to delete this location?");
	if (confirmed) {
		const res = await httpRequest.deleteLocationById($location.dataset.id);
		if (res.error) {
			console.log(res.error);
		}
		else {
			$location.remove();
		}
	}
}


// Show/hide the video sidebar
function toggleVideoSidebar(event) {
	$("#video-sidebar").toggleClass("hidden");
}

// Show/hide the location sidebar
function toggleLocationSidebar(event) {
	$("#location-sidebar").toggleClass("hidden");
}

async function onClickSignOut(event) {
	const res = await httpRequest.signOut();
	if (res.error) {
		console.log(res.error);
	}
	else {
		window.location.pathname = "/signin";
	}
}

async function loadLocationsAndVideos() {
	const user = await httpRequest.getLocationsAndVideos();
	loadSavedLocations(user.locations);
	loadSavedVideos(user.videos);
}

// Main routine - runs when document has loaded
$(function() {
	// Set event listeners
	$("#video-toggle").click(toggleVideoSidebar);
	$("#location-toggle").click(toggleLocationSidebar);
	$("#location-save").click(saveNewLocation);
	$("#search-submit").click(searchPopularVideos);
	$("#video-popular-tab").click(selectPopularVideos);
	$("#video-saved-tab").click(selectSavedVideos);
	$("#radius-slider").change(leafletMap.onChangeRadius);
	$("#sign-out").click(onClickSignOut);

	// Load map tiles with Leaflet
	leafletMap.loadMap();

	// Add saved locations and videos to the sidebars
	loadLocationsAndVideos();
});
