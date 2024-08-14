import { useState } from 'react';
import * as T from '../types'


interface Props {
  closeModal: () => void;
  addLinkToNode: any;
  nodes: T.Node[];
  defaultNode: T.Node;
  setNodes: any;
}

interface NodeSelectDropdownProps {
  nodes: T.Node[];
  defaultNode: T.Node;
  setSelectedNode: any;
}

const AddLinkModal = (props: Props) => {
  // form inputs
  const [label, setLabel] = useState('')
  const [keychord, setKeychord] = useState('')
  const [url, setUrl] = useState('')
  const [selectedNode, setSelectedNode] = useState(props.defaultNode)

  // uses the node uuid to add the link to the link list
  const addLinkToNode = (uuid: string, link: T.Link) => {
    props.addLinkToNode(uuid, link);
  }

  const addLinkBtnClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault()
    addLinkToNode(selectedNode?.uuid || "", {
      label: label,
      url: url,
      keychord: keychord
    })
  }

  const NodeSelectDropdown = (props: NodeSelectDropdownProps) => {
    const nodes = props?.nodes || [];
    const defaultNode = props?.defaultNode || {};
    const selectedNode: T.Node | undefined = nodes.find((node: T.Node) => node.uuid === defaultNode.uuid) as T.Node | undefined

    const findNodeViaUUID = (uuid: string): T.Node | undefined => {
      return nodes.find((node: T.Node) => node.uuid == uuid)
    }

    let value = undefined;
    if (selectedNode !== undefined) {
      value = selectedNode.uuid;
    }
    return (
      <select name="node-select" defaultValue={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.setSelectedNode(findNodeViaUUID(e.target.value))}>
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
      <h2>Add Link</h2>
      <form id="add-link-form">
        <label>node: </label>
        <NodeSelectDropdown nodes={props.nodes} defaultNode={props.defaultNode} setSelectedNode={setSelectedNode} />
        <br />
        <label>label: </label>
        <input type="text" name="label" value={label} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value))}></input><br />
        <label>keystroke: </label>
        <input type="text" name="keystroke" onChange={((e: React.ChangeEvent<HTMLInputElement>) => setKeychord(e.target.value))}></input><br />
        <label>url: </label>
        <input type="text" name="url" onChange={((e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value))}></input><br />
        <button type="submit" form="add-link-form" onClick={addLinkBtnClick}>[ add link ]</button>
      </form>
    </div >
  );
};

export default AddLinkModal;
