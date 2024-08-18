import { useState, useEffect } from "react";
import Modal from 'react-modal'
import "./App.css";
import Clock from "./components/Clock.tsx";
import Grid from "./components/Grid.tsx";
import TestJSON from "./test/test.json";
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
    setEditMode(editMode ? false : true)
  }

  const attemptGoToLink = (keychord: string) => {
    console.log(`going to ${keychord}`);
  };

  const recordUserKeys = (event: KeyboardEvent): void => {
    setUserInput((prevInput: string): string => {
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
    const userJSON: T.Data = TestJSON as T.Data;
    setSettings(userJSON.settings);
    setNodes(userJSON.nodes);
    return () => {
      document.removeEventListener("keydown", recordUserKeys);
    };
  }, [recordUserKeys]);

  useEffect(() => {
  }, [nodes]);

  return (
    <>
      <header id="header">
        <Clock />
        <span id="user-input-span">⌨{userInput}</span>
        <div>
          <button onClick={toggleEditMode}>edit</button>
          <button onClick={openSettingsModal}>⚙</button>
        </div>
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
          <SettingsModal closeModal={closeModal} />
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
          openConfirmModal={openConfirmModal}
        />
      </main >
    </>
  );
}

export default App;
