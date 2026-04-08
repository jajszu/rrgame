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

