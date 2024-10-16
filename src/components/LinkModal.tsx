import { useState, useEffect } from "react";
import * as T from "../types";

interface Props {
  closeModal: () => void;
  addLinkToNode: any;
  editLinkForNode: any;
  nodes: T.Node[];
  defaultNode: T.Node;
  setNodes: any;
  mode: T.LinkModalMode;
  editLink?: T.Link | undefined;
}

const LinkModal = (props: Props) => {
  // form inputs
  const [label, setLabel] = useState("");
  const [keychord, setKeychord] = useState("");
  const [url, setUrl] = useState("");
  // const [selectedNode, setSelectedNode] = useState(props.defaultNode)
  const selectedNode = props.defaultNode;

  useEffect(() => {
    // if edit modal set values
    if (props.mode === T.LinkModalMode.EDIT && props.editLink) {
      setLabel(props.editLink.label);
      setKeychord(props.editLink.keychord);
      setUrl(props.editLink.url);
    }
  }, [props.mode, props.editLink]);

  // uses the node uuid to add the link to the link list
  const addLinkToNode = (nodeUuid: string, link: T.Link) => {
    props.addLinkToNode(nodeUuid, link);
  };
  // uses the node uuid to find and edit the link in link list in place
  const editLinkForNode = (nodeUuid: string, link: T.Link) => {
    props.editLinkForNode(nodeUuid, link);
  };

  const addLinkBtnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    addLinkToNode(selectedNode.uuid, {
      label: label,
      url: url,
      keychord: keychord,
    });
    props.closeModal();
  };

  const editLinkBtnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    if (!props.editLink) {
      alert("Error: problem with link passing");
      return;
    }
    editLinkForNode(selectedNode.uuid, {
      uuid: props.editLink.uuid,
      label: label,
      url: url,
      keychord: keychord,
    });
    props.closeModal();
  };

  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>): void => {
    if (props.mode === T.LinkModalMode.ADD) {
      addLinkBtnClick(event);
    } else if (props.mode === T.LinkModalMode.EDIT) {
      editLinkBtnClick(event);
    } else {
      alert("Error: link modal mode error");
    }
  };

  return (
    <div>
      <h2 className="modal-title">
        {props.mode === T.LinkModalMode.ADD && "➕ add link:"}
        {props.mode === T.LinkModalMode.EDIT && "✏️  edit link:"}
      </h2>
      <form id="link-modal-form">
        <table>
          <tbody>
            <tr>
              <td>
                <label>label: </label>
              </td>
              <td>
                <input
                  className="long-text-input"
                  type="text"
                  name="label"
                  value={label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLabel(e.target.value)
                  }
                ></input>
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <label>url: </label>
              </td>
              <td>
                <input
                  className="long-text-input"
                  type="text"
                  name="url"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUrl(e.target.value)
                  }
                ></input>
                <br />
              </td>
            </tr>
            <tr>
              <td>
                <label>keychord: </label>
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
                ></input>
                <br />
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <div className="modal-button-container">
          <button
            type="submit"
            form="link-modal-form"
            onClick={handleLinkFormSubmit}
          >
            {props.mode === T.LinkModalMode.ADD && "[ add ]"}
            {props.mode === T.LinkModalMode.EDIT && "[ save ]"}
          </button>
          <button onClick={props.closeModal}>[ cancel ]</button>
        </div>
      </form>
    </div>
  );
};

export default LinkModal;
