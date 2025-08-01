# JCU Gym Backend API

JCU Gym의 백엔드 API 서버입니다. Node.js, Express, MySQL을 사용하여 구축되었습니다.

## 🚀 기능

- 사용자 등록 (학생/직원)
- 사용자 로그인/인증
- JWT 토큰 기반 인증
- 사용자 프로필 관리
- 비밀번호 변경
- 데이터 검증
- 보안 미들웨어

## 📋 요구사항

- Node.js (v14 이상)
- MySQL (v8.0 이상)
- npm 또는 yarn

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
cd Advanced-Software-Engineering/Back-end
npm install
```

### 2. 환경 변수 설정

`config.env` 파일을 편집하여 데이터베이스 설정을 구성하세요:

```env
# Server Configuration
PORT=8081
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jcu_gym_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. MySQL 데이터베이스 설정

1. MySQL 서버를 시작하세요
2. 데이터베이스를 생성하세요:

```sql
CREATE DATABASE jcu_gym_db;
```

### 4. 서버 실행

개발 모드:
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

## 📚 API 엔드포인트

### 인증 관련

#### 사용자 등록
```
POST /api/registration/createMembership
```

요청 본문:
```json
{
  "userRole": "student",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobileNumber": "+1234567890",
  "gender": "Male",
  "birthdate": "1990-01-01",
  "emergencyContactName": "Jane Doe",
  "emergencyContactNumber": "+1234567890",
  "termsAccepted": true,
  "membershipFee": 50.00,
  "paymentType": "monthly"
}
```

#### 로그인
```
POST /api/login
```

요청 본문:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 프로필 조회 (인증 필요)
```
GET /api/profile
```

헤더:
```
Authorization: Bearer <token>
```

#### 프로필 업데이트 (인증 필요)
```
PUT /api/profile
```

#### 비밀번호 변경 (인증 필요)
```
PUT /api/change-password
```

요청 본문:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## 🗄️ 데이터베이스 스키마

### users 테이블
- `id`: 기본 키
- `user_role`: 사용자 역할 (student/worker)
- `full_name`: 전체 이름
- `email`: 이메일 (고유)
- `password_hash`: 해시된 비밀번호
- `mobile_number`: 휴대폰 번호
- `gender`: 성별
- `birthdate`: 생년월일
- `emergency_contact_name`: 비상연락처 이름
- `emergency_contact_number`: 비상연락처 번호
- `terms_accepted`: 약관 동의 여부
- `membership_fee`: 회원비
- `payment_type`: 결제 유형
- `is_active`: 계정 활성화 상태
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## 🔒 보안 기능

- 비밀번호 해싱 (bcrypt)
- JWT 토큰 인증
- 입력 데이터 검증
- CORS 설정
- Helmet 보안 헤더
- SQL 인젝션 방지

## 🧪 테스트

```bash
npm test
```

## 📝 로그

서버는 Morgan을 사용하여 HTTP 요청을 로깅합니다. 개발 환경에서는 상세한 로그가 출력됩니다.

## 🚨 에러 처리

모든 API 응답은 일관된 형식을 따릅니다:

```json
{
  "code": 200,
  "msg": "Success message",
  "data": {}
}
```

에러 응답:
```json
{
  "code": 400,
  "msg": "Error message",
  "errors": []
}
```

## 🔧 개발

### 코드 구조
```
Back-end/
├── config/          # 데이터베이스 설정
├── controllers/     # 비즈니스 로직
├── middleware/      # 미들웨어 (인증, 검증)
├── models/          # 데이터 모델
├── routes/          # API 라우트
├── utils/           # 유틸리티 함수
├── server.js        # 메인 서버 파일
└── package.json     # 프로젝트 설정
```

### 환경 변수
- `PORT`: 서버 포트 (기본값: 8081)
- `NODE_ENV`: 환경 설정 (development/production)
- `DB_HOST`: 데이터베이스 호스트
- `DB_USER`: 데이터베이스 사용자
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `DB_NAME`: 데이터베이스 이름
- `JWT_SECRET`: JWT 시크릿 키
- `CORS_ORIGIN`: CORS 허용 오리진

## 📞 지원

문제가 발생하면 이슈를 등록하거나 개발팀에 문의하세요. 