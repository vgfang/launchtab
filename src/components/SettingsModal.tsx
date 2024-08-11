const SettingsModal = (props) => {
  return (
    <div>
      <button onClick={props.closeModal}>[close]</button>
      <h2>Settings</h2>
    </div>
  );
};

export default SettingsModal;
