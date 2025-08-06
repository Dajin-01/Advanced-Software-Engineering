const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

// 모든 예약 조회 (로그인 필요)
router.get('/', authenticateToken, bookingController.getBookings);
// 예약 생성 (로그인 필요)
router.post('/', authenticateToken, bookingController.createBooking);
// 예약 삭제 (로그인 필요)
router.delete('/:id', authenticateToken, bookingController.deleteBooking);

module.exports = router;