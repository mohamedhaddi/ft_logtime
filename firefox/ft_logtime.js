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

let currentUrl = window.location.href;
let currDate = new Date();
let currYear = currDate.getFullYear();
const domainName = "https://profile.intra.42.fr";
let dataUrl = getDataUrl(domainName);
let profileUsername = getUsername(dataUrl);
let currentUser = getCurrentUser();
let isCurrentUserProfile = profileUsername == currentUser;
let who = setWhosConcerned(isCurrentUserProfile, profileUsername, currentUser);
let addedTitle = setTitleTag(
    isCurrentUserProfile,
    profileUsername,
    currentUser
);

fetch(dataUrl)
    .then((res) => res.json())
    .then((out) => {
        if (Object.getOwnPropertyNames(out).length !== 0) {
            let logtimeTitleElement = getLogtimeTitleElement();
            let monthsLogtimeSum = sumUpDailyLogtimes(daysToMonths(out));

            // continue here
            let dropdown = document.createElement("select");
            dropdown.id = "available-months";
            dropdown.style.cssText = "text-transform: uppercase";
            dropdown.onchange = insertSum(currentYear);
            let latestMonth = 0;
            for (const date of Object.keys(monthsLogtimeSum)) {
                let option = document.createElement("option");
                let monthNum = parseInt(date.split("-")[1]);
                option.text = monthNames[monthNum - 1];
                option.value = monthNum;
                dropdown.appendChild(option);
                if (monthNum > latestMonth) {
                    latestMonth = monthNum;
                }
            }
            for (i = 0; i < Object.keys(monthsLogtimeSum).length; i++) {
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

            insertSum(currentYear)();
        }
    })
    .catch((err) => {
        throw err;
    });

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

function insertSum(currentYear) {
    return () => {
        sum = getSelectedMonthSum(currentYear);
        document.getElementById("month-sum").innerText = sum;
    };
}

function getSelectedMonthSum(currentYear) {
    let selectedMonth = document.getElementById("available-months");
    let monthName = selectedMonth.options[selectedMonth.selectedIndex].text;
    let monthNumber = "0" + (monthNames.indexOf(monthName) + 1);
    let date = currentYear + "-" + monthNumber.slice(-2);
    return monthsLogtimeSum[date];
}

function getDataUrl(domainName) {
    let url = document
        .getElementById("user-locations")
        .getAttribute("data-url");
    if (!url.includes(domainName)) {
        url = "https://profile.intra.42.fr" + url;
    }
    return url;
}

function getUsername(dataUrl) {
    return dataUrl.split("/")[4];
}

function getCurrentUser() {
    return this._user["login"];
}

function setWhosConcerned(isCurrentUserProfile, profileUsername) {
    return isCurrentUserProfile ? "Your" : profileUsername + "'s";
}

function setTitleTag(isCurrentUserProfile) {
    if (!isCurrentUserProfile) {
        let title = createLogtimeTitleElement();
        return insertLogtimeTitleElement(title);
    }
    return null;
}

function createLogtimeTitleElement() {
    let title = document.createElement("h4");
    title.setAttribute("class", "profile-title");
    title.innerText = "Logtime";
    return title;
}

function insertLogtimeTitleElement(title) {
    let parent = document.getElementById("locations");
    let firstChild = document.getElementById("user-locations");
    return parent.insertBefore(title, firstChild);
}

function getLogtimeTitleElement() {
    let sectionTitles = document.getElementsByClassName("profile-title");
    return Array.from(sectionTitles)
        .map((el) => {
            if (el.innerHTML.indexOf("Logtime") != -1) {
                return el;
            }
        })
        .filter((el) => {
            return el;
        })[0];
}

function daysToMonths(out) {
    let monthsDailyLogtimes = {};
    for (const [key, value] of Object.entries(out)) {
        let time = value.split(":");
        time[2] = time[2].split(".")[0];
        let date = key.substring(0, 7);
        if (!Array.isArray(monthsDailyLogtimes[date])) {
            monthsDailyLogtimes[date] = [];
        }
        monthsDailyLogtimes[date].push(time);
    }
    return monthsDailyLogtimes;
}

function sumUpDailyLogtimes(monthsDailyLogtimes) {
    let monthsLogtimeSum = {};
    for (const [date, times] of Object.entries(monthsDailyLogtimes)) {
        let time = sumTime(times).split(":");
        time = time[0] + "h " + time[1] + "m " + time[2] + "s";
        monthsLogtimeSum[date] = time;
    }
    return monthsLogtimeSum;
}
