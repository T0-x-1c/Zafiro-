const SUPABASE_URL = "https://ooogltaidyqjxtuqtucx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KiFzA_mnt6G1TisM8J3Pyw_98vE2_Vz";

let cart = getJsonCookie("cart") || [];

async function fetchProduct() {

    // Отримуємо ID з URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        console.error("ID товару не знайдено");
        return;
    }


    // Запит до Supabase
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/product?id=eq.${productId}`,
        {
            headers: {
                apiKey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        }
    );


    if (!response.ok) {
        console.error("Помилка запиту:", response.status);
        return;
    }


    const data = await response.json();

    console.log("Отриманий товар:", data);


    if (data.length === 0) {
        console.error("Товар не знайдено");
        return;
    }


    const product = data[0];

    displayProduct(product);
    showCharacteristics(product);
}


function displayProduct(product) {

    document.getElementById("product-image").src =
    `./img/${product.name}.png`;

    document.getElementById("product-image").alt =
        product.name;


    document.getElementById("product-category").textContent =
        product.category ?? "";


    document.getElementById("product-name").textContent =
        product.name;


    document.getElementById("product-description").textContent =
        product.description ?? "Опис відсутній";


    const productPrice = Number(product.price);
    const oldPrice = Number(product.old_price);
    const hasDiscount = Boolean(product.discount) && oldPrice > productPrice;
    const priceElement = document.getElementById("product-price");
    const oldPriceElement = document.getElementById("product-old-price");

    priceElement.textContent = `$${product.price}`;
    priceElement.classList.toggle("text-rose-700", hasDiscount);
    oldPriceElement.textContent = hasDiscount ? `$${product.old_price}` : "";
    oldPriceElement.classList.toggle("hidden", !hasDiscount);


    document.getElementById("product-quantity").textContent =
        product.quantity > 0
            ? `Є в наявності (${product.quantity} шт.)`
            : "Немає в наявності";

    document.getElementById("add-to-cart-button").onclick = function () {
        addToCart(product);

        successMessage();
    };

}

function successMessage() {
    const messageElement = document.getElementById("success-message");

    // Спочатку робимо елемент видимим для рендерингу (прибираємо invisible)
    messageElement.classList.remove('invisible'); 

    // Наступний кадр (невеликий таймаут, щоб браузер встиг помітити зміну invisible і запустив анімацію)
    requestAnimationFrame(() => {
        // 1. ПОЯВА (Випадає зверху)
        messageElement.classList.remove('opacity-0', '-translate-y-10', 'pointer-events-none');
        messageElement.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    });

    // 2. ЗНИКНЕННЯ (Через 3 секунди плавно тане назад)
    setTimeout(() => {
        // Повертаємо початкові класи Tailwind для анімації ховання
        messageElement.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        messageElement.classList.add('opacity-0', '-translate-y-10', 'pointer-events-none');
        
        // Повністю ховаємо елемент з видимості ТІЛЬКИ після того, як закінчиться CSS анімація (300мс)
        setTimeout(() => {
            messageElement.classList.add('invisible');
        }, 300); // 300мс відповідає класу duration-300
    }, 3000);
}


// ==========================================
// TABS
// ==========================================

const descriptionTab =
    document.getElementById("description-tab");

const characteristicsTab =
    document.getElementById("characteristics-tab");

const descriptionContent =
    document.getElementById("description-content");

const characteristicsContent =
    document.getElementById("characteristics-content");


descriptionTab.addEventListener("click", () => {

    // Показуємо description
    descriptionContent.classList.remove("hidden");

    // Ховаємо characteristics
    characteristicsContent.classList.add("hidden");


    // Активна вкладка
    descriptionTab.classList.add(
        "text-blue-600",
        "border-blue-500"
    );

    descriptionTab.classList.remove(
        "text-gray-700",
        "border-transparent"
    );


    // Неактивна вкладка
    characteristicsTab.classList.remove(
        "text-blue-600",
        "border-blue-500"
    );

    characteristicsTab.classList.add(
        "text-gray-700",
        "border-transparent"
    );

});


characteristicsTab.addEventListener("click", () => {

    // Ховаємо description
    descriptionContent.classList.add("hidden");

    // Показуємо characteristics
    characteristicsContent.classList.remove("hidden");


    // Активна вкладка
    characteristicsTab.classList.add(
        "text-blue-600",
        "border-blue-500"
    );

    characteristicsTab.classList.remove(
        "text-gray-700",
        "border-transparent"
    );


    // Неактивна вкладка
    descriptionTab.classList.remove(
        "text-blue-600",
        "border-blue-500"
    );

    descriptionTab.classList.add(
        "text-gray-700",
        "border-transparent"
    );

});


// ==========================================
// ХАРАКТЕРИСТИКИ ТОВАРУ
// ==========================================

function showCharacteristics(product) {

    const container =
        document.getElementById("product-characteristics");


    container.innerHTML = "";


    const characteristics = [

        {
            name: "Brand",
            value: product.brand
        },

        {
            name: "Category",
            value: product.category
        },

        {
            name: "Gender",
            value: product.gender
        },

        {
            name: "Movement",
            value: product.movement
        },

        {
            name: "Water resistance",
            value: product.water_resistance
        },

        {
            name: "Functions",
            value: product.functions
        },

        {
            name: "Case material",
            value: product.case_material
        },

        {
            name: "Strap material",
            value: product.strap_material
        },

        {
            name: "Glass",
            value: product.glass
        },

        {
            name: "Case size",
            value: product.case_size
        },

        {
            name: "Weight",
            value: product.weight
        }

    ];


    characteristics.forEach(item => {

        // Не показуємо порожні характеристики
        if (
            item.value === null ||
            item.value === undefined ||
            item.value === ""
        ) {
            return;
        }


        const row =
            document.createElement("div");


        row.className =
            "flex justify-between gap-4 py-3";


        row.innerHTML = `

            <span class="font-medium text-gray-700">
                ${item.name}
            </span>

            <span class="text-gray-500 text-right">
                ${item.value}
            </span>

        `;


        container.appendChild(row);

    });

}



// 1.Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
    if (targetCookie) {

        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(encodedData));
    }
    return null;
}

// 2. Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}

function addToCart(product) {
    if (!product) return;
    const cartProduct = cart.find(p => p.id === product.id);
    if (cartProduct) {
        cartProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }
    saveJsonCookie(
        "cart",
        cart,
        3600 * 24 * 7
    );
    console.log("Додано в кошик:", cart);
}

fetchProduct();

