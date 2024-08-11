import { useState, useEffect } from 'react'
import './App.css'
import Clock from './components/Clock.tsx' 
import Grid from './components/Grid.tsx'
import TestJSON from './test/test.json'

function App() {
  // holds current keychord input from user
  const [userInput, setUserInput] = useState("")
  // holds current edit mode state
  const [editMode, setEditMode] = useState(true)
  // holds current settings
  const [settings, setSettings] = useState({})
  // holds current nodes information
  const [nodes, setNodes] = useState([])

  const attemptGoToLink = (keychord: string) => {
    console.log(`going to ${keychord}`)
  }

  const recordUserKeys = (event) => {
    setUserInput(prevInput => {
      if (event.key === 'Backspace') {
        return prevInput.length > 0 ? prevInput.slice(0, -1) : prevInput;
      } else if (event.key === 'Enter') {
        attemptGoToLink(prevInput)
        return "" 
      } else if (/^[a-z0-9]$/i.test(event.key)) {
        return prevInput + event.key
      } else {
        // ignore non alphanumeric
        return prevInput;
      }
    })
  }

  useEffect(() => {
    document.addEventListener('keydown', recordUserKeys)
    const userJSON = TestJSON
    setSettings(userJSON['settings'])
    setNodes(userJSON['nodes'])
    return () => {
      document.removeEventListener('keydown', recordUserKeys)
    }
  }, [])

  useEffect(()=>{
    console.log(nodes)
  }, [nodes])

  return (
    <>
      <header id="header">
        <Clock/>
        <span id="user-input-span">
           keychord: {userInput}
        </span>
        <div>
          <button>edit</button>
          <button>settings</button>
        </div>
      </header>
      <main>
        <Grid editMode={editMode} settings={settings} nodes={nodes} setNodes={setNodes}/>
      </main>
    </>
  )
}

export default App
