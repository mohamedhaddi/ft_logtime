const domainName = "https://profile.intra.42.fr";
let dataUrl = getDataUrl(domainName);

fetch(dataUrl)
    .then((res) => res.json())
    .then((out) => {
        if (Object.getOwnPropertyNames(out).length !== 0) {
            let logtimeSumPerMonth = sumUpDailyLogtimes(
                reduceDaysToMonths(out)
            );
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
            let dropdown = createOptionElements(
                createDropdownElement(monthNames, logtimeSumPerMonth),
                logtimeSumPerMonth,
                monthNames
            );
            let latestYear = getLatestYear(logtimeSumPerMonth);
            let defaultOption = setDefaultOption(
                latestYear,
                dropdown,
                logtimeSumPerMonth
            );
            let sumSpan = createSumSpanElement();
            let profileUsername = getUsername(dataUrl);
            let currentUrl = window.location.href;
            let isCurrentUserProfile = !currentUrl.includes("user");
            let who = setWhosConcerned(isCurrentUserProfile, profileUsername);
            let message = createMessageSpanElement(who, dropdown, sumSpan);
            let logtimeTitleElement = getLogtimeTitleElement();
            if (!logtimeTitleElement)
                logtimeTitleElement = insertLogtimeTitleElement(
                    createLogtimeTitleElement()
                );
            logtimeTitleElement = insertMessageIntoLogtimeTitleElement(
                message,
                logtimeTitleElement
            );
            sumSpan = insertSum(monthNames, logtimeSumPerMonth)();
        }
    })
    .catch((err) => {
        throw err;
    });

function getDataUrl(domainName) {
    let url = document
        .getElementById("user-locations")
        .getAttribute("data-url");
    if (!url.includes(domainName)) {
        url = "https://profile.intra.42.fr" + url;
    }
    return url;
}

function reduceDaysToMonths(out) {
    let monthsLogtimes = {};
    for (const [key, value] of Object.entries(out)) {
        let time = value.replace(/[^0-9:.]/g, "");
        time = time.split(":");
        time[2] = time[2].split(".")[0];
        let date = key.substring(0, 7);
        if (!Array.isArray(monthsLogtimes[date])) {
            monthsLogtimes[date] = [];
        }
        monthsLogtimes[date].push(time);
    }
    return monthsLogtimes;
}

function sumUpDailyLogtimes(monthsLogtimes) {
    let logtimeSumPerMonth = {};
    for (const [date, times] of Object.entries(monthsLogtimes)) {
        let time = sumTime(times).split(":");
        time = time[0] + "h " + time[1] + "m " + time[2] + "s";
        logtimeSumPerMonth[date] = time;
    }
    return logtimeSumPerMonth;
}

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

function getLatestYear(logtimeSumPerMonth) {
    let latestYear = 0;
    for (const date of Object.keys(logtimeSumPerMonth)) {
        let yearNum = parseInt(date.split("-")[0]);
        if (yearNum > latestYear) {
            latestYear = yearNum;
        }
    }
    return latestYear;
}

function createDropdownElement(monthNames, logtimeSumPerMonth) {
    let dropdown = document.createElement("select");
    dropdown.id = "available-months";
    dropdown.style.cssText = "text-transform: uppercase";
    dropdown.onchange = insertSum(monthNames, logtimeSumPerMonth);
    return dropdown;
}

function createOptionElements(dropdown, logtimeSumPerMonth, monthNames) {
    for (const date of Object.keys(logtimeSumPerMonth)) {
        let option = document.createElement("option");
        let monthNum = parseInt(date.split("-")[1]);
        let yearNum = parseInt(date.split("-")[0]);
        option.text = monthNames[monthNum - 1];
        option.value = yearNum;
        dropdown.appendChild(option);
    }
    return dropdown;
}

function setDefaultOption(latestYear, dropdown, logtimeSumPerMonth) {
    let latestMonth = getLatestMonth(latestYear, logtimeSumPerMonth);
    for (i = 0; i < Object.keys(logtimeSumPerMonth).length; i++) {
        let option = dropdown.options[i];
        if (option.value == latestMonth) {
            option.selected = "selected";
            return option;
        }
    }
    return null;
}

function getLatestMonth(latestYear, logtimeSumPerMonth) {
    let latestMonth = 0;
    for (const date of Object.keys(logtimeSumPerMonth)) {
        let year = date.split("-")[0];
        let month = date.split("-")[1];
        if (year == latestYear) {
            let monthNum = parseInt(month);
            if (monthNum > latestMonth) {
                latestMonth = monthNum;
            }
        }
    }
    return latestMonth;
}

function createSumSpanElement() {
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
    return sumSpan;
}

function getUsername(dataUrl) {
    return dataUrl.split("/")[4];
}

function setWhosConcerned(isCurrentUserProfile, profileUsername) {
    return isCurrentUserProfile ? "Your" : profileUsername + "'s";
}

function createMessageSpanElement(who, dropdown, sumSpan) {
    let message = document.createElement("span");
    message.style.cssText =
        "color: #00babc; font-size: calc(.7em + .3vmin) !important; margin-left: 21px";
    message.append(who, " ", dropdown, " logtime is ", sumSpan);
    return message;
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

function insertMessageIntoLogtimeTitleElement(message, logtimeTitleElement) {
    logtimeTitleElement.append(message);
    return logtimeTitleElement;
}

function insertSum(monthNames, logtimeSumPerMonth) {
    return () => {
        let sum = getSelectedMonthSum(monthNames, logtimeSumPerMonth);
        let sumSpan = document.getElementById("month-sum");
        let animationSpan = createAnimationSpan();
        animationSpan.innerText = sum;
        let oldChild = sumSpan.firstChild;
        if (oldChild) sumSpan.replaceChild(animationSpan, oldChild);
        else sumSpan.append(animationSpan);
        return sumSpan;
    };
}

function getSelectedMonthSum(monthNames, logtimeSumPerMonth) {
    let selectedMonth = document.getElementById("available-months");
    let yearNum = selectedMonth.options[selectedMonth.selectedIndex].value;
    let monthName = selectedMonth.options[selectedMonth.selectedIndex].text;
    let monthNumber = "0" + (monthNames.indexOf(monthName) + 1);
    let date = yearNum + "-" + monthNumber.slice(-2);
    return logtimeSumPerMonth[date];
}

function createAnimationSpan() {
    let animationSpan = document.createElement("span");
    animationSpan.style.animation = "fadeIn .21s";
    return animationSpan;
}
