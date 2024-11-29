// Fetch query from the URL
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("query").toLowerCase();

// Fetch products from the JSON file
fetch("/heaven/products.json")
  .then((response) => response.json())
  .then((data) => {
    const products = data.products;

    // Filter products based only on the tags
    const filteredProducts = products.filter(product =>
      product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)) // Search only in product tags
    );

    // Display the filtered products
    const productList = document.getElementById("productList");
    const backToTopButton = document.querySelector(".btn-secondary");

    if (filteredProducts.length > 0) {
      filteredProducts.forEach(product => {
        const productCard = document.createElement("li");
        productCard.className = "scrollbar-item";

        // Make the entire container clickable
        productCard.innerHTML = `
          <div class="shop-card" onclick="window.location.href='/heaven/product details/product details.html?id=${product.id}'">
            <div class="card-banner img-holder" style="--width: 540; --height: 720;">
              <img
                src="${product.images[0]}"
                width="540" height="720"
                loading="lazy"
                alt="${product.name}"
                class="img-cover">
              <div class="card-actions">
                <button class="action-btn" aria-label="add to cart">
                  <ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>
                </button>
                <button class="action-btn" aria-label="add to wishlist">
                  <ion-icon name="star-outline" aria-hidden="true"></ion-icon>
                </button>
                <button class="action-btn" aria-label="compare">
                  <ion-icon name="repeat-outline" aria-hidden="true"></ion-icon>
                </button>
              </div>
            </div>
            <div class="card-content">
              <div class="price">
                <span class="span">${product.price}</span>
              </div>
              <h3>
                <a href="/heaven/product details/product details.html?id=${product.id}" class="card-title">${product.name}</a>
              </h3>
              <div class="card-rating">
                <div class="rating-wrapper" aria-label="5-star rating">
                  <ion-icon name="star" aria-hidden="true"></ion-icon>
                  <ion-icon name="star" aria-hidden="true"></ion-icon>
                  <ion-icon name="star" aria-hidden="true"></ion-icon>
                  <ion-icon name="star" aria-hidden="true"></ion-icon>
                  <ion-icon name="star" aria-hidden="true"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        `;
        productList.appendChild(productCard);
      });
      backToTopButton.style.display = 'block';
    } else {
      productList.innerHTML = "<p class='no-products'>No products found.</p>";
      // Hide the back to top button when no products are found
      backToTopButton.style.display = 'none';
    }
  })
  .catch(error => console.error("Error fetching products:", error));
