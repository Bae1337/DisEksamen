// Referencer til HTML-elementer for produkter og inputfeltet
const products = document.getElementById("products");
const input = document.getElementById("input");

// Start med at vise produkterne
displayProducts();

// Funktion til at hente produkter fra serveren
async function fetchProducts() {
  try {
    const response = await fetch('/product/getProducts'); // Forespørgsel til serveren om at hente produkter
    if (!response.ok) {
      throw new Error('Failed to fetch products'); // Kaster en fejl, hvis forespørgslen fejler
    }
    productList = await response.json(); // Konverter svaret til JSON-format
    return productList; // Returnér produktlisten
  } catch (error) {
    console.error("Error:", error); // Log fejl til konsollen
    return []; // Returnér en tom liste, hvis der opstår en fejl
  }
}

// Funktion til at vise produkterne på siden
async function displayProducts() {
  const productList = await fetchProducts(); // Hent produkter fra databasen

  const productContainer = document.getElementById("product-list"); // Element til drikkevarer
  const productContainerSandwich = document.getElementById("product-list-sandwich"); // Element til sandwich

  productContainer.innerHTML = ""; // Ryd drikkevare-containeren
  productContainerSandwich.innerHTML = ""; // Ryd sandwich-containeren

  // Gennemløb listen af produkter og opret HTML-elementer for hver
  productList.forEach((product, index) => {
    const productItem = document.createElement("div"); // Opret et div-element til produktet
    productItem.classList.add("product-item"); // Tilføj en CSS-klasse

    // Opret billed-elementet
    const img = document.createElement("img");
    img.src = product.imgsrc; // Brug Cloudinary-URL'en fra databasen
    img.alt = product.productName; // Tilføj produktnavnet som alt-tekst

    // Opret knappen til at tilføje til kurv
    const addToCardButton = document.createElement("button");
    addToCardButton.innerHTML = "Tilføj til kurv"; // Tekst på knappen

    addToCardButton.addEventListener("click", () => addToCart(product.productName, addToCardButton)); // Tilføj klik-event

    // Opret element til produktnavnet
    const productNameElem = document.createElement("h3");
    productNameElem.innerText = product.productName; // Sæt produktnavnet som tekst

    // Opret element til produktprisen
    const productPriceElem = document.createElement("h4");
    productPriceElem.innerText = product.price + " kr"; // Sæt prisen som tekst

    // Tilføj elementerne til produkt-div'en
    productItem.appendChild(img);
    productItem.appendChild(addToCardButton);
    productItem.appendChild(productNameElem);
    productItem.appendChild(productPriceElem);

    // Tilføj produktet til den rigtige kategori baseret på typen
    if (product.type === "drink") {
      productContainer.appendChild(productItem);
    } else if (product.type === "sandwich") {
      productContainerSandwich.appendChild(productItem);
    }
  });
}

// Funktion til at tilføje et produkt til kurven
async function addToCart(productName, addToCardButton) {
  try {
    // Send forespørgsel til serveren for at hente produktdetaljer
    const response = await fetch('/product/getProduct/productName', {
      method: 'POST', // HTTP-metode
      headers: {
        'Content-Type': 'application/json' // Indholdstype som JSON
      },
      body: JSON.stringify({
        productName: productName // Send produktnavnet i body
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart'); // Kaster en fejl, hvis forespørgslen fejler
    }

    const result = await response.json(); // Hent produktdata fra serverens svar

    // Gem produktet i localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Hent eksisterende kurv eller opret en tom liste
    cart.push(result); // Tilføj produktet til kurven
    localStorage.setItem("cart", JSON.stringify(cart)); // Gem kurven i localStorage

    alert(`${productName} er blevet tilføjet til kurven`); // Giv brugeren besked

  } catch (error) {
    console.error("Error:", error); // Log fejl til konsollen
  }
}