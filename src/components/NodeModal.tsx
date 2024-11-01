import { useState } from "react";
import * as T from "../types";
import { v4 as uuidv4 } from "uuid";
import "../stylesheets/Modal.css";
import Picker from "@emoji-mart/react";

interface Props {
  selectedNode?: T.Node;
  closeModal: any;
  addNode: any;
  updateNode: any;
  deleteNode: any;
  openConfirmModal: any;
  mode: T.NodeModalMode;
  defaultNodePos: { x: number; y: number };
}

const NodeModal = (props: Props) => {
  const [label, setLabel] = useState(props.selectedNode?.label || "");
  const [keychord, setKeychord] = useState(props.selectedNode?.keychord || "");
  const [emoji, setEmoji] = useState(props.selectedNode?.emoji || "");
  const [posX, setPosX] = useState(
    props.selectedNode?.posX.toString() || props.defaultNodePos.x.toString(),
  );
  const [posY, setPosY] = useState(
    props.selectedNode?.posY.toString() || props.defaultNodePos.y.toString(),
  );
  const [width, setWidth] = useState(
    props.selectedNode?.width.toString() || "1",
  );
  const [height, setHeight] = useState(
    props.selectedNode?.height.toString() || "1",
  );

  const addNewNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const newNode: T.Node = {
      uuid: uuidv4(),
      label: label,
      keychord: keychord,
      emoji: emoji,
      posX: parseInt(posX),
      posY: parseInt(posY),
      width: parseInt(width),
      height: parseInt(height),
      links: [],
    };

    const validation: T.Validation = props.addNode(newNode);
    if (validation.valid) {
      props.closeModal();
    }
  };

  const updateSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (props.selectedNode) {
      const newNode: T.Node = {
        uuid: props.selectedNode.uuid,
        label: label,
        keychord: keychord,
        emoji: emoji,
        posX: parseInt(posX),
        posY: parseInt(posY),
        width: parseInt(width),
        height: parseInt(height),
        links: props.selectedNode.links,
      };

      const validation: T.Validation = props.updateNode(newNode);
      if (validation.valid) {
        props.closeModal();
      }
    }
  };

  const deleteSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (props.selectedNode) {
      const desc = `confirm deletion of node: ${props.selectedNode.emoji} ${props.selectedNode.label}`;
      props.openConfirmModal(() => {
        if (props.selectedNode) {
          props.deleteNode(props.selectedNode.uuid);
          props.closeModal();
        }
      }, desc);
    }
  };

  return (
    <div>
      <h2 className="modal-title">
        {props.mode == T.NodeModalMode.EDIT && "✏️  edit node: "}
        {props.mode == T.NodeModalMode.ADD && "➕ add new node: "}
        {props.selectedNode && props.selectedNode.emoji}{" "}
        {props.selectedNode && props.selectedNode.label}
      </h2>
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label>label:</label>
              </td>
              <td colSpan={3}>
                <input
                  type="text"
                  className="fill-text-input"
                  name="label"
                  value={label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLabel(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>keychord:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="keychord"
                  value={keychord}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setKeychord(e.target.value)
                  }
                />
              </td>
              <td>
                <label>emoji:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="emoji"
                  readOnly={true}
                  value={emoji}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>posX:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="posX"
                  value={posX}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPosX(e.target.value)
                  }
                />
              </td>
              <td>
                <label>posY:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="posY"
                  value={posY}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPosY(e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>width:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="width"
                  value={width}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWidth(e.target.value)
                  }
                />
              </td>
              <td>
                <label>height:</label>
              </td>
              <td>
                <input
                  className="short-number-input"
                  type="text"
                  name="height"
                  value={height}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHeight(e.target.value)
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <Picker
          onEmojiSelect={(data: any) => {
            setEmoji(data.native);
          }}
        ></Picker>
        <br />

        <div className="modal-button-container">
          {props.mode == T.NodeModalMode.ADD && (
            <button onClick={addNewNode}>[ add ]</button>
          )}
          {props.mode == T.NodeModalMode.EDIT && (
            <button onClick={updateSelectedNode}>[ save ]</button>
          )}
          {props.mode == T.NodeModalMode.EDIT && (
            <button onClick={deleteSelectedNode}>[ delete ]</button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              props.closeModal();
            }}
          >
            [ cancel ]
          </button>
        </div>
      </form>
    </div>
  );
};

export default NodeModal;
