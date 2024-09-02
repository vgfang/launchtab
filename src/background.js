chrome.runtime.onInstalled.addListener(() => {
  const defaultData = {
    settings: {
      // Copy the DefaultSettings object from your React app
    },
    nodes: []
  };

  chrome.storage.sync.set({ data: defaultData }, () => {
    console.log('Initial data set in chrome.storage.sync');
  });
});
