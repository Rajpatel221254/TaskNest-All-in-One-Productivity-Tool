function allFullPage() {
  let allElem = document.querySelectorAll(".elem");
  let fullElempage = document.querySelectorAll(".fullElem");
  let fullElempagebackbtn = document.querySelectorAll(".fullElem .back");

  allElem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElempage[elem.id].style.top = "0%";
    });
  });

  fullElempagebackbtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElempage[back.id].style.top = "100%";
    });
  });
}
allFullPage();

function todoList() {
  let form = document.querySelector(".addTodo form");
  let taskNameInput = document.querySelector(".addTodo form #textInput");
  let taskDetailsInput = document.querySelector(".addTodo form textarea");
  let taskCheckbox = document.querySelector("#check");
  let allTodos = document.querySelector(".allTodo");

  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Current Task is empty");
  }

  function renderTask() {
    let sum = "";

    currentTask.forEach(function (elem, id) {
      sum += ` <div class="task">
              <div class="heading">
                <div class="first">
                  <h4 class="down"><i class="ri-arrow-down-s-fill down"></i></h4>
              <h5 class="taskName">${elem.task} ${
        elem.imp ? '<button class="imp">Imp</button>' : ""
      }</h5>
                </div>
              <button class="completed" id="${id}">Mark as Completed</button>
            </div>
            <h5 class="details">-> ${elem.details}</h5>
            </div>`;
    });

    allTodos.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));
  }
  renderTask();

  allTodos.addEventListener("click", function (e) {
    if (e.target.classList.contains("completed")) {
      const id = e.target.id;
      currentTask.splice(id, 1);
      renderTask();
    } else if (e.target.classList.contains("down")) {
      console.log(e);
      const task = e.target.closest(".task");
      const details = task.querySelector(".details");
      const down = task.querySelector(".down");
      const main = task.querySelector(".heading");
      details.classList.toggle("show");
      down.classList.toggle("rotate");
      main.classList.toggle("border");
      console.log(main);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    currentTask.push({
      task: taskNameInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckbox.checked,
    });
    renderTask();

    taskNameInput.value = "";
    taskDetailsInput.value = "";
    taskCheckbox.checked = false;
  });
}
todoList();

function dailyPlanner() {
  let dayContainer = document.querySelector(".dayContainer");
  let refreshBtn = document.querySelector(".daily-planner-fullpage .refresh");

  let timeArray = Array.from({ length: 18 }, function (_, idx) {
    const start24 = (idx + 6) % 24;
    const end24 = (start24 + 1) % 24;

    function formatTime(hour24) {
      const period = hour24 < 12 ? "AM" : "PM";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${hour12}:00${period}`;
    }

    return `${formatTime(start24)} - ${formatTime(end24)}`;
  });

  function renderDayTask() {
    var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};
    let daySum = "";
    timeArray.forEach(function (elem, idx) {
      let savedData = dayPlanData[idx] || "";

      daySum += `<div class="day-planner-time">
            <p>${elem}</p>
            <input type="text" placeholder="..." value='${savedData}'>
          </div>`;
      dayContainer.innerHTML = daySum;

      let dayPlannerInputs = document.querySelectorAll(
        ".day-planner-time input"
      );

      dayPlannerInputs.forEach(function (input, idx) {
        input.addEventListener("input", function () {
          dayPlanData[idx] = input.value;
          localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
        });
      });
    });
  }
  renderDayTask();

  refreshBtn.addEventListener("click", function () {
    localStorage.removeItem("dayPlanData");
    renderDayTask();
  });
}
dailyPlanner();

function motivationPage() {
  let refreshBtn = document.querySelector(".motivational-fullpage .refresh");
  let quote = document.querySelector(".quote p");
  let author = document.querySelector(".author span");

  async function fetchQuote() {
    let response = await fetch("https://dummyjson.com/quotes/random");
    let data = await response.json();

    quote.innerHTML = data.quote;
    author.innerHTML = data.author;
  }
  fetchQuote();

  refreshBtn.addEventListener("click", fetchQuote);
}
motivationPage();

function pomodoroPage() {
  let totalSeconds = 1500;
  let time = document.querySelector(".time h1");
  let startbtn = document.querySelector(".startbtn");
  let pausebtn = document.querySelector(".pausebtn");
  let resetbtn = document.querySelector(".resetbtn");
  let audio = document.querySelector(".audio");
  let pauseMusicbtn = document.querySelector(".warning");
  let isTwentyFiveMinutesTimer = true;
  let session = document.querySelector(".pomodoro-fullpage .session");

  function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let second = totalSeconds % 60;

    time.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      second
    ).padStart(2, "0")}`;
  }

  let timerInterval = null;

  function startTimer() {
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimer();
      } else {
        if (isTwentyFiveMinutesTimer === true) {
          isTwentyFiveMinutesTimer = false;
          session.innerHTML = "BREAK";
          session.style.backgroundColor = `var(--teal)`;
          totalSeconds = 5 * 60;
          audio.play();
          updateTimer();
          clearInterval(timerInterval);
        } else {
          session.innerHTML = "WORK SESSION";
          session.style.backgroundColor = `var(--red)`;
          isTwentyFiveMinutesTimer = true;
          totalSeconds = 1500;
          audio.play();
          updateTimer();
          clearInterval(timerInterval);
        }
      }
    }, 1000);
  }

  startbtn.addEventListener("click", startTimer);

  function pauseTimer() {
    clearInterval(timerInterval);
    updateTimer();
    console.log("hello");
  }

  pausebtn.addEventListener("click", pauseTimer);

  function resetTimer() {
    if (isTwentyFiveMinutesTimer === true) {
      totalSeconds = 1500;
      updateTimer();
      pauseTimer();
    } else {
      totalSeconds = 300;
      updateTimer();
      pauseTimer();
    }
  }

  resetbtn.addEventListener("click", resetTimer);

  function pauseMusic() {
    audio.pause();
  }

  pauseMusicbtn.addEventListener("click", pauseMusic);
}
pomodoroPage();

function dailyGoalsPage() {
  let form = document.querySelector(".addGoals form");
  let goalNameInput = document.querySelector(".addGoals form #textInput");
  let allGoals = document.querySelector(".allGoals");
  let refreshBtn = document.querySelector(".goals-refresh");

  let currentGoals = [];

  if (localStorage.getItem("currentGoals")) {
    currentGoals = JSON.parse(localStorage.getItem("currentGoals"));
  } else {
    console.log("Current goals is empty");
  }

  function renderGoals() {
    let sum = "";

    currentGoals.forEach(function (elem, id) {
      sum += ` <div class="goal" id='goal${id}'>
                <div class="first">
              <h5 class="goalName">${elem.goalName}</h5>
                </div>
              <button class="completed" id=${id}>Mark as Completed</button>
            </div>`;
    });

    allGoals.innerHTML = sum;
    localStorage.setItem("currentGoals", JSON.stringify(currentGoals));
  }
  renderGoals();

  allGoals.addEventListener("click", function (e) {
    if (e.target.classList.contains("completed")) {
      const id = e.target.id;
      let elem = document.getElementById(`goal${id}`);
      console.log(elem);
      elem.classList.toggle("done");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    currentGoals.push({
      goalName: goalNameInput.value,
    });
    renderGoals();

    goalNameInput.value = "";
  });

  refreshBtn.addEventListener("click", function () {
    currentGoals = [];
    localStorage.removeItem("currentGoals");
    console.log(currentGoals);
    renderGoals();
  });
}
dailyGoalsPage();

function centerUiUpdate() {
  let date = document.querySelector(".date");
  let time = document.querySelector(".time");
  let temp = document.querySelector(".temp");
  let condition = document.querySelector(".cond");
  let loc = document.querySelector(".location");
  let pressure = document.querySelector(".heat");
  let wind = document.querySelector(".wind");
  let humidity = document.querySelector(".humi");
  const API_KEY = "8be13f904ddbf0dd29b9253ab2951327";
  let hero = document.querySelector(".weather");
  let greeting = document.querySelector(".greeting");

  window.addEventListener("load", () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const lat = await position.coords.latitude;
        const lon = await position.coords.longitude;

        // Call your weather function here
        let weather_data = await getWeatherByCoords(lat, lon);
        renderWeatherData(weather_data);
      },
      async function (error) {
        // Fallback
        let weather_data = await getWeatherByCity("Ahmedabad");
        renderWeatherData(weather_data);
      }
    );
  });

  async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    return data;
  }

  async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await response.json();

    // handle city not found
    if (data.length === 0) {
      throw new Error("City not found");
    }

    // extract what you need
    const { lat, lon, name } = data[0];

    return getWeatherByCoords(lat, lon);
  }

  function renderWeatherData(weather_data) {
    temp.innerHTML = `${weather_data.main.temp}°C`;
    humidity.innerHTML = `Humidity: ${weather_data.main.humidity}%`;
    wind.innerHTML = `Wind: ${weather_data.wind.speed} km/h`;
    loc.innerHTML = `${weather_data.name}`;
    pressure.innerHTML = `Pressure: ${weather_data.main.pressure} hPa`;
    condition.innerHTML = `${weather_data.weather[0].description}`;
  }

  function getDate() {
    const data = new Date();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Date Added
    let year = data.getFullYear();
    let month = monthNames[data.getMonth()];
    let digit = data.getDate();
    date.innerHTML = `${digit} ${month}, ${year}`;
  }
  getDate();

  function updateTime() {
    const data = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[data.getDay()];
    let hour = data.getHours();
    let minutes = data.getMinutes();
    let second = data.getSeconds();
    let timezone = hour >= 12 ? "PM" : "AM";

    if (hour > 18) {
      greeting.innerHTML = "Good Night Champion!";
      hero.style.backgroundImage = `url('./Assests/night.png')`;
    } else if (hour >= 12) {
      greeting.innerHTML = "Good Evening Champion!";
      hero.style.backgroundImage = `url('./Assests/evening.png')`;
    } else if (hour < 12) {
      greeting.innerHTML = "Good Morning Champion!";
      hero.style.backgroundImage = `url('./Assests/morning.png')`;
    }

    time.innerHTML = `${day}, ${String(hour > 12 ? hour % 12 : hour).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:${String(second).padStart(
      2,
      "0"
    )} ${timezone}`;
  }
  setInterval(() => {
    updateTime();
  }, 1000);
}
centerUiUpdate();

function darkMode() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  // load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  // toggle theme
  toggle.addEventListener("click", () => {
    const isLight = root.hasAttribute("data-theme");

    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌙";
    }
  });
}
darkMode();
