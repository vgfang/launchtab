chrome.runtime.onInstalled.addListener(() => {
  const defaultData = {
    settings: {
      grid: {
        sizeX: 3,
        sizeY: 3,
        width: 200,
        padding: 50,
        gap: 10,
        radius: 10,
      },
      colors: {
        fg: "#abaca1",
        bg: "#24283b",
        accent: "#f7768e",
        text: "#73daca",
      },
      fonts: {
        headerSize: 24,
        linkSize: 18,
        keychordHintSize: 18,
        clockSize: 64,
        fontFamily: "monospace, sans-serif",
      },
    },
    nodes: [],
  };

  chrome.storage.sync.set({ data: defaultData }, () => {
    console.log("Initial data set in chrome.storage.sync");
  });
});
