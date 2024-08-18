import * as T from '../types'

interface Props {
  selectedNode: T.Node;
  closeModal: any;
}

const NodeModal = (props: Props) => {
  return (
    <>
      <h2>Node: {props.selectedNode.label} </h2>
    </>
  )
}

export default NodeModal
