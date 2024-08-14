import { useState } from "react";
import Modal from "react-modal";
import Node from "./Node.tsx";
import AddLinkModal from "./AddLinkModal.tsx";
import { v4 as uuidv4 } from 'uuid'
import * as T from '../types'

interface Props {
  nodes: T.Node[];
  setNodes: any;
  editMode: boolean;
  settings: T.Settings;
  openAddLinkModal: any;
}

interface NodeListProps {
  nodes: T.Node[];
  openAddLinkModal: any;
  setNodes: any;
  editMode: boolean;
}

const Grid = (props: Props) => {
  // add link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultNode, setModalDefaultNode] = useState<T.Node>({} as T.Node)
  const openAddLinkModal = (defaultNode: T.Node) => {
    if (defaultNode) {
      setModalDefaultNode(defaultNode);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addLinkToNode = (uuid: string, link: T.Link) => {
    link.uuid = uuidv4()
    props.setNodes((prevNodes: T.Node[]) => {
      console.log(prevNodes)
      console.log(uuid)
      const nodeForLink: T.Node = prevNodes.filter((node: T.Node) => node.uuid === uuid)[0];
      if (nodeForLink) {
        nodeForLink.links.push(link)
      }
      console.log(nodeForLink)
      return prevNodes
    })
  }

  const NodeList = (props: NodeListProps) => {
    const nodes = props?.nodes || [];
    return (
      <>
        {nodes.map((node, key) => {
          return (
            <Node
              key={key}
              node={node}
              editMode={props.editMode}
              openAddLinkModal={props.openAddLinkModal}
            />
          );
        })}
      </>
    )
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <AddLinkModal nodes={props.nodes} setNodes={props.setNodes} addLinkToNode={addLinkToNode} closeModal={closeModal} defaultNode={modalDefaultNode} />
      </Modal>
      <div
        id="grid"
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(${props.settings.gridX}, 1fr)`,
          gridTemplateRows: `repeat(${props.settings.gridY}, 1fr)`,
          gridGap: "20px",
        }}
      >
        <NodeList
          nodes={props.nodes}
          setNodes={props.setNodes}
          editMode={props.editMode}
          openAddLinkModal={openAddLinkModal}
        />
      </div>
    </>
  );
};

export default Grid;
