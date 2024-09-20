let cartItems = [];

// Function to handle adding items to the cart
function addToCart(product, price, imageUrl) {
    console.log(`Adding ${product} to the cart`);

    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.product === product);
    if (!existingItem) {
        cartItems.push({ product, price, quantity: 1, imageUrl });
    } else {
        existingItem.quantity++;
    }

    // Save cart items to localStorage
    saveCart();

    // Update cart icon and summary
    updateCartIcon();
    updateCartSummary();

    // Show popup confirmation
    showModal(`${product} has been added to your cart.`);
}

// Function to show modal
function showModal(message) {
    const modal = document.getElementById('cart-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    modal.querySelector('.close').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Function to remove items from the cart
function removeFromCart(product) {
    console.log(`Removing ${product} from the cart`);
    const index = cartItems.findIndex(item => item.product === product);
    if (index !== -1) cartItems.splice(index, 1);

    saveCart();
    updateCartIcon();
    updateCartSummary();
}

// Function to update cart icon with number of items
function updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon img');
    if (cartIcon) {
        const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        cartIcon.alt = `Cart (${cartCount})`;
        cartIcon.title = `You have ${cartCount} items in your cart`;
    }
}

// Function to update cart summary
function updateCartSummary() {
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        cartSummary.innerHTML = '';
        let totalCost = 0;

        cartItems.forEach(item => {
            cartSummary.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imageUrl}" alt="${item.product}" style="width: 80px; height: auto;">
                    <div class="cart-item-info">
                        <h3>${item.product}</h3>
                        <p>Price: $${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-from-cart" data-product="${item.product}">Remove</button>
                    </div>
                    <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>`;
            totalCost += item.price * item.quantity;
    console.log(cartItems);  // Check if items are being added to cartItems

        });

        cartSummary.innerHTML += `<div class="cart-total">Total: $${totalCost.toFixed(2)}</div>`;
    }
}

// Function to save cart items to localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to load cart items from localStorage
function loadCart() {
    const savedItems = localStorage.getItem('cartItems');
    if (savedItems) {
        cartItems = JSON.parse(savedItems);
        updateCartIcon();
        updateCartSummary();
    }
}

// Function to clear the cart
function clearCart() {
    cartItems = [];
    localStorage.removeItem('cartItems');
    updateCartIcon();
    updateCartSummary();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Add to Cart button event listeners
    document.querySelectorAll('.btn.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.closest('.products-item');
            const productName = productElement.querySelector('.overlay h5').innerText.split(' - ')[0];
            const productPrice = parseFloat(productElement.querySelector('.overlay h5').innerText.split(' - $')[1]);
            const productImage = productElement.querySelector('img').src;
            addToCart(productName, productPrice, productImage);
        });
    });

    // Remove from Cart button event listeners
    document.querySelector('.cart-summary').addEventListener('click', event => {
        if (event.target.classList.contains('remove-from-cart')) {
            const product = event.target.dataset.product;
            removeFromCart(product);
        }
    });

    // Clear Cart button
    document.getElementById('clear-cart').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the cart?')) {
            clearCart();
        }
    });
});
