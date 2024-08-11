const AddLinkModal = (props) => {
  // uses the node uuid to add the link to the link list
  const addLinkToNode = (uuid: string, link: object) => {
    props.addLinkToNode(uuid, link);
  }

  const addLinkBtnClick = (event) => {
    event.preventDefault()
    addLinkToNode("03b3809e-7d91-48c8-b6d4-d1365a054dff", {
      label: "test",
      url: "https://google.ccom",
      keystroke: "asd"
    })
  }

  const NodeSelectDropdown = () => {
    return (
      <select name="node-select">
        {
          props.nodes.map((node, key) => {
            return(
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
        <NodeSelectDropdown/>
          <br/>
        <label>label: </label>
        <input type="text" name="label"></input><br/>
        <label>keystroke: </label>
        <input type="text" name="keystroke"></input><br/>
        <label>url: </label>
        <input type="text" name="url"></input><br/>
        <button type="submit" form="add-link-form" onClick={addLinkBtnClick}>[ add link ]</button>
      </form>
    </div>
  );
};

export default AddLinkModal;
