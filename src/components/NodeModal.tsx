import { useEffect, useState } from 'react'
import * as T from '../types'
import { v4 as uuidv4 } from 'uuid'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import '../stylesheets/Modal.css'

interface Props {
  selectedNode?: T.Node;
  closeModal: any;
  addNode: any;
  updateNode: any;
  deleteNode: any;
  openConfirmModal: any;
  mode: T.NodeModalMode;
}

const NodeModal = (props: Props) => {
  const [label, setLabel] = useState('')
  const [keychord, setKeychord] = useState('')
  const [emoji, setEmoji] = useState('')
  const [posX, setPosX] = useState(1)
  const [posY, setPosY] = useState(1)
  const [width, setWidth] = useState(1)
  const [height, setHeight] = useState(1)

  useEffect(() => {
    // if edit modal set values
    if (props.mode === T.NodeModalMode.EDIT && props.selectedNode) {
      setLabel(props.selectedNode.label)
      setKeychord(props.selectedNode.keychord)
      setEmoji(props.selectedNode.emoji)
      setPosX(props.selectedNode.posX)
      setPosY(props.selectedNode.posY)
      setWidth(props.selectedNode.width)
      setHeight(props.selectedNode.height)
    }
  }, [props.mode, props.selectedNode]);

  const addNewNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const newNode: T.Node = {
      uuid: uuidv4(),
      label: label,
      keychord: keychord,
      emoji: emoji,
      posX: posX,
      posY: posY,
      width: width,
      height: height,
      links: []
    }
    // TODO: Node Specific Input Validation
    props.addNode(newNode)
    props.closeModal()
  }

  const updateSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (props.selectedNode) {
      const newNode: T.Node = {
        uuid: props.selectedNode.uuid,
        label: label,
        keychord: keychord,
        emoji: emoji,
        posX: posX,
        posY: posY,
        width: width,
        height: height,
        links: props.selectedNode.links
      }
      props.updateNode(newNode)
    }
    props.closeModal()
  }

  const deleteSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    if (props.selectedNode) {
      const desc = `confirm deletion of node: ${props.selectedNode.emoji} ${props.selectedNode.label}`
      props.openConfirmModal(() => {
        if (props.selectedNode) {
          props.deleteNode(props.selectedNode.uuid);
          props.closeModal()
        }
      }, desc)
    }
  }

  return (
    <div>
      <h2 className="modal-title">
        {props.mode == T.NodeModalMode.EDIT && '✏️  edit node: '}
        {props.mode == T.NodeModalMode.ADD && '➕ add new node: '}
        {props.selectedNode && props.selectedNode.emoji} {props.selectedNode && props.selectedNode.label}
      </h2>
      <form>
        <table>
          <tbody>
            <tr>
              <td><label>label:</label></td>
              <td colSpan={3}><input type='text' className='fill-text-input' name='label' value={label} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value))} /></td>
              <td rowSpan={4}>
              </td>
            </tr>
            <tr>
              <td><label>keychord:</label></td>
              <td><input className='short-number-input' type='text' name='keychord' value={keychord} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setKeychord(e.target.value))} /></td>
              <td><label>emoji:</label></td>
              <td><input maxLength='1' className='short-number-input' type='text' name='emoji' value={emoji} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setEmoji(e.target.value))} /></td>
            </tr>
            <tr>
              <td><label>posX:</label></td>
              <td><input className='short-number-input' type='text' name='posX' value={posX} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setPosX(parseInt(e.target.value)))} /></td>
              <td><label>posY:</label></td>
              <td><input className='short-number-input' type='text' name='posY' value={posY} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setPosY(parseInt(e.target.value)))} /></td>
            </tr>
            <tr>
              <td><label>width:</label></td>
              <td><input className='short-number-input' type='text' name='width' value={width} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setWidth(parseInt(e.target.value)))} /></td>
              <td><label>height:</label></td>
              <td><input className='short-number-input' type='text' name='height' value={height} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setHeight(parseInt(e.target.value)))} /></td>
            </tr>
          </tbody>
        </table>
        <EmojiPicker onEmojiClick={(emojiData: EmojiClickData) => { setEmoji(emojiData.emoji) }} />
        <br />

        <div className="modal-button-container">
          {props.mode == T.NodeModalMode.ADD && <button onClick={addNewNode}>[ add ]</button>}
          {props.mode == T.NodeModalMode.EDIT && <button onClick={updateSelectedNode}>[ save ]</button>}
          {props.mode == T.NodeModalMode.EDIT && <button onClick={deleteSelectedNode}>[ delete ]</button>}
          <button onClick={(e) => { e.preventDefault(); props.closeModal() }}>[ cancel ]</button>
        </div>
      </form>
    </div>
  )
}

export default NodeModal
