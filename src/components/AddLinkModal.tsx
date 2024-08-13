import * as T from '../types'

interface Props {
  closeModal: () => void;
  addLinkToNode: (uuid: string, Link: T.Link) => void;
  nodes: T.Node[];
  defaultNode?: T.Node;
}

interface NodeSelectDropdownProps {
  nodes: T.Node[];
}

const AddLinkModal = (props: Props) => {
  // uses the node uuid to add the link to the link list
  const addLinkToNode = (uuid: string, link: T.Link) => {
    props.addLinkToNode(uuid, link);
  }

  const addLinkBtnClick = (event: MouseEvent): void => {
    event.preventDefault()
    addLinkToNode("03b3809e-7d91-48c8-b6d4-d1365a054dff", {
      label: "test",
      url: "https://google.ccom",
      keychord: "asd"
    })
  }

  const NodeSelectDropdown = (props: NodeSelectDropdownProps) => {
    const selectedNode: T.Node = props.nodes.find((node: T.Node) => 'defaultNode' in props && node.uuid === props.defaultNode['uuid'])
    let value = ""
    if (selectedNode !== undefined) {
      value = selectedNode.uuid;
    }
    return (
      <select name="node-select" defaultValue={value}>
        {
          props.nodes.map((node: T.Node, key: number) => {
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
        <NodeSelectDropdown nodes={props.nodes} />
        <br />
        <label>label: </label>
        <input type="text" name="label"></input><br />
        <label>keystroke: </label>
        <input type="text" name="keystroke"></input><br />
        <label>url: </label>
        <input type="text" name="url"></input><br />
        <button type="submit" form="add-link-form" onClick={addLinkBtnClick}>[ add link ]</button>
      </form>
    </div>
  );
};

export default AddLinkModal;
