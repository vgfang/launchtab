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

  const parseUrlForUse = (url: string) => {
    const hasPrefix = /^(http:\/\/|https:\/\/)/i.test(url);
    if (hasPrefix) {
      return url;
    }
    return `https://${url}`;
  }

  const handleDeleteLink = () => {
    console.log("handle delete link")
    const description = `Are you sure you want to delete link:\n ${props.link.label}(${props.link.url})?`;
    props.openConfirmModal(() => props.deleteLinkForNode(
      props.nodeUuid,
      props.link.uuid
    ), description)
  }

  return (
    <li>
      <span>{'> '}</span>
      <a
        href={parseUrlForUse(props.link.url)}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => props.editMode && e.preventDefault()}
      >
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
