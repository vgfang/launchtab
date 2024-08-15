import * as T from '../types'

interface Props {
  link: T.Link;
  editMode: boolean;
  key: number;
  openEditLinkModal: any;
  nodeUuid: string;
  setEditLinkUuid: any;
  openConfirmModal: any;
  deleteLinkForNode: any;
}

const Link = (props: Props) => {
  const openEditLinkModal = () => {
    const newLink = props.link
    // need to set modal state
    props.setEditLinkUuid(props.link.uuid)
    props.openEditLinkModal(props.nodeUuid, newLink)
  }

  const handleDeleteLink = () => {
    console.log("handle delete link")
    const description = `Are you sure you want to delete link:\n ${props.link.label}(${props.link.url})?`;
    // props.openConfirmModal(props.deleteLinkForNode.bind(
    //   null,
    //   props.nodeUuid,
    //   props.link.uuid
    // ), description)
    props.openConfirmModal(() => { console.log("hey") }, description)
  }

  return (
    <li>
      <a href={props.link.url}>
        {props.link.label}
      </a>
      {props.editMode &&
        <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
          <button onClick={openEditLinkModal} className="link-edit-button">
            ✎
          </button>
          <button onClick={handleDeleteLink} className="link-delete-button">
            ✕
          </button>
        </div>
      }
    </li>
  )
}

export default Link
