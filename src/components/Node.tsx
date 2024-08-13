import '../stylesheets/Node.css';
import Link from './Link'
import * as T from '../types'

interface Props {
  node: T.Node;
  editMode: boolean;
  openAddLinkModal: (node: T.Node) => void;
}

interface LinkListProps {
  links: T.Link[];
  editMode: boolean;
}

const Node = (props: Props) => {
  const node: T.Node = props.node
  // const emoji = props.node.emoji == "" ? "&#128511;" : props.node.emoji

  const openAddLinkModal = () => {
    props.openAddLinkModal(node)
  }

  const LinkList = (props: LinkListProps) => {
    return (
      <ul className="link-list">
        {props.links.map((link: T.Link, key: number) => {
          return (
            <Link key={key} link={link} editMode={props.editMode} />
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
        <span className="section-keychord-hint">{props.node.keychord}</span>
        <LinkList links={props.node.links} editMode={props.editMode} />
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

