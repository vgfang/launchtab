import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Node from "./Node.tsx";
import AddLinkModal from "./AddLinkModal.tsx";
import {v4 as uuidv4} from 'uuid'
import * as T from './types'

const Grid = (props) => {
  // add link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAddLinkModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const addLinkToNode = (uuid: string, link: object) => {
    link.uuid = uuidv4()
    props.setNodes((prevNodes) => {
      prevNodes.filter((node: T.Node) => node.uuid === uuid);
    })
  }

  const NodeList = (props) => {
    return (
      <>
        {props.nodes.map((node, key) => {
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
    );
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add link:"
        appElement={document.getElementById('root')}
    >
        <AddLinkModal nodes={props.nodes} setNodes={props.setNodes} addLinkToNode={addLinkToNode} closeModal={closeModal}/>
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
