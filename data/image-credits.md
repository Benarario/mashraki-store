# Product Image Credits

The Elecom product photos hosted on the original site (designmirror6.e-shops.co.il)
are not legally redistributable and were blocked from download. Instead, each product
type uses a clear, representative stock photo from **Unsplash**.

**License:** [Unsplash License](https://unsplash.com/license) — free to use for
commercial and non-commercial purposes, no permission or attribution required
(attribution appreciated). Downloaded 2026-06-17 into `assets/img/products/`.

These are representative category images (one clear photo per product type), not the
exact manufacturer model shots. They are mapped to products by sub-category in
`assets/js/data.js` (`SUBIMAGES` + keyword overrides in `assignProductImages()`).

| File | Depicts | Used for sub-category |
|------|---------|------------------------|
| clipper.jpg | hair clippers | מכונות תספורת |
| shaver.jpg | electric shaver | מכונות גילוח |
| hairdryer.jpg | hair dryer | מייבשי שיער |
| toothbrush.jpg | electric toothbrush | מברשת שיניים חשמלית |
| straightener.jpg | hair styler | מעצבי שיער |
| cordphone.jpg | home telephone | טלפון אלחוטי |
| deskphone.jpg | desk telephone | טלפון שולחני |
| tv.jpg | flat-screen smart TV | טלוויזיות / ממירים / אנטנות |
| radio.jpg | portable radio | רדיו / רשמקולים |
| speaker.jpg | bluetooth speaker | אוזניות ורמקולים |
| fan.jpg | electric fan | מאווררים |
| heater.jpg | electric heater | תנורי חימום / רדיאטורים |
| vacuum.jpg | vacuum cleaner | שואבי אבק (+ ניטענים, קיטור) |
| iron.jpg | clothes iron | מגהצים |
| washer.jpg | washing machine | מכונות כביסה |
| mixer.jpg | stand mixer | מיקסרים ובלנדרים |
| foodproc.jpg | food processor | מעבד מזון |
| microwave.jpg | microwave oven | מיקרוגל |
| toaster.jpg | toaster | מצנמים / טוסטר אובן |
| cooker.jpg | cooking pot | סירי בישול |
| coffee.jpg | coffee machine | מכונות קפה |

To swap in exact manufacturer images later, obtain licensing from the brand/importer
and replace the files above (keep the same filenames) or set a per-product `img` in
`data.js`, which overrides the sub-category mapping.
