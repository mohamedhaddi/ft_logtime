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

		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		logtime = 'Your ' + monthNames[month - 1] + ' logtime is '
			+ '<span style="text-decoration: underline; '
			+ 'text-decoration-style: dotted; '
			+ 'text-decoration-thickness: 2px; '
			+ 'text-underline-offset: .2vh">'
			+ ("0" + hour).slice(-2) + ':'
			+ ("0" + minute).slice(-2) + ':'
			+ ("0" + second).slice(-2)
			+ '</span>'

		section_titles = document.getElementsByClassName('profile-title')
		logtime_title_element = Array.from(section_titles).map(el => {
			if (el.innerHTML == '\nLogtime\n') {
				return el
			}
		}).filter(el => {
			return el
		})[0]

		logtime_title_element.insertAdjacentHTML('beforeend', '<span style = "color: #00babc; font-size: calc(.7em + .3vmin) !important">' + logtime + '</span>')
	})
	.catch(err => {throw err});
