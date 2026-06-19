/* ==========================================================================
   Elecom catalog data — sourced from www.elecom.co.il
   - CATEGORIES: key -> Hebrew label (real Elecom categories)
   - SUBCATEGORIES: key -> array of Hebrew sub-category labels
   - REVIEWS: 6 verbatim customer reviews
   - ICONS: key -> inline SVG placeholder per category
   - PRODUCTS: real Elecom products with actual names and prices
   ========================================================================== */

const CATEGORIES = {
  cleaning:   "ניקיון",
  care:       "טיפוח אישי",
  phones:     "טלפונים",
  multimedia: "נגני mp3 ומולטימדיה",
  winter:     "מוצרי חורף",
  kitchen:    "למטבח בישול ואפיה",
  scooters:   "קורקינטים חשמליים",
};

/* Sub-categories per main category — used by hover dropdowns in nav and product page. */
const SUBCATEGORIES = {
  cleaning:   ["שואבי אבק", "שואבי אבק ניטענים", "ניקוי בקיטור", "מגהצים", "מכונות כביסה"],
  care:       ["מכונות גילוח", "מכונות תספורת", "מייבשי שיער", "מעצבי שיער", "מברשת שיניים חשמלית"],
  phones:     ["טלפון שולחני", "טלפון אלחוטי"],
  multimedia: ["טלוויזיות", "רדיו", "אוזניות ורמקולים", "ממירים", "אנטנות", "רשמקולים"],
  winter:     ["מאווררים", "תנורי חימום", "רדיאטורים"],
  kitchen:    ["מיקרוגל", "מצנמים", "טוסטר אובן", "מיקסרים ובלנדרים", "סירי בישול", "מעבד מזון"],
  scooters:   [], // matches the real 8-category nav; no products yet (do not invent any)
};

/* Stock product photos (Unsplash License — free commercial use) mapped per sub-category.
   Every product without a specific image falls back to its sub-category photo. */
const SUBIMAGES = {
  "מכונות תספורת": "assets/img/products/clipper.jpg",
  "מכונות גילוח": "assets/img/products/shaver.jpg",
  "מייבשי שיער": "assets/img/products/hairdryer.jpg",
  "מברשת שיניים חשמלית": "assets/img/products/toothbrush.jpg",
  "מעצבי שיער": "assets/img/products/straightener.jpg",
  "טלפון אלחוטי": "assets/img/products/cordphone.jpg",
  "טלפון שולחני": "assets/img/products/deskphone.jpg",
  "טלוויזיות": "assets/img/products/tv.jpg",
  "רדיו": "assets/img/products/radio.jpg",
  "אוזניות ורמקולים": "assets/img/products/speaker.jpg",
  "רשמקולים": "assets/img/products/radio.jpg",
  "ממירים": "assets/img/products/tv.jpg",
  "אנטנות": "assets/img/products/tv.jpg",
  "מאווררים": "assets/img/products/fan.jpg",
  "תנורי חימום": "assets/img/products/heater.jpg",
  "רדיאטורים": "assets/img/products/heater.jpg",
  "שואבי אבק": "assets/img/products/vacuum.jpg",
  "שואבי אבק ניטענים": "assets/img/products/vacuum.jpg",
  "ניקוי בקיטור": "assets/img/products/vacuum.jpg",
  "מגהצים": "assets/img/products/iron.jpg",
  "מכונות כביסה": "assets/img/products/washer.jpg",
  "מיקסרים ובלנדרים": "assets/img/products/mixer.jpg",
  "מעבד מזון": "assets/img/products/foodproc.jpg",
  "מיקרוגל": "assets/img/products/microwave.jpg",
  "מצנמים": "assets/img/products/toaster.jpg",
  "טוסטר אובן": "assets/img/products/toaster.jpg",
  "סירי בישול": "assets/img/products/cooker.jpg",
  "מחבת חשמלי": "assets/img/products/coffee.jpg",
};

/* Real customer reviews from elecom.co.il (verbatim) — used by the home cube. */
const REVIEWS = [
  { name: "מץ",    text: "מוצר מעולה באיכות גבוהה מאוד, החברה מתחייבת על המוצרים שלה ואחריות. כל הכבוד!" },
  { name: "נועה",  text: "מוצר טוב מאוד וזול לעומת חנויות אחרות, שירות טוב מאוד. החברה עובדת בהגינות — מומלץ מאוד לקנות, מחירים טובים ואחריות מעולה." },
  { name: "ולאד",  text: "שירות מצוין, חברה אמינה מאוד עם שירות לקוחות מעולה. קניתי כמה פעמים דרכם — תמיד שירות טוב ומוצרים איכותיים. ממליץ בחום!" },
  { name: "רועי",  text: "שירות מעולה כל הזמן! אם יש שאלות הם עוזרים במהירות. כל המוצרים שקניתי תמיד תקינים, המחיר טוב ושירות הלקוחות מדהים." },
  { name: "דנה",   text: "מרוצה מאוד! המוצרים איכותיים, המשלוח הגיע מהר והשירות אדיב ומקצועי. אחזור לקנות שוב." },
  { name: "כרמית", text: "המוצר הגיע תוך 5 ימים, בדיוק כמו בתמונה. מרוצה מאוד מההזמנה ומהשירות הטוב!" },
];

const ICONS = {
  cleaning:   '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 8l4 22"/><path d="M30 30h28l-3 18a4 4 0 0 1-4 3H37a4 4 0 0 1-4-3z"/><path d="M30 38h28"/><path d="M40 8a5 5 0 0 1 10 0"/><circle cx="16" cy="48" r="6"/><path d="M22 48h11"/></svg>',
  care:       '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="5"/><path d="M35 33l6 6"/><path d="M41 39l12 12a3 3 0 0 1-4 4L37 43z"/></svg>',
  phones:     '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="20" y="6" width="24" height="52" rx="5"/><path d="M20 16h24"/><path d="M20 48h24"/><circle cx="32" cy="53" r="1.6"/></svg>',
  multimedia: '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="12" width="52" height="34" rx="4"/><path d="M22 52h20"/><path d="M32 46v6"/><path d="M24 26l14 7-14 7z" fill="currentColor" stroke="none"/></svg>',
  winter:     '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M32 6v52M6 32h52M14 14l36 36M50 14 14 50"/><circle cx="32" cy="32" r="5"/></svg>',
  kitchen:    '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10h24l-3 16H23z"/><path d="M28 26l-2 14a6 6 0 0 0 6 6 6 6 0 0 0 6-6l-2-14"/><path d="M32 46v8"/><path d="M24 54h16"/></svg>',
  scooters:   '<svg class="cat-icon-img" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14" cy="48" r="7"/><circle cx="50" cy="48" r="7"/><path d="M21 48h22l9-34h6"/><path d="M43 14l-2 8"/></svg>',
};

/* ==========================================================================
   PRODUCTS — real Elecom products scraped from www.elecom.co.il
   img: local path if available, else null (falls back to ICONS[category] SVG)
   sub: sub-category label (matches SUBCATEGORIES entries)
   ========================================================================== */
const PRODUCTS = [
  // ----- טיפוח אישי — מכונות תספורת -----
  { id: "care-andis-ts2",   name: "מכונת תספורת Andis TS-2",                category: "care", sub: "מכונות תספורת", price: 279, img: null, tag: "מומלץ",      desc: "מכונת תספורת מקצועית עם להבים מתחלפים ופעולה שקטה." },
  { id: "care-moser-4416",  name: "מכונת תספורת MOSER 4416",                category: "care", sub: "מכונות תספורת", price: 298, img: "assets/img/media_6.png", tag: "נמכר ביותר", desc: "תוצרת גרמניה — חדה, עמידה ומדויקת לתספורת ביתית מושלמת." },
  { id: "care-moser-4431",  name: "מכונת תספורת MOSER 4431-51",             category: "care", sub: "מכונות תספורת", price: 225, img: null,                    desc: "דגם מקצועי של MOSER עם ראש רחב לתספורת מהירה." },
  { id: "care-wahl-det",    name: "מכונת תספורת Wahl Detailer 08081-016",   category: "care", sub: "מכונות תספורת", price: 380, img: null,                    desc: "מכונה אלחוטית מקצועית לפירוט ועיצוב קווים מושלמים." },
  { id: "care-wahl-clip",   name: "מכונת תספורת Wahl Cordless Magic Clip 8148", category: "care", sub: "מכונות תספורת", price: 395, img: null,               desc: "Magic Clip האגדית בגרסה אלחוטית — תספורת מדויקת ללא חוטים." },
  { id: "care-rowenta",     name: "מכונת תספורת Rowenta CF7212",             category: "care", sub: "מכונות תספורת", price: 300, img: null,                    desc: "ראש קרמי, 13 מסרקי אורך וטכנולוגיה צרפתית." },
  { id: "care-panasonic-gp", name: "מכונת תספורת Panasonic ER-GP80k",       category: "care", sub: "מכונות תספורת", price: 520, img: null,                    desc: "לייני מקצועי של פנסוניק, גוזז נטען עם ראש 45°." },
  { id: "care-omega",       name: "מכונת תספורת OMEGA OM-950",               category: "care", sub: "מכונות תספורת", price: 85,  img: null,                    desc: "מכונת תספורת ביתית קומפקטית עם 4 מסרקים." },
  // --- מכונות גילוח ---
  { id: "care-braun-1170",  name: "מכונת גילוח Braun 1170",                  category: "care", sub: "מכונות גילוח",   price: 150, img: null,                    desc: "מגלח BRAUN Series 1 — גילוח נקי ועדין לעור רגיש." },
  { id: "care-braun-heads", name: "ראשי גילוח Braun (חילוף)",               category: "care", sub: "מכונות גילוח",   price: 119, img: null,                    desc: "ראשים חילופיים מקוריים Braun, תואמים לדגמי Series 3." },
  // --- מייבשי שיער ---
  { id: "care-parlux-3600", name: "מייבש שיער PARLUX 3600",                  category: "care", sub: "מייבשי שיער",    price: 545, img: null, tag: "מומלץ",      desc: "מייבש מקצועי 2200W, נוזל יוני, 2 מהירויות — קל ועמיד." },
  { id: "care-parlux-4600", name: "מייבש שיער Parlux 4600",                  category: "care", sub: "מייבשי שיער",    price: 645, img: null,                    desc: "דגם הפרימיום של Parlux עם טכנולוגיית יון מתקדמת." },
  // --- מברשת שיניים ---
  { id: "care-oral-b-1",    name: "מברשת שיניים BRAUN ORAL-B",               category: "care", sub: "מברשת שיניים חשמלית", price: 72, img: null,               desc: "מברשת שיניים חשמלית Oral-B עם ראש מסתובב." },
  { id: "care-oral-b-2",    name: "מברשת שיניים BRAUN ORAL-B (חילופית)",    category: "care", sub: "מברשת שיניים חשמלית", price: 70, img: null,               desc: "ראשי חילוף למברשת Oral-B — 2 יחידות בחבילה." },
  // --- מסירי שיער ---
  { id: "care-dafni",       name: "מברשת מחליקה DAFNI",                      category: "care", sub: "מעצבי שיער",     price: 229, img: "assets/img/media_8.png", desc: "מחליקה את השיער במחי תנועה אחד — חימום מהיר וטכנולוגיה קרמית." },

  // ----- טלפונים — אלחוטי -----
  { id: "ph-uniden-8401",   name: "טלפון אלחוטי Uniden AS8401",              category: "phones", sub: "טלפון אלחוטי", price: 149, img: null, tag: "מומלץ",     desc: "טלפון DECT ענטנה כפולה, שיחה עד 10 שעות, ID מתקשר." },
  { id: "ph-uniden-7401",   name: "טלפון אלחוטי Uniden AS7401",              category: "phones", sub: "טלפון אלחוטי", price: 149, img: null,                    desc: "DECT 6.0 עם תאורה, מסך גדול ואיכות שמע גבוהה." },
  { id: "ph-pan-tgd310",    name: "טלפון אלחוטי Panasonic KXTGD310",         category: "phones", sub: "טלפון אלחוטי", price: 280, img: null,                    desc: "ידנית ארגונומית, ניטרול רעשים מתקדם, ID מתקשר." },
  { id: "ph-pan-tgd313",    name: "טלפון אלחוטי Panasonic KXTGD313",         category: "phones", sub: "טלפון אלחוטי", price: 549, img: null,                    desc: "ערכת 3 ידניות, Link-to-Cell, ניטרול רעש מתקדם." },
  { id: "ph-pan-tgb210",    name: "טלפון אלחוטי Panasonic KXTGB210",         category: "phones", sub: "טלפון אלחוטי", price: 195, img: null,                    desc: "עיצוב קומפקטי, מסך אחורי, 50 שמות בזיכרון." },
  { id: "ph-vtech-slb150",  name: "טלפון אלחוטי VTECH SLB150",               category: "phones", sub: "טלפון אלחוטי", price: 198, img: null,                    desc: "VTech DECT עם ספקטרום נרחב ושמע קריסטלי." },
  { id: "ph-pan-tgc412",    name: "טלפון אלחוטי Panasonic KX-TGC412",        category: "phones", sub: "טלפון אלחוטי", price: 299, img: null,                    desc: "ערכת שתי ידניות, מסכי LCD גדולים, GAP טכנולוגיה." },
  { id: "ph-vtech-fs6414",  name: "טלפון אלחוטי VTech FS6414-2A",            category: "phones", sub: "טלפון אלחוטי", price: 350, img: null,                    desc: "ערכת 2+1 ידניות, מסכי צבע, מענה אוטומטי." },
  { id: "ph-pan-tgc410",    name: "טלפון אלחוטי Panasonic KX-TGC410",        category: "phones", sub: "טלפון אלחוטי", price: 220, img: null,                    desc: "ידנית בודדת, מסך 1.6 אינץ', 50 שמות בזיכרון." },
  { id: "ph-moto-s3002",    name: "טלפון אלחוטי Motorola S3002",              category: "phones", sub: "טלפון אלחוטי", price: 299, img: null,                    desc: "DECT מוטורולה עם שמע ברור ועיצוב סלים." },
  { id: "ph-uniden-at41062", name: "טלפון אלחוטי Uniden AT4106-2WH",         category: "phones", sub: "טלפון אלחוטי", price: 299, img: null,                    desc: "ערכת 2 ידניות, מסכי LED גדולים, ID מתקשר." },
  { id: "ph-uniden-at4106", name: "טלפון אלחוטי Uniden AT4106",               category: "phones", sub: "טלפון אלחוטי", price: 199, img: null,                    desc: "DECT עם ידנית אחת, מסך גדול ואיכות שמע גבוהה." },
  { id: "ph-pan-tg6812",    name: "טלפון אלחוטי Panasonic KXTG6812",          category: "phones", sub: "טלפון אלחוטי", price: 399, img: null,                    desc: "ערכת 2 ידניות Link-to-Cell לחיבור לסמארטפון." },
  // --- שולחני ---
  { id: "ph-pan-ts880",     name: "טלפון שולחני Panasonic KXTS880",           category: "phones", sub: "טלפון שולחני", price: 239, img: null,                    desc: "טלפון שולחני קלאסי עם שפופרת מוגברת ו-ID מתקשר." },
  { id: "ph-pan-ts500",     name: "טלפון שולחני Panasonic TS500",             category: "phones", sub: "טלפון שולחני", price: 95,  img: null,                    desc: "טלפון שולחני פשוט ואמין, מסך גדול לראייה קלה." },
  { id: "ph-philips-m20b",  name: "טלפון שולחני Philips M20B/00",             category: "phones", sub: "טלפון שולחני", price: 143, img: null,                    desc: "פיליפס בעל מסך מואר, זיכרון 20 מספרים ועמידות גבוהה." },

  // ----- נגני mp3 ומולטימדיה — טלוויזיות -----
  { id: "tv-sam-43du7100",  name: "טלוויזיה Samsung UE43DU7100 4K 43 אינץ'",  category: "multimedia", sub: "טלוויזיות",  price: 1499, img: null, tag: "חדש",   desc: "Samsung Crystal UHD 43 אינץ', 4K, HDR, Smart TV." },
  { id: "tv-sam-65du7100",  name: "טלוויזיה Samsung UE65DU7100 4K 65 אינץ'",  category: "multimedia", sub: "טלוויזיות",  price: 2390, img: null,               desc: "Samsung Crystal 4K 65 אינץ', HDR10+, Tizen OS." },
  { id: "tv-sam-65u8000",   name: "טלוויזיה Samsung UE65U8000F 4K 65 אינץ'",  category: "multimedia", sub: "טלוויזיות",  price: 1950, img: null,               desc: "Samsung 4K QLED 65 אינץ', 144Hz, Smart TV עם Tizen." },
  { id: "tv-sam-32h5000",   name: "טלוויזיה Samsung UE32H5000F HD 32 אינץ'",  category: "multimedia", sub: "טלוויזיות",  price: 990,  img: null,               desc: "Full HD 32 אינץ', 2 HDMI, USB, עיצוב דק." },
  { id: "tv-tcl-55p7k",     name: "טלוויזיה TCL 55P7K 4K 55 אינץ'",          category: "multimedia", sub: "טלוויזיות",  price: 1849, img: null,               desc: "TCL 4K HDR 55 אינץ', Google TV, Dolby Atmos, MEMC." },
  { id: "tv-tcl-65p7k",     name: "טלוויזיה TCL 65P7K 4K 65 אינץ'",          category: "multimedia", sub: "טלוויזיות",  price: 2290, img: null,               desc: "TCL 4K HDR 65 אינץ', Google TV, Dolby Vision ואטמוס." },
  { id: "tv-tcl-75p7k",     name: "טלוויזיה TCL 75P7K 4K 75 אינץ'",          category: "multimedia", sub: "טלוויזיות",  price: 3190, img: null,               desc: "TCL 4K 75 אינץ', Google TV, MEMC, Dolby Atmos." },
  { id: "tv-tcl-43p635",    name: "טלוויזיה TCL 43P635 4K 43 אינץ'",          category: "multimedia", sub: "טלוויזיות",  price: 1420, img: null,               desc: "TCL 4K 43 אינץ', Android TV, HDR10, Dolby Audio." },
  { id: "tv-haier-43k85",   name: "טלוויזיה Haier H43K85FUX 4K 43 אינץ'",    category: "multimedia", sub: "טלוויזיות",  price: 1090, img: null,               desc: "Haier QLED 4K 43 אינץ', Google TV, DTS Virtual X." },
  { id: "tv-haier-50k85",   name: "טלוויזיה Haier H50K85FUX 4K 50 אינץ'",    category: "multimedia", sub: "טלוויזיות",  price: 1290, img: null,               desc: "Haier QLED 4K 50 אינץ', Google TV, HDR10+, 60Hz." },
  { id: "tv-haier-50s80",   name: "טלוויזיה Haier H50S80FUX 4K 50 אינץ'",    category: "multimedia", sub: "טלוויזיות",  price: 1589, img: null,               desc: "Haier 4K OLED 50 אינץ', Google TV, Dolby Vision." },
  { id: "tv-tcl-32s5400",   name: "טלוויזיה TCL 32S5400AF Full HD 32 אינץ'", category: "multimedia", sub: "טלוויזיות",  price: 849,  img: null,               desc: "TCL Full HD 32 אינץ', Android TV, HDR, Dolby Audio." },
  // --- רדיו ---
  { id: "rad-sangean-prd4bt", name: "רדיו Sangean PR-D4BT",                   category: "multimedia", sub: "רדיו",        price: 499,  img: null,               desc: "רדיו נייד DAB+/FM עם Bluetooth ושמע עשיר." },
  { id: "rad-sangean-prd18",  name: "רדיו Sangean PRD18",                     category: "multimedia", sub: "רדיו",        price: 370,  img: null,               desc: "רדיו FM/AM אנלוגי נייד, עמיד ואיכותי." },
  { id: "rad-sangean-dh1000", name: "רדיו שעון Sangean DH-1000",              category: "multimedia", sub: "רדיו",        price: 478,  img: null,               desc: "רדיו שעון עם תאורה, מעורר כפול ושמע FM/AM." },
  { id: "rad-pan-rxdu10k",    name: "מערכת שמע Panasonic RX-DU10K",           category: "multimedia", sub: "רדיו",        price: 399,  img: "assets/img/BN_157.jpg", tag: "מומלץ", desc: "מערכת שמע ביתית עם Bluetooth, FM, USB ו-CD." },
  { id: "rad-pan-rf2400",     name: "רדיו Panasonic RF2400",                   category: "multimedia", sub: "רדיו",        price: 150,  img: null,               desc: "רדיו נייד קומפקטי AM/FM, סוללות AA." },
  { id: "rad-pan-rxd550",     name: "רדיו Panasonic RX-D550",                  category: "multimedia", sub: "רדיו",        price: 499,  img: null,               desc: "מגהה נייד עם Bluetooth, CD, FM/AM ו-USB." },
  { id: "rad-pan-rfp50d",     name: "רדיו Panasonic RF-P50D",                  category: "multimedia", sub: "רדיו",        price: 89,   img: null,               desc: "רדיו ידני FM/AM פשוט ואמין לשימוש יומיומי." },
  { id: "rad-pan-pm250",      name: "מערכת שמע Panasonic SC-PM250",            category: "multimedia", sub: "רדיו",        price: 499,  img: null,               desc: "מערכת מיני עם CD, Bluetooth, USB, FM — 80W." },
  // --- רמקולים ואוזניות ---
  { id: "spk-jbl-flip7",      name: "רמקול JBL Flip 7",                       category: "multimedia", sub: "אוזניות ורמקולים", price: 360, img: null, tag: "חדש", desc: "רמקול Bluetooth נייד, עמיד למים IP67, 12 שעות סוללה." },
  { id: "spk-jbl-charge5",    name: "רמקול JBL Charge 5",                     category: "multimedia", sub: "אוזניות ורמקולים", price: 493, img: null,            desc: "רמקול Bluetooth עמיד IP67 עם Power Bank מובנה." },
  // --- רשמקולים ---
  { id: "rec-philips-dvt1250", name: "רשמקול Philips DVT1250",                category: "multimedia", sub: "רשמקולים",   price: 320,  img: null,               desc: "רשמקול דיגיטלי 8GB, USB ישיר, הפעלה פשוטה." },
  { id: "rec-olympus-vn541",   name: "רשמקול Olympus VN-541PC",               category: "multimedia", sub: "רשמקולים",   price: 320,  img: null,               desc: "רשמקול קומפקטי עם 4GB פנימי ו-USB." },
  // --- ממירים ואנטנות ---
  { id: "cvt-sakal-skl06b",   name: "ממיר SAKAL SKL-06B DVB-T2",              category: "multimedia", sub: "ממירים",      price: 180,  img: null,               desc: "ממיר ל-DVB-T2 עם תמיכה ב-4K ו-USB PVR." },
  { id: "ant-sakal-eu009",    name: "אנטנה SAKAL EU-009",                     category: "multimedia", sub: "אנטנות",      price: 125,  img: null,               desc: "אנטנה לממיר דיגיטלי לשידורים ב-UHF/VHF." },

  // ----- ניקיון -----
  { id: "cln-midea-m600",     name: "שואב אבק Midea M600",                    category: "cleaning", sub: "שואבי אבק",        price: 436,  img: null,           desc: "שואב אבק חוטי 2200W עם מיכל 2.5 ליטר וסינון HEPA." },
  { id: "cln-shark-ch953",    name: "שואב אבק Shark CH953",                   category: "cleaning", sub: "שואבי אבק",        price: 349,  img: null,           desc: "שואב אבק אלחוטי נטען, קל משקל עם זמן פעולה 40 דק'." },
  { id: "cln-dyson-v15s",     name: "שואב אבק Dyson V15s Detect Submarine",   category: "cleaning", sub: "שואבי אבק ניטענים", price: 3189, img: null, tag: "פרימיום", desc: "Dyson V15 עם חיישן לייזר לגילוי אבק, עמוד ניקוי לרצפות קשות." },
  { id: "cln-xiaomi-e10",     name: "שואב אבק רובוטי Xiaomi Mi Robot E10",    category: "cleaning", sub: "שואבי אבק",        price: 999,  img: null,           desc: "רובוט שואב אבק עם ניווט LDS, 2700 Pa ושטיפה בו-זמנית." },
  { id: "cln-shark-wd213",    name: "שואב אבק Shark WD213",                   category: "cleaning", sub: "שואבי אבק",        price: 1435, img: null,           desc: "שואב אבק רטוב/יבש עוצמתי לכל סוגי הרצפות." },
  { id: "cln-shark-iz413",    name: "שואב אבק Shark Hyper Plus IZ413",        category: "cleaning", sub: "שואבי אבק ניטענים", price: 1224, img: null,           desc: "שואב אלחוטי Anti Hair Wrap, סוללה כפולה נשלפת." },
  { id: "cln-shark-hz503",    name: "שואב אבק Shark HZ503 Zero M Power Pro",  category: "cleaning", sub: "שואבי אבק ניטענים", price: 899,  img: null,           desc: "שואב אנכי עם טכנולוגיית Zero-M לניקוי עצמי של המברשת." },
  { id: "cln-shark-iz323",    name: "שואב אבק Shark IZ323 Zero M Vertex Double Pro", category: "cleaning", sub: "שואבי אבק ניטענים", price: 1760, img: null,    desc: "שואב אלחוטי DuoClean עם 2 סוללות וזמן עבודה ארוך." },
  { id: "cln-shark-iz423",    name: "שואב אבק Shark IZ423 Zero-M Stratos",    category: "cleaning", sub: "שואבי אבק ניטענים", price: 1659, img: null,           desc: "Stratos עם טכנולוגיית Anti-Odour וניקוי עצמי." },
  { id: "cln-dyson-v12",      name: "שואב אבק Dyson V12 Detect Slim Absolute", category: "cleaning", sub: "שואבי אבק ניטענים", price: 2290, img: null, tag: "פרימיום", desc: "Dyson V12 קל משקל עם חיישן לייזר ומסך LCD." },
  { id: "cln-dyson-gen5",     name: "שואב אבק Dyson Gen5 Detect Absolute",    category: "cleaning", sub: "שואבי אבק ניטענים", price: 2750, img: null,           desc: "הדגם החזק של Dyson עם סינון HEPA מלא וזיהוי אבק." },
  { id: "cln-dyson-cy28",     name: "שואב אבק Dyson CY28 Big Ball Parquet 2", category: "cleaning", sub: "שואבי אבק",        price: 1945, img: null,           desc: "שואב צילינדר Dyson Big Ball עם ראש פרקט עדין." },
  { id: "cln-bosch-bcs711",   name: "שואב אבק Bosch Unlimited 7 ProAnimal",   category: "cleaning", sub: "שואבי אבק ניטענים", price: 1583, img: null,           desc: "Bosch אלחוטי עם סוללה נשלפת, מתאים לבעלי חיות." },
  { id: "cln-midea-vcc36",    name: "שואב אבק Midea VCC36C16",                category: "cleaning", sub: "שואבי אבק",        price: 239,  img: null,           desc: "שואב צילינדר חסכוני עם מיכל ללא שקית." },
  { id: "cln-shark-wv250",    name: "מנקה קיטור Shark WV250",                 category: "cleaning", sub: "ניקוי בקיטור",      price: 399,  img: null,           desc: "שואב קיטור ידני קטן, מחטא 99.9% חיידקים ללא חומרים." },
  { id: "cln-steamery-c2",    name: "מגהץ קיטור Steamery Cirrus No.2",        category: "cleaning", sub: "ניקוי בקיטור",      price: 699,  img: null,           desc: "מגהץ קיטור נייד, 1500W, בוילר 0.2L — מוכן ב-20 שניות." },
  // --- מגהצים ---
  { id: "cln-philips-gc1740", name: "מגהץ Philips GC1740",                    category: "cleaning", sub: "מגהצים",          price: 198,  img: null,           desc: "מגהץ 2000W, קיטור רציף, בסיס נירוסטה לגלישה חלקה." },
  { id: "cln-philips-gc1433", name: "מגהץ Philips GC1433/30",                 category: "cleaning", sub: "מגהצים",          price: 198,  img: null,           desc: "מגהץ קיטור 2000W עם בסיס קרמי וריסוס כפול." },
  { id: "cln-tefal-fv4870",   name: "מגהץ Tefal FV4870",                      category: "cleaning", sub: "מגהצים",          price: 349,  img: null,           desc: "Tefal FreeMove, קיטור 40g/דקה, מערכת נגד אבנית." },
  { id: "cln-tefal-fv9845",   name: "מגהץ Tefal FV9845",                      category: "cleaning", sub: "מגהצים",          price: 629,  img: null,           desc: "Tefal Ultraglide, 300ml, בסיס Durilium לגלישה מהירה." },
  { id: "cln-braun-si5037",   name: "מגהץ Braun SI5037",                      category: "cleaning", sub: "מגהצים",          price: 348,  img: null,           desc: "Braun CareStyle 5, 2800W, כיבוי אוטומטי." },
  { id: "cln-braun-si3042",   name: "מגהץ Braun SI3042VI",                    category: "cleaning", sub: "מגהצים",          price: 299,  img: null,           desc: "Braun TexStyle 3, בסיס Eloxal לגלישה חלקה." },
  { id: "cln-braun-is3157",   name: "מגהץ קיטור Braun IS3157",                category: "cleaning", sub: "מגהצים",          price: 588,  img: null,           desc: "תחנת גיהוץ Braun CareStyle עם לחץ קיטור גבוה." },
  { id: "cln-tefal-gv9230",   name: "תחנת גיהוץ Tefal GV9230",                category: "cleaning", sub: "מגהצים",          price: 999,  img: null,           desc: "Pro Express עם 7.5 בר לחץ וקיטור רב-עוצמתי." },
  { id: "cln-philips-dst8020", name: "מגהץ Philips DST8020",                  category: "cleaning", sub: "מגהצים",          price: 549,  img: null,           desc: "Azur 8000, 3000W, OptimalTEMP — ללא כוונון חום." },
  // --- מכונות כביסה ---
  { id: "cln-bosch-wan24",    name: "מכונת כביסה Bosch WAN24068IL 7 ק\"ג",     category: "cleaning", sub: "מכונות כביסה",     price: 2690, img: null, tag: "מומלץ", desc: "Bosch Serie 4, 7 ק\"ג, 1200 סל\"ד, מנוע EcoSilence." },
  { id: "cln-zanussi-zwf825", name: "מכונת כביסה Zanussi ZWF825B3W 8 ק\"ג",    category: "cleaning", sub: "מכונות כביסה",     price: 1890, img: null,           desc: "Zanussi 8 ק\"ג, 1200 סל\"ד, תכנית AquaControl." },
  { id: "cln-candy-cst27",    name: "מכונת כביסה Candy CST27LET/1-S 7 ק\"ג",   category: "cleaning", sub: "מכונות כביסה",     price: 2290, img: null,           desc: "Candy Smart 7 ק\"ג עם חיבור Wi-Fi וניהול מהאפליקציה." },
  { id: "cln-blomberg-tga170", name: "מייבש כביסה Blomberg TGA170PXO",         category: "cleaning", sub: "מכונות כביסה",     price: 1390, img: null,           desc: "מייבש כביסה במשאבת חום, יעילות אנרגטית גבוהה." },

  // ----- מוצרי חורף — תנורי חימום ורדיאטורים -----
  { id: "win-gld-atl2615",    name: "תנור חימום Gold Line ATL-2615",          category: "winter", sub: "תנורי חימום", price: 398, img: null, tag: "מומלץ", desc: "גוף חימום קוורץ עם 2 דרגות חום ומגן בטיחות." },
  { id: "win-gld-atl1405",    name: "תנור חימום Gold Line ATL-1405",          category: "winter", sub: "תנורי חימום", price: 160, img: null,            desc: "תנור חימום קומפקטי עם הגנה מפני התחממות יתר." },

  // ----- מוצרי חורף — מאווררים -----
  { id: "win-gld-atl20",      name: "מאוורר שולחני Goldline ATL20",            category: "winter", sub: "מאווררים",  price: 199, img: null,                    desc: "מאוורר שולחני 30 ס\"מ, 3 מהירויות, כבל 180 ס\"מ." },
  { id: "win-gld-atl92",      name: "מאוורר רצפה Goldline ATL92ETW",           category: "winter", sub: "מאווררים",  price: 390, img: null,                    desc: "מאוורר עומד 40 ס\"מ, טיימר 8 שעות, שלט רחוק." },
  { id: "win-elstr-tfs601",   name: "מאוורר עמודי ElectroStar TFS601",         category: "winter", sub: "מאווררים",  price: 225, img: null,                    desc: "מאוורר עמודי 40W, 3 מהירויות, טיימר, ניידות מלאה." },
  { id: "win-elstr-tfw129",   name: "מאוורר רצפה ElectroStar TFW129",          category: "winter", sub: "מאווררים",  price: 189, img: null,                    desc: "מאוורר רצפה 40 ס\"מ, ראש מתנדנד, 3 מהירויות." },
  { id: "win-gld-atl010",     name: "מאוורר שולחני Goldline ATL010",           category: "winter", sub: "מאווררים",  price: 105, img: null,                    desc: "מאוורר שולחני קומפקטי 20 ס\"מ, שקט ויעיל." },
  { id: "win-star4life",      name: "מאוורר תקרה עם תאורה STAR4LIFE",          category: "winter", sub: "מאווררים",  price: 299, img: "assets/img/media_9.png", tag: "מומלץ", desc: "מאוורר תקרה עם LED, 3 מהירויות ושלט רחוק." },

  // ----- למטבח בישול ואפיה — מיקסרים ובלנדרים -----
  { id: "kit-kenwood-km630",  name: "מיקסר Kenwood KM630",                    category: "kitchen", sub: "מיקסרים ובלנדרים", price: 1069, img: null, tag: "פרימיום", desc: "מיקסר עמידותי 1200W, 5 ליטר, 6 מהירויות + פולס." },
  { id: "kit-moul-ar110",     name: "מיקסר Moulinex AR110O10",                category: "kitchen", sub: "מיקסרים ובלנדרים", price: 199,  img: null,            desc: "מיקסר ידני 500W, 5 מהירויות + טורבו, קל לניקוי." },
  { id: "kit-moul-me620",     name: "מיקסר Moulinex ME620",                   category: "kitchen", sub: "מיקסרים ובלנדרים", price: 599,  img: null,            desc: "מיקסר 1200W עם קערת 5L, וו לישה, עיצוב פרמיום." },
  { id: "kit-selmor-se633",   name: "מיקסר Selmor SE633",                     category: "kitchen", sub: "מיקסרים ובלנדרים", price: 249,  img: null,            desc: "מיקסר ידני 300W, 6 מהירויות, 2 מקצפות + 2 ווי לישה." },
  { id: "kit-selmor-se240",   name: "מיקסר Selmor SE240",                     category: "kitchen", sub: "מיקסרים ובלנדרים", price: 240,  img: null,            desc: "מיקסר שולחני 1200W, קערת 5 ליטר, 6 מהירויות." },
  { id: "kit-sauter-hm656",   name: "מיקסר Sauter HM656",                     category: "kitchen", sub: "מיקסרים ובלנדרים", price: 155,  img: null,            desc: "מיקסר ידני 350W, 5 מהירויות + טורבו, ידית ארגונומית." },
  { id: "kit-philips-hr3740", name: "בלנדר Philips HR3740",                   category: "kitchen", sub: "מיקסרים ובלנדרים", price: 185,  img: null,            desc: "בלנדר 650W, כוס פלסטיק 2L, להבי נירוסטה, קל לניקוי." },
  { id: "kit-ninja-cb103",    name: "בלנדר Ninja CB103",                       category: "kitchen", sub: "מיקסרים ובלנדרים", price: 419,  img: null,            desc: "בלנדר 1100W, כוס 72oz, ריסוק קרח בשנייה." },
  { id: "kit-ninja-bn653",    name: "בלנדר Ninja BN653",                       category: "kitchen", sub: "מיקסרים ובלנדרים", price: 440,  img: null,            desc: "בלנדר Ninja Detect 1400W, AI לזיהוי מרכיבים." },
  { id: "kit-ninja-nc303",    name: "בלנדר Ninja Creami NC303",                category: "kitchen", sub: "מיקסרים ובלנדרים", price: 793,  img: null,            desc: "יצרנית גלידה/שייק/סורבה, 7 תכניות אוטומטיות." },
  // --- מעבד מזון ---
  { id: "kit-magimix-cs5200", name: "מעבד מזון Magimix CS5200JXL PREMIUM",    category: "kitchen", sub: "מעבד מזון",          price: 1475, img: null, tag: "פרימיום", desc: "מעבד מזון 1100W, 5.2L, 4 קערות, 20 אבזרים." },
  { id: "kit-sauter-fp610",   name: "מעבד מזון Sauter FP610",                 category: "kitchen", sub: "מעבד מזון",          price: 650,  img: null,            desc: "מעבד מזון 1000W, 3 קערות, ג'ולייני, פרוסה ופומפייה." },
  { id: "kit-gld-atl260",     name: "קוצץ Gold Line ATL260",                  category: "kitchen", sub: "מעבד מזון",          price: 159,  img: null,            desc: "קוצץ חשמלי קומפקטי, 500ml, ניקוי קל." },
  { id: "kit-gld-atl9999",    name: "מטחנת Gold Line ATL-9999 (6 כוסות)",     category: "kitchen", sub: "מעבד מזון",          price: 355,  img: null,            desc: "מטחנת מזון עוצמתית 6 כוסות, להב פלדה." },
  { id: "kit-gld-atl066",     name: "מטחנת Gold Line ATL066",                 category: "kitchen", sub: "מעבד מזון",          price: 209,  img: null,            desc: "מטחנת 500W לתבלינים, קפה, ואגוזים." },
  // --- מיקרוגל ---
  { id: "kit-midea-em9p",     name: "מיקרוגל MIDEA EM9P032MX",                category: "kitchen", sub: "מיקרוגל",            price: 495,  img: null,            desc: "מיקרוגל 25L, 900W, 8 תכניות, עיצוב נירוסטה." },
  { id: "kit-midea-em823",    name: "מיקרוגל MIDEA EM823A2GU",                category: "kitchen", sub: "מיקרוגל",            price: 449,  img: null,            desc: "מיקרוגל 20L, 700W עם גריל, 6 תכניות." },
  { id: "kit-sharp-r327",     name: "מיקרוגל Sharp R-327FHS",                  category: "kitchen", sub: "מיקרוגל",            price: 880,  img: null,            desc: "מיקרוגל Sharp 900W עם גריל, 28L, תצוגה דיגיטלית." },
  // --- טוסטר אובן ---
  { id: "kit-ninja-ct683",    name: "טוסטר אובן Ninja CT683",                  category: "kitchen", sub: "טוסטר אובן",         price: 1045, img: null,            desc: "Ninja 12-in-1, 25.5L, אוויר חם, בישול מהיר." },
  { id: "kit-ninja-dt203",    name: "טוסטר אובן Ninja DT203",                  category: "kitchen", sub: "טוסטר אובן",         price: 1080, img: null, tag: "מומלץ", desc: "Ninja Foodi XL Pro, 2 מדפים בו-זמנית, 10 תכניות." },
  { id: "kit-sauter-mag100",  name: "טוסטר Sauter Multi Air Grill 100",        category: "kitchen", sub: "טוסטר אובן",         price: 900,  img: null,            desc: "Sauter 9 בכלי אחד: גריל, אפייה, טיגון אוויר." },
  // --- מצנמים ---
  { id: "kit-gld-atl801",     name: "טוסטר Gold Line ATL801",                  category: "kitchen", sub: "מצנמים",             price: 199,  img: null,            desc: "טוסטר שתי פרוסות, 7 דרגות השחמה, מגש פירורים." },
  // --- סירי בישול ---
  { id: "kit-universe-nr713", name: "סיר Universe NR713",                      category: "kitchen", sub: "סירי בישול",         price: 546,  img: null,            desc: "סיר לחץ חשמלי 6L, 14 תכניות, לחץ כפול." },
  { id: "kit-moul-lm91hd27",  name: "מכונת קפה Moulinex LM91HD27",             category: "kitchen", sub: "מחבת חשמלי",         price: 1197, img: null,            desc: "מכונת קפה Genio S Touch, לחץ 15 בר, קפוצ'ינו אוטומטי." },
];

/* ---- Assign a clear stock photo to every product ----
   Keyword overrides take priority (so a blender shows a blender, a coffee
   machine shows coffee, etc.), then the sub-category photo, then any existing
   image, and finally the category SVG placeholder handles the rest at render. */
(function assignProductImages() {
  const KEYWORDS = [
    [/מיקרוגל/,            "assets/img/products/microwave.jpg"],
    [/מצנם|טוסטר/,         "assets/img/products/toaster.jpg"],
    [/מכונת קפה|מכונת אספרסו/, "assets/img/products/coffee.jpg"],
    [/בלנדר|מסחטה/,        "assets/img/products/mixer.jpg"],
    [/מעבד מזון/,          "assets/img/products/foodproc.jpg"],
    [/סיר/,               "assets/img/products/cooker.jpg"],
    [/מגהץ|גיהוץ/,         "assets/img/products/iron.jpg"],
    [/מכונת כביסה|מייבש כביסה/, "assets/img/products/washer.jpg"],
    [/שואב/,              "assets/img/products/vacuum.jpg"],
    [/רמקול/,             "assets/img/products/speaker.jpg"],
    [/טלוויזיה/,           "assets/img/products/tv.jpg"],
  ];
  PRODUCTS.forEach(function (p) {
    let img = null;
    for (let i = 0; i < KEYWORDS.length; i++) {
      if (KEYWORDS[i][0].test(p.name)) { img = KEYWORDS[i][1]; break; }
    }
    p.img = img || SUBIMAGES[p.sub] || p.img || null;
  });
})();

/* ==========================================================================
   Product enrichment — derives the optional fields the UI renders when present:
   brand, specs[], stock, rating{avg,count}, and a fuller 2-sentence desc.

   IMPORTANT: specs / stock / rating values are PLACEHOLDERS generated from
   per-sub-category templates (marked `placeholder` below). They are deterministic
   (seeded by product id) so they stay stable between loads, but they are NOT real
   manufacturer data — swap them for confirmed values in the launch phase.
   ========================================================================== */
(function enrichProducts() {
  /* Known brands, matched against the product name (longest first). */
  const BRANDS = [
    "Gold Line", "Goldline", "ElectroStar", "STAR4LIFE", "Morphy Richards",
    "Andis", "MOSER", "Wahl", "Rowenta", "Panasonic", "OMEGA", "Braun", "Parlux",
    "DAFNI", "Oral-B", "ORAL-B", "Uniden", "VTECH", "VTech", "Motorola", "Philips",
    "Samsung", "TCL", "Haier", "Sangean", "Olympus", "JBL", "SAKAL", "Midea",
    "Shark", "Dyson", "Xiaomi", "Bosch", "Steamery", "Tefal", "Zanussi", "Candy",
    "Blomberg", "Kenwood", "Moulinex", "Selmor", "Sauter", "Ninja", "Magimix",
    "Sharp", "Universe",
  ];
  function brandOf(name) {
    const lc = name.toLowerCase();
    for (let i = 0; i < BRANDS.length; i++) {
      if (lc.indexOf(BRANDS[i].toLowerCase()) !== -1) return BRANDS[i] === "Goldline" ? "Gold Line" : BRANDS[i];
    }
    return null;
  }

  /* placeholder spec templates per sub-category (label/value pairs). */
  const SPEC_TEMPLATES = {
    "מכונות תספורת":      [["סוג", "מקצועית"], ["להבים", "פלדת אל-חלד מתחלפת"], ["הפעלה", "נטענת / חוטית"]],
    "מכונות גילוח":       [["סוג ראש", "צף תלת-ממדי"], ["הפעלה", "סוללה נטענת"], ["שטיפה", "עמיד למים"]],
    "מייבשי שיער":        [["הספק", "2200W"], ["מהירויות", "2 מהירויות, 3 דרגות חום"], ["טכנולוגיה", "יוני"]],
    "מעצבי שיער":         [["חימום", "קרמי מהיר"], ["טמפרטורה", "עד 230°C"], ["מתח", "100–240V"]],
    "מברשת שיניים חשמלית": [["תנועות", "מסתובב-מתנדנד"], ["סוללה", "נטענת"], ["טיימר", "מובנה 2 דקות"]],
    "טלפון אלחוטי":       [["טכנולוגיה", "DECT 6.0"], ["זיהוי שיחה", "כן"], ["זיכרון", "עד 50 מספרים"]],
    "טלפון שולחני":       [["סוג", "חוטי שולחני"], ["מסך", "תאורה אחורית"], ["זיהוי שיחה", "כן"]],
    "טלוויזיות":          [["רזולוציה", "4K UHD"], ["מערכת", "Smart TV"], ["חיבורים", "HDMI ×3, USB"]],
    "רדיו":               [["גלים", "FM/AM"], ["חיבור", "Bluetooth / USB"], ["הזנה", "רשת / סוללות"]],
    "אוזניות ורמקולים":   [["חיבור", "Bluetooth"], ["עמידות", "IP67 מוגן מים"], ["סוללה", "עד 12 שעות"]],
    "רשמקולים":           [["זיכרון", "8GB מובנה"], ["חיבור", "USB"], ["פורמט", "MP3/WAV"]],
    "ממירים":             [["תקן", "DVB-T2"], ["רזולוציה", "עד 4K"], ["הקלטה", "USB PVR"]],
    "אנטנות":             [["תחום", "UHF/VHF"], ["סוג", "פנימית/חיצונית"], ["חיבור", "מחבר קואקסיאלי"]],
    "מאווררים":           [["קוטר", "40 ס\"מ"], ["מהירויות", "3 מהירויות"], ["תנועה", "ראש מתנדנד"]],
    "תנורי חימום":        [["הספק", "2000W"], ["דרגות חום", "2 דרגות"], ["בטיחות", "מגן התחממות יתר"]],
    "רדיאטורים":          [["צלעות", "11 צלעות"], ["הספק", "2000W"], ["תרמוסטט", "מתכוונן"]],
    "שואבי אבק":          [["הספק", "2200W"], ["מיכל", "2.5 ליטר"], ["סינון", "HEPA"]],
    "שואבי אבק ניטענים":  [["הפעלה", "אלחוטי נטען"], ["זמן עבודה", "עד 40 דקות"], ["סינון", "HEPA רב-שלבי"]],
    "ניקוי בקיטור":       [["הספק", "1500W"], ["חיטוי", "קיטור 99.9%"], ["מוכנות", "כ-20 שניות"]],
    "מגהצים":             [["הספק", "2400W"], ["קיטור", "רציף + זרבוב"], ["בסיס", "נירוסטה / קרמי"]],
    "מכונות כביסה":       [["קיבולת", "7 ק\"ג"], ["סחיטה", "1200 סל\"ד"], ["דירוג אנרגטי", "A"]],
    "מיקסרים ובלנדרים":   [["הספק", "1000W"], ["נפח קערה", "5 ליטר"], ["מהירויות", "6 + פולס"]],
    "מעבד מזון":          [["הספק", "1000W"], ["אבזרים", "מספר להבים ודיסקים"], ["נפח", "3 ליטר"]],
    "מיקרוגל":            [["נפח", "25 ליטר"], ["הספק", "900W"], ["תכניות", "8 תכניות אוטומטיות"]],
    "מצנמים":             [["פרוסות", "2 פרוסות"], ["דרגות", "7 דרגות השחמה"], ["מגש", "פירורים נשלף"]],
    "טוסטר אובן":         [["נפח", "25 ליטר"], ["פונקציות", "אפייה, גריל, טיגון אוויר"], ["טיימר", "דיגיטלי"]],
    "סירי בישול":         [["נפח", "6 ליטר"], ["תכניות", "14 תכניות"], ["סוג", "סיר לחץ חשמלי"]],
    "מחבת חשמלי":         [["לחץ", "15 בר"], ["מערכת", "אוטומטית"], ["מיכל", "נשלף"]],
  };

  /* Tiny deterministic hash so placeholder stock/rating stay stable per product. */
  function seed(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  PRODUCTS.forEach(function (p) {
    const s = seed(p.id);

    /* brand (derived from the name) */
    if (p.brand == null) p.brand = brandOf(p.name);

    /* specs[] — sub-category template + warranty (placeholder values) */
    if (p.specs == null) {
      const tpl = SPEC_TEMPLATES[p.sub] || [];
      p.specs = tpl.map(function (r) { return { label: r[0], value: r[1] }; });
      p.specs.push({ label: "אחריות", value: "12 חודשים יבואן רשמי" });
    }

    /* stock — placeholder: mostly in-stock, a few low, rare out */
    if (p.stock == null) {
      const r = s % 14;
      p.stock = r === 0 ? "out" : (r <= 2 ? "low" : "in"); // placeholder
    }

    /* rating — placeholder avg 4.3–4.9 with a plausible count */
    if (p.rating == null) {
      const avg = Math.round((4.3 + (s % 7) / 10) * 10) / 10; // 4.3–4.9, placeholder
      const count = 8 + (s % 140);                            // 8–147, placeholder
      p.rating = { avg: avg, count: count };
    }

    /* desc — keep the authored first sentence, add a second natural one (our copy) */
    if (p.desc && !/[.!?]\s+\S/.test(p.desc.trim().replace(/[.!?]$/, ""))) {
      const first = p.desc.trim().replace(/\s*\.?$/, ".");
      const tail = p.brand
        ? " מבית " + p.brand + ", באחריות יבואן רשמי ועם שירות ותמיכה מלאים של אלקום."
        : " מוצר איכותי באחריות מלאה, עם שירות אישי ותמיכה מקצועית של אלקום.";
      p.desc = first + tail;
    }
  });
})();
