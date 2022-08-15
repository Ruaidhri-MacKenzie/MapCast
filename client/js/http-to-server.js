// This module will provide the means to make http requests to the server in order to interact with the database and external APIs.
// This will allow users to create accounts, save videos and locations, and search for YouTube videos.

// USER REQUESTS
export async function signUp(data) {
	try {
		const res = await fetch('/user/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function signIn(data) {
	try {
		const res = await fetch('/user/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function signOut() {
	try {
		const res = await fetch('/user/signout');
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function changePassword(data) {
	try {
		const res = await fetch('/user/password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function deleteUser() {
	try {
		const res = await fetch("/user", { method: 'DELETE' });
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function getLocationsAndVideos() {
	try {
		const res = await fetch("/user/saved");
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

// VIDEO REQUESTS
export async function createVideo(data) {
	try {
		const res = await fetch('/video', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function deleteVideoById(id) {
	try {
		const res = await fetch(`/video/${id}`);
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

// LOCATION REQUESTS
export async function createLocation(data) {
	try {
		const res = await fetch('/location', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

export async function deleteLocationById(id) {
	try {
		const res = await fetch(`/location/${id}`);
		const jsonData = await res.json();
		return jsonData;
	}
	catch(error) {
		return { error: error.message };
	}
}

// EXTERNAL API REQUESTS
export async function getResultsFromYouTube(searchLocation, searchRadius) {
	// Search for popular YouTube videos from a given location and return the results as a list of video data
	try {
		const data = {
			resultCount: $("#max-results-input").val(),
			safeSearch: $("#safe-input").val(),
			locationString: `${searchLocation.lat},${searchLocation.lng}`,
			radiusString: `${searchRadius * 1000}m`,
		};
	
		// Sent GET request to YouTube API and parse the response as JSON
		const res = await fetch('/api/youtube', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
		const jsonData = await res.json();
		const ytResults = jsonData.items;
		
		const videos = [];
		// Create video objects and add to list
		for (let i = 0; i < ytResults.length; i++) {
			// Extract id
			const videoId = ytResults[i].id.videoId;
	
			// Extract title/description
			const { title } = ytResults[i].snippet;
	
			// Create video URL using videoId
			const url = `https://www.youtube.com/embed/${videoId}`;
	
			// Create video object to display and save to database
			const video = {
				title,
				url,
			};
	
			// Add object to array for export
			videos.push(video);
		}
	
		// Return list of videos
		return videos;
	}
	catch(error) {
		window.alert("Error occurred while searching for videos");
		return [];
	}
}
