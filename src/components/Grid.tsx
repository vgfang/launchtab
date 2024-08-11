import React, {useState, useEffect} from 'react';
import Node from './Node.tsx'
import Modal from 'react-modal';
import AddLinkModal from './AddLinkModal.tsx'

const Grid = (props) => { 
  // add link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openAddLinkModal = () => {
    setIsModalOpen(true)
  }
  const afterOpenModal = () => {
  }
  const closeModal = ()=> {
    setIsModalOpen(false)
  }

  const NodeList = (props) => {
    return (
    <>
      {props.nodes.map((node, key) => {
        return <Node key={key} node={node} editMode={props.editMode} openAddLinkModal={props.openAddLinkModal}/>
      })}
    </>
    )
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        contentLabel="Add link:"
      >
        <AddLinkModal/>
      </Modal>
    <div
      id="grid"
      style={{
        display: `grid`,
        gridTemplateColumns: `repeat(${props.settings.gridX}, 1fr)`,
        gridTemplateRows: `repeat(${props.settings.gridY}, 1fr)`,
        gridGap: '20px',
      }}
    >
      <NodeList nodes={props.nodes} setNodes={props.setNodes} editMode={props.editMode} openAddLinkModal={openAddLinkModal}/>
    </div>
    </>
  )
}

export default Grid;

