import { useState } from 'react'
import * as T from '../types'

interface Props {
  selectedNode: T.Node;
  closeModal: any;
  updateNode: any;
  deleteNode: any;
  openConfirmModal: any;
}

const NodeModal = (props: Props) => {
  const [label, setLabel] = useState(props.selectedNode.label)
  const [keychord, setKeychord] = useState(props.selectedNode.keychord)
  const [emoji, setEmoji] = useState(props.selectedNode.emoji)
  const [posX, setPosX] = useState(props.selectedNode.posX)
  const [posY, setPosY] = useState(props.selectedNode.posY)
  const [width, setWidth] = useState(props.selectedNode.width)
  const [height, setHeight] = useState(props.selectedNode.height)

  const updateSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
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
    props.closeModal()
  }

  const deleteSelectedNode = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const desc = `confirm deletion of node ${props.selectedNode.label}`
    props.openConfirmModal(() => { props.deleteNode(props.selectedNode.uuid); props.closeModal() }, desc)
  }

  return (
    <div>
      <h2>Edit Node: {props.selectedNode.emoji} {props.selectedNode.label}</h2>
      <form>
        <table>
          <tbody>
            <tr>
              <td><label>label:</label></td>
              <td colSpan={3}><input type='text' name='label' value={label} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value))} /></td>
            </tr>
            <tr>
              <td><label>keychord:</label></td>
              <td><input type='text' name='keychord' value={keychord} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setKeychord(e.target.value))} /></td>
              <td><label>emoji:</label></td>
              <td><input type='text' name='emoji' value={emoji} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setEmoji(e.target.value))} /></td>
            </tr>
            <tr>
              <td><label>posX:</label></td>
              <td><input type='text' name='posX' value={posX} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setPosX(parseInt(e.target.value)))} /></td>
              <td><label>posY:</label></td>
              <td><input type='text' name='posY' value={posY} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setPosY(parseInt(e.target.value)))} /></td>
            </tr>
            <tr>
              <td><label>width:</label></td>
              <td><input type='text' name='width' value={width} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setWidth(parseInt(e.target.value)))} /></td>
              <td><label>height:</label></td>
              <td><input type='text' name='height' value={height} onChange={((e: React.ChangeEvent<HTMLInputElement>) => setHeight(parseInt(e.target.value)))} /></td>
            </tr>
          </tbody>
        </table>
        <br />
        <button onClick={updateSelectedNode}>[ save ]</button>
        <button onClick={deleteSelectedNode}>[ delete ]</button>
        <button onClick={(e) => { e.preventDefault(); props.closeModal() }}>[ cancel ]</button>
      </form>
    </div>
  )
}

export default NodeModal
