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

function isDiscounted(product) {
    return Boolean(product.discount) && Number(product.old_price) > Number(product.price);
}

function createProductCard(product) {
    const hasDiscount = isDiscounted(product);
    const priceMarkup = hasDiscount
        ? `<div class="mt-1 flex items-baseline gap-2">
                <span class="font-medium text-rose-700">$${product.price}</span>
                <span class="text-sm text-gray-500 line-through">$${product.old_price}</span>
            </div>`
        : `<p class="mt-1">$${product.price}</p>`;

    return `
        <div class="lg:w-1/4 md:w-1/2 p-4 w-full max-w-[360px]">

            <a class="block relative h-96 sm:h-80 lg:h-48 rounded overflow-hidden"
                href="./product_page.html?id=${product.id}">

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

                ${priceMarkup}

            </div>

        </div>
    `;
}

const filterFields = [
    { key: "brand", label: "Бренд" },
    { key: "category", label: "Категорія" },
    { key: "gender", label: "Стать" },
    { key: "movement", label: "Механізм" },
    { key: "water_resistance", label: "Водозахист" },
    { key: "functions", label: "Функції" },
    { key: "case_material", label: "Матеріал корпусу" },
    { key: "strap_material", label: "Матеріал ремінця" },
    { key: "glass", label: "Скло" },
    { key: "case_size", label: "Розмір корпусу" },
];

let allProducts = [];

function getFilterValue(product, key) {
    return String(product[key] ?? "").trim();
}

function createFilterGroups(products) {
    const groups = document.getElementById("filter-groups");

    groups.innerHTML = filterFields.map(({ key, label }) => {
        const values = [...new Set(products
            .map(product => getFilterValue(product, key))
            .filter(Boolean))].sort((first, second) => first.localeCompare(second, "uk"));

        if (!values.length) return "";

        return `
            <fieldset>
                <legend class="mb-3 text-sm font-semibold text-gray-800">${label}</legend>
                <div class="max-h-40 space-y-2 overflow-y-auto pr-1">
                    ${values.map(value => `
                        <label class="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                            <input type="checkbox" class="filter-option h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" data-filter-key="${key}" value="${value.replace(/"/g, "&quot;")}">
                            <span>${value}</span>
                        </label>
                    `).join("")}
                </div>
            </fieldset>
        `;
    }).join("");

    groups.querySelectorAll(".filter-option").forEach(input => {
        input.addEventListener("change", renderFilteredProducts);
    });
}

function renderFilteredProducts() {
    const search = document.getElementById("product-search").value.trim().toLocaleLowerCase("uk");
    const minPrice = Number(document.getElementById("price-min").value) || 0;
    const maxPriceValue = document.getElementById("price-max").value;
    const maxPrice = maxPriceValue === "" ? Infinity : Number(maxPriceValue);
    const onlyDiscounted = document.getElementById("discount-filter").checked;
    const selected = {};

    document.querySelectorAll(".filter-option:checked").forEach(input => {
        const key = input.dataset.filterKey;
        selected[key] ??= [];
        selected[key].push(input.value);
    });

    let filteredProducts = allProducts.filter(product => {
        const searchableText = `${product.name ?? ""} ${product.brand ?? ""}`.toLocaleLowerCase("uk");
        const matchesSearch = !search || searchableText.includes(search);
        const price = Number(product.price) || 0;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const hasDiscount = isDiscounted(product);
        const matchesOptions = Object.entries(selected).every(([key, values]) => values.includes(getFilterValue(product, key)));

        return matchesSearch && matchesPrice && (!onlyDiscounted || hasDiscount) && matchesOptions;
    });

    const sort = document.getElementById("sort-products").value;
    if (sort === "price-asc") filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name-asc") filteredProducts.sort((a, b) => String(a.name).localeCompare(String(b.name), "uk"));

    document.getElementById("products-container").innerHTML = filteredProducts.map(createProductCard).join("");
    document.getElementById("products-count").textContent = `Знайдено: ${filteredProducts.length}`;
    document.getElementById("empty-products").classList.toggle("hidden", filteredProducts.length > 0);
}

function clearFilters() {
    document.getElementById("product-search").value = "";
    document.getElementById("price-min").value = "";
    document.getElementById("price-max").value = "";
    document.getElementById("discount-filter").checked = false;
    document.getElementById("sort-products").value = "default";
    document.querySelectorAll(".filter-option").forEach(input => {
        input.checked = false;
    });
    renderFilteredProducts();
}

async function showProducts() {

    allProducts = await fatchData();
    createFilterGroups(allProducts);
    renderFilteredProducts();
}

document.getElementById("product-search").addEventListener("input", renderFilteredProducts);
document.getElementById("price-min").addEventListener("input", renderFilteredProducts);
document.getElementById("price-max").addEventListener("input", renderFilteredProducts);
document.getElementById("discount-filter").addEventListener("change", renderFilteredProducts);
document.getElementById("sort-products").addEventListener("change", renderFilteredProducts);
document.getElementById("clear-filters").addEventListener("click", clearFilters);

document.getElementById("filters-toggle").addEventListener("click", () => {
    const button = document.getElementById("filters-toggle");
    const panel = document.getElementById("filters-panel");
    const isOpen = !panel.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(isOpen));
});

showProducts();