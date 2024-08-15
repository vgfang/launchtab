import { useState } from "react";
import Modal from "react-modal";
import Node from "./Node.tsx";
import LinkModal from "./LinkModal.tsx";
import { v4 as uuidv4 } from 'uuid'
import * as T from '../types'

interface Props {
  nodes: T.Node[];
  setNodes: any;
  editMode: boolean;
  settings: T.Settings;
  openConfirmModal: any;
}

interface NodeListProps {
  nodes: T.Node[];
  openLinkModal: any;
  setNodes: any;
  editMode: boolean;
  setEditLinkUuid: any;
  openConfirmModal: any;
  deleteLinkForNode: any;
}

const Grid = (props: Props) => {
  // link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultNode, setModalDefaultNode] = useState<T.Node>({} as T.Node)
  const [modalMode, setModalMode] = useState<T.LinkModalMode>(T.LinkModalMode.ADD)
  const [modalEditLinkUuid, setModalEditLinkUuid] = useState('')

  const openLinkModal = (defaultNode: T.Node, mode: T.LinkModalMode) => {
    if (defaultNode) {
      setModalDefaultNode(defaultNode);
    }
    setModalMode(mode)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addLinkToNode = (nodeUuid: string, link: T.Link) => {
    link.uuid = uuidv4()
    props.setNodes((prevNodes: T.Node[]) => {
      const nodeForLink: T.Node | undefined = prevNodes.find((node: T.Node) => node.uuid === nodeUuid);
      if (nodeForLink) {
        nodeForLink.links.push(link)
      }
      return prevNodes
    })
  }

  const editLinkForNode = (nodeUuid: string, link: T.Link) => {
    props.setNodes((prevNodes: T.Node[]) => {
      const nodeForLink: T.Node | undefined = prevNodes.find((node: T.Node) => node.uuid === nodeUuid)
      if (nodeForLink) {
        const linkIndex: number = nodeForLink.links.findIndex((oldLink: T.Link) => oldLink.uuid === link.uuid)
        if (linkIndex > -1) {
          nodeForLink.links[linkIndex] = link
        }
      }
      return prevNodes
    })
  }

  const deleteLinkForNode = (nodeUuid: string, linkUuid: string) => {
    console.log(`delete link for node ${nodeUuid} ${linkUuid}`)
    props.setNodes((prevNodes: T.Node[]) => {
      const nodeForLink: T.Node | undefined = prevNodes.find((node: T.Node) => node.uuid === nodeUuid)
      if (nodeForLink) {
        const linkIndex: number = nodeForLink.links.findIndex((oldLink: T.Link) => oldLink.uuid === linkUuid)
        if (linkIndex > -1) {
          nodeForLink.links.splice(linkIndex, 1)
        }
      }
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
              openLinkModal={props.openLinkModal}
              setEditLinkUuid={props.setEditLinkUuid}
              openConfirmModal={props.openConfirmModal}
              deleteLinkForNode={props.deleteLinkForNode}
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
        <LinkModal nodes={props.nodes} setNodes={props.setNodes} mode={modalMode} addLinkToNode={addLinkToNode} editLinkForNode={editLinkForNode} closeModal={closeModal} defaultNode={modalDefaultNode} editLinkUuid={modalEditLinkUuid} />
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
          openLinkModal={openLinkModal}
          setEditLinkUuid={setModalEditLinkUuid}
          openConfirmModal={props.openConfirmModal}
          deleteLinkForNode={deleteLinkForNode}
        />
      </div>
    </>
  );
};

export default Grid;
