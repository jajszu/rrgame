
const codes = ['Lk15810','PNEN124D400','10001','ULICABASZTOWA20DZ.VKLEPARZ','4841534C4F3A2A2A2A2A2A']


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
