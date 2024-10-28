document.addEventListener("DOMContentLoaded", async () => {
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 

    async function fetchProducts() {
        try {
            const response = await fetch('products.json'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            products = await response.json();
            renderProducts(products);
            renderCart(); 
        } catch (error) {
            console.error("Өгөгдлийг унших үед алдаа гарлаа:", error);
        }
    }

    function renderProducts(displayProducts) {
        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";

        displayProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Үнэ: ${product.price} MNT</p>
                <button data-id="${product.id}" class="add-to-cart-button">Сагсанд нэмэх</button>
            `;
            productContainer.appendChild(productDiv);
        });

        const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                const productToAdd = products.find(product => product.id === productId);
                addToCart(productToAdd);
            });
        });
    }

    function addToCart(product) {
        cart.push(product); 
        localStorage.setItem('cart', JSON.stringify(cart)); 
        renderCart(); 
        alert(`${product.name} сагсанд нэмэгдлээ!`);
    }

    function renderCart() {
        const cartContainer = document.getElementById("cart-container");
        cartContainer.innerHTML = ""; 
    
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Сагсанд бараа байхгүй.</p>";
            document.getElementById('checkout-button').style.display = 'none'; 
            return;
        }
    
        cart.forEach(item => {
            const cartDiv = document.createElement("div");
            cartDiv.classList.add("cart-item");
            cartDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>Үнэ: ${item.price} MNT</p>
                <button class="remove-button" data-id="${item.id}">✖</button> <!-- Return button -->
            `;
            cartContainer.appendChild(cartDiv);
        });
    
        document.getElementById('checkout-button').style.display = 'block';
    
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                removeItem(productId);
            });
        });
    }
    


    function removeItem(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            const removedItem = cart.splice(itemIndex, 1); 
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            alert(`${removedItem[0].name} буцсан!`); 
        }
    }

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        alert("Таны төлбөр амжилттай хийгдлээ!");
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    const searchInput = document.getElementById('search-input');
    const searchOptions = document.getElementById('search-options');

    function loadPreviousSearches() {
        const previousSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchOptions.innerHTML = "";

        previousSearches.forEach(search => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('search-option-item');
            optionDiv.textContent = search;

            optionDiv.addEventListener('click', () => {
                searchInput.value = search;
                searchOptions.style.display = 'none';
            });

            searchOptions.appendChild(optionDiv);
        });
    }

    searchInput.addEventListener('focus', () => {
        searchOptions.style.display = 'block';
    });

    searchInput.addEventListener('input', () => {
        loadPreviousSearches(); 
        searchOptions.style.display = 'block'; 
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            searchOptions.style.display = 'none'; 
        }, 100);
    });

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            addSearchToHistory(searchTerm);
            console.log(`Searching for: ${searchTerm}`);
        }
    });

    function addSearchToHistory(searchTerm) {
        const previousSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!previousSearches.includes(searchTerm)) {
            previousSearches.push(searchTerm);
            localStorage.setItem('searchHistory', JSON.stringify(previousSearches));
            loadPreviousSearches();
        }
    }

    loadPreviousSearches(); 
    fetchProducts();
});