import '../stylesheets/Node.css';
import Link from './Link'
import * as T from '../types'

interface Props {
  node: T.Node;
  editMode: boolean;
  openLinkModal: (node: T.Node, mode: T.LinkModalMode, link?: T.Link | undefined) => void;
  openConfirmModal: any;
  deleteLinkForNode: any;
  openNodeModal: (selectedNode: T.Node | undefined, mode: T.NodeModalMode) => void;
  closeNodeModal: any;
}

interface LinkListProps {
  nodeUuid: string;
  links: T.Link[];
  editMode: boolean;
  openEditLinkModal: (link: T.Link | undefined) => void;
  openConfirmModal: any;
  deleteLinkForNode: any;
}

const Node = (props: Props) => {
  const node: T.Node = props.node

  const openAddLinkModal = () => {
    props.openLinkModal(node, T.LinkModalMode.ADD)
  }

  const openEditLinkModal = (link: T.Link | undefined) => {
    props.openLinkModal(node, T.LinkModalMode.EDIT, link)
  }

  const openNodeModalForNode = () => {
    props.openNodeModal(props.node, T.NodeModalMode.EDIT)
  }

  const LinkList = (props: LinkListProps) => {
    return (
      <ul className="link-list">
        {props.links.map((link: T.Link, key: number) => {
          return (
            <Link
              key={key}
              link={link}
              editMode={props.editMode}
              openEditLinkModal={props.openEditLinkModal}
              nodeUuid={node.uuid}
              openConfirmModal={props.openConfirmModal}
              deleteLinkForNode={props.deleteLinkForNode}
            />
          )
        })
        }
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
      <div>
        <div className="node-header">
          <div className="node-label-keychord-container">
            <h2 className="node-label">🖥️{props.node.label}</h2>
            <span className="keychord-hint">{node.keychord}</span>
          </div>
          {props.editMode &&
            <button className='edit-btn-square' onClick={openNodeModalForNode}>
              ✎
            </button>}
        </div>
        <LinkList
          nodeUuid={node.uuid}
          links={node.links}
          editMode={props.editMode}
          openEditLinkModal={openEditLinkModal}
          openConfirmModal={props.openConfirmModal}
          deleteLinkForNode={props.deleteLinkForNode}
        />
        <br />
        {props.editMode &&
          <button onClick={openAddLinkModal} className='edit-btn-square'>
            +
          </button>
        }
      </div>
    </div >
  )
}

export default Node;

