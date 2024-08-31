import * as T from '../types'
import '../stylesheets/Link.css';
import { DraggableProvided } from '@hello-pangea/dnd';

interface Props {
  link: T.Link;
  editMode: boolean;
  key: number;
  openEditLinkModal: any;
  nodeUuid: string;
  openConfirmModal: any;
  deleteLinkForNode: any;
  provided: DraggableProvided;
}

const Link = (props: Props) => {
  const openEditLinkModal = () => {
    // need to set modal state
    props.openEditLinkModal(props.link)
  }

  const parseUrlForUse = (url: string) => {
    const hasPrefix = /^(http:\/\/|https:\/\/)/i.test(url);
    if (hasPrefix) {
      return url;
    }
    return `https://${url}`;
  }

  const handleDeleteLink = () => {
    const description = `Are you sure you want to delete link:\n ${props.link.label}(${props.link.url})?`;
    props.openConfirmModal(() => props.deleteLinkForNode(
      props.nodeUuid,
      props.link.uuid
    ), description)
  }

  return (
    <li className="link-container"
      draggable={props.editMode}
      ref={props.provided.innerRef}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
    >
      <div className="link-label-keychord-container">
        <span>{!props.editMode && '> '}{props.editMode && '⋮ '}</span>
        <a
          className="link-a"
          href={parseUrlForUse(props.link.url)}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => props.editMode && e.preventDefault()}
        >
          {props.link.label}
        </a>
        <span className="keychord-hint">
          {props.link.keychord}
        </span>
      </div>
      {
        props.editMode &&
        <div className="link-edit-buttons-container">
          <button onClick={openEditLinkModal} className="edit-btn-square">
            ✎
          </button>
          <button onClick={handleDeleteLink} className="edit-btn-square">
            ✕
          </button>
        </div>
      }
    </li >
  )
}

export default Link
