import { useState } from 'react'
import * as T from '../types'

interface Props {
  closeModal: any;
  saveSettings: any;
  oldSettings: T.Settings
}

const SettingsModal = (props: Props) => {
  const [gridX, setGridX] = useState(props.oldSettings.grid.sizeX.toString())
  const [gridY, setGridY] = useState(props.oldSettings.grid.sizeY.toString())
  const [width, setWidth] = useState(props.oldSettings.grid.width.toString())
  const [padding, setPadding] = useState(props.oldSettings.grid.padding.toString())
  const [gap, setGap] = useState(props.oldSettings.grid.gap.toString())
  const [radius, setRadius] = useState(props.oldSettings.grid.radius.toString())
  const [colorFg, setColorFg] = useState(props.oldSettings.colors.fg)
  const [colorBg, setColorBg] = useState(props.oldSettings.colors.bg)
  const [colorAccent, setColorAccent] = useState(props.oldSettings.colors.accent)
  const [colorText, setColorText] = useState(props.oldSettings.colors.text)


  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const newSettings: T.Settings = {
      grid: {
        sizeX: parseInt(gridX),
        sizeY: parseInt(gridY),
        width: parseInt(width),
        padding: parseInt(padding),
        gap: parseInt(gap),
        radius: parseInt(radius)
      },
      colors: {
        fg: colorFg,
        bg: colorBg,
        accent: colorAccent,
        text: colorText
      }
    }
    // TODO: add validator
    props.saveSettings(newSettings)
    props.closeModal()
  }

  return (
    <div>
      <h2>settings:</h2>

      <form>

        <label>Grid:</label>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Size X: </label>
              </td>
              <td>
                <input type="number" value={gridX} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGridX(e.target.value)} />
              </td>
              <td>
                <label>Size Y:</label>
              </td>
              <td>
                <input type="text" value={gridY} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGridY(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                <label>Width: </label>
              </td>
              <td>
                <input type="text" value={width} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)} />
              </td>
              <td>
                <label>Padding: </label>
              </td>
              <td>
                <input type="text" value={padding} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPadding(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                <label>Gap: </label>
              </td>
              <td>
                <input type="text" value={gap} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGap(e.target.value)} />
              </td>
              <td>
                <label>Radius: </label>
              </td>
              <td>
                <input type="text" value={radius} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <label>Colors:</label>
        <table>
          <tbody>
            <tr>
              <td>
                <label>BG Color:</label>
              </td>
              <td>
                <input type="color" value={colorBg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorBg(e.target.value)} />
              </td>
              <td>
                <label>FG Color:</label>
              </td>
              <td>
                <input type="color" value={colorFg} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorFg(e.target.value)} />
              </td>
            </tr>
            <tr>
              <td>
                <label>Text Color:</label>
              </td>
              <td>
                <input type="color" value={colorText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorText(e.target.value)} />
              </td>
              <td>
                <label>Accent Color:</label>
              </td>
              <td>
                <input type="color" value={colorAccent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorAccent(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>

        <button onClick={props.closeModal}>[ cancel ]</button>
        <button type="submit" form="confirm-modal-form" onClick={handleLinkFormSubmit}>
          [ save ]
        </button>
      </form>
    </div>
  );
};

export default SettingsModal;
