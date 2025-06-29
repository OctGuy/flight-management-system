import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Spinner, Modal } from 'react-bootstrap';
import { Ticket } from '../../models';
import { ticketService } from '../../services';

interface TicketCardProps {
  ticket: Ticket;
  onCancel?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getStatusVariant = (status?: number) => {
    switch (status) {
      case 1: return 'success'; // paid
      case 2: return 'warning'; // unpaid  
      case 3: return 'danger';  // cancelled
      default: return 'secondary';
    }
  };

  const getStatusText = (status?: number) => {
    switch (status) {
      case 1: return 'Đã xác nhận';
      case 2: return 'Chờ thanh toán';
      case 3: return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const canCancelTicket = () => {
    // Allow cancellation if status is confirmed (paid)
    return ticket.ticketStatus === 1;
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await ticketService.deleteTicket(ticket.ticketId!);
      setShowCancelModal(false);
      setShowSuccessModal(true);
      if (onCancel) onCancel();
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể hủy vé');
      setShowCancelModal(false);
      setShowErrorModal(true);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Card className="mb-3 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold">Vé #{ticket.ticketId}</span>
                {ticket.flightId && (
                  <Badge bg="light" text="dark" className="fs-6">
                    Chuyến bay {ticket.flightId}
                  </Badge>
                )}
              </div>
            </Col>
            <Col xs="auto">
              <Badge bg={getStatusVariant(ticket.ticketStatus)}>
                {getStatusText(ticket.ticketStatus)}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <div className="text-center">
                <small className="text-muted d-block">Hành khách</small>
                <strong>{ticket.passengerId || 'Chưa có'}</strong>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="text-center">
                <small className="text-muted d-block">Ghế ngồi</small>
                <strong>{ticket.seatNumber || 'Chưa phân'}</strong>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="text-center">
                <small className="text-muted d-block">Hạng vé</small>
                <strong>{ticket.ticketClassId || 'Chưa có'}</strong>
              </div>
            </Col>

            {ticket.fare && (
              <Col xs={12}>
                <div className="text-center border-top pt-3">
                  <small className="text-muted d-block">Giá vé</small>
                  <h5 className="text-primary mb-0">{ticket.fare.toLocaleString('vi-VN')} VND</h5>
                </div>
              </Col>
            )}

            {ticket.paymentTime && (
              <Col xs={12}>
                <div className="text-center">
                  <small className="text-muted">
                    Thanh toán xác nhận vào {new Date(ticket.paymentTime).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              </Col>
            )}
          </Row>

          {canCancelTicket() && (
            <div className="mt-3 d-flex justify-content-center">
              <Button 
                variant="outline-danger"
                onClick={handleCancelClick}
                disabled={cancelling}
                size="sm"
              >
                {cancelling ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang hủy...
                  </>
                ) : (
                  'Hủy vé'
                )}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Hủy vé
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-3">
            <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="text-center mb-3">Bạn có chắc chắn muốn hủy vé này không?</h5>
          <div className="p-3 bg-light rounded mb-3">
            <div className="text-center">
              <strong>Vé #{ticket.ticketId}</strong><br />
              <span className="text-muted">
                {ticket.seatNumber && `Ghế: ${ticket.seatNumber}`}
                {ticket.fare && ` - ${ticket.fare.toLocaleString('vi-VN')} VND`}
              </span>
            </div>
          </div>
          <p className="text-center text-muted mb-0">
            Hành động này không thể hoàn tác. Vé sẽ bị hủy vĩnh viễn.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
            disabled={cancelling}
          >
            Giữ vé
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang hủy...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Có, hủy vé
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-check-circle me-2"></i>
            Thành công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3">
            <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="mb-3">Hủy vé thành công!</h5>
          <p className="text-muted mb-0">
            Vé #{ticket.ticketId} đã được hủy thành công.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => setShowSuccessModal(false)}
          >
            <i className="bi bi-check me-2"></i>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Lỗi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3">
            <i className="bi bi-x-circle text-danger" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="mb-3">Không thể hủy vé</h5>
          <p className="text-muted mb-0">
            {errorMessage}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowErrorModal(false)}
          >
            <i className="bi bi-x me-2"></i>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TicketCard;
