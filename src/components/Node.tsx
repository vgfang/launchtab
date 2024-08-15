import '../stylesheets/Node.css';
import Link from './Link'
import * as T from '../types'

interface Props {
  node: T.Node;
  editMode: boolean;
  openLinkModal: (node: T.Node, mode: T.LinkModalMode) => void;
  setEditLinkUuid: any,
  openConfirmModal: any;
  deleteLinkForNode: any;
}

interface LinkListProps {
  nodeUuid: string;
  links: T.Link[];
  editMode: boolean;
  openEditLinkModal: (node: T.Node, mode: T.LinkModalMode) => void;
  setEditLinkUuid: any,
  openConfirmModal: any;
  deleteLinkForNode: any;
}

const Node = (props: Props) => {
  const node: T.Node = props.node
  // const emoji = props.node.emoji == "" ? "&#128511;" : props.node.emoji

  const openAddLinkModal = () => {
    props.openLinkModal(node, T.LinkModalMode.ADD)
  }

  const openEditLinkModal = () => {
    props.openLinkModal(node, T.LinkModalMode.EDIT)
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
              setEditLinkUuid={props.setEditLinkUuid}
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
      <div className="node-header">
        <h2>{props.node.label}</h2>
        <span className="section-keychord-hint">{node.keychord}</span>
        <LinkList
          nodeUuid={node.uuid}
          links={node.links}
          editMode={props.editMode}
          openEditLinkModal={openEditLinkModal}
          setEditLinkUuid={props.setEditLinkUuid}
          openConfirmModal={props.openConfirmModal}
          deleteLinkForNode={props.deleteLinkForNode}
        />
        {props.editMode &&
          <button onClick={openAddLinkModal}>
            ➕
          </button>
        }
      </div>
    </div>
  )
}

export default Node;

