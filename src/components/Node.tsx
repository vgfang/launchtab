import React, {useState, useEffect} from 'react';
import '../stylesheets/Node.css';
import * as T from './types'

const Node = (props) => { 
  const node: T.Node = props.node
  // const emoji = props.node.emoji == "" ? "&#128511;" : props.node.emoji

  const openAddLinkModal = () => {
    props.openAddLinkModal(node) 
  }

  const LinkList = (props) => {
    return (
    <ul className="link-list">
      {props.links.map((link, key) => {
          return (
            <li key={key}>
            <a href={link.url}>
              {link.label}
            </a>
            </li>
          )
      })}
    </ul>
    )
  }
  return (
    <div 
      className="node"
      style={{
        gridRow: `${node.posY} / ${node.posY + node.height}`,
        gridColumn: `${node.posX} / ${node.posX + node.width}`,
      }}
    >
      <div className="node-header">
        <h2>{props.node.label}</h2>
        <span className="section-keychord-hint">{props.node.keychord}</span>
        <LinkList links={props.node.links}/>
        {props.editMode && 
            <button onClick={openAddLinkModal}>
              [ + ]
            </button>
        }
        </div>
    </div>
  )
}

export default Node;

