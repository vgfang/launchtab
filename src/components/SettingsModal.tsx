interface Props {
  closeModal: any
}

const SettingsModal = (props: Props) => {

  const handleLinkFormSubmit = () => {

  }

  return (
    <div>
      <button onClick={props.closeModal}>[close]</button>
      <h2>⚙</h2>

      <form>
        <label>Grid Size: </label>
        <label>x: </label>
        <input type="text" />
        <label>y: </label>
        <input type="text" /><br />

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
          [ save setttings ]
        </button>
      </form>
    </div>
  );
};

export default SettingsModal;
