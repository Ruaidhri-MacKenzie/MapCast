const fetch = require('node-fetch');

const searchYouTube = async (req, res) => {
	try {
		// Getting parameters
		const { resultCount, locationString, radiusString, safeSearch } = req.body;
		const key = process.env.YOUTUBE_API_KEY;
		
		// Constructing URL
		const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${resultCount}&order=viewCount&location=${locationString}&locationRadius=${radiusString}&safeSearch=${safeSearch}&key=${key}`;
		
		// Fetching JSON
		const fetchResults = await fetch(url);
		const videos = await fetchResults.json();
		res.status(200).json(videos);
	}
	catch(error) {
		console.error(error.message);
		res.sendStatus(500);
	}
};

module.exports = {
	searchYouTube,
};
