const products = document.getElementById("products");
const input = document.getElementById("input");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

let username = getCookie("userAuth");
if (!username) {
  location.href = "/";
}

displayProducts()

async function fetchProducts() {
  try {
    const response = await fetch('/product/getProducts');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    productList = await response.json(); 
    return productList;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function displayProducts() {
  const productList = await fetchProducts(); // Fetch products from the database

  const productContainer = document.getElementById("product-list");

  productContainer.innerHTML = ""; // Clear the container

  productList.forEach((product, index) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");

    // Create the image element
    const img = document.createElement("img");
    img.src = product.imgsrc; // Directly use the Cloudinary URL from the database
    img.alt = product.productName;

    // Create the add-to-cart button
    const addToCardButton = document.createElement("button");
    addToCardButton.innerHTML = "Tilføj til kurv";

    addToCardButton.addEventListener("click", () => addToCart(product.productName, addToCardButton));

    // Create the product name element
    const productNameElem = document.createElement("h3");
    productNameElem.innerText = product.productName;

    // Append elements to the product item
    productItem.appendChild(img);
    productItem.appendChild(addToCardButton);
    productItem.appendChild(productNameElem);

    // Append the product item to the container
    productContainer.appendChild(productItem);
  });
}


async function addToCart(productName, addToCardButton) {
  try {
    const response = await fetch('/product/getProduct/productName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productName: productName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const result = await response.json();

    // Gem resultatet i localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(result);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${productName} er blevet tilføjet til kurven`);

  } catch (error) {
    console.error("Error:", error);
  }
}

