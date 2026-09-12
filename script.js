const SUPABASE_URL = "https://ooogltaidyqjxtuqtucx.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_KiFzA_mnt6G1TisM8J3Pyw_98vE2_Vz"


async function fatchData() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/product`, {
        headers: {
            apiKey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
}

fatchData()

function createProductCard(product) {

    return `
        <div class="lg:w-1/4 md:w-1/2 p-4 w-full">

            <a class="block relative h-48 rounded overflow-hidden"
                href="product_page.html?id=${product.id}">

                <img
                    alt="${product.name}"
                    class="object-cover object-center w-full h-full block"
                    src="./img/${product.name}.jpg"
                >

            </a>

            <div class="mt-4">

                <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">
                    ${product.category ?? "CATEGORY"}
                </h3>

                <h2 class="text-gray-900 title-font text-lg font-medium">
                    ${product.name}
                </h2>

                <p class="mt-1">
                    $${product.price}
                </p>

            </div>

        </div>
    `;
}


async function showProducts() {

    const products = await fatchData();

    const container = document.getElementById("products-container");

    container.innerHTML = products
        .map(product => createProductCard(product))
        .join("");
}


showProducts();