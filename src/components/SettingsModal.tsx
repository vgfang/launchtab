import { useState } from "react";
import * as T from "../types";
import "../stylesheets/Modal.css"; // import { GridUtils } from "../utils/GridUtils.tsx"

interface Props {
  closeModal: any;
  saveSettings: any;
  oldSettings: T.Settings;
  importData: any;
  exportData: any;
}

const SettingsModal = (props: Props) => {
  const [gridX, setGridX] = useState(props.oldSettings.grid.sizeX.toString());
  const [gridY, setGridY] = useState(props.oldSettings.grid.sizeY.toString());
  const [width, setWidth] = useState(props.oldSettings.grid.width.toString());
  const [padding, setPadding] = useState(
    props.oldSettings.grid.padding.toString(),
  );
  const [gap, setGap] = useState(props.oldSettings.grid.gap.toString());
  const [radius, setRadius] = useState(
    props.oldSettings.grid.radius.toString(),
  );

  const [colorFg, setColorFg] = useState(props.oldSettings.colors.fg);
  const [colorBg, setColorBg] = useState(props.oldSettings.colors.bg);
  const [colorAccent, setColorAccent] = useState(
    props.oldSettings.colors.accent,
  );
  const [colorText, setColorText] = useState(props.oldSettings.colors.text);

  const [fontHeaderSize, setFontHeaderSize] = useState(
    props.oldSettings.fonts.headerSize,
  );
  const [fontLinkSize, setFontLinkSize] = useState(
    props.oldSettings.fonts.linkSize,
  );
  const [fontKeychordHintSize, setFontKeychordHintSize] = useState(
    props.oldSettings.fonts.keychordHintSize,
  );
  const [fontClockSize, setFontClockSize] = useState(
    props.oldSettings.fonts.clockSize,
  );
  const [fontFamily, setFontFamily] = useState(
    props.oldSettings.fonts.fontFamily,
  );

  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const newSettings: T.Settings = {
      grid: {
        sizeX: parseInt(gridX),
        sizeY: parseInt(gridY),
        width: parseInt(width),
        padding: parseInt(padding),
        gap: parseInt(gap),
        radius: parseInt(radius),
      },
      colors: {
        fg: colorFg,
        bg: colorBg,
        accent: colorAccent,
        text: colorText,
      },
      fonts: {
        headerSize: fontHeaderSize,
        linkSize: fontLinkSize,
        keychordHintSize: fontKeychordHintSize,
        clockSize: fontClockSize,
        fontFamily: fontFamily,
      },
    };
    if (props.saveSettings(newSettings)) {
      props.closeModal();
    }
  };

  return (
    <div>
      <h2 className="modal-title">⚙️ settings:</h2>

      <form id="settings-modal-form">
        <label>Grid:</label>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Size X: </label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={gridX}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGridX(e.target.value)
                  }
                />
              </td>
              <td>
                <label>Size Y:</label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={gridY}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGridY(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Width: </label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={width}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWidth(e.target.value)
                  }
                />
              </td>
              <td>
                <label>Padding: </label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={padding}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPadding(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Gap: </label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={gap}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGap(e.target.value)
                  }
                />
              </td>
              <td>
                <label>Radius: </label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={radius}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRadius(e.target.value)
                  }
                />
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
                <input
                  type="color"
                  value={colorBg}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setColorBg(e.target.value)
                  }
                />
              </td>
              <td>
                <label>FG Color:</label>
              </td>
              <td>
                <input
                  type="color"
                  value={colorFg}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setColorFg(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Text Color:</label>
              </td>
              <td>
                <input
                  type="color"
                  value={colorText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setColorText(e.target.value)
                  }
                />
              </td>
              <td>
                <label>Accent Color:</label>
              </td>
              <td>
                <input
                  type="color"
                  value={colorAccent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setColorAccent(e.target.value)
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <label>Fonts: </label>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Font Family:</label>
              </td>
              <td colSpan={3}>
                <input
                  type="text"
                  className="fill-text-input"
                  value={fontFamily}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFontFamily(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Clock Size:</label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={fontClockSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFontClockSize(parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                <label>Header Size:</label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={fontHeaderSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFontHeaderSize(parseInt(e.target.value))
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Link Size:</label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={fontLinkSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFontLinkSize(parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                <label>Key Hint Size:</label>
              </td>
              <td>
                <input
                  type="number"
                  className="short-number-input"
                  value={fontKeychordHintSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFontKeychordHintSize(parseInt(e.target.value))
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <div className="modal-button-container">
          <button
            type="submit"
            form="settings-modal-form"
            onClick={handleLinkFormSubmit}
          >
            [ save ]
          </button>
          <button onClick={props.closeModal}>[ cancel ]</button>
        </div>
      </form>
      <br />
      <hr />
      <br />
      <h2 className="modal-title">💾 data migration:</h2>
      <p>Data is in JSON format.</p>
      <p>It includes both settings and node data.</p>
      <div className="modal-button-container">
        <button onClick={() => { props.importData() }}>[ import ]</button>
        <button onClick={() => { props.exportData() }}>[ export ]</button>
      </div>
    </div>
  );
};

export default SettingsModal;
