# Landing de restaurante · concepto "Cartel Chicha"

Página para restaurantes pensada para vender por WhatsApp desde el celular, con la estética de los **afiches de cumbia amazónica peruana**: los platos se anuncian como artistas de un concierto.

> **Dos versiones del mismo demo:**
> - **Esta (completa):** concepto con identidad propia, para clientes que quieren destacar.
> - **Simple:** [restaurante-landing](https://github.com/AlxzDiaz/restaurante-landing), un diseño cálido y elegante ("Selva & Achiote"), más clásico.

| Sección | Concepto |
|---|---|
| Ticker superior | Anuncios en movimiento (delivery, pagos, calificación) |
| Cartel (inicio) | Afiche con "la actuación estelar de…" los platos y un letrero de neón "ABIERTO" que parpadea |
| Función estelar | Combo del día con precio tachado y sello en forma de estrella |
| La carta ("el repertorio") | Filtros por categoría; cada categoría tiene su color fosforescente |
| Historia | Tracklist de un cassette ("Lado A") con carretes que giran + logros animados |
| Desde la cocina | Galería tipo rollo de película, en dos filas que se mueven |
| Dedicatorias | Reseñas como saludos de radio cumbiera, "al aire" |
| Próximas fechas | Horarios como fechas de gira + mapa |
| Comanda | El carrito es un **ticket de cocina impreso** (borde dentado, n.° de comanda) que se envía por WhatsApp, con confeti al enviar |

Usa HTML, CSS y JavaScript, sin build. Solo hay que subir la carpeta.

**Librerías (por CDN):**
- [Remix Icon](https://remixicon.com) para los íconos.
- [GSAP + ScrollTrigger](https://gsap.com) para las animaciones de entrada.
- [canvas-confetti](https://github.com/catdad/canvas-confetti) para el confeti al enviar.
- Google Fonts: **Bungee** (letras de cartel) + **Archivo** (texto) + **IBM Plex Mono** (comanda).

```
restaurante-chicha-landing/
├── index.html          estructura + SEO + foto del plato estrella y del local
├── css/styles.css      estilos (paleta en :root, arriba del archivo)
├── js/config.js        ← DATOS DEL CLIENTE: casi todo se cambia aquí
├── js/main.js          lógica (no hace falta tocarlo)
└── images/
    ├── logo.svg        emblema del restaurante
    ├── favicon.svg
    └── platos/ …       ilustraciones de respaldo (se ven si una foto no carga)
```

## Personalizar para un cliente

1. **`js/config.js`:**
   - **Datos básicos:** nombre, eslogan, WhatsApp (`51` + número, sin espacios), dirección y coordenadas.
   - **Promociones y confianza:** anuncio, calificación de Google, delivery (tiempo, costo y monto para envío gratis), medios de pago, logros y combo del día.
   - **Contenido:** platos, galería y reseñas.
   - **Cartel:** `cartel.estelares` (los platos "artistas"), `cartel.invitado` y `cartel.platoEstrella` (precio del sello).
   - **Historia:** `historia`, cada pista del cassette con año, título y texto.
   - **Categorías:** cada una lleva un `icono` de Remix Icon y un `color` (`rosa`, `amarillo`, `verde`, `cian` o `naranja`).
2. **`index.html`:** cambia el `<title>`, la `meta description`, la `og:image`, la foto del plato estrella del cartel y la foto del local en "Historia".
3. **Logo:** reemplaza `images/logo.svg` y `favicon.svg`. El actual es un sol chicha de 16 puntas con un paiche al centro.
4. **Colores:** edita las variables de `:root` en `css/styles.css`. Los fosforescentes (`--rosa`, `--amarillo`, `--verde`, `--cian`) **siempre llevan texto oscuro**; nunca pongas texto blanco sobre ellos.

### Fotos

- Las fotos de ejemplo son de [Unsplash](https://unsplash.com) (licencia gratuita, uso comercial permitido) y se cargan desde su CDN.
- Para un cliente real, usa sus fotos: platos en 4:3 de unos 800×600 px en **WebP** de menos de 150 KB. Puedes comprimirlas en [squoosh.app](https://squoosh.app).
- Guárdalas en `images/platos/` y cambia `imagen: "images/platos/juane.webp"` en `config.js`.
- Si una foto no carga, la página muestra automáticamente una ilustración de respaldo.

### Datos que deben ser reales

La calificación de Google, el número de reseñas, los logros ("10+ años", "15k platos") y las reseñas son **de ejemplo**. Con un cliente real, cópialos de su perfil de Google o Facebook. No publiques datos inventados.

## Cómo llega el pedido

Al tocar "Enviar pedido por WhatsApp", se abre un chat con un mensaje como este:

```
Hola Sabor Amazónico 👋, te mando mi comanda N° 7511:

• 1 x Combo Amazónico — S/ 22.00
• 2 x Patarashca de doncella — S/ 60.00

Subtotal: S/ 82.00
Envío: Gratis
*Total: S/ 82.00*

👤 Nombre: Ana Torres
🛵 Entrega: Delivery
📍 Dirección: Av. León Velarde 450, frente al parque
💳 Pago: Yape
📝 Notas: Sin ají, por favor
```

El pedido se guarda en el navegador del cliente: si cierra la página y vuelve, lo sigue teniendo.

## Publicar en Netlify (gratis)

1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta.
2. En *Site settings → Change site name* ponle un nombre como `sabor-amazonico.netlify.app`.
3. Opcional: conecta un dominio `.pe` o `.com`.

Después de publicar:

- Agrega la URL en el **Google Business Profile** del cliente y en su bio de Instagram y TikTok.
- Genera un QR con la URL para imprimirlo en las mesas.

## Checklist antes de entregar

- [ ] Se ve bien en un celular real
- [ ] "Enviar pedido" abre WhatsApp con el número correcto y el mensaje completo
- [ ] El costo de envío y el monto para envío gratis son los del cliente
- [ ] Las fotos son del cliente (o al menos coinciden con sus platos)
- [ ] La calificación, las reseñas y los logros son reales
- [ ] El "Abierto ahora" coincide con el horario real
- [ ] Título, descripción, logo y redes sociales son los del cliente
