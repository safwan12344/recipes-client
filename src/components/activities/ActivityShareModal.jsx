import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

function ActivityShareModal(props) {
  return (
    <Modal {...props} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>Share Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TelegramShareButton url={window.location.href} title={props.activity.name}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <WhatsappShareButton title={props.activity.name} url={window.location.href}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <EmailShareButton url={window.location.href}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      </Modal.Body>
    </Modal>
  );
}

ActivityShareModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
};

export default ActivityShareModal;
