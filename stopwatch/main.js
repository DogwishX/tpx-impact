// Time variables
const msInOneCentisecond = 10;
const csInOneSecond = 100;
const csInOneMinute = 6000;
const csInOneHour = 360000;
const secondsInOneMinute = 60;
const minutesInOneHour = 60;

// Stopwatch state
let isRunning = false;
let totalTimeInCentiseconds = 0;
let lapTimeInCentiseconds = 0;
let stopwatchInterval;

// DOM variables
const timeEl = document.querySelector(".time");
const lapTimeEl = document.querySelector(".lap-time");
const startBtn = document.querySelector("#start-stop");
const resetBtn = document.querySelector("#reset");
const lapBtn = document.querySelector("#lap-btn");
const lapsList = document.querySelector(".laps");

startBtn.addEventListener("click", startOrStop);
resetBtn.addEventListener("click", resetAll);
lapBtn.addEventListener("click", saveLap);

function startOrStop() {
  startBtn.classList.toggle("start");

  if (isRunning) return stop();
  start();
}

function start() {
  stopwatchInterval = setInterval(() => {
    totalTimeInCentiseconds += 1;
    printTime(totalTimeInCentiseconds, timeEl);

    lapTimeInCentiseconds += 1;
    printTime(lapTimeInCentiseconds, lapTimeEl);
  }, msInOneCentisecond);

  isRunning = true;
  startBtn.textContent = "Pause";
}

function stop() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  isRunning = false;
  startBtn.textContent = "Start";
}

function resetAll() {
  stop();
  resetLapTime();
  clearInnerHTML(lapsList);
  clearTime(timeEl);
  localStorage.clear();
  totalTimeInCentiseconds = 0;
}

function resetLapTime() {
  lapTimeInCentiseconds = 0;
  clearTime(lapTimeEl);
}

function saveLap() {
  saveToLocalStorage();
  resetLapTime();
  renderSavedLaps();
}

function saveToLocalStorage() {
  const savedLaps = localStorage.laps ? JSON.parse(localStorage.laps) : [];
  savedLaps.push(lapTimeEl.textContent);
  localStorage.setItem("laps", JSON.stringify(savedLaps));
}

function renderSavedLaps() {
  clearInnerHTML(lapsList);
  const savedLaps = JSON.parse(localStorage.laps);
  savedLaps.forEach(renderLap);
}

function renderLap(lapTime) {
  const newLi = document.createElement("li");
  newLi.classList.add("laps__item");
  newLi.textContent = lapTime;
  lapsList.append(newLi);
}

// Helper functions
function printTime(timeInCentiseconds, element) {
  const centiseconds = timeInCentiseconds % csInOneSecond;
  const seconds =
    parseInt(timeInCentiseconds / csInOneSecond) % secondsInOneMinute;
  const minutes =
    parseInt(timeInCentiseconds / csInOneMinute) % minutesInOneHour;
  const hours = parseInt(timeInCentiseconds / csInOneHour);
  const timeArr = [hours, minutes, seconds, centiseconds];

  element.textContent = timeArr.map((item) => addPadding(item)).join(":");
}

function addPadding(val) {
  return val < 10 ? "0" + val : val;
}

function clearTime(element) {
  element.textContent = `00:00:00:00`;
}

function clearInnerHTML(element) {
  element.innerHTML = "";
}
