import * as T from '../types'

interface Props {
  link: T.Link;
  editMode: boolean;
  key: number;
  openEditLinkModal: any;
  nodeUuid: string;
}

const Link = (props: Props) => {
  const openEditLinkModal = () => {
    const newLink = props.link
    props.openEditLinkModal(props.nodeUuid, newLink)
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
          <button className="link-delete-button">
            ✕
          </button>
        </div>
      }
    </li>
  )
}

export default Link
