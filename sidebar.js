const pressureGauge = document.getElementById('pressure-gauge');
const bonsaiCanvas = document.getElementById('bonsai-canvas');
const bonsaiStatus = document.getElementById('bonsai-status');
const focusScoreSpan = document.getElementById('focus-score');

const maxTabsInput = document.getElementById('max-tabs-input');
const distractionsInput = document.getElementById('distractions-input');
const saveBtn = document.getElementById('save-btn');
const displayMax = document.getElementById('display-max');

// New Goal Elements
const goal1 = document.getElementById('goal-1');
const goal2 = document.getElementById('goal-2');
const goal3 = document.getElementById('goal-3');
const imageInput = document.getElementById('goal-image-input');
const imagePreview = document.getElementById('image-preview');

let currentTabCount = 0;
let maxTabsLimit = 8;
let focusScore = 50;
let isCurrentlyDistracted = false;
let savedImageData = null;

function updateUI() {
  displayMax.innerText = maxTabsLimit;
  if (currentTabCount > maxTabsLimit) {
    pressureGauge.className = 'danger';
    pressureGauge.innerHTML = `⚠️ OVERLOAD: ${currentTabCount} / ${maxTabsLimit} Tabs`;
    bonsaiCanvas.className = "state-wilted";
    bonsaiStatus.innerText = "Tab overload! Your tree is wilting.";
    bonsaiStatus.style.color = "#c0392b";
  } else if (isCurrentlyDistracted) {
    pressureGauge.className = 'safe';
    pressureGauge.innerHTML = `Open Tabs: <span id="tab-count">${currentTabCount}</span> / ${maxTabsLimit}`;
    bonsaiCanvas.className = "state-wilted";
    bonsaiStatus.innerText = "Distracting site! Energy draining...";
    bonsaiStatus.style.color = "#e74c3c";
  } else {
    pressureGauge.className = 'safe';
    pressureGauge.innerHTML = `Open Tabs: <span id="tab-count">${currentTabCount}</span> / ${maxTabsLimit}`;
    if (focusScore < 20) {
      bonsaiCanvas.className = "state-wilted";
      bonsaiStatus.innerText = "Focus critically low. Close distractions.";
      bonsaiStatus.style.color = "#c0392b";
    } else if (focusScore < 50) {
      bonsaiCanvas.className = "state-seedling";
      bonsaiStatus.innerText = "Focus is low. Keep working to grow.";
      bonsaiStatus.style.color = "#e67e22";
    } else if (focusScore < 80) {
      bonsaiCanvas.className = "state-growing";
      bonsaiStatus.innerText = "Growing steadily. Good focus!";
      bonsaiStatus.style.color = "#27ae60";
    } else {
      bonsaiCanvas.className = "state-flourishing";
      bonsaiStatus.innerText = "Flourishing! Deep focus achieved.";
      bonsaiStatus.style.color = "#2ecc71";
    }
  }
  focusScoreSpan.innerText = focusScore;
}

// Handle Image Upload Preview & Conversion
imageInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      savedImageData = e.target.result; // This is the Base64 string
      imagePreview.src = savedImageData;
      imagePreview.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});

// Fetch initial data
chrome.storage.local.get(['currentTabCount', 'userMaxTabs', 'focusScore', 'distractionList', 'isCurrentlyDistracted', 'userGoals', 'userImage'], (result) => {
  if (result.userMaxTabs !== undefined) maxTabsLimit = result.userMaxTabs;
  if (result.currentTabCount !== undefined) currentTabCount = result.currentTabCount;
  if (result.focusScore !== undefined) focusScore = result.focusScore;
  if (result.distractionList !== undefined) distractionsInput.value = result.distractionList.join(', ');
  if (result.isCurrentlyDistracted !== undefined) isCurrentlyDistracted = result.isCurrentlyDistracted;
  
  // Load Goals & Image
  if (result.userGoals) {
    goal1.value = result.userGoals[0] || '';
    goal2.value = result.userGoals[1] || '';
    goal3.value = result.userGoals[2] || '';
  }
  if (result.userImage) {
    savedImageData = result.userImage;
    imagePreview.src = savedImageData;
    imagePreview.style.display = 'block';
  }
  
  maxTabsInput.value = maxTabsLimit;
  updateUI();
});

// Listen for background updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.currentTabCount) currentTabCount = changes.currentTabCount.newValue;
    if (changes.focusScore) focusScore = changes.focusScore.newValue;
    if (changes.isCurrentlyDistracted !== undefined) isCurrentlyDistracted = changes.isCurrentlyDistracted.newValue;
    if (changes.userMaxTabs) maxTabsLimit = changes.userMaxTabs.newValue;
    updateUI();
  }
});

// Save Settings
saveBtn.addEventListener('click', () => {
  const newLimit = parseInt(maxTabsInput.value, 10);
  const listStr = distractionsInput.value;
  const newDistractions = listStr.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
  const goals = [goal1.value, goal2.value, goal3.value];
  
  if (newLimit > 0) {
    chrome.storage.local.set({ 
      userMaxTabs: newLimit,
      distractionList: newDistractions,
      userGoals: goals,
      userImage: savedImageData
    }, () => {
      saveBtn.innerText = "Saved!";
      setTimeout(() => { saveBtn.innerText = "Save Settings"; }, 2000);
    });
  }
});