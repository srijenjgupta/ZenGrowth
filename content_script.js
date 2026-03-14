// Fetch user settings
chrome.storage.local.get(['distractionList', 'userGoals', 'userImage'], (data) => {
  const list = data.distractionList || ["youtube.com", "instagram.com", "reddit.com", "twitter.com", "facebook.com", "linkedin.com"];
  const currentHostname = window.location.hostname.toLowerCase();
  const isDistracted = list.some(site => currentHostname.includes(site));

  if (isDistracted) {
    triggerGoalMirror(data.userGoals, data.userImage);
  }
});

function triggerGoalMirror(goals, imageBase64) {
  if (document.getElementById('zen-growth-mirror')) return;

  // Setup dynamic goals or fallbacks
  const g1 = goals && goals[0] ? goals[0] : "Define Goal 1 in ZenGrowth";
  const g2 = goals && goals[1] ? goals[1] : "Define Goal 2 in ZenGrowth";
  const g3 = goals && goals[2] ? goals[2] : "Define Goal 3 in ZenGrowth";

  // Check if user uploaded an image
  const imageHTML = imageBase64 
    ? `<img src="${imageBase64}" style="width: 100%; max-height: 180px; object-fit: cover; border-radius: 6px; margin-bottom: 15px; border: 2px solid #ecf0f1;">` 
    : ``;

  const overlay = document.createElement('div');
  overlay.id = 'zen-growth-mirror';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(30, 39, 46, 0.95); backdrop-filter: blur(10px);
    z-index: 2147483647; display: flex; align-items: center; justify-content: center;
    font-family: 'Segoe UI', Tahoma, sans-serif; color: white; text-align: center;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: white; color: #333; padding: 30px; border-radius: 12px;
    max-width: 450px; width: 90%; box-shadow: 0 15px 40px rgba(0,0,0,0.6);
  `;

  modal.innerHTML = `
    <h2 style="margin-top:0; color:#c0392b; font-size: 24px; text-transform: uppercase;">Time Wasted is Time Lost.</h2>
    <p style="font-size: 15px; margin-bottom: 15px; font-weight: bold; color: #2c3e50;">
      Every second you spend here is stolen from your actual future. Your digital tree is wilting. Is this site worth abandoning these?
    </p>
    
    ${imageHTML}

    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #c0392b; text-align: left;">
        <span style="font-size: 14px; font-weight: bold; color: #2c3e50;">1. ${g1}</span><br>
        <span style="font-size: 14px; font-weight: bold; color: #2c3e50;">2. ${g2}</span><br>
        <span style="font-size: 14px; font-weight: bold; color: #2c3e50;">3. ${g3}</span>
    </div>
    
    <div style="display: flex; justify-content: space-between; gap: 15px;">
      <button id="zen-back-btn" style="flex:1; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">Leave Site</button>
      <button id="zen-proceed-btn" disabled style="flex:1; padding: 12px; background: #bdc3c7; color: white; border: none; border-radius: 6px; cursor: not-allowed; font-weight: bold; font-size: 14px;">Wait (5s)...</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('zen-back-btn').addEventListener('click', () => {
    window.location.href = "about:blank"; 
  });

  const proceedBtn = document.getElementById('zen-proceed-btn');
  let timeLeft = 5;
  
  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      proceedBtn.innerText = `Wait (${timeLeft}s)...`;
    } else {
      clearInterval(timer);
      proceedBtn.innerText = "Sacrifice my time"; // Guilt-inducing button text
      proceedBtn.style.background = "#e74c3c";
      proceedBtn.style.cursor = "pointer";
      proceedBtn.disabled = false;
    }
  }, 1000);

  proceedBtn.addEventListener('click', () => {
    overlay.remove();
    startCenterNudgeTimer();
  });
}

// --- THE CENTER-SCREEN NUDGE ---
function startCenterNudgeTimer() {
  let minutesSpent = 0;
  setInterval(() => {
    minutesSpent++;
    showCenterNudge(minutesSpent);
  }, 60000); 
}

function showCenterNudge(mins) {
  // Prevent multiple nudges stacking up
  if (document.getElementById('zen-center-nudge')) return;

  const overlay = document.createElement('div');
  overlay.id = 'zen-center-nudge';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(192, 57, 43, 0.85); backdrop-filter: blur(5px);
    z-index: 2147483647; display: flex; align-items: center; justify-content: center;
    font-family: 'Segoe UI', Tahoma, sans-serif;
  `;
  
  const box = document.createElement('div');
  box.style.cssText = `
    background: white; padding: 40px; border-radius: 10px; text-align: center;
    max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  `;

  box.innerHTML = `
    <h1 style="color: #c0392b; font-size: 40px; margin: 0 0 10px 0;">${mins} Min</h1>
    <h2 style="color: #333; margin-top: 0;">You are still here.</h2>
    <p style="color: #555; font-size: 16px; margin-bottom: 20px;">
      You have sacrificed <strong>${mins} minute(s)</strong> of progress on your goals to this website. The damage to your focus is compounding.
    </p>
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button id="zen-nudge-leave" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Leave Now</button>
      <button id="zen-nudge-stay" style="padding: 10px 20px; background: #ecf0f1; color: #7f8c8d; border: none; border-radius: 5px; cursor: pointer;">Keep Wasting Time</button>
    </div>
  `;
  
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('zen-nudge-leave').addEventListener('click', () => {
    window.location.href = "about:blank";
  });

  document.getElementById('zen-nudge-stay').addEventListener('click', () => {
    overlay.remove();
  });
}