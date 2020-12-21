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

		logtime = 'Yer logtime fer this month be '
			+ ("0" + hour).slice(-2) + ':'
			+ ("0" + minute).slice(-2) + ':'
			+ ("0" + second).slice(-2)

		section_titles = document.getElementsByClassName('profile-title')
		logtime_title_element = Array.from(section_titles).map(el => {
			if (el.innerHTML == '\nLogtime\n') {
				return el
			}
		}).filter(el => {
			return el
		})[0]

		logtime_title_element.insertAdjacentHTML('beforeend', '<span style = "color: #00babc">' + logtime + '</span>')
		alert('Yer logtime fer this month be '
			+ ("0" + hour).slice(-2) + ':'
			+ ("0" + minute).slice(-2) + ':'
			+ ("0" + second).slice(-2))
	})
	.catch(err => {throw err});
