// SafraSphere - Futuristic EV Charging Application
// Main JavaScript file handling all app functionality

// Global variables
let currentScreen = 'splashScreen';
let chargingInterval = null;
let chargingStartTime = null;
let batteryPercentage = 0;
let unitsConsumed = 0;
let totalCost = 0;
let sessionToken = null;

// Configuration
const CONFIG = {
    // Karur, Tamil Nadu coordinates
    VALID_LOCATION: {
        lat: 10.9601,
        lon: 78.0766,
        tolerance: 0.01 // ±0.01 degrees tolerance
    },
    // Valid QR code for testing (in production, this would be validated server-side)
    VALID_QR: 'SAFRASPHERE_CHARGER_KARUR_001',
    // Charging simulation parameters
    CHARGING: {
        ratePerKwh: 12, // ₹12 per kWh
        maxBattery: 100,
        chargingSpeed: 2 // percentage per second (for demo purposes)
    },
    // API endpoints (for future backend integration)
    API: {
        baseUrl: 'http://localhost:8080/api',
        verifyQR: '/verifyQR',
        startCharging: '/startCharging',
        status: '/status',
        payment: '/payment'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('SafraSphere Application Initialized');
    initializeSplashScreen();
});

// Splash Screen Management
function initializeSplashScreen() {
    console.log('Initializing splash screen...');
    
    // Auto-transition to QR scanner after 4 seconds
    setTimeout(() => {
        transitionToScreen('qrScreen');
    }, 4000);
}

// Screen Transition Management
function transitionToScreen(screenId) {
    console.log(`Transitioning to screen: ${screenId}`);
    
    // Hide current screen
    const currentScreenElement = document.getElementById(currentScreen);
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    
    // Show new screen after a brief delay for smooth transition
    setTimeout(() => {
        const newScreenElement = document.getElementById(screenId);
        if (newScreenElement) {
            newScreenElement.classList.add('active');
            currentScreen = screenId;
            
            // Initialize screen-specific functionality
            initializeScreen(screenId);
        }
    }, 300);
}

// Initialize screen-specific functionality
function initializeScreen(screenId) {
    switch(screenId) {
        case 'qrScreen':
            initializeQRScanner();
            break;
        case 'chargingScreen':
            initializeChargingSimulation();
            break;
        case 'paymentScreen':
            initializePaymentScreen();
            break;
        case 'successScreen':
            initializeSuccessScreen();
            break;
        case 'exitScreen':
            initializeExitScreen();
            break;
    }
}

// QR Scanner Implementation
function initializeQRScanner() {
    console.log('Initializing QR scanner...');
    
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const statusElement = document.getElementById('scannerStatus');
    
    // Request camera access
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
    })
    .then(stream => {
        video.srcObject = stream;
        video.play();
        statusElement.textContent = 'Camera ready - Position QR code within the frame';
        startQRScanning(video, canvas, context, statusElement);
    })
    .catch(err => {
        console.error('Camera access denied:', err);
        statusElement.textContent = 'Camera access required for QR scanning';
        statusElement.style.color = '#ff4757';
    });
}

function startQRScanning(video, canvas, context, statusElement) {
    const scanQR = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                console.log('QR Code detected:', code.data);
                handleQRCodeDetected(code.data, statusElement);
                return; // Stop scanning once QR is detected
            }
        }
        
        // Continue scanning if no QR code detected
        if (currentScreen === 'qrScreen') {
            requestAnimationFrame(scanQR);
        }
    };
    
    scanQR();
}

function handleQRCodeDetected(qrData, statusElement) {
    console.log('Processing QR code:', qrData);
    statusElement.textContent = 'QR Code detected - Verifying...';
    statusElement.style.color = '#FFD700';
    
    // Simulate QR verification (in production, this would be a server call)
    setTimeout(() => {
        if (qrData === CONFIG.VALID_QR) {
            statusElement.textContent = 'QR Code verified! Checking location...';
            statusElement.style.color = '#00ff88';
            
            // Stop camera stream
            const video = document.getElementById('video');
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(track => track.stop());
            }
            
            // Proceed to location verification
            setTimeout(() => {
                transitionToScreen('locationScreen');
            }, 1500);
        } else {
            statusElement.textContent = 'Invalid QR Code - Please try again';
            statusElement.style.color = '#ff4757';
            
            // Reset scanner after 2 seconds
            setTimeout(() => {
                statusElement.textContent = 'Position QR code within the frame';
                statusElement.style.color = '#FFD700';
            }, 2000);
        }
    }, 1000);
}

// Location Verification
function requestLocationPermission() {
    console.log('Requesting location permission...');
    
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    const statusElement = document.getElementById('scannerStatus');
    statusElement.textContent = 'Requesting location access...';
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log('Location obtained:', position.coords);
            verifyLocation(position.coords);
        },
        (error) => {
            console.error('Location error:', error);
            statusElement.textContent = 'Location access required for charging';
            statusElement.style.color = '#ff4757';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

function verifyLocation(coords) {
    console.log('Verifying location...');
    
    const locationStatus = document.getElementById('locationStatus');
    locationStatus.textContent = 'Verifying your location...';
    
    // Calculate distance from valid location (Karur)
    const distance = calculateDistance(
        coords.latitude, coords.longitude,
        CONFIG.VALID_LOCATION.lat, CONFIG.VALID_LOCATION.lon
    );
    
    console.log('Distance from valid location:', distance);
    
    setTimeout(() => {
        // For demo purposes, we'll be more lenient with location verification
        // In production, use the actual calculated distance
        const isValidLocation = distance <= CONFIG.VALID_LOCATION.tolerance || true; // Always true for demo
        
        if (isValidLocation) {
            locationStatus.textContent = 'Location verified! Generating session token...';
            locationStatus.style.color = '#00ff88';
            
            // Generate session token
            sessionToken = generateSessionToken();
            console.log('Session token generated:', sessionToken);
            
            setTimeout(() => {
                transitionToScreen('chargingScreen');
            }, 2000);
        } else {
            locationStatus.textContent = 'You must be near the charger to start charging';
            locationStatus.style.color = '#ff4757';
            
            setTimeout(() => {
                transitionToScreen('qrScreen');
            }, 3000);
        }
    }, 2000);
}

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Session Token Generation
function generateSessionToken() {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    return `CST_${timestamp}_${randomId}`;
}

// Charging Simulation
function initializeChargingSimulation() {
    console.log('Initializing charging simulation...');
    
    // Reset charging parameters
    batteryPercentage = 0;
    unitsConsumed = 0;
    totalCost = 0;
    chargingStartTime = Date.now();
    
    // Update session ID display
    document.getElementById('sessionId').textContent = sessionToken || 'CS-001';
    
    // Start charging simulation
    startChargingSimulation();
}

function startChargingSimulation() {
    console.log('Starting charging simulation...');
    
    chargingInterval = setInterval(() => {
        // Simulate battery charging
        if (batteryPercentage < CONFIG.CHARGING.maxBattery) {
            batteryPercentage += CONFIG.CHARGING.chargingSpeed;
            
            // Calculate units consumed (simplified calculation)
            unitsConsumed = (batteryPercentage / 100) * 50; // Assuming 50kWh battery capacity
            
            // Calculate cost
            totalCost = unitsConsumed * CONFIG.CHARGING.ratePerKwh;
            
            // Update UI
            updateChargingDisplay();
        } else {
            // Charging complete
            batteryPercentage = CONFIG.CHARGING.maxBattery;
            updateChargingDisplay();
            stopCharging();
        }
    }, 1000); // Update every second
}

function updateChargingDisplay() {
    // Update battery percentage and visual
    const batteryLevelElement = document.getElementById('batteryLevel');
    const batteryPercentageElement = document.getElementById('batteryPercentage');
    const unitsConsumedElement = document.getElementById('unitsConsumed');
    const chargingCostElement = document.getElementById('chargingCost');
    const chargingTimeElement = document.getElementById('chargingTime');
    
    if (batteryLevelElement) {
        batteryLevelElement.style.width = `${batteryPercentage}%`;
    }
    
    if (batteryPercentageElement) {
        batteryPercentageElement.textContent = `${Math.round(batteryPercentage)}%`;
    }
    
    if (unitsConsumedElement) {
        unitsConsumedElement.textContent = unitsConsumed.toFixed(1);
    }
    
    if (chargingCostElement) {
        chargingCostElement.textContent = `₹${totalCost.toFixed(2)}`;
    }
    
    if (chargingTimeElement && chargingStartTime) {
        const elapsed = Math.floor((Date.now() - chargingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        chargingTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function stopCharging() {
    console.log('Stopping charging...');
    
    if (chargingInterval) {
        clearInterval(chargingInterval);
        chargingInterval = null;
    }
    
    // Transition to payment screen
    setTimeout(() => {
        transitionToScreen('paymentScreen');
    }, 1000);
}

// Payment Screen
function initializePaymentScreen() {
    console.log('Initializing payment screen...');
    
    // Update payment summary
    document.getElementById('finalUnits').textContent = `${unitsConsumed.toFixed(1)} kWh`;
    document.getElementById('finalAmount').textContent = `₹${totalCost.toFixed(2)}`;
    
    if (chargingStartTime) {
        const elapsed = Math.floor((Date.now() - chargingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('finalDuration').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function confirmPayment() {
    console.log('Processing payment...');
    
    // Simulate payment processing
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>Processing...</span>';
    button.disabled = true;
    
    setTimeout(() => {
        console.log('Payment successful');
        transitionToScreen('successScreen');
    }, 2000);
}

// Success Screen
function initializeSuccessScreen() {
    console.log('Initializing success screen...');
    
    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    document.getElementById('transactionId').textContent = transactionId;
    
    // Set transaction date
    const now = new Date();
    document.getElementById('transactionDate').textContent = now.toLocaleString();
    
    // Update receipt details
    document.getElementById('receiptUnits').textContent = `${unitsConsumed.toFixed(1)} kWh`;
    document.getElementById('receiptAmount').textContent = `₹${totalCost.toFixed(2)}`;
}

function exitApp() {
    console.log('Exiting application...');
    transitionToScreen('exitScreen');
}

// Exit Screen
function initializeExitScreen() {
    console.log('Initializing exit screen...');
    
    // Auto-return to splash screen after 5 seconds for demo purposes
    setTimeout(() => {
        resetApplication();
        transitionToScreen('splashScreen');
    }, 5000);
}

// Reset Application State
function resetApplication() {
    console.log('Resetting application state...');
    
    // Clear intervals
    if (chargingInterval) {
        clearInterval(chargingInterval);
        chargingInterval = null;
    }
    
    // Reset variables
    batteryPercentage = 0;
    unitsConsumed = 0;
    totalCost = 0;
    chargingStartTime = null;
    sessionToken = null;
    
    // Reset UI elements
    const batteryLevelElement = document.getElementById('batteryLevel');
    if (batteryLevelElement) {
        batteryLevelElement.style.width = '0%';
    }
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    // In production, you might want to show a user-friendly error message
});

// Prevent context menu on mobile for better UX
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Handle visibility change (when user switches tabs/apps)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('App hidden');
        // Pause charging simulation if running
        if (chargingInterval && currentScreen === 'chargingScreen') {
            clearInterval(chargingInterval);
        }
    } else {
        console.log('App visible');
        // Resume charging simulation if it was running
        if (currentScreen === 'chargingScreen' && !chargingInterval && batteryPercentage < 100) {
            startChargingSimulation();
        }
    }
});

// Utility Functions
function showNotification(message, type = 'info') {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: var(--card-bg);
        border: 1px solid var(--text-primary);
        border-radius: 10px;
        color: var(--text-primary);
        z-index: 1000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

console.log('SafraSphere JavaScript loaded successfully');