// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL = "https://ooogltaidyqjxtuqtucx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_KiFzA_mnt6G1TisM8J3Pyw_98vE2_Vz"


// ==========================================
// COOKIE
// ==========================================

function getJsonCookie(cookieName) {

    const allCookies = document.cookie.split("; ");

    const targetCookie = allCookies.find(row =>
        row.startsWith(cookieName + "=")
    );

    if (targetCookie) {

        const encodedData = targetCookie.split("=")[1];

        return JSON.parse(
            decodeURIComponent(encodedData)
        );
    }

    return null;
}


function saveJsonCookie(cookieName, data, seconds) {

    const jsonString = JSON.stringify(data);

    const safeString = encodeURIComponent(jsonString);

    document.cookie =
        `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}


// ==========================================
// КОШИК
// ==========================================

let cart = getJsonCookie("cart") || [];


// ==========================================
// ЕЛЕМЕНТИ
// ==========================================

const cartItems = document.getElementById("cartItems");

const subtotal = document.getElementById("subtotal");

const total = document.getElementById("total");

const emptyCart = document.getElementById("emptyCart");

const cartContent = document.getElementById("cartContent");


// ==========================================
// ОТРИМАННЯ ТОВАРІВ З SUPABASE
// ==========================================

async function getCartProducts() {

    if (cart.length === 0) {

        renderEmptyCart();

        return;
    }


    // Отримуємо тільки ID товарів з cookie
    const ids = cart.map(item => item.id);


    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/product?id=in.(${ids.join(",")})&select=*`,
        {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        }
    );


    if (!response.ok) {

        console.error(
            "Помилка отримання товарів:",
            await response.text()
        );

        return;
    }


    const products = await response.json();


    renderCart(products);
}


// ==========================================
// ВІДОБРАЖЕННЯ ПОРОЖНЬОГО КОШИКА
// ==========================================

function renderEmptyCart() {

    emptyCart.classList.remove("hidden");

    cartContent.classList.add("hidden");
}


// ==========================================
// ВІДОБРАЖЕННЯ КОШИКА
// ==========================================

function renderCart(products) {

    cartItems.innerHTML = "";


    let totalPrice = 0;


    products.forEach(product => {

        // Знаходимо кількість товару в cookie
        const cartProduct = cart.find(
            item => item.id === product.id
        );


        if (!cartProduct) return;


        const quantity = cartProduct.quantity;

        const price = Number(product.price);

        const productTotal = price * quantity;


        totalPrice += productTotal;


        const item = document.createElement("div");

        item.className =
            "bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5";


        item.innerHTML = `

            <!-- Фото -->

            <div class="w-28 h-28 bg-[#f5f1e9]
                        rounded-xl flex items-center
                        justify-center flex-shrink-0">

                <img
                    src="./img/${product.name}.png"
                    alt="${product.name}"
                    class="max-h-24 max-w-full object-contain">

            </div>


            <!-- Інформація -->

            <div class="flex-1 min-w-0">

                <h2 class="font-medium text-lg truncate">

                    ${product.name}

                </h2>


                <p class="text-gray-500 text-sm mt-1">

                    ${product.brand || ""}

                </p>


                <!-- Кількість -->

                <div class="flex items-center gap-3 mt-4">

                    <button
                        onclick="changeQuantity(${product.id}, -1)"
                        class="w-8 h-8 rounded-lg
                                bg-gray-100 hover:bg-gray-200">

                        −

                    </button>


                    <span class="min-w-[20px] text-center">

                        ${quantity}

                    </span>


                    <button
                        onclick="changeQuantity(${product.id}, 1)"
                        class="w-8 h-8 rounded-lg
                                bg-gray-100 hover:bg-gray-200">

                        +

                    </button>

                </div>

            </div>


            <!-- Ціна -->

            <div class="text-right flex-shrink-0">

                <p class="font-semibold text-lg">

                    $${productTotal.toFixed(2)}

                </p>


                <p class="text-sm text-gray-400">

                    $${price.toFixed(2)} × ${quantity}

                </p>


                <button
                    onclick="removeProduct(${product.id})"
                    class="text-sm text-red-500
                            hover:text-red-700 mt-3">

                    Видалити

                </button>

            </div>

        `;


        cartItems.appendChild(item);

    });


    // ======================================
    // ПІДСУМОК
    // ======================================

    subtotal.textContent =
        `$${totalPrice.toFixed(2)}`;

    total.textContent =
        `$${totalPrice.toFixed(2)}`;
}


// ==========================================
// ЗМІНА КІЛЬКОСТІ
// ==========================================

function changeQuantity(productId, change) {

    const cartProduct = cart.find(
        item => item.id === productId
    );


    if (!cartProduct) return;


    cartProduct.quantity += change;


    // Якщо кількість 0 — видаляємо
    if (cartProduct.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== productId
        );
    }


    // Оновлюємо cookie

    saveJsonCookie(
        "cart",
        cart,
        3600 * 24 * 7
    );


    // Заново отримуємо товари

    getCartProducts();
}


// ==========================================
// ВИДАЛЕННЯ ТОВАРУ
// ==========================================

function removeProduct(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );


    saveJsonCookie(
        "cart",
        cart,
        3600 * 24 * 7
    );


    getCartProducts();
}


// ==========================================
// ЗАПУСК
// ==========================================

getCartProducts();

