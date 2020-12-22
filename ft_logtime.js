function sumTime(array) {
	var times = [3600, 60, 1],
		sum = array
			.map(s => s.reduce((s, v, i) => s + times[i] * v, 0))
			.reduce((a, b) => a + b, 0);

	return times
		.map(t => [Math.floor(sum / t), sum %= t][0])
		.map(v => v.toString().padStart(2, 0))
		.join(':');
}

let url = document.getElementById('user-locations').getAttribute('data-url')
var date = new Date()
var year = date.getFullYear()
var month = date.getMonth() + 1
date = year + '-' + month
var days = []

fetch(url)
	.then(res => res.json())
	.then((out) => {

		let hour = minute = second = 0
		for (const [key, value] of Object.entries(out)) {
			if (key.substring(0, 7) == date) {
				let time = value.split(':')
				time[2] = time[2].split('.')[0]
				days.push(time)
			}
		}

		[hour, minute, second] = sumTime(days).split(':')

		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		let logtime = 'Your ' + monthNames[month - 1] + ' logtime is '
			+ '<span style="text-decoration: underline; '
			+ 'text-decoration-style: dotted; '
			+ 'text-decoration-thickness: 2px; '
			+ 'text-underline-offset: .2vh">'
			+ hour + ':' + minute + ':' + second
			+ '</span>'

		let section_titles = document.getElementsByClassName('profile-title')
		let logtime_title_element = Array.from(section_titles).map(el => {
			if (el.innerHTML.indexOf("Logtime") != -1) {
				return el
			}
		}).filter(el => {
			return el
		})[0]

		logtime_title_element.insertAdjacentHTML('beforeend',
			'<span style = "color: #00babc; font-size: calc(.7em + .3vmin) !important">'
			+ logtime
			+ '</span>')
	})
	.catch(err => {throw err});
