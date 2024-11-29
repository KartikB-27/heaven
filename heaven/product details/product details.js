// Fetch product data from JSON
async function loadProductData(productId) {
    try {
        // Fetch JSON file containing product data
        const response = await fetch('/heaven/products.json'); // Update path to your JSON file
        const data = await response.json();

        // Ensure products array exists
        if (!data.products || !Array.isArray(data.products)) {
            console.error("Invalid product data structure");
            return;
        }

        // Find the product by ID
        const productData = data.products.find(product => product.id === productId);
        if (!productData) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }

        // Populate product details
        document.getElementById("product-name").innerText = productData.name;
        document.getElementById("product-description").innerText = productData.description;
        document.getElementById("product-price").innerText = productData.price;
        document.getElementById("product-ingredients").innerText = productData.ingredients;
        document.getElementById("product-img").src = productData.images[0]; // Main image

        // Populate Benefits Section
        const benefitsList = document.getElementById("benefits-list");
        benefitsList.innerHTML = ""; // Clear existing benefits
        productData.benefits.forEach(benefit => {
            const listItem = document.createElement("li");
            listItem.innerText = benefit;
            benefitsList.appendChild(listItem);
        });

        // Populate Ratings Section
        document.getElementById("total-reviews").innerText = `${productData.ratings.totalReviews}`;

        // Generate thumbnails
        const thumbnailContainer = document.querySelector(".thumbnail-container");
        thumbnailContainer.innerHTML = ""; // Clear any existing thumbnails
        productData.images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement("img");
            thumbnail.src = imgSrc;
            if (index === 0) thumbnail.classList.add("active"); // Mark first thumbnail as active
            thumbnail.addEventListener("click", () => {
                document.getElementById("product-img").src = imgSrc;
                document.querySelectorAll(".thumbnail-container img").forEach(img => img.classList.remove("active"));
                thumbnail.classList.add("active"); // Mark clicked thumbnail as active
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    } catch (error) {
        console.error("Error loading product data:", error);
    }
}

// Dynamically load the product based on a passed product ID
function initializeProductPage(productId) {
    if (!productId) {
        console.error("No product ID provided");
        return;
    }
    loadProductData(productId);
}

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id")); // Example: /product.html?id=102
initializeProductPage(productId);
