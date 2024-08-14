import * as T from '../types'

interface Props {
  link: T.Link;
  editMode: boolean;
  key: number;
}

const Link = (props: Props) => {
  return (
    <li>
      <a href={props.link.url}>
        {props.link.label}
      </a>
      {props.editMode &&
        <div style={{ 'display': 'flex', 'flexDirection': 'row' }}>
          <button className="link-edit-button">
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
