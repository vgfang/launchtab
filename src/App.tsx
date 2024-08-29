import { useState, useEffect } from "react";
import Modal from 'react-modal'
import "./App.css";
import Clock from "./components/Clock.tsx";
import Grid from "./components/Grid.tsx";
import TestJSON from "../test/test.json";
import SettingsModal from "./components/SettingsModal"
import * as T from './types'
import { DefaultSettings } from "./defaults"
import ConfirmModal from "./components/ConfirmModal.tsx";

function App() {
  // holds current keychord input from user
  const [userInput, setUserInput] = useState("");
  // holds current edit mode state
  const [editMode, setEditMode] = useState(true);
  // holds current settings
  const [settings, setSettings] = useState<T.Settings>(DefaultSettings);
  // holds current nodes information
  const [nodes, setNodes] = useState([] as T.Node[]);
  // holds the currently most accurate link
  // const [targetedLink, setTargetedLink] = useState<T.Link | undefined>(undefined)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openSettingsModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmFunc, setConfirmFunc] = useState(() => { })
  const openConfirmModal = (func: any, desc: string) => {
    setConfirmFunc(() => func)
    setConfirmDescription(desc)
    setIsConfirmModalOpen(true)
  }
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false)
  }
  const [confirmDescription, setConfirmDescription] = useState('')

  const toggleEditMode = () => {
    setUserInput("")
    setEditMode(editMode ? false : true)
  }

  const attemptGoToLink = (keychord: string) => {
    console.log(`going to ${keychord}`);
  };

  const saveSettings = (newSettings: T.Settings) => {
    setSettings(newSettings)
  }

  const recordUserKeys = (event: KeyboardEvent): void => {
    setUserInput((prevInput: string): string => {
      if (editMode) {
        return prevInput;
      }

      if (event.key === "Backspace") {
        return prevInput.length > 0 ? prevInput.slice(0, -1) : prevInput;
      } else if (event.key === "Enter") {
        attemptGoToLink(prevInput);
        return "";
      } else if (/^[a-z0-9]$/i.test(event.key)) {
        return prevInput + event.key;
      } else {
        // ignore non alphanumeric
        return prevInput;
      }
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", recordUserKeys);
    return () => {
      document.removeEventListener("keydown", recordUserKeys);
    };
  }, [recordUserKeys]);

  useEffect(() => {
    // testcode
    const userJSON: T.Data = TestJSON as T.Data;
    setSettings(userJSON.settings);
    setNodes(userJSON.nodes);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--node-radius', `${settings.grid.radius}px`);
    document.documentElement.style.setProperty('--node-padding', `${settings.grid.padding}px`);
    document.documentElement.style.setProperty('--grid-gap', `${settings.grid.gap}px`);
    document.documentElement.style.setProperty('--node-width', `${settings.grid.width}px`);
    document.documentElement.style.setProperty('--grid-size-x', `${settings.grid.sizeX}`);
    document.documentElement.style.setProperty('--grid-size-y', `${settings.grid.sizeY}`);

    document.documentElement.style.setProperty('--bg-color', settings.colors.bg);
    document.documentElement.style.setProperty('--fg-color', settings.colors.fg);
    document.documentElement.style.setProperty('--text-color', settings.colors.text);
    document.documentElement.style.setProperty('--accent-color', settings.colors.accent);

    document.documentElement.style.setProperty('--header-font-size', `${settings.fonts.headerSize}px`);
    document.documentElement.style.setProperty('--link-font-size', `${settings.fonts.linkSize}px`);
    document.documentElement.style.setProperty('--keychord-font-size', `${settings.fonts.keychordHintSize}px`);
    document.documentElement.style.setProperty('--clock-font-size', `${settings.fonts.clockSize}px`);
    document.documentElement.style.setProperty('--font-family', `${settings.fonts.fontFamily}`);
  }, [settings]);


  Modal.defaultStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',  // semi-transparent background
      backdropFilter: 'blur(5px)',  // blur effect
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative',  // changed from 'absolute'
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px',
      maxWidth: '80%',  // prevent modal from being too wide
      maxHeight: '80%', // prevent modal from being too tall
    }
  }


  return (
    <>
      <header className="header">
        <div className="edit-btn-container">
          {editMode &&
            <button className="edit-btn-big" onClick={openSettingsModal}>[settings ⚙]</button>
          }
          <button className="edit-btn-big edit-btn-main" onClick={toggleEditMode}>✎</button>
        </div>
        <Clock />
        <span className="user-input-span">{!editMode && '⌨'} {userInput} {editMode && '* edit mode active *'}</span>
        {/* <span className="link-preview-span">{targetedLink && `->${targetedLink.label}`}</span> */}
      </header>
      <main>
        <Modal
          style={{
            overlay: { zIndex: 10 },
            content: { zIndex: 11 }
          }}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
        >
          <SettingsModal oldSettings={settings} saveSettings={saveSettings} closeModal={closeModal} />
        </Modal>
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={closeConfirmModal}
          ariaHideApp={false}
          style={{
            overlay: { zIndex: 20 },
            content: { zIndex: 21 }
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
        />
      </main >
    </>
  );
}

export default App;
