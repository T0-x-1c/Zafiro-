const SUPABASE_URL = "https://ooogltaidyqjxtuqtucx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KiFzA_mnt6G1TisM8J3Pyw_98vE2_Vz";

let cart = []

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
}


function displayProduct(product) {

    document.getElementById("product-image").src =
    `./img/${product.name}.jpg`;

    document.getElementById("product-image").alt =
        product.name;


    document.getElementById("product-category").textContent =
        product.category ?? "";


    document.getElementById("product-name").textContent =
        product.name;


    document.getElementById("product-description").textContent =
        product.description ?? "Опис відсутній";


    document.getElementById("product-price").textContent =
        `$${product.price}`;


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


// 1.Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
    if (targetCookie) {

        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURICompoіnent(encodedData));
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