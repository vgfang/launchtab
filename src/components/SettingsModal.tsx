interface Props {
  closeModal: any
}

const SettingsModal = (props: Props) => {
  return (
    <div>
      <button onClick={props.closeModal}>[close]</button>
      <h2>⚙</h2>
    </div>
  );
};

export default SettingsModal;
