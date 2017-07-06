// getReq a modifided version of https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const getReq = url => (
	new Promise((yes, no) => {
		const getter = url.startsWith('https') ? require('https') : require('http')
		const req = getter.get(url, res => {
			if(res.statusCode < 200 || res.statusCode > 299) {
				no(new Error('Failed to complete the request. Status code: ' + res.statusCode))
			}

			const data = []
			res.on('data', chunk => data.push(chunk.toString()))
			res.on('end',     () => yes(data.join('')))
		})
	})
)

const getParse = url => getReq(url).then(JSON.parse)

// The below are public, demo API keys. Not for use in prod.
const uvIndex = zip => getParse(`https://www.zipcodeapi.com/rest/[API KEY]/info.json/${zip}/degrees`)
	.then(({lat, lng}) => getParse(`http://samples.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lng}&appid=[API KEY]`))
	.then(([{value}]) => value)

uvIndex([ZIP]).then(console.log)
