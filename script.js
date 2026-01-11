// Product Data
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        price: 1299.00,
        image: "assets/ring.png",
        category: "Rings"
    },
    {
        id: 2,
        name: "Gold Filigree Necklace",
        price: 850.00,
        image: "assets/necklace.png",
        category: "Necklaces"
    },
    {
        id: 3,
        name: "Diamond Hoop Earrings",
        price: 599.00,
        image: "assets/earrings.png",
        category: "Earrings"
    },
    {
        id: 4,
        name: "Hammered Gold Cuff",
        price: 450.00,
        image: "assets/bracelet.png",
        category: "Bracelets"
    },
    {
        id: 5,
        name: "Vintage Gold Band",
        price: 320.00,
        image: "assets/ring.png", // Reusing image for demo
        category: "Rings"
    },
    {
        id: 6,
        name: "Pearl Drop Pendant",
        price: 675.00,
        image: "assets/necklace.png", // Reusing image for demo
        category: "Necklaces"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const body = document.body;

// Initialize
function init() {
    renderProducts();
    updateCartUI();
}

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <h3 class="product-title">${product.name}</h3>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Toggle Cart
function toggleCart() {
    body.classList.toggle('cart-active');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    
    // Show notification
    showNotification('Item added to cart!', 'success');
    
    // Open cart when adding item (optional UX choice)
    if (!body.classList.contains('cart-active')) {
        toggleCart();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;

    // Update Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top: 2rem; color: #888;">Your cart is empty.</p>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = '$' + total.toFixed(2);
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    showNotification('Thank you for your purchase! This is a demo.', 'success');
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Contact Form Handling
function handleContact(event) {
    event.preventDefault();
    const form = event.target;
    // In a real app, you would send this data to a backend
    showNotification('Message sent successfully! We will contact you soon.', 'success');
    form.reset();
}

// Notification System
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="notification-message">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 3000);
}

// Start
init();

// Expose functions to global scope for HTML onclick attributes
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.handleContact = handleContact;
