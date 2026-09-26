import os
import requests

IMG_DIR = "img"

os.makedirs(IMG_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}

images = {

    # =========================================================
    # CASIO G-SHOCK
    # =========================================================

    "Casio G-Shock GA-2100-1A1":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA2/GA-2100-1A1/assets/GA-2100-1A1_Seq01.png.transform/main-visual-sp/image.png",

    "Casio G-Shock DW-5600E-1":
        "https://www.casio.com/content/dam/casio/product-info/locales/jp/ja/timepiece/product/watch/D/DW/DW5/DW-5600E-1/assets/DW-5600E-1_Seq1.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GA-B2100-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GA/gab/ga-b2100-1a/assets/GA-B2100-1A.png.transform/main-visual-sp/image.png",

    "Casio G-Shock G-5600E-1":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/G5/G56/G-5600E-1/assets/G-5600E-1_Seq1.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GW-M5610U-1":
        "https://www.casio.com/content/dam/casio/product-info/locales/europe/en-gb/timepiece/product/watch/G/GW/GWM/GW-M5610U-1/assets/GW-M5610U-1.png.transform/main-visual-pc/image.png",

    "Casio G-Shock GA-700-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA7/GA-700-1A/assets/GA-700-1A_Seq1.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GA-100-1A1":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA1/GA-100-1A1/assets/GA-100-1A1_Seq1.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GA-900-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA9/GA-900-1A/assets/GA-900-1A_Seq01.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GA-2100BCE-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA2/ga-2100bce-1a/assets/GA-2100BCE-1A.png.transform/main-visual-sp/image.png",

    "Casio G-Shock DW-5600BCE-1":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/D/DW/DW5/dw-5600bce-1/assets/DW-5600BCE-1.png.transform/main-visual-sp/image.png",

    "Casio G-Shock GA-110-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GA/GA1/GA-110-1A/assets/GA-110-1A_Seq1.png.transform/main-visual-sp/image.png",

    # =========================================================
    # CASIO G-SHOCK
    # =========================================================

    "Casio G-Shock GWG-B1000EC-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/cn/zh/timepiece/product/watch/G/GW/GWG/GWG-B1000EC-1A/assets/GWG-B1000EC-1A.png.transform/main-visual-sp/image.png",

    # =========================================================
    # CASIO EDIFICE
    # =========================================================

    "Casio Edifice ECB-40DC-1A":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EC/ECB/ecb-40dc-1a/assets/ECB-40DC-1A.png.transform/main-visual-sp/image.png",

    "Casio Edifice EFR-S108DE-8AV":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EF/EFR/efr-s108de-8av/assets/EFR-S108DE-8AVU.png.transform/main-visual-sp/image.png",

    "Casio Edifice EFR-574D-1AV":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EF/EFR/efr-574d-1av/assets/EFR-574D-1AVU.png.transform/main-visual-sp/image.png",

    "Casio Edifice EFV-140L-1AV":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EF/EFV/efv-140l-1av/assets/EFV-140L-1AVU.png.transform/main-visual-sp/image.png",

    "Casio Edifice EFR-S567DC-1AV":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EF/EFR/EFR-S567DC-1AV/assets/EFR-S567DC-1AV_Seq1.png.transform/main-visual-sp/image.png",

    "Casio Edifice EFR-S108D-2BV":
        "https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/E/EF/EFR/efr-s108d-2bv/assets/EFR-S108D-2BVU.png.transform/main-visual-sp/image.png",

    # =========================================================
    # SEIKO
    # =========================================================

    "Seiko Prospex SPB481J1":
        "https://www.seikowatches.com/middleeast-en/-/media/Images/Product--Image/All/Seiko/2024/10/07/21/18/SPB481J1/SPB481J1.png?mh=1200&mw=1200",

    "Seiko Prospex SSC935":
        "https://www.seikowatches.com/se-en/-/media/Images/Product--Image/All/Seiko/2023/09/25/08/19/SSC935P1/SSC935P1.png?mh=1200&mw=1200",

    "Seiko 5 Sports SRPD55":
        "https://www.seikowatches.com/us-en/-/media/Images/Product--Image/All/Seiko/2022/02/20/02/14/SRPD55K1/SRPD55K1.png?mh=1200&mw=1200",

    "Seiko 5 Sports SRPE55":
        "https://www.seikowatches.com/uk-en/-/media/Images/Product--Image/All/Seiko/2022/02/20/02/24/SRPE55K1/SRPE55K1.png?mh=1200&mw=1200",

    # =========================================================
    # SEIKO PRESAGE
    # =========================================================

    "Seiko Presage SRPB41":
        "https://i.ebayimg.com/images/g/2L4AAOSw6hVoG5io/s-l1200.png",

    # =========================================================
    # CITIZEN
    # =========================================================

    "Citizen Garrison BM6838-09X":
        "https://www.citizenwatch.com/dw/image/v2/BBQF_PRD/on/demandware.static/-/Sites-citizen-master-catalog/default/dw/"

    # Тут навмисно НЕ ставлю вигаданий URL.
}


# =========================================================
# ЗАВАНТАЖЕННЯ
# =========================================================

success = 0
failed = 0

print("=" * 65)
print("ZAFIRO — завантаження фотографій")
print("=" * 65)

for name, url in images.items():

    print(f"\n{name}")
    print(url)

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=30
        )

        response.raise_for_status()

        content_type = response.headers.get("Content-Type", "")

        if not content_type.startswith("image/"):
            print(f"❌ Не зображення: {content_type}")
            failed += 1
            continue

        file_path = os.path.join(
            IMG_DIR,
            f"{name}.jpg"
        )

        with open(file_path, "wb") as file:
            file.write(response.content)

        size = len(response.content) / 1024

        print(f"✅ Збережено: {file_path}")
        print(f"   {size:.1f} KB")

        success += 1

    except Exception as error:
        print(f"❌ ПОМИЛКА: {error}")
        failed += 1


print("\n" + "=" * 65)
print("РЕЗУЛЬТАТ")
print("=" * 65)

print(f"Успішно: {success}")
print(f"Помилок: {failed}")
print(f"Папка: {os.path.abspath(IMG_DIR)}")