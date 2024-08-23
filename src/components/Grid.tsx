import { useState } from "react";
import Modal from "react-modal";
import Node from "./Node.tsx";
import LinkModal from "./LinkModal.tsx";
import NodeModal from "./NodeModal.tsx";
import { v4 as uuidv4 } from 'uuid'
import * as T from '../types'
import { GridUtils } from "../utils/GridUtils.tsx";
import '../stylesheets/Grid.css';

interface Props {
  nodes: T.Node[];
  size: { x: number; y: number; }
  setNodes: any;
  editMode: boolean;
  settings: T.Settings;
  openConfirmModal: any;
}

interface NodeListProps {
  nodes: T.Node[];
  size: { x: number; y: number }
  openLinkModal: any;
  setNodes: any;
  editMode: boolean;
  openConfirmModal: any;
  deleteLinkForNode: any;
  openNodeModal: any;
  closeNodeModal: any;
}

const Grid = (props: Props) => {
  // link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultNode, setModalDefaultNode] = useState<T.Node>({} as T.Node)
  const [modalMode, setModalMode] = useState<T.LinkModalMode>(T.LinkModalMode.ADD)
  const [modalEditLink, setModalEditLink] = useState<T.Link | undefined>(undefined)

  // node modal
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [nodeModalSelectedNode, setNodeModalSelectedNode] = useState<T.Node>({} as T.Node);

  const openNodeModal = (selectedNode: T.Node) => {
    setNodeModalSelectedNode(selectedNode)
    setIsNodeModalOpen(true)
  }

  const closeNodeModal = () => {
    setIsNodeModalOpen(false)
  }

  const openLinkModal = (defaultNode: T.Node, mode: T.LinkModalMode, editLink: T.Link | undefined = undefined) => {
    if (defaultNode) {
      setModalDefaultNode(defaultNode);
    }
    if (editLink) {
      setModalEditLink(editLink)
    }
    setModalMode(mode)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateNode = (newNode: T.Node) => {
    props.setNodes((prevNodes: T.Node[]) => {
      const nodeForEditIndex: number = prevNodes.findIndex((node: T.Node) => node.uuid === newNode.uuid);
      if (nodeForEditIndex > -1) {
        prevNodes[nodeForEditIndex] = newNode
      }
      return prevNodes
    })
  }

  const deleteNode = (delNodeUuid: string) => {
    props.setNodes((prevNodes: T.Node[]) => {
      const nodeForDelIndex: number = prevNodes.findIndex((node: T.Node) => node.uuid === delNodeUuid);
      if (nodeForDelIndex > -1) {
        prevNodes.splice(nodeForDelIndex, 1)
      }
      return prevNodes
    })
  }

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
    const emptyGridLocs = GridUtils.getEmptyGridLocations(nodes, props.size.x, props.size.y) || [];

    return (
      <>
        {nodes.map((node, key) => {
          // node component handles grid locations
          return (
            <Node
              key={key}
              node={node}
              editMode={props.editMode}
              openLinkModal={props.openLinkModal}
              openConfirmModal={props.openConfirmModal}
              deleteLinkForNode={props.deleteLinkForNode}
              openNodeModal={openNodeModal}
              closeNodeModal={closeNodeModal}
            />
          );
        })}
        {props.editMode && emptyGridLocs.map((xy: { x: number, y: number }, key: number) => {
          return (
            <button
              key={key}
              className="new-node-btn"
              style={{
                gridRow: xy.y,
                gridColumn: xy.x
              }}
            >
              [new node]
            </button>
          )
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
        <LinkModal nodes={props.nodes} setNodes={props.setNodes} mode={modalMode} addLinkToNode={addLinkToNode} editLinkForNode={editLinkForNode} closeModal={closeModal} defaultNode={modalDefaultNode} editLink={modalEditLink} />
      </Modal>
      <Modal
        isOpen={isNodeModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <NodeModal selectedNode={nodeModalSelectedNode} closeModal={closeNodeModal} updateNode={updateNode} deleteNode={deleteNode} openConfirmModal={props.openConfirmModal} />
      </Modal>
      <div
        id="grid"
      >
        <NodeList
          nodes={props.nodes}
          setNodes={props.setNodes}
          editMode={props.editMode}
          openLinkModal={openLinkModal}
          openConfirmModal={props.openConfirmModal}
          openNodeModal={openNodeModal}
          closeNodeModal={closeNodeModal}
          deleteLinkForNode={deleteLinkForNode}
          size={props.size}
        />
      </div>
    </>
  );
};

export default Grid;
