const SUPABASE_URL =
    "https://ooogltaidyqjxtuqtucx.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_KiFzA_mnt6G1TisM8J3Pyw_98vE2_Vz";



function getJsonCookie(cookieName) {

    const allCookies = document.cookie.split("; ");

    const targetCookie = allCookies.find(row =>
        row.startsWith(cookieName + "=")
    );

    if (!targetCookie) {
        return null;
    }

    const encodedData =
        targetCookie.split("=")[1];

    try {

        return JSON.parse(
            decodeURIComponent(encodedData)
        );

    } catch (error) {

        console.error(
            "Помилка читання cookie:",
            error
        );

        return null;
    }
}



let cart = getJsonCookie("cart") || [];



const checkoutItems =
    document.getElementById("checkoutItems");

const subtotalElement =
    document.getElementById("subtotal");

const deliveryPriceElement =
    document.getElementById("deliveryPrice");

const totalElement =
    document.getElementById("total");

const emptyCheckout =
    document.getElementById("emptyCheckout");

const checkoutContent =
    document.getElementById("checkoutContent");

const submitOrderButton =
    document.getElementById("submitOrder");



const deliveryPrices = {

    nova_poshta: 3,

    ukrposhta: 2,

    courier: 5

};



async function getCheckoutProducts() {

    // Якщо кошик порожній

    if (cart.length === 0) {

        emptyCheckout.classList.remove("hidden");

        checkoutContent.classList.add("hidden");

        return;
    }


    // ID товарів

    const ids = cart.map(
        item => item.id
    );


    try {

        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/product?id=in.(${ids.join(",")})&select=*`,

            {

                headers: {

                    "apikey": SUPABASE_ANON_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_ANON_KEY}`

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


        const products =
            await response.json();


        renderCheckout(products);


    } catch (error) {

        console.error(
            "Помилка:",
            error
        );

    }

}



function renderCheckout(products) {

    checkoutItems.innerHTML = "";


    let subtotal = 0;


    products.forEach(product => {


        // Знаходимо товар у cookie

        const cartProduct =
            cart.find(
                item => item.id === product.id
            );


        if (!cartProduct) {
            return;
        }


        // Кількість

        const quantity =
            cartProduct.quantity;


        // Ціна

        const price =
            Number(product.price);


        // Сума конкретного товару

        const productTotal =
            price * quantity;


        // Загальна сума

        subtotal += productTotal;


        // Створюємо елемент

        const item =
            document.createElement("div");


        item.className =
            "flex gap-4";


        item.innerHTML = `


            <div
                class="w-20 h-20 rounded-xl bg-[#f5f1e9]
                        flex items-center justify-center
                        flex-shrink-0"
            >

                <img
                    src="./img/${product.name}.png"
                    alt="${product.name}"
                    class="max-w-full max-h-20 object-contain"
                >

            </div>


            <!--INFO -->

            <div class="flex-1 min-w-0">

                <h3 class="font-medium text-sm truncate">

                    ${product.name}

                </h3>


                <p class="text-xs text-gray-500 mt-1">

                    ${product.brand || ""}

                </p>


                <p class="text-xs text-gray-500 mt-2">

                    Кількість: ${quantity}

                </p>

            </div>


            <!--PRICE -->

    <div class="text-right flex-shrink-0">

        <p class="font-medium text-sm">

            $${productTotal.toFixed(2)}

        </p>

        <p class="text-xs text-gray-400 mt-1">

            $${price.toFixed(2)} × ${quantity}

        </p>

    </div>

`;


        checkoutItems.appendChild(item);

    });


    // Зберігаємо subtotal

    window.checkoutSubtotal =
        subtotal;


    updateTotal();

}


function updateTotal() {

    const selectedDelivery =
        document.querySelector(
            'input[name="delivery"]:checked'
        );


    const deliveryMethod =
        selectedDelivery
            ? selectedDelivery.value
            : "nova_poshta";


    const deliveryPrice =
        deliveryPrices[deliveryMethod];


    const subtotal =
        window.checkoutSubtotal || 0;


    const total =
        subtotal + deliveryPrice;


    subtotalElement.textContent =
        `$${subtotal.toFixed(2)}`;


    deliveryPriceElement.textContent =
        `$${deliveryPrice.toFixed(2)}`;


    totalElement.textContent =
        `$${total.toFixed(2)}`;

}



document
    .querySelectorAll('input[name="delivery"]')
    .forEach(radio => {

        radio.addEventListener(
            "change",
            updateTotal
        );

    });


submitOrderButton.addEventListener(
    "click",
    submitOrder
);


function submitOrder() {



    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const comment =
        document.getElementById("comment").value.trim();



    if (
        !firstName ||
        !lastName ||
        !phone ||
        !city ||
        !address
    ) {

        alert(
            "Будь ласка, заповніть усі обов'язкові поля."
        );

        return;
    }



    const delivery =
        document.querySelector(
            'input[name="delivery"]:checked'
        ).value;



    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;



    const order = {

        customer: {

            firstName,

            lastName,

            phone,

            email

        },


        delivery: {

            method: delivery,

            city,

            address

        },


        payment,

        comment,


        products: cart,


        subtotal:
            window.checkoutSubtotal || 0,


        deliveryPrice:
            deliveryPrices[delivery],


        total:
            (window.checkoutSubtotal || 0) +
            deliveryPrices[delivery]

    };




    console.log(
        "Замовлення:",
        order
    );


    alert(
        "Замовлення сформовано!"
    );

}

getCheckoutProducts();
