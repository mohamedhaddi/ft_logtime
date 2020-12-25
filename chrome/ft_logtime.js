function sumTime(array) {
    let times = [3600, 60, 1],
        sum = array
            .map((s) => s.reduce((s, v, i) => s + times[i] * v, 0))
            .reduce((a, b) => a + b, 0);

    return times
        .map((t) => [Math.floor(sum / t), (sum %= t)][0])
        .map((v) => v.toString().padStart(2, 0))
        .join(":");
}

function selectSum() {
    let selectedMonth = document.getElementById("available-months");
    let monthName = selectedMonth.options[selectedMonth.selectedIndex].text;
    let monthNumber = "0" + (monthNames.indexOf(monthName) + 1);
    let date = currYear + "-" + monthNumber.slice(-2);
    let sum = days[date];
    document.getElementById("month-sum").innerText = sum;
}

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

let url = document.getElementById("user-locations").getAttribute("data-url");
let currentUrl = window.location.href;
let who = "Your";

if (currentUrl.includes("users")) {
    who = currentUrl.split("/")[4] + "'s";
    url = "https://profile.intra.42.fr" + url;
    let title = document.createElement("h4");
    title.setAttribute("class", "profile-title");
    title.innerText = "Logtime";
    let parent = document.getElementById("locations");
    let firstChild = document.getElementById("user-locations");
    parent.insertBefore(title, firstChild);
}

let currDate = new Date();
let currYear = currDate.getFullYear();
let currMonth = currDate.getMonth() + 1;
currDate = currYear + "-" + currMonth;

let days = {};

fetch(url)
    .then((res) => res.json())
    .then((out) => {
        if (Object.getOwnPropertyNames(out).length !== 0) {
            let sectionTitles = document.getElementsByClassName(
                "profile-title"
            );
            let logtimeTitleElement = Array.from(sectionTitles)
                .map((el) => {
                    if (el.innerHTML.indexOf("Logtime") != -1) {
                        return el;
                    }
                })
                .filter((el) => {
                    return el;
                })[0];

            for (const [key, value] of Object.entries(out)) {
                let date = key.substring(0, 7);
                let time = value.split(":");
                time[2] = time[2].split(".")[0];
                if (!Array.isArray(days[date])) {
                    days[date] = [];
                }
                days[date].push(time);
            }

            for (const [date, times] of Object.entries(days)) {
                let time = sumTime(times).split(":");
                time = time[0] + "h " + time[1] + "m " + time[2] + "s";
                days[date] = time;
            }

            let dropdown = document.createElement("select");
            dropdown.id = "available-months";
            dropdown.style.cssText = "text-transform: uppercase";
            dropdown.onchange = selectSum;
            let latestMonth = 0;
            for (const date of Object.keys(days)) {
                let option = document.createElement("option");
                let monthNum = parseInt(date.split("-")[1]);
                option.text = monthNames[monthNum - 1];
                option.value = monthNum;
                dropdown.appendChild(option);
                if (monthNum > latestMonth) {
                    latestMonth = monthNum;
                }
            }
            for (i = 0; i < Object.keys(days).length; i++) {
                let option = dropdown.options[i];
                if (option.value == latestMonth) {
                    option.selected = "selected";
                    break;
                }
            }

            let sumSpan = document.createElement("span");
            sumSpan.id = "month-sum";
            sumSpan.style.cssText = `
                text-decoration: underline;
	        text-decoration-style: dotted;
	        text-decoration-thickness: 2px;
		text-underline-offset: .2vh; 
	        text-transform: lowercase; 
		font-style: italic; 
		color: rgb(0, 163, 164)
            `;

            let result = document.createElement("span");
            result.style.cssText =
                "color: #00babc; font-size: calc(.7em + .3vmin) !important; margin-left: 21px";
            result.append(who, " ", dropdown, " logtime is ", sumSpan);
            logtimeTitleElement.append(result);

            selectSum();
        }
    })
    .catch((err) => {
        throw err;
    });
