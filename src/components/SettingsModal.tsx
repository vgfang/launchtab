interface Props {
  closeModal: any
}

const SettingsModal = (props: Props) => {

  const handleLinkFormSubmit = () => {

  }

  return (
    <div>
      <h2>settings:</h2>

      <form>

        <label>Grid Size: </label>
        <label>x: </label>
        <input type="text" />
        <label>y: </label>
        <input type="text" /><br />

        <label>Grid Padding: </label>
        <label>Grid Gap: </label>
        <label>Grid Width: </label>
        <label>Grid Radius: </label>
        <br />

        <label>Colors:</label>
        <table>
          <tbody>
            <tr>
              <td>
                <label>BG Color:</label>
              </td>
              <td>
                <input type="color" />
              </td>
            </tr>
            <tr>
              <td>
                <label>FG Color:</label>
              </td>
              <td>
                <input type="color" />
              </td>
            </tr>
            <tr>
              <td>
                <label>Text Color:</label>
              </td>
              <td>
                <label><input type="color" /></label>
              </td>
            </tr>
            <tr>
              <td>
                <label>Accent Color:</label>
              </td>
              <td>
                <label><input type="color" /></label>
              </td>
            </tr>
          </tbody>
        </table>

        <button onClick={props.closeModal}>[ cancel ]</button>
        <button type="submit" form="confirm-modal-form" onClick={handleLinkFormSubmit}>
          [ save ]
        </button>
      </form>
    </div>
  );
};

export default SettingsModal;
