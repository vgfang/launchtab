import { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";
import Clock from "./components/Clock.tsx";
import Grid from "./components/Grid.tsx";
import SettingsModal from "./components/SettingsModal";
import * as T from "./types";
import { DefaultSettings } from "./defaults";
import ConfirmModal from "./components/ConfirmModal.tsx";
import { KeychordUtils } from "./utils/KeychordUtils.tsx";
import { GridUtils } from "./utils/GridUtils.tsx";

function App() {
  // holds current keychord input from user
  const [userInput, setUserInput] = useState("");
  // holds current edit mode state
  const [editMode, setEditMode] = useState(false);
  // holds current settings
  const [settings, setSettings] = useState<T.Settings>(DefaultSettings);
  // holds current nodes information
  const [nodes, setNodes] = useState([] as T.Node[]);
  // holds the targetedLink
  const [targetedLink, setTargetedLink] = useState<T.Link | undefined>(
    undefined,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openSettingsModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmFunc, setConfirmFunc] = useState(() => {});
  const openConfirmModal = (func: any, desc: string) => {
    setConfirmFunc(() => func);
    setConfirmDescription(desc);
    setIsConfirmModalOpen(true);
  };
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };
  const [confirmDescription, setConfirmDescription] = useState("");

  const toggleEditMode = () => {
    setUserInput("");
    setEditMode(editMode ? false : true);
  };

  if (import.meta.hot) {
    import.meta.hot.accept();
  }

  const saveSettings = (newSettings: T.Settings) => {
    const validation = GridUtils.validateGrid(
      nodes,
      newSettings.grid.sizeX,
      newSettings.grid.sizeY,
    );
    if (validation.valid) {
      setSettings(newSettings);
      return true;
    } else {
      alert(validation.error);
      return false;
    }
  };

  // handle data migration
  const exportData = () => {
    const data = JSON.stringify({ settings, nodes }, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "launchtab_data.json";
    link.click();
  };
  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    // Trigger the file input
    input.click();

    // Handle the file upload once a file is selected
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file); // Read the file
        reader.onload = (e: any) => {
          try {
            const importedData = JSON.parse(e.target.result);
            // Validate that the data contains the expected structure
            if (importedData.settings && importedData.nodes) {
              setSettings(importedData.settings);
              setNodes(importedData.nodes);
              alert("Data imported successfully.");
            } else {
              alert("Error: Invalid data format.");
            }
          } catch (error) {
            alert("Error: Failed to parse JSON file.");
          }
        };
      }
    };
  };

  // handle keychord
  useEffect(() => {
    const goToLink = (keychord: string) => {
      const link: T.Link | undefined = KeychordUtils.getLinkMatchingKeychord(
        nodes,
        keychord,
      );
      if (link) {
        const parseUrlForUse = (url: string) => {
          const hasPrefix = /^(http:\/\/|https:\/\/)/i.test(url);
          if (hasPrefix) {
            return url;
          }
          return `https://${url}`;
        };
        window.location.assign(parseUrlForUse(link.url));
      }
    };

    const recordUserKeys = (event: KeyboardEvent): void => {
      setUserInput((prevInput: string): string => {
        if (editMode) {
          return prevInput;
        }
        if (event.key === "Backspace") {
          return prevInput.length > 0 ? prevInput.slice(0, -1) : prevInput;
        } else if (event.key === "Enter") {
          goToLink(prevInput);
          return "";
        } else if (/^[a-z0-9]$/i.test(event.key)) {
          return prevInput + event.key;
        } else {
          // ignore non alphanumeric
          return prevInput;
        }
      });
    };
    document.addEventListener("keydown", recordUserKeys);
    return () => {
      document.removeEventListener("keydown", recordUserKeys);
    };
  }, [nodes, userInput, editMode]);

  // Update targetedLink
  useEffect(() => {
    const link: T.Link | undefined = KeychordUtils.getLinkMatchingKeychord(
      nodes,
      userInput,
    );
    if (link) {
      setTargetedLink(link);
    } else {
      setTargetedLink(undefined);
    }
  }, [userInput, nodes]);

  // Load settings and nodes from Chrome storage
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.sync.get(["data"], (result: any) => {
        if (result.data) {
          setSettings(result.data.settings);
          setNodes(result.data.nodes);
        }
      });
    }
  }, []);

  // Save settings to Chrome storage whenever they change
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.sync.set({ data: { settings, nodes } });
    }
  }, [settings, nodes]);

  // load in settings
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--node-radius",
      `${settings.grid.radius}px`,
    );
    document.documentElement.style.setProperty(
      "--node-padding",
      `${settings.grid.padding}px`,
    );
    document.documentElement.style.setProperty(
      "--grid-gap",
      `${settings.grid.gap}px`,
    );
    document.documentElement.style.setProperty(
      "--node-width",
      `${settings.grid.width}px`,
    );
    document.documentElement.style.setProperty(
      "--grid-size-x",
      `${settings.grid.sizeX}`,
    );
    document.documentElement.style.setProperty(
      "--grid-size-y",
      `${settings.grid.sizeY}`,
    );

    document.documentElement.style.setProperty(
      "--bg-color",
      settings.colors.bg,
    );
    document.documentElement.style.setProperty(
      "--fg-color",
      settings.colors.fg,
    );
    document.documentElement.style.setProperty(
      "--text-color",
      settings.colors.text,
    );
    document.documentElement.style.setProperty(
      "--accent-color",
      settings.colors.accent,
    );

    document.documentElement.style.setProperty(
      "--header-font-size",
      `${settings.fonts.headerSize}px`,
    );
    document.documentElement.style.setProperty(
      "--link-font-size",
      `${settings.fonts.linkSize}px`,
    );
    document.documentElement.style.setProperty(
      "--keychord-font-size",
      `${settings.fonts.keychordHintSize}px`,
    );
    document.documentElement.style.setProperty(
      "--clock-font-size",
      `${settings.fonts.clockSize}px`,
    );
    document.documentElement.style.setProperty(
      "--font-family",
      `${settings.fonts.fontFamily}`,
    );

    Modal.defaultStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      content: {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px",
        maxWidth: "80%",
        maxHeight: "80%",
        border: `2px solid ${settings.colors.fg}`,
      },
    };
  }, [settings]);

  return (
    <>
      <header className="header">
        <div className="edit-btn-container">
          {editMode && (
            <button className="edit-btn-big" onClick={openSettingsModal}>
              [settings]
            </button>
          )}
          <button
            className="edit-btn-big edit-btn-square"
            onClick={toggleEditMode}
          >
            ✎
          </button>
        </div>
        <Clock />
        <span className="user-input-span">
          {!editMode && "⌨"} {userInput} {editMode && "* edit mode active *"}
        </span>
        <span className="link-preview-span">
          {targetedLink && (
            <a href={targetedLink.url}>
              {targetedLink.label} ({targetedLink.url})
            </a>
          )}
        </span>
      </header>
      <main>
        <Modal
          style={{
            overlay: { zIndex: 10 },
            content: { zIndex: 11 },
          }}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <SettingsModal
            oldSettings={settings}
            saveSettings={saveSettings}
            closeModal={closeModal}
            importData={importData}
            exportData={exportData}
          />
        </Modal>
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={closeConfirmModal}
          ariaHideApp={false}
          style={{
            overlay: { zIndex: 20 },
            content: { zIndex: 21 },
          }}
        >
          <ConfirmModal
            confirmFunc={confirmFunc}
            closeModal={closeConfirmModal}
            description={confirmDescription}
          ></ConfirmModal>
        </Modal>
        <Grid
          editMode={editMode}
          settings={settings}
          nodes={nodes}
          setNodes={setNodes}
          size={{ x: settings.grid.sizeX, y: settings.grid.sizeY }}
          openConfirmModal={openConfirmModal}
          userInput={userInput}
        />
      </main>
    </>
  );
}

export default App;
