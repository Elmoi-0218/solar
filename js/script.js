
// Cart functionality
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartTotal = document.getElementById('cartTotal');
const totalAmount = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const productCard = this.closest('.product-card');
        const productName = productCard.getAttribute('data-name');
        const productPrice = parseFloat(productCard.getAttribute('data-price'));
        
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${productName} añadido al carrito!`);
    });
});

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal content
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartTotal.style.display = 'flex';
        checkoutBtn.style.display = 'block';
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons and inputs
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const quantity = parseInt(this.value);
                const item = cart.find(item => item.id === id);
                
                if (item && quantity > 0) {
                    item.quantity = quantity;
                } else if (quantity <= 0) {
                    cart = cart.filter(item => item.id !== id);
                    this.value = 1;
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cart modal functionality
const cartModal = document.getElementById('cartModal');
const openCartBtn = document.getElementById('openCart');
const openCartCTA = document.getElementById('openCartCTA');
const closeCartBtn = document.getElementById('closeCart');

openCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

openCartCTA.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Payment modal functionality
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePayment');

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        cartModal.style.display = 'none';
        paymentModal.style.display = 'flex';
        updatePaymentSummary();
    }
});

closePaymentBtn.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Payment method selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('active');
        });
        // Add active class to clicked option
        this.classList.add('active');
        
        // Show corresponding form
        const method = this.getAttribute('data-method');
        document.getElementById('creditForm').style.display = 'none';
        document.getElementById('paypalForm').style.display = 'none';
        document.getElementById('transferForm').style.display = 'none';
        document.getElementById(`${method}Form`).style.display = 'block';
    });
});

// Update payment summary
function updatePaymentSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + shipping;
    
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingAmount').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('finalTotalAmount').textContent = `$${total.toFixed(2)}`;
}

// Payment button
const payBtn = document.getElementById('payBtn');
payBtn.addEventListener('click', function() {
    const activeMethod = document.querySelector('.payment-option.active').getAttribute('data-method');
    
    if (activeMethod === 'credit') {
        // Validate credit card form
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            showNotification('Por favor completa todos los campos de la tarjeta');
            return;
        }
    }
    
    showNotification('¡Pago procesado exitosamente! Gracias por tu compra.');
    cart = [];
    updateCart();
    paymentModal.style.display = 'none';
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Format card number input
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue.substring(0, 19);
});

// Format expiry date input
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Format CVV input
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
});

// Simulated database for client view


// Load products
function loadCustomerProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].filter(p => p.status === 'active').forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-name', product.name);
        productCard.setAttribute('data-price', product.price);
        productCard.innerHTML = `
            <div class="product-image">
                ${product.name}
            </div>
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <i class="fas fa-star star"></i>
                        <span>4.${Math.floor(Math.random() * 5) + 3}</span>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-features">
                    ${product.features.map(feature => `
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Añadir
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Setup add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productCard = this.closest('.product-card');
            const productName = productCard.getAttribute('data-name');
            const productPrice = parseFloat(productCard.getAttribute('data-price'));
            
            // Check if product already exists in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${productName} añadido al carrito!`);
        });
    });
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartTotal = document.getElementById('cartTotal');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartTotal.style.display = 'flex';
        checkoutBtn.style.display = 'block';
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners for quantity buttons
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity += 1;
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const quantity = parseInt(this.value);
                const item = cart.find(item => item.id === id);
                
                if (item && quantity > 0) {
                    item.quantity = quantity;
                } else if (quantity <= 0) {
                    cart = cart.filter(item => item.id !== id);
                    this.value = 1;
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
}

// Setup cart event listeners
function setupCartEventListeners() {
    const cartModal = document.getElementById('cartModal');
    const openCartBtn = document.getElementById('openCart');
    const openCartCTA = document.getElementById('openCartCTA');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    openCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    openCartCTA.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.style.display = 'none';
            document.getElementById('paymentModal').style.display = 'flex';
            updatePaymentSummary();
        }
    });
}

function updatePaymentSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingAmount').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('finalTotalAmount').textContent = `$${total.toFixed(2)}`;
}

// Payment functionality
document.addEventListener('DOMContentLoaded', function() {
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show corresponding form
            const method = this.getAttribute('data-method');
            document.getElementById('creditForm').style.display = 'none';
            document.getElementById('paypalForm').style.display = 'none';
            document.getElementById('transferForm').style.display = 'none';
            document.getElementById(`${method}Form`).style.display = 'block';
        });
    });
    
    // Payment button
    document.getElementById('payBtn')?.addEventListener('click', function() {
        const activeMethod = document.querySelector('.payment-option.active').getAttribute('data-method');
        
        if (activeMethod === 'credit') {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value;
            
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                showNotification('Por favor completa todos los campos de la tarjeta');
                return;
            }
        }
        
        showNotification('¡Pago procesado exitosamente! Gracias por tu compra.');
        cart = [];
        updateCart();
        document.getElementById('paymentModal').style.display = 'none';
    });
    
    // Format card inputs
    document.getElementById('cardNumber')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue.substring(0, 19);
    });
    
    document.getElementById('expiryDate')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Initialize the page
    loadCustomerProducts();
    setupCartEventListeners();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
});

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Simulated database for admin panel
let products = [
    {
        id: 1,
        name: "SolarShield Ultra",
        code: "SS-001",
        category: "facial",
        price: 24.99,
        cost: 12.50,
        stock: 42,
        description: "Protección SPF 50+ con fórmula ligera y no grasa",
        features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
        status: "active",
        createdAt: "2023-01-15"
    },
    {
        id: 2,
        name: "AquaDefense Gel",
        code: "AD-002",
        category: "corporal",
        price: 19.99,
        cost: 9.75,
        stock: 28,
        description: "Gel hidratante con protección solar SPF 30",
        features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
        status: "active",
        createdAt: "2023-02-20"
    },
    {
        id: 3,
        name: "EcoSun Mineral",
        code: "EM-003",
        category: "mineral",
        price: 28.99,
        cost: 14.25,
        stock: 5,
        description: "Protector solar mineral ecológico SPF 45",
        features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
        status: "active",
        createdAt: "2023-03-10"
    },
    {
        id: 4,
        name: "KidsSun Protector",
        code: "KS-004",
        category: "niños",
        price: 22.99,
        cost: 11.80,
        stock: 0,
        description: "Fórmula suave especialmente diseñada para pieles sensibles de niños",
        features: ["SPF 50+", "Hipoalergénico", "Sin fragancia", "Resistente al agua"],
        status: "active",
        createdAt: "2023-04-05"
    },
    {
        id: 5,
        name: "SolarGlow Facial",
        code: "SG-005",
        category: "facial",
        price: 32.99,
        cost: 16.50,
        stock: 15,
        description: "Protector facial con efecto iluminador y antioxidantes",
        features: ["SPF 40", "Efecto glow", "Con vitamina C", "No graso"],
        status: "active",
        createdAt: "2023-05-12"
    }
];

let sales = [
    {
        id: "ORD-2023-156",
        date: "2023-12-28",
        customer: "María González",
        items: [
            { productId: 1, name: "SolarShield Ultra", quantity: 2, price: 24.99 },
            { productId: 3, name: "EcoSun Mineral", quantity: 1, price: 28.99 }
        ],
        total: 78.97,
        status: "delivered"
    },
    {
        id: "ORD-2023-155",
        date: "2023-12-27",
        customer: "Carlos Méndez",
        items: [
            { productId: 2, name: "AquaDefense Gel", quantity: 3, price: 19.99 }
        ],
        total: 59.97,
        status: "shipped"
    },
    {
        id: "ORD-2023-154",
        date: "2023-12-26",
        customer: "Ana Rodríguez",
        items: [
            { productId: 1, name: "SolarShield Ultra", quantity: 1, price: 24.99 },
            { productId: 2, name: "AquaDefense Gel", quantity: 1, price: 19.99 },
            { productId: 5, name: "SolarGlow Facial", quantity: 1, price: 32.99 }
        ],
        total: 77.97,
        status: "delivered"
    }
];

// Admin credentials
const adminCredentials = {
    "12345678": { // Cédula
        password: "admin123",
        name: "Juan Pérez",
        role: "admin"
    },
    "87654321": {
        password: "inventario456",
        name: "María Rodríguez",
        role: "inventory"
    }
};

let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const cedulaInput = document.getElementById('cedula');
const passwordInput = document.getElementById('password');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const adminName = document.getElementById('adminName');

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    setupEventListeners();
    
    // Check for remembered session
    checkRememberedSession();
});

// Setup event listeners
function setupEventListeners() {
    // Login
    loginBtn.addEventListener('click', handleLogin);
    cedulaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout
    logoutBtn.addEventListener('click', logout);
    
    // Tab navigation
    document.querySelectorAll('.sidebar-nav li').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // Product management
    document.getElementById('addProductBtn')?.addEventListener('click', openAddProductModal);
    document.getElementById('saveProduct')?.addEventListener('click', saveNewProduct);
    document.getElementById('closeAddProduct')?.addEventListener('click', closeAddProductModal);
    document.getElementById('cancelAddProduct')?.addEventListener('click', closeAddProductModal);
}

// Login functionality
function handleLogin() {
    const cedula = cedulaInput.value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById('remember').checked;
    
    if (!cedula || !password) {
        showNotification('Por favor ingrese cédula y contraseña', 'error');
        return;
    }
    
    // Check credentials
    if (adminCredentials[cedula] && adminCredentials[cedula].password === password) {
        // Successful login
        isLoggedIn = true;
        currentUser = adminCredentials[cedula];
        currentUser.cedula = cedula;
        
        // Remember session if checked
        if (remember) {
            localStorage.setItem('adminSession', JSON.stringify({
                cedula: cedula,
                timestamp: new Date().getTime()
            }));
        }
        
        // Hide login modal and show admin panel
        loginModal.style.display = 'none';
        showAdminPanel();
        showNotification(`Bienvenido, ${currentUser.name}!`, 'success');
    } else {
        showNotification('Cédula o contraseña incorrectos', 'error');
    }
}

function checkRememberedSession() {
    const session = localStorage.getItem('adminSession');
    if (session) {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // Session valid for 7 days
        if (now - sessionData.timestamp < 7 * 24 * 60 * 60 * 1000) {
            if (adminCredentials[sessionData.cedula]) {
                isLoggedIn = true;
                currentUser = adminCredentials[sessionData.cedula];
                currentUser.cedula = sessionData.cedula;
                showAdminPanel();
            } else {
                localStorage.removeItem('adminSession');
            }
        } else {
            localStorage.removeItem('adminSession');
        }
    }
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('adminSession');
    adminPanel.style.display = 'none';
    loginModal.style.display = 'flex';
    showNotification('Sesión cerrada exitosamente', 'info');
}

// Admin Panel
function showAdminPanel() {
    adminPanel.style.display = 'block';
    adminName.textContent = currentUser.name;
    loadDashboardContent();
    loadProductsContent();
    loadInventoryContent();
    loadSalesContent();
}

function activateTab(tabId) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav li').forEach(button => button.classList.remove('active'));
    
    // Add active class to selected tab and button
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.sidebar-nav li[data-tab="${tabId}"]`).classList.add('active');
    
    // Update header title
    document.querySelector('.header-left h1').textContent = 
        tabId === 'dashboard' ? 'Dashboard' :
        tabId === 'products' ? 'Gestión de Productos' :
        tabId === 'inventory' ? 'Inventario' :
        tabId === 'sales' ? 'Reportes de Ventas' :
        'Panel de Administración';
}

// Dashboard
function loadDashboardContent() {
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon revenue">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>$${calculateTotalRevenue().toFixed(2)}</h3>
                    <p>Ingresos Totales</p>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>12.5% desde el mes pasado</span>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon sales">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-info">
                    <h3>${sales.length}</h3>
                    <p>Ventas Realizadas</p>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>8.2% desde el mes pasado</span>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon inventory">
                    <i class="fas fa-boxes"></i>
                </div>
                <div class="stat-info">
                    <h3>${[
            {
                id: 1,
                name: "SolarShield Ultra",
                description: "Protección SPF 50+ con fórmula ligera y no grasa",
                price: 24.99,
                features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
                status: "active"
            },
            {
                id: 2,
                name: "AquaDefense Gel",
                description: "Gel hidratante con protección solar SPF 30",
                price: 19.99,
                features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
                status: "active"
            },
            {
                id: 3,
                name: "EcoSun Mineral",
                description: "Protector solar mineral ecológico SPF 45",
                price: 28.99,
                features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
                status: "active"
            }
        ].length}</h3>
                    <p>Productos en Inventario</p>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>3.5% desde el mes pasado</span>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon customers">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${getTotalCustomers()}</h3>
                    <p>Clientes Registrados</p>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i>
                        <span>15.3% desde el mes pasado</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="recent-activity">
            <h3>Actividad Reciente</h3>
            <div class="activity-list" id="activityList">
                <!-- Activities will be loaded here -->
            </div>
        </div>
    `;
    
    loadRecentActivity();
}

function calculateTotalRevenue() {
    return sales.reduce((total, sale) => total + sale.total, 0);
}

function getTotalCustomers() {
    // In a real system, this would come from a customers database
    return 156;
}

function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    let activities = [];
    
    // Add recent sales
    sales.slice(0, 3).forEach(sale => {
        activities.push({
            type: 'success',
            icon: 'fa-check',
            message: `Nuevo pedido #${sale.id} - $${sale.total.toFixed(2)}`,
            time: sale.date
        });
    });
    
    // Add low stock products
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].filter(p => p.stock < 10 && p.stock > 0).forEach(product => {
        activities.push({
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            message: `Inventario bajo: ${product.name} (${product.stock} unidades)`,
            time: 'hoy'
        });
    });
    
    // Add out of stock products
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].filter(p => p.stock === 0).forEach(product => {
        activities.push({
            type: 'danger',
            icon: 'fa-times-circle',
            message: `Sin stock: ${product.name}`,
            time: 'hoy'
        });
    });
    
    // Sort by time (most recent first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // Limit to 5 activities
    activities = activities.slice(0, 5);
    
    let activityHTML = '';
    activities.forEach(activity => {
        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.message}</strong></p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `;
    });
    
    activityList.innerHTML = activityHTML;
}

// Products Management
function loadProductsContent() {
    const productsGrid = document.getElementById('adminProductsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.name}
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-code">${product.code}</div>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-stats">
                    <div>
                        <span class="value">${product.stock}</span>
                        <span class="label">En Stock</span>
                    </div>
                    <div>
                        <span class="value">$${((product.price - product.cost) / product.cost * 100).toFixed(0)}%</span>
                        <span class="label">Margen</span>
                    </div>
                    <div>
                        <span class="value">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                        <span class="label">Estado</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-outline ${product.status === 'active' ? 'btn-danger' : 'btn-primary'} toggle-status" data-id="${product.id}">
                        <i class="fas ${product.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i> ${product.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            toggleProductStatus(productId);
        });
    });
}

function toggleProductStatus(productId) {
    const product = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].find(p => p.id === productId);
    if (!product) return;
    
    product.status = product.status === 'active' ? 'inactive' : 'active';
    loadProductsContent();
    loadInventoryContent();
    
    const action = product.status === 'active' ? 'activado' : 'desactivado';
    showNotification(`Producto ${action} exitosamente`, 'success');
}

function getCategoryName(category) {
    const categories = {
        'facial': 'Protección Facial',
        'corporal': 'Protección Corporal',
        'niños': 'Productos para Niños',
        'mineral': 'Protectores Minerales',
        'especial': 'Fórmulas Especiales'
    };
    return categories[category] || category;
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'flex';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function saveNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const code = document.getElementById('productCode').value.trim() || generateProductCode();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const cost = parseFloat(document.getElementById('productCost').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value) || 0;
    const description = document.getElementById('productDescription').value.trim();
    const features = document.getElementById('productFeatures').value.trim().split('\n').filter(f => f.trim() !== '');
    
    if (!name || !category) {
        showNotification('Por favor complete los campos obligatorios (Nombre y Categoría)', 'error');
        return;
    }
    
    const newProduct = {
        id: [
            {
                id: 1,
                name: "SolarShield Ultra",
                description: "Protección SPF 50+ con fórmula ligera y no grasa",
                price: 24.99,
                features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
                status: "active"
            },
            {
                id: 2,
                name: "AquaDefense Gel",
                description: "Gel hidratante con protección solar SPF 30",
                price: 19.99,
                features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
                status: "active"
            },
            {
                id: 3,
                name: "EcoSun Mineral",
                description: "Protector solar mineral ecológico SPF 45",
                price: 28.99,
                features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
                status: "active"
            }
        ].length > 0 ? Math.max(...[
                {
                    id: 1,
                    name: "SolarShield Ultra",
                    description: "Protección SPF 50+ con fórmula ligera y no grasa",
                    price: 24.99,
                    features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
                    status: "active"
                },
                {
                    id: 2,
                    name: "AquaDefense Gel",
                    description: "Gel hidratante con protección solar SPF 30",
                    price: 19.99,
                    features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
                    status: "active"
                },
                {
                    id: 3,
                    name: "EcoSun Mineral",
                    description: "Protector solar mineral ecológico SPF 45",
                    price: 28.99,
                    features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
                    status: "active"
                }
            ].map(p => p.id)) + 1 : 1,
        name,
        code,
        category,
        price,
        cost,
        stock,
        description,
        features,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].push(newProduct);
    loadProductsContent();
    loadInventoryContent();
    closeAddProductModal();
    
    showNotification('Producto agregado exitosamente', 'success');
}

function generateProductCode() {
    const prefix = 'PRD';
    const number = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].length + 1;
    return `${prefix}-${number.toString().padStart(3, '0')}`;
}

// Inventory Management
function loadInventoryContent() {
    // Update stats
    document.getElementById('totalProducts').textContent = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].length;
    
    const inventoryValue = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].reduce((total, p) => total + (p.stock * p.cost), 0);
    document.getElementById('inventoryValue').textContent = `$${inventoryValue.toFixed(2)}`;
    
    const lowStock = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].filter(p => p.stock > 0 && p.stock < 10).length;
    document.getElementById('lowStock').textContent = lowStock;
    
    const outOfStock = [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].filter(p => p.stock === 0).length;
    document.getElementById('outOfStock').textContent = outOfStock;
    
    // Update table
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';
    
    [
        {
            id: 1,
            name: "SolarShield Ultra",
            description: "Protección SPF 50+ con fórmula ligera y no grasa",
            price: 24.99,
            features: ["SPF 50+", "Resistente al agua", "No comedogénico", "Con vitamina E"],
            status: "active"
        },
        {
            id: 2,
            name: "AquaDefense Gel",
            description: "Gel hidratante con protección solar SPF 30",
            price: 19.99,
            features: ["SPF 30", "Hidratación 24h", "Textura gel", "Para todo tipo de piel"],
            status: "active"
        },
        {
            id: 3,
            name: "EcoSun Mineral",
            description: "Protector solar mineral ecológico SPF 45",
            price: 28.99,
            features: ["SPF 45", "100% mineral", "Biodegradable", "Sin químicos dañinos"],
            status: "active"
        }
    ].forEach(product => {
        const row = document.createElement('tr');
        const totalValue = product.stock * product.cost;
        
        let stockClass = '';
        if (product.stock === 0) stockClass = 'danger';
        else if (product.stock < 10) stockClass = 'warning';
        
        row.innerHTML = `
            <td>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-code">${product.code}</div>
                </div>
            </td>
            <td>${getCategoryName(product.category)}</td>
            <td class="${stockClass}">${product.stock} ${stockClass === 'danger' ? '(Sin stock)' : stockClass === 'warning' ? '(Bajo)' : ''}</td>
            <td>$${product.cost.toFixed(2)}</td>
            <td>$${totalValue.toFixed(2)}</td>
            <td>
                <span class="status ${product.status}">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Sales Management
function loadSalesContent() {
    const totalSales = calculateTotalRevenue();
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
    
    document.getElementById('totalOrders').textContent = sales.length;
    
    // Find top product
    const productSales = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = { name: item.name, quantity: 0, total: 0 };
            }
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].total += item.price * item.quantity;
        });
    });
    
    const topProduct = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)[0];
    
    if (topProduct) {
        document.getElementById('topProduct').textContent = topProduct.name;
        document.getElementById('topProductUnits').textContent = `${topProduct.quantity} unidades`;
    }
    
    const avgTicket = sales.length > 0 ? totalSales / sales.length : 0;
    document.getElementById('avgTicket').textContent = `$${avgTicket.toFixed(2)}`;
    
    // Update sales table
    const tableBody = document.getElementById('salesTableBody');
    tableBody.innerHTML = '';
    
    sales.forEach(sale => {
        const row = document.createElement('tr');
        const items = sale.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
        
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.date}</td>
            <td>${sale.customer}</td>
            <td>${items}</td>
            <td class="amount">$${sale.total.toFixed(2)}</td>
            <td>
                <span class="status ${sale.status}">${getStatusName(sale.status)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getStatusName(status) {
    const statuses = {
        'pending': 'Pendiente',
        'processing': 'Procesando',
        'shipped': 'Enviado',
        'delivered': 'Entregado',
        'cancelled': 'Cancelado'
    };
    return statuses[status] || status;
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

              
                    