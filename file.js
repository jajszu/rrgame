
const codes = ['Lk15810','b','c','d','e']


function checkCode()
{
    const input = document.getElementById("code");
      let progress = localStorage.getItem("progress");

  if (!progress) {
    progress = 1;
    saveProgress(1);
  }


  progress = parseInt(progress);
  if(codes[progress - 1] == input.value)
  {
    unlockNextStage();
    input.value = "";
  }
else{
    flashInputRed(input);
  }
}

function flashInputRed(inputElement) {
    // usuń klasę, jeśli już była
    inputElement.classList.remove("flash-red");

    // wymuś reflow, żeby animacja zadziałała ponownie
    void inputElement.offsetWidth;

    // dodaj klasę do animacji
    inputElement.classList.add("flash-red");
}

function hideAllStages() {
  const stages = document.querySelectorAll(".stage");
  stages.forEach(stage => stage.style.display = "none");
}

function showStage(stageNumber) {
  const el = document.getElementById("stage" + stageNumber);
  if (el) {
    el.style.display = "block";
  }
}

function saveProgress(stageNumber) {
  localStorage.setItem("progress", stageNumber);
}

function loadProgress() {
  hideAllStages();

  let progress = localStorage.getItem("progress");

  if (!progress) {
    progress = 1;
    saveProgress(1);
  }

  progress = parseInt(progress);

  for (let i = 1; i <= progress; i++) {
    showStage(i);
  }
}

function unlockNextStage() {
  let progress = localStorage.getItem("progress");
  progress = progress ? parseInt(progress) : 1;

  const nextStage = progress + 1;

  saveProgress(nextStage);
  showStage(nextStage);
}

window.onload = function() {
  loadProgress();
};

function resetGame() {
  localStorage.removeItem("progress");
  location.reload();
}


const target = {
  lat: 50.0670,  // <- punkt docelowy
  lng: 19.9120
};

let userLat = null;
let userLng = null;
let heading = 0;

// 📍 pobieranie lokalizacji
navigator.geolocation.watchPosition((pos) => {
  userLat = pos.coords.latitude;
  userLng = pos.coords.longitude;

  updateCompass();
});

// 🧭 orientacja urządzenia (kompas)
window.addEventListener("deviceorientationabsolute", (event) => {
  if (event.alpha !== null) {
    heading = event.alpha; // kierunek telefonu
    updateCompass();
  }
});

function toRad(deg) {
  return deg * Math.PI / 180;
}

function toDeg(rad) {
  return rad * 180 / Math.PI;
}

// 📐 oblicz azymut do celu
function getBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// 📏 odległość (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 🔄 aktualizacja UI
function updateCompass() {
  if (userLat === null || heading === null) return;

  const bearing = getBearing(userLat, userLng, target.lat, target.lng);

  const rotation = bearing - heading;

  document.querySelector(".arrow").style.transform =
    `translateX(-50%) rotate(${rotation}deg)`;

  const distance = getDistance(userLat, userLng, target.lat, target.lng);

  document.getElementById("distance").innerText =
    `Odległość: ${(distance / 1000).toFixed(2)} km`;
}

if (typeof DeviceOrientationEvent.requestPermission === "function") {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response === "granted") {
        console.log("OK");
      }
    });
}