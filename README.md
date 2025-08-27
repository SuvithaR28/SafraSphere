# SafraSphere - Futuristic EV Charging Web Application

🚗⚡ **SafraSphere** is a next-generation EV charging web application that provides a premium, futuristic charging experience with QR code authentication, location verification, and secure payment processing.

## ✨ Features

- **🎨 Futuristic UI/UX**: Neon gradients, glowing animations, and premium design
- **📱 QR Code Scanning**: Camera-based QR code authentication
- **📍 Location Verification**: GPS-based proximity checking
- **⚡ Real-time Charging**: Live battery percentage, kWh consumption, and cost tracking
- **💳 Secure Payments**: UPI integration with digital receipts
- **🔐 JWT Authentication**: Secure session management
- **📊 Session Management**: Complete charging session lifecycle
- **🌐 Responsive Design**: Works on mobile and desktop

## 🏗️ Architecture

### Frontend
- **HTML5** with semantic structure
- **CSS3** with advanced animations and effects
- **Vanilla JavaScript** with modern ES6+ features
- **jsQR** library for QR code scanning
- **Orbitron** font for futuristic typography

### Backend
- **Java Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **RESTful API** design
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Java 17** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

### Frontend Setup

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd safrasphere
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure MySQL database**:
   - Create a MySQL database named `safrasphere_db`
   - Update `src/main/resources/application.properties` with your database credentials:
     ```properties
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Run the database schema**:
   ```bash
   mysql -u your_username -p safrasphere_db < ../sql/schema.sql
   ```

4. **Build and run the Spring Boot application**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Backend will be available at**: `http://localhost:8080`

## 📱 User Flow

### 1. **Splash Screen** (4 seconds)
- Animated SafraSphere logo with spinning golden globe
- Neon glow effects and shimmer animations
- Auto-transition to QR scanner

### 2. **QR Scanner**
- Camera-based QR code scanning with jsQR
- Animated scan frame with moving laser line
- Real-time feedback messages

### 3. **Location Verification**
- GPS location checking against Karur coordinates (10.9601, 78.0766)
- ±0.01 degrees tolerance for demo purposes
- Animated loading spinner

### 4. **Charging Simulation**
- Real-time battery percentage with animated progress bar
- Live kWh consumption tracking
- Dynamic cost calculation (₹12 per kWh)
- Futuristic dashboard with neon effects

### 5. **Payment Processing**
- UPI payment integration
- Digital receipt generation
- Transaction ID and timestamp

### 6. **Success & Exit**
- Animated success confirmation
- Digital receipt display
- Farewell animation with floating particles

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/verifyQR` - Verify QR code and location

### Protected Endpoints (Require JWT)
- `POST /api/startCharging` - Start charging session
- `GET /api/status` - Get charging status
- `POST /api/payment` - Process payment

## 🎨 Design Features

### Visual Effects
- **Neon Gradients**: Orange (#FF8C42) to Pink (#FF3D68)
- **Golden Glow**: Primary accent color (#FFD700)
- **Animated Elements**: Spinning globes, shimmer effects, floating particles
- **Micro-interactions**: Hover effects, ripple animations, smooth transitions

### Typography
- **Primary Font**: Orbitron (futuristic monospace)
- **Font Weights**: 400 (regular), 700 (bold), 900 (black)
- **Text Effects**: Glow, shimmer, and gradient fills

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: 768px (tablet), 480px (mobile)
- **Flexible layouts** with CSS Grid and Flexbox

## 🔐 Security Features

- **JWT Authentication**: Secure session tokens
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 🗄️ Database Schema

### Tables
1. **users**: User information and profiles
2. **chargers**: EV charging station details
3. **sessions**: Charging session records

### Key Features
- **Foreign Key Constraints**: Data integrity
- **Indexes**: Optimized query performance
- **Timestamps**: Automatic creation and update tracking
- **Enums**: Standardized status values

## 🧪 Testing

### Frontend Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build
```

### Backend Testing
```bash
# Run unit tests
mvn test

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🚀 Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your web server

### Backend Deployment
1. Create production JAR:
   ```bash
   mvn clean package -Pprod
   ```
2. Run with production profile:
   ```bash
   java -jar target/safrasphere-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=safrasphere_db
DB_USERNAME=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080
```

## 📊 Performance Optimizations

- **Lazy Loading**: Images and components loaded on demand
- **CSS Animations**: Hardware-accelerated transforms
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Gzip Compression**: Reduced payload sizes

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**:
   - Ensure HTTPS or localhost
   - Check browser permissions
   - Verify camera hardware

2. **Database connection failed**:
   - Check MySQL service status
   - Verify credentials in application.properties
   - Ensure database exists

3. **CORS errors**:
   - Check allowed origins in SecurityConfig
   - Verify frontend URL configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: HTML5, CSS3, JavaScript ES6+
- **Backend Development**: Java Spring Boot, MySQL
- **UI/UX Design**: Futuristic neon theme with premium animations
- **Security**: JWT authentication and CORS protection

## 🙏 Acknowledgments

- **jsQR Library**: QR code scanning functionality
- **Spring Boot**: Robust backend framework
- **MySQL**: Reliable database system
- **Orbitron Font**: Futuristic typography

---

**🚗⚡ SafraSphere - Charging the Future! ⚡🚗**

For support or questions, please open an issue in the repository.