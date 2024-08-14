import { useState } from 'react';
import * as T from '../types'

interface Props {
  closeModal: () => void;
  addLinkToNode: any;
  editLinkForNode: any;
  nodes: T.Node[];
  defaultNode: T.Node;
  setNodes: any;
  mode: T.LinkModalMode;
  editLinkUuid?: string;
}

interface NodeSelectDropdownProps {
  nodes: T.Node[];
  setSelectedNode: any;
  selectedNode: T.Node;
}

const LinkModal = (props: Props) => {
  // form inputs
  const [label, setLabel] = useState('')
  const [keychord, setKeychord] = useState('')
  const [url, setUrl] = useState('')
  const [selectedNode, setSelectedNode] = useState(props.defaultNode)

  // uses the node uuid to add the link to the link list
  const addLinkToNode = (nodeUuid: string, link: T.Link) => {
    props.addLinkToNode(nodeUuid, link);
  }
  // uses the node uuid to find and edit the link in link list in place
  const editLinkForNode = (nodeUuid: string, link: T.Link) => {
    props.editLinkForNode(nodeUuid, link);
  }

  const addLinkBtnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault()
    addLinkToNode(selectedNode.uuid, {
      label: label,
      url: url,
      keychord: keychord
    })
    props.closeModal()
  }

  const editLinkBtnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault()
    if (!props.editLinkUuid) {
      alert("problem with linkuuid passing")
      return
    }
    editLinkForNode(selectedNode.uuid, {
      uuid: props.editLinkUuid,
      label: label,
      url: url,
      keychord: keychord
    })
    props.closeModal()
  }

  const handleLinkFormSubmit = (event: React.MouseEvent<HTMLElement>): void => {
    if (props.mode === T.LinkModalMode.ADD) {
      addLinkBtnClick(event)
    } else if (props.mode === T.LinkModalMode.EDIT) {
      editLinkBtnClick(event)
    } else {
      alert('link modal mode error')
    }
  }

  const NodeSelectDropdown = (props: NodeSelectDropdownProps) => {
    const nodes = props?.nodes || [];
    const selectOnChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => props.setSelectedNode(findNodeViaUUID(e.target.value))
    const selectedNode = props.selectedNode
    const findNodeViaUUID = (uuid: string): T.Node | undefined => {
      return nodes.find((node: T.Node) => node.uuid == uuid)
    }

    let value = undefined;
    if (selectedNode !== undefined) {
      value = selectedNode.uuid;
    }
    return (
      <select name="node-select" value={value} onChange={selectOnChangeHandler}>
        {
          nodes.map((node: T.Node, key: number) => {
            return (
              <option key={key} value={node.uuid}>
                {node.label}
              </option>
            )
          })
        }
      </select>
    )
  }

  return (
    <div>
      <button onClick={props.closeModal}>[close]</button>
      {props.mode === T.LinkModalMode.ADD && <h2>Add Link</h2>}
      {props.mode === T.LinkModalMode.EDIT && <h2>Edit Link</h2>}
      <form id="link-modal-form">
        <label>node: </label>
        <NodeSelectDropdown nodes={props.nodes} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
        <br />
        <label>label: </label>
        <input type="text" name="label" value={label} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value))}></input><br />
        <label>keystroke: </label>
        <input type="text" name="keystroke" onChange={((e: React.ChangeEvent<HTMLInputElement>) => setKeychord(e.target.value))}></input><br />
        <label>url: </label>
        <input type="text" name="url" onChange={((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value))}></input><br />
        <button type="submit" form="link-modal-form" onClick={handleLinkFormSubmit}>
          {props.mode === T.LinkModalMode.ADD && '[ add link ]'}
          {props.mode === T.LinkModalMode.EDIT && '[ save changes ]'}
        </button>
      </form>
    </div >
  );
};

export default LinkModal;