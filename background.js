chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

let focusScore = 50; 
let distractionList = ["youtube.com", "instagram.com", "reddit.com", "twitter.com", "facebook.com", "linkedin.com"];
let maxTabsLimit = 8;

// Initialize from storage on startup
chrome.storage.local.get(['focusScore', 'userMaxTabs', 'distractionList'], (data) => {
  if (data.focusScore !== undefined) focusScore = data.focusScore;
  if (data.userMaxTabs !== undefined) maxTabsLimit = data.userMaxTabs;
  if (data.distractionList !== undefined) distractionList = data.distractionList;
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.userMaxTabs) maxTabsLimit = changes.userMaxTabs.newValue;
    if (changes.distractionList) distractionList = changes.distractionList.newValue;
  }
});

// --- MINUTE-BY-MINUTE SCORE CALCULATION ---
chrome.alarms.create("focusCheck", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "focusCheck") {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let isDistracted = false;
    
    if (activeTab && activeTab.url) {
      const urlLower = activeTab.url.toLowerCase();
      isDistracted = distractionList.some(site => urlLower.includes(site));
    }

    const allTabs = await chrome.tabs.query({ currentWindow: true });
    const isOverloaded = allTabs.length > maxTabsLimit;

    // Calculate score
    if (isOverloaded) {
      focusScore -= 10; 
    } else if (isDistracted) {
      focusScore -= 5;  
    } else {
      focusScore += 2;  
    }

    focusScore = Math.max(0, Math.min(100, focusScore));

    chrome.storage.local.set({ focusScore: focusScore, currentTabCount: allTabs.length });
    
    // Update Badge Color
    if (isOverloaded) {
      chrome.action.setBadgeText({ text: "HIGH" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" }); 
    } else {
      chrome.action.setBadgeText({ text: focusScore.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); 
    }
  }
});

// --- INSTANT DISTRACTION & TAB DETECTION ---
async function updateInstantState() {
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  let isDistracted = false;
  if (activeTab && activeTab.url) {
    const urlLower = activeTab.url.toLowerCase();
    isDistracted = distractionList.some(site => urlLower.includes(site));
  }

  // Tell the sidebar instantly
  chrome.storage.local.set({ 
    currentTabCount: allTabs.length,
    isCurrentlyDistracted: isDistracted
  });
}

// Fire instant checks on tab changes
chrome.tabs.onCreated.addListener(updateInstantState);
chrome.tabs.onRemoved.addListener(updateInstantState);
chrome.tabs.onActivated.addListener(updateInstantState);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    updateInstantState();
  }
});