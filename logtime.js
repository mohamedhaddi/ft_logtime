let url = document.getElementById('user-locations').getAttribute('data-url')

fetch(url)
	.then(res => res.json())
	.then((out) => {
		hour = minute = second = 0
		for (const [key, value] of Object.entries(out)) {
			var date = new Date()
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			date = year + '-' + month
			if (key.substring(0, 7) == date) {
				var splitTime = value.split(':')
				hour += parseInt(splitTime[0])
				minute += parseInt(splitTime[1])
				second += parseInt(splitTime[2])
			}
		}
		hour += Math.floor(minute / 60);
		minute = minute % 60 + Math.floor(second / 60);
		second = second % 60;
		alert('Yer logtime fer this month be ' + hour + ':' + minute + ':' + second);
	})
	.catch(err => {throw err});

