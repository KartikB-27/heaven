'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header sticky & back top btn active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.add("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * scroll reveal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.4) {
      sections[i].classList.add("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);







const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  const tags = []; // Assuming you will populate this array with your tags from the JSON file

  // Fetch and filter tags based on the search query
  fetch("./products.json")
    .then(response => response.json())
    .then(data => {
      tags.push(...data.products.flatMap(product => product.tags || [])); // Extract tags from JSON

      // Filter suggestions based on the query
      const filteredTags = tags.filter(tag => tag.toLowerCase().includes(query));

      // Remove duplicates and display suggestions
      displaySuggestions([...new Set(filteredTags)]);
    })
    .catch(error => console.error("Error fetching products:", error));
});

function displaySuggestions(tags) {
  // Clear previous suggestions
  suggestionsBox.innerHTML = "";

  if (tags.length === 0 || searchInput.value.trim() === "") {
    suggestionsBox.classList.remove("show");
    return;
  }

  // Create list items for each unique tag
  tags.forEach(tag => {
    const listItem = document.createElement("li");
    listItem.textContent = tag;
    listItem.addEventListener("click", () => {
      // Set the selected tag in the search input
      searchInput.value = tag;
      suggestionsBox.classList.remove("show"); // Hide dropdown on selection

      // Focus back on the search input for immediate use
      searchInput.focus(); // Set focus back to the input box

      // Perform the search immediately after selection
      performSearch(tag);
    });
    suggestionsBox.appendChild(listItem);
  });

  // Show the dropdown with sliding down effect
  suggestionsBox.classList.add("show");
}

// Function to perform the search
function performSearch(query) {
  if (query) {
    // Save query to localStorage for use in search.html
    localStorage.setItem('searchQuery', query);

    // Redirect to search.html with the query parameter
    window.location.href = `./search/search.html?query=${encodeURIComponent(query)}`;
  } else {
    alert('Please enter a product to search!');
  }
}

// Hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".input-wrapper")) {
    suggestionsBox.classList.remove("show");
  }
});



emailjs.init("u5XwVOf5DVqkt7PsU"); // Replace with your actual Public Key

document.getElementById("newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form refresh

  const email = document.getElementById("email-field").value;

  if (email === "") {
    alert("Please enter a valid email address."); // Validation for empty input
    return;
  }

  const subscribeButton = document.getElementById("subscribe-button");
  subscribeButton.disabled = true; // Disable button to prevent multiple clicks
  const originalText = subscribeButton.textContent; // Store original button text

  // Create a spinner element
  const spinner = document.createElement("span");
  spinner.className = "spinner"; // Set class for styling
  subscribeButton.textContent = "Subscribing"; // Change button text
  subscribeButton.appendChild(spinner); // Add spinner to button

  // Send email using EmailJS
  emailjs
    .send("service_byhjah9", "template_tuhr88t", {
      to_email: email, // This should correspond to the recipient email field in your template
      from_name: "Heaven", // The name you want to show as the sender
    })
    .then(function (response) {
      console.log("Email sent successfully!", response.status, response.text);

      // Save email to Google Sheets
      const googleSheetsURL = "https://script.google.com/macros/s/AKfycby03EEZZKDQXquKUJLHNQAk2ssIJ6l8_KcZzDtrp5DZ7VDQRNpDqTMiVDgT-YTmwehk/exec"; // Replace with your Web App URL
      fetch(googleSheetsURL, {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Email saved to Google Sheets!");
            document.getElementById("thank-you-dialog").style.display = "block"; // Show thank-you dialog
          } else {
            throw new Error("Failed to save to Google Sheets.");
          }
        })
        .catch((error) => {
          console.error("Error saving to Google Sheets:", error);
          alert("Could not save your email. Please try again later.");
        })
        .finally(() => {
          // Reset button after processing
          subscribeButton.textContent = originalText; // Reset button text
          if (spinner.parentNode) {
            spinner.parentNode.removeChild(spinner); // Remove spinner
          }
          subscribeButton.disabled = false; // Re-enable button
        });
    })
    .catch(function (error) {
      console.log("EmailJS failed...", error);
      alert("Failed to send email. Please try again later.");

      // Reset button on failure
      subscribeButton.textContent = originalText; // Reset button text
      if (spinner.parentNode) {
        spinner.parentNode.removeChild(spinner); // Remove spinner
      }
      subscribeButton.disabled = false; // Re-enable button
    });
});

function closeDialog() {
  document.getElementById("thank-you-dialog").style.display = "none";
}
