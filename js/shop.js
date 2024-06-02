document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const randomUsersContainer = document.getElementById('random-users');
    const menuButton = document.querySelector('.menu-btn');
    const menuHeader = document.querySelector('.menu-header');

    menuButton.addEventListener('click', function () {
        menuHeader.classList.toggle('show-menu');
    });

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    leafletScript.onload = function () {
        var map = L.map('map').setView([51.22989566573189, 4.41727841480322], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([51.22989566573189, 4.41727841480322]).addTo(map)
            .bindPopup('Onze Winkel');
    };

    document.head.appendChild(leafletScript);

    let cartTotal = 0;
    const cartItems = {};

    function toggleHeartColor(button) {
        button.classList.toggle('favorite-active');
    }

    function updateCartDisplay() {
        cartItemsContainer.textContent = '';

        for (const productId in cartItems) {
            const { name, price, quantity } = cartItems[productId];

            const cartItem = document.createElement('section');
            cartItem.classList.add('cart-item');
            cartItem.id = `cart-item-${productId}`;

            const pElement = document.createElement('p');
            const itemNameSpan = document.createElement('span');
            const itemPriceSpan = document.createElement('span');
            const itemQuantitySpan = document.createElement('span');
            const removeButton = document.createElement('span');

            removeButton.classList.add('remove-btn');

            itemNameSpan.textContent = name;
            itemPriceSpan.textContent = ` €${(price * quantity).toFixed(2)}`;
            itemQuantitySpan.textContent = ` x${quantity}`;
            removeButton.innerHTML = '&#10060;';

            pElement.appendChild(itemNameSpan);
            pElement.appendChild(itemPriceSpan);
            pElement.appendChild(itemQuantitySpan);
            pElement.appendChild(removeButton);

            cartItem.appendChild(pElement);
            cartItemsContainer.appendChild(cartItem);

            removeButton.addEventListener('click', handleRemoveButtonClick);
        }
    }
    function handleRemoveButtonClick(event) {
        const button = event.target;
        const cartItemElement = button.parentElement.parentElement;
        const productId = cartItemElement.id.replace('cart-item-', '');

        if (cartItems.hasOwnProperty(productId)) {
            const productPrice = cartItems[productId].price * cartItems[productId].quantity;

            delete cartItems[productId];

            cartTotal -= productPrice;
            cartTotalPrice.textContent = `€${cartTotal.toFixed(2)}`;

            updateCartDisplay();
        }
    }



    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = button.getAttribute('data-product-id');
            const productName = button.parentElement.querySelector('h3').textContent;
            const productPrice = parseFloat(button.parentElement.querySelector('p').textContent.replace('Prijs: €', ''));

            if (cartItems[productId]) {
                cartItems[productId].quantity++;
            } else {
                cartItems[productId] = {
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                };
            }

            cartTotal += productPrice;
            cartTotalPrice.textContent = `€${cartTotal.toFixed(2)}`;

            updateCartDisplay();
        });
    });

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function () {
            toggleHeartColor(button);
        });
    });

    fetch('https://randomuser.me/api/?results=10')
        .then(response => response.json())
        .then(data => {
            displayRandomUsers(data.results);
        })

    function displayRandomUsers(users) {
        randomUsersContainer.textContent = '';

        users.forEach(user => {
            const userElement = document.createElement('article');
            userElement.classList.add('random-user');

            const imgElement = document.createElement('img');
            imgElement.src = user.picture.medium;
            imgElement.alt = 'User Image';
            userElement.appendChild(imgElement);

            const titleElement = document.createElement('h4');
            titleElement.textContent = getTitle(user.gender) + ` ${user.name.first} ${user.name.last}`;
            userElement.appendChild(titleElement);

            const countryElement = document.createElement('p');
            countryElement.textContent = `Land: ${user.location.country}`;
            userElement.appendChild(countryElement);

            randomUsersContainer.appendChild(userElement);
        });
    }

    function getTitle(gender) {
        return gender === 'male' ? 'Mijnheer' : 'Mevrouw';
    }
});
