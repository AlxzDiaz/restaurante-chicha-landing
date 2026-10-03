# Guía para crear landing pages que venden

> Documentación del proyecto **Sabor Amazónico** (landing de restaurante) convertida en un método reutilizable para crear páginas de **cualquier tipo de negocio**: lodges, clínicas, gimnasios, academias, inmobiliarias, talleres…
>
> Autor: Alexzandro · Puerto Maldonado · 2026

---

## Índice

1. [Qué construimos y por qué funciona](#1-qué-construimos-y-por-qué-funciona)
2. [Arquitectura del proyecto](#2-arquitectura-del-proyecto)
3. [Sistema de diseño](#3-sistema-de-diseño)
4. [Librerías ("plugins") que usamos](#4-librerías-plugins-que-usamos)
5. [Estructura de secciones (el embudo)](#5-estructura-de-secciones-el-embudo)
6. [Elementos que convencen (psicología de venta)](#6-elementos-que-convencen-psicología-de-venta)
7. [Patrones de código reutilizables](#7-patrones-de-código-reutilizables)
8. [Fotos: cómo conseguirlas y elegirlas](#8-fotos-cómo-conseguirlas-y-elegirlas)
9. [Adaptar a otros negocios (recetas por rubro)](#9-adaptar-a-otros-negocios-recetas-por-rubro)
10. [Errores que encontramos y cómo los resolvimos](#10-errores-que-encontramos-y-cómo-los-resolvimos)
11. [Cómo probar antes de entregar](#11-cómo-probar-antes-de-entregar)
12. [Publicar y entregar al cliente](#12-publicar-y-entregar-al-cliente)
13. [Paso a paso para una página nueva](#13-paso-a-paso-para-una-página-nueva)
14. [Darle a cada demo un concepto único](#14-darle-a-cada-demo-un-concepto-único)

> **Nota:** las secciones 1–13 documentan la versión "Selva & Achiote" del restaurante, que sirve como base técnica. La versión actual usa el concepto **Cartel chicha** (sección 14).

---

## 1. Qué construimos y por qué funciona

### El proyecto

Una landing page para un restaurante de comida amazónica en Puerto Maldonado que:

- Muestra la carta con **fotos reales** y filtros por categoría.
- Tiene un **carrito**: el cliente arma su pedido, elige delivery o recojo, deja nombre, dirección, medio de pago y notas, y todo llega **por WhatsApp en un solo mensaje ordenado**.
- Muestra si el local está **abierto ahora** (según la hora de Perú).
- Incluye calificación de Google, combo del día, galería, reseñas, mapa y SEO local.

### La evolución (lo que aprendimos)

| Versión | Qué tenía | Problema |
|---|---|---|
| v1 | Paleta naranja/gris, Poppins, ilustraciones SVG, botón "Agregar" por plato | Se veía **correcta pero genérica**. No antojaba. |
| v2 (Figma) | Lo mismo pasado a Figma con componentes | Era una copia del código, no aportaba diseño nuevo. |
| **v3 (final)** | Paleta "Selva & Achiote", Fraunces + DM Sans, fotos reales, logo-emblema, animaciones, combo, carrito con formulario | **Se siente premium y convence.** |

> **Lección clave:** lo que hace que el cliente diga "lo quiero" no es el código, son **4 cosas**:
> 1. **Fotos reales y apetitosas** (o del rubro).
> 2. **Una tipografía con personalidad** para los títulos.
> 3. **Una paleta con intención** (colores que evocan el negocio).
> 4. **Elementos de confianza y urgencia** (reseñas, "abierto ahora", ofertas).

---

## 2. Arquitectura del proyecto

```
mi-landing/
├── index.html          estructura + SEO + fotos principales (hero, nosotros)
├── css/styles.css      estilos mobile-first; paleta en :root
├── js/config.js        ← TODOS los datos del negocio (lo único que cambias por cliente)
├── js/main.js          lógica: lee CONFIG y arma la página
├── images/
│   ├── logo.svg
│   ├── favicon.svg
│   └── platos/*.svg    ilustraciones de respaldo si una foto no carga
├── README.md           instrucciones para personalizar
└── GUIA-LANDINGS.md    este documento
```

### Principio: separar datos de lógica

Todo lo que cambia entre clientes vive en **`config.js`**. `main.js` nunca tiene textos ni precios escritos a mano.

```js
// js/config.js
const CONFIG = {
  nombre: "Sabor Amazónico",
  eslogan: "Cocina de la selva",
  whatsapp: "51999999999",            // 51 + número, sin espacios
  telefono: "+51 999 999 999",
  direccion: "Jr. Arequipa 123",
  ciudad: "Puerto Maldonado",
  region: "Madre de Dios",
  ubicacion: { lat: -12.5937, lng: -69.1893 },
  redes: { facebook: "...", instagram: "...", tiktok: "" },   // "" = se oculta
  anuncio: "Delivery gratis desde S/ 40",                     // "" = se oculta
  rating: { valor: 4.8, total: 320, fuente: "Google" },
  delivery: { tiempo: "30–40 min", costo: 5, gratisDesde: 40 },
  pagos: ["Yape", "Plin", "Efectivo", "Tarjeta"],
  logros: [{ valor: 10, sufijo: "+", texto: "años cocinando" }],
  horarios: [{ etiqueta: "Lunes a sábado", dias: [1,2,3,4,5,6], abre: "11:00", cierra: "22:00" }],
  combo: { nombre, descripcion, precio, precioAntes, imagen },  // null = se oculta
  categorias: [{ id: "fondos", nombre: "Platos de fondo", icono: "ph-cooking-pot" }],
  platos: [{ categoria, nombre, precio, descripcion, imagen, destacado }],
  galeria: [/* urls */],
  testimonios: [{ nombre, fuente, estrellas, texto }],
};
```

**Ventaja comercial:** personalizar para un cliente nuevo toma 30–60 minutos y no rompes nada.

### Sin frameworks, sin build

- HTML + CSS + JS puros. Las librerías van por CDN.
- Se sube arrastrando la carpeta a Netlify.
- Carga rápido en celulares con datos móviles (lo normal en Puerto Maldonado).

---

## 3. Sistema de diseño

### 3.1 Paleta: la regla 60-30-10

| % | Rol | En el restaurante |
|---|---|---|
| **60%** | Fondo neutro cálido | Crema `#FBF6EE` y arena `#F3E8D6` |
| **30%** | Color de marca (oscuro) | Verde selva `#0B2018` → `#1F5A41` |
| **10%** | Acento de acción | Rojo achiote `#C93D24` + mango `#F5A524` |
| extra | Color funcional | Verde WhatsApp `#25D366` (solo en botones de WhatsApp) |

```css
:root {
  /* Marca (oscuros) */
  --selva-950: #0B2018;
  --selva-800: #143A2B;
  --selva-600: #1F5A41;
  --hoja: #3BA776;
  --hoja-texto: #1F7A52;      /* versión legible para texto */

  /* Acción y acento */
  --achiote: #C93D24;         /* botones: texto BLANCO (contraste 5:1) */
  --achiote-hover: #A9311B;
  --mango: #F5A524;           /* acentos: texto OSCURO siempre */
  --mango-suave: #FDEBC8;
  --wa: #25D366;              /* WhatsApp: texto OSCURO */

  /* Neutros */
  --crema: #FBF6EE;
  --arena: #F3E8D6;
  --papel: #FFFDF9;
  --tinta: #1E1B17;           /* texto principal (no negro puro) */
  --gris: #6B645C;            /* texto secundario */
  --borde: #E8DCC8;
}
```

#### Reglas de color que no se rompen

1. **Nunca negro puro (`#000`) ni blanco puro de fondo.** Usa tinta `#1E1B17` y crema/papel: se ve más cálido y caro.
2. **Contraste mínimo 4.5:1** para texto normal. Verifícalo en [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).
   - ❌ `#E17055` con texto blanco = 3.2:1 (no pasa).
   - ✅ `#C93D24` con texto blanco = 5:1.
3. **Los colores claros (mango, verde WhatsApp) siempre llevan texto oscuro.**
4. **Un solo color "grita"** (el de acción). Si todo es llamativo, nada lo es.
5. **El verde WhatsApp se reserva para WhatsApp.** La gente lo reconoce al instante y hace clic.

### 3.2 Tipografía: dos fuentes con roles claros

| Rol | Fuente | Por qué |
|---|---|---|
| Títulos | **Fraunces** (serif, con cursivas) | Cálida, artesanal, "de restaurante bueno". |
| Texto e interfaz | **DM Sans** | Muy legible en celular, moderna, neutral. |

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&display=swap" rel="stylesheet">
```

**El truco que más eleva el diseño: cursiva de acento en los títulos.**

```html
<h1>El sabor de la <em>Amazonía</em>, servido en tu mesa</h1>
```
```css
h1 em, h2 em { font-style: italic; font-weight: 500; color: var(--achiote); }
.hero h1 em { color: var(--mango); }   /* sobre fondo oscuro */
```

**Tamaños fluidos** (se adaptan solos del celular a la PC):

```css
.hero h1 { font-size: clamp(2.6rem, 9vw, 4.6rem); }
.seccion__head h2 { font-size: clamp(2rem, 5.5vw, 3rem); }
```

- Cuerpo **mínimo 16px**. En celular no bajes de ahí.
- Altura de línea: 1.1–1.2 en títulos y 1.6 en párrafos.
- `letter-spacing: -.01em` en títulos grandes los hace ver más pulidos.

### 3.3 Espaciado, bordes y sombras

```css
:root {
  --radio: 18px;        /* tarjetas */
  --radio-lg: 28px;     /* bloques grandes, drawer */
  --sombra: 0 1px 2px rgba(30,27,23,.04), 0 8px 24px rgba(30,27,23,.08);   /* sutil, doble capa */
  --sombra-lg: 0 24px 60px rgba(11,32,24,.22);                             /* elementos flotantes */
  --ease: cubic-bezier(.2, .7, .2, 1);                                     /* movimiento natural */
}
.seccion { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
```

- **Sombras con el color de la marca** (verde oscuro o tinta), nunca gris puro.
- **Botones en forma de píldora** (`border-radius: 999px`): se ven modernos y amigables.
- **Formas orgánicas** para las fotos destacadas: un arco (`border-radius: 220px 220px 28px 28px`) o una esquina muy redondeada (`28px 28px 28px 160px`). Rompen la monotonía de los rectángulos.

### 3.4 Logo cuando el cliente no tiene

Haz un **emblema SVG simple + el nombre en texto** con la fuente de títulos:

```html
<a class="logo">
  <img src="images/logo.svg" width="44" height="44" alt="">
  <span class="logo__texto">
    <span class="logo__nombre">Sabor <em>Amazónico</em></span>
    <span class="logo__eslogan">Cocina de la selva</span>
  </span>
</a>
```

- **Emblema:** un círculo de color de marca con un símbolo del rubro, en 3 colores como máximo. En el restaurante son dos hojas que forman una llama (selva + cocina).
- **Nombre en dos estilos:** primera palabra normal y el resto en cursiva de acento. Se genera solo desde `CONFIG.nombre`.
- **Eslogan** en mayúsculas pequeñas con mucho espaciado (`letter-spacing: .18em`).
- **Microinteracción:** el emblema rota levemente al pasar el mouse.

### 3.5 Componentes clave

| Componente | Detalle que lo hace verse premium |
|---|---|
| **Botón** | Píldora, sombra del mismo color del botón, se eleva 2px al pasar el mouse |
| **Chip de filtro** | Ícono + texto; el activo en color de marca oscuro |
| **Tarjeta** | Foto 4:3 con zoom suave al pasar el mouse, etiqueta "Favorito" dorada, precio con la fuente de títulos |
| **Eyebrow** (antetítulo) | Píldora pequeña en mayúsculas con fondo suave: "NUESTRA CARTA" |
| **Tarjeta flotante** | Sobre la foto del hero, con animación de flotar (`translateY`) |
| **Cinta (marquee)** | Franja con texto en cursiva que se desplaza infinitamente |
| **Sello circular** | "Ahorra S/ 9", rotado -10°, en color mango |

---

## 4. Librerías ("plugins") que usamos

Todas por CDN, sin instalar nada:

```html
<!-- Íconos: Phosphor (6000+ íconos, incluye logos de WhatsApp, Instagram, TikTok, Google) -->
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">

<!-- Animaciones al hacer scroll: AOS -->
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
```

### Phosphor Icons

```html
<i class="ph ph-fork-knife"></i>            <!-- línea -->
<i class="ph-fill ph-whatsapp-logo"></i>    <!-- relleno -->
```

Busca íconos en [phosphoricons.com](https://phosphoricons.com). Algunos útiles por rubro:

| Rubro | Íconos |
|---|---|
| Comida | `fork-knife`, `cooking-pot`, `bowl-food`, `cake`, `orange-slice`, `fire`, `basket` |
| Turismo | `tent`, `boat`, `binoculars`, `tree-evergreen`, `bird`, `sun-horizon`, `compass` |
| Salud | `tooth`, `heartbeat`, `first-aid`, `stethoscope`, `calendar-check`, `shield-check` |
| Gimnasio | `barbell`, `person-simple-run`, `timer`, `lightning`, `trophy` |
| Educación | `graduation-cap`, `book-open`, `chalkboard-teacher`, `certificate`, `exam` |
| Inmobiliaria | `house-line`, `map-trifold`, `ruler`, `key`, `blueprint` |
| Taller | `wrench`, `car`, `gear`, `engine`, `tire` |
| General | `whatsapp-logo`, `map-pin`, `clock`, `star`, `medal`, `moped`, `wallet`, `storefront` |

> ⚠️ Revisa cómo se ve el ícono a 20–24px. `shopping-bag` parecía un sobre de correo y lo cambiamos por `basket`.

### AOS (Animate On Scroll)

```html
<h2 data-aos="fade-up">Título</h2>
<div data-aos="fade-up" data-aos-delay="100">…</div>
<img data-aos="zoom-in">
```
```js
AOS.init({
  once: true,                 // anima solo la primera vez
  duration: 700,
  easing: "ease-out-cubic",
  offset: 40,
  disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
});
```

- Para elementos en grilla, escalona los retrasos: `data-aos-delay="${(i % 4) * 60}"`.
- Si filtras u ocultas elementos, llama a `AOS.refresh()`.
- ⚠️ `fade-left` y `fade-right` causan scroll horizontal en celular (ver la [sección 10](#10-errores-que-encontramos-y-cómo-los-resolvimos)).

### Otras librerías útiles según el rubro

| Necesidad | Librería | Cuándo usarla |
|---|---|---|
| Carrusel táctil | [Swiper](https://swiperjs.com) | Galerías de lodges y tours, antes/después |
| Lightbox de fotos | [GLightbox](https://biati-digital.github.io/glightbox/) | Galerías grandes (inmobiliaria, lodge) |
| Comparador antes/después | [img-comparison-slider](https://img-comparison-slider.sneas.io/) | Clínicas dentales, estética, talleres |
| Calendario | input `type="date"` nativo | Reservas y citas (no necesitas librería) |
| Confeti al confirmar | [canvas-confetti](https://github.com/catdad/canvas-confetti) | Opcional, para promociones |

> **Regla:** cada librería pesa. Usa solo las que aportan algo visible para el cliente.

---

## 5. Estructura de secciones (el embudo)

El orden importa. La página guía al visitante de **"me interesa"** a **"lo pido ya"**:

| # | Sección | Objetivo | Restaurante |
|---|---|---|---|
| 0 | **Anuncio** | Gancho inmediato | "Delivery gratis desde S/ 40" |
| 1 | **Header fijo** | Acción siempre visible | Logo, menú, carrito, botón WhatsApp |
| 2 | **Hero** | Captar en 3 segundos | Foto de fondo + título con cursiva + 2 botones + confianza |
| 3 | **Cinta** | Ritmo visual, mostrar variedad | Nombres de platos desplazándose |
| 4 | **Oferta** | Urgencia + ahorro | Combo del día con precio tachado |
| 5 | **Catálogo** | Mostrar el producto | Carta con filtros y botón Agregar |
| 6 | **Nosotros** | Generar confianza | Historia + foto + logros animados |
| 7 | **Galería** | Antojar y mostrar el ambiente | 6 fotos en mosaico |
| 8 | **Opiniones** | Prueba social | Calificación resumen + 4 reseñas |
| 9 | **Ubicación** | Quitar dudas prácticas | Horario, dirección, pagos, mapa |
| 10 | **CTA final** | Última oportunidad | "¿Se te antojó? Pide ahora" |
| 11 | **Footer** | Datos completos | Logo, horario, contacto, redes |
| + | **Flotantes** | Acción permanente | Botón WhatsApp / barra del pedido |

### Anatomía del hero (la sección más importante)

```
┌──────────────────────────────────────────────────────────┐
│ [foto de fondo + degradado oscuro de izquierda a derecha] │
│                                                           │
│  [★★★★★ 4.8 · 320 reseñas]          ┌────────────┐        │
│                                     │  FOTO EN   │ [chip  │
│  El sabor de la                     │   ARCO     │ flot.] │
│  *Amazonía*, servido                │            │        │
│  en tu mesa                [chip    └────────────┘        │
│                             flot.]                        │
│  Subtítulo con los productos clave.                       │
│                                                           │
│  [ Ver la carta ]  [ Pedir por WhatsApp ]                 │
│                                                           │
│  ● Abierto ahora   🛵 Delivery 30–40 min   💳 Yape · Plin  │
└──────────────────────────────────────────────────────────┘
```

**Fórmula del título:** beneficio + *palabra emocional en cursiva* + lugar o contexto.

- Restaurante: "El sabor de la *Amazonía*, servido en tu mesa".
- Lodge: "Despierta en el corazón de la *selva*".
- Clínica dental: "Sonríe *sin miedo*, con tecnología de punta".
- Gimnasio: "Tu *mejor versión* empieza hoy".
- Academia: "Ingresa a la *universidad* a la primera".

**Degradado para que el texto se lea sobre la foto:**

```css
.hero::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(120% 80% at 0% 100%, rgba(11,32,24,.96) 20%, transparent 70%),
    linear-gradient(90deg, rgba(11,32,24,.92) 0%, rgba(11,32,24,.7) 55%, rgba(11,32,24,.35) 100%);
}
```

---

## 6. Elementos que convencen (psicología de venta)

Esto es lo que hace que **el dueño del negocio quiera comprar la página** y que **sus clientes compren**:

| Elemento | Principio | Implementación |
|---|---|---|
| ⭐ Calificación de Google en el hero | **Prueba social** | Píldora con "G" + estrellas + número de reseñas |
| 🟢 "Abierto ahora" con punto que late | **Inmediatez** | Calculado con la zona horaria `America/Lima` |
| 💰 Precio tachado + sello "Ahorra S/ 9" | **Anclaje de precio** | `<s>S/ 31.00</s>` junto al precio real |
| ⏰ "Válido hoy, hasta agotar stock" | **Urgencia y escasez** | Texto pequeño bajo la oferta |
| 🛵 "Agrega S/ 10 más y el delivery es gratis" | **Sube el ticket promedio** | Se calcula en el carrito |
| 📊 Logros animados ("10+ años", "15k platos") | **Autoridad** | Contadores que suben al aparecer |
| 💳 Yape · Plin · Efectivo visibles | **Quitar fricción** | En el hero y en la ubicación |
| 💬 Botón flotante de WhatsApp con onda | **Acción siempre a mano** | Se oculta cuando hay pedido |
| 🧺 Carrito con aviso "agregado ✓" | **Recompensa inmediata** | Toast + contador que "salta" |
| 📝 Pedido ya ordenado en WhatsApp | **Valor para el dueño** | Llega con nombre, dirección, pago y total |
| 🏷️ Etiqueta "Favorito" en productos | **Guía la decisión** | `destacado: true` en config |

> **Argumento de venta para el dueño:**
> "Con esta página tus clientes ven la carta con fotos, arman su pedido solos y te llega a WhatsApp con nombre, dirección, forma de pago y total. Ya no tienes que preguntar todo uno por uno."

> ⚠️ **Ética:** la calificación, las reseñas y los logros de la demo son **de ejemplo**. Con un cliente real, usa **solo sus datos reales**. Publicar reseñas inventadas es engañoso y puede traerte problemas con el cliente y con Google.

---

## 7. Patrones de código reutilizables

### 7.1 Enlace de WhatsApp con mensaje prellenado

```js
const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

// Cualquier enlace con data-wa se convierte en botón de WhatsApp
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.wa || `Hola ${CONFIG.nombre}, quiero hacer un pedido.`);
  a.target = "_blank";
  a.rel = "noopener";
});
```
```html
<a class="btn btn--wa" data-wa href="#">Pedir</a>
<a data-wa="Hola, quiero reservar el tour de 3 días" href="#">Reservar</a>
```

### 7.2 Carrito o solicitud → mensaje ordenado

El patrón que más valor da. Sirve para pedidos, reservas, citas y cotizaciones:

```js
const msg = [
  `Hola ${CONFIG.nombre} 👋, quiero hacer este pedido:`,
  "",
  ...lineas,                              // "• 2 x Juane — S/ 30.00"
  "",
  `*Total: ${soles(total)}*`,             // *texto* = negrita en WhatsApp
  "",
  `👤 Nombre: ${nombre}`,
  `🛵 Entrega: ${entrega}`,
  esDelivery ? `📍 Dirección: ${direccion}` : null,
  `💳 Pago: ${pago}`,
  notas ? `📝 Notas: ${notas}` : null,
].filter((l) => l !== null).join("\n");

window.open(waLink(msg), "_blank", "noopener");
```

**Partes del carrito:**

- Estado: un `Map` con `id → cantidad`.
- Persistencia: se guarda en `localStorage` (siempre dentro de `try/catch`).
- Panel: el elemento nativo `<dialog>` con `showModal()`. Trae fondo oscuro y se cierra con Esc sin código extra.
- En celular se abre desde abajo y en PC como panel lateral derecho.

```js
// Guardar y recuperar el pedido de forma segura
const CLAVE = "pedido-" + CONFIG.nombre;
try { JSON.parse(localStorage.getItem(CLAVE) || "[]").forEach(([id, n]) => pedido.set(id, n)); } catch (_) {}
const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify([...pedido])); } catch (_) {} };
```

```js
// Cerrar el <dialog> al hacer clic fuera del panel
drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
```

### 7.3 "Abierto ahora" con la hora de Perú

Funciona aunque el visitante esté en otro país:

```js
function ahoraEnLima() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const valor = (t) => partes.find((p) => p.type === t).value;
  return {
    dia: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(valor("weekday")),
    minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
  };
}
```

Mensajes: "Abierto ahora · hasta las 10 p. m.", "Abrimos hoy a las 11 a. m." o "Abrimos mañana a las 11 a. m.".

### 7.4 Imágenes con respaldo automático

Si una foto externa falla, se muestra una ilustración local:

```html
<img src="https://images.unsplash.com/..." data-fallback="images/platos/fondos.svg" alt="…">
```
```js
document.addEventListener("error", (e) => {
  const img = e.target;
  if (img.tagName === "IMG" && img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) {
    img.src = img.dataset.fallback;
  }
}, true);  // ← "true" (captura) es obligatorio: el evento error de <img> no burbujea
```

### 7.5 Contadores animados con respaldo

```js
const io = new IntersectionObserver(([en]) => {
  if (en.isIntersecting) { animarNumero(el); io.disconnect(); }
}, { threshold: .6 });
io.observe(el);

// Dentro de animarNumero: respaldo si requestAnimationFrame está pausado (pestaña en segundo plano)
setTimeout(() => { el.textContent = fin.toFixed(dec) + suf; }, dur + 100);
```

### 7.6 Aviso flotante (toast)

```js
function avisar(texto) {
  toast.innerHTML = `<i class="ph-fill ph-check-circle"></i>${esc(texto)}`;
  toast.classList.add("visible");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("visible"), 1800);
}
```
Con `role="status"` y `aria-live="polite"`, los lectores de pantalla también lo anuncian.

### 7.7 Filtros fijos con efecto vidrio

```css
.filtros {
  position: sticky; top: var(--header-h); z-index: 20;
  display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
  background: rgba(243, 232, 214, .9);
  backdrop-filter: blur(12px);
}
@media (min-width: 720px) {
  .filtros { width: fit-content; margin: 0 auto 32px; padding: 6px; border-radius: 999px; }
}
```

Al tocar un filtro en celular, se centra solo:

```js
filtros.scrollTo({ left: boton.offsetLeft - (filtros.clientWidth - boton.offsetWidth) / 2, behavior: "smooth" });
```

### 7.8 Cinta infinita (marquee) sin librería

```html
<div class="cinta"><div class="cinta__pista"><span>…items…</span><span>…items…</span></div></div>
```
```css
.cinta { overflow: hidden; }
.cinta__pista { display: flex; width: max-content; animation: cinta 38s linear infinite; }
@keyframes cinta { to { transform: translateX(-50%); } }   /* el contenido va duplicado */
```

### 7.9 Header de vidrio que reacciona al scroll

```css
.header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(11, 32, 24, .9);
  backdrop-filter: saturate(1.4) blur(14px);
}
.header.scrolled { box-shadow: 0 10px 30px rgba(0,0,0,.25); }
```
```js
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 10), { passive: true });
```

### 7.10 SEO local (datos estructurados)

```js
const ld = {
  "@context": "https://schema.org",
  "@type": "Restaurant",         // Dentist, HealthClub, LodgingBusiness, School, RealEstateAgent, AutoRepair…
  name: CONFIG.nombre,
  telephone: CONFIG.telefono,
  address: { "@type": "PostalAddress", streetAddress, addressLocality, addressRegion, addressCountry: "PE" },
  geo: { "@type": "GeoCoordinates", latitude, longitude },
  openingHoursSpecification: [...],
  paymentAccepted: "Yape, Plin, Efectivo",
};
```

> ⚠️ **No incluyas `aggregateRating`** con la calificación del propio negocio: Google no acepta reseñas autodeclaradas en los datos estructurados de un negocio local.

### 7.11 Mapa sin API key

```js
mapa.src = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
comoLlegar.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
```

### 7.12 Seguridad básica: escapar textos

Si insertas datos de `config.js` con `innerHTML`, escápalos:

```js
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
```

---

## 8. Fotos: cómo conseguirlas y elegirlas

### Fuentes gratuitas para uso comercial

- **[Unsplash](https://unsplash.com):** la mejor calidad. Licencia libre y sin atribución obligatoria.
- **[Pexels](https://pexels.com):** buena alternativa.
- ⚠️ **Evita Unsplash+**: son fotos de pago; aparecen marcadas con "+" y su dominio es `plus.unsplash.com`.

### Cómo usarlas sin descargarlas

```js
const foto = (id, w = 640) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

foto("1783469567371-f1a384ea2edd")        // tarjeta (640px)
foto("1746716447103-e1618bbd0669", 1800)  // portada
```

- `auto=format` sirve WebP o AVIF automáticamente.
- `w=` ajusta el tamaño: 640 para tarjetas, 900 para destacados, 1800 para la portada.
- `q=70` da buena calidad con poco peso.

### Proceso de selección (importante)

1. **Busca en inglés y en plural:** "grilled fish plate", "fried plantain", "tropical juice glass", "rustic restaurant interior".
2. **Junta 4–6 candidatas por foto** y míralas juntas en una hoja de contactos.
3. **Revisa que encajen culturalmente.** Nos pasó que la foto del "combo amazónico" eran tacos mexicanos: rompía la credibilidad.
4. **Mantén la coherencia:** luz cálida, ángulos parecidos, sin fondos blancos de catálogo mezclados con fotos de ambiente.
5. **Foto de portada:** oscura o con zonas oscuras, para que el texto blanco se lea.

### Con un cliente real

- Lo ideal: **fotos del propio negocio**. Ofrece una sesión con celular (luz natural, cerca de la ventana) como servicio extra.
- Formato: WebP, de menos de 150 KB, horizontal 4:3 para productos y 16:9 o más ancha para la portada.
- Comprímelas en [squoosh.app](https://squoosh.app).

### Búsquedas sugeridas por rubro

| Rubro | Búsquedas en Unsplash |
|---|---|
| Lodge / turismo | `amazon rainforest lodge`, `jungle river boat`, `tropical bungalow`, `macaw`, `canopy walkway` |
| Clínica dental | `dentist clinic modern`, `smiling woman teeth`, `dental chair`, `dentist team` |
| Gimnasio | `gym dark moody`, `weightlifting`, `functional training`, `crossfit` |
| Academia | `students studying group`, `classroom latin`, `graduation happy`, `teacher whiteboard` |
| Inmobiliaria | `aerial land plots`, `modern house tropical`, `construction site`, `keys new home` |
| Taller | `mechanic workshop`, `car repair`, `motorcycle mechanic`, `tools garage` |

---

## 9. Adaptar a otros negocios (recetas por rubro)

### 9.1 Equivalencias del módulo central

El carrito del restaurante es un **"módulo de solicitud"** que se adapta a cada rubro:

| Rubro | Catálogo | Botón | Formulario | El mensaje llega como |
|---|---|---|---|---|
| Restaurante | Platos | Agregar | Delivery/recojo, dirección, pago | Pedido con total |
| Lodge / turismo | Tours y paquetes | Reservar | Fechas, n.º de personas, idioma | Solicitud de reserva |
| Clínica dental | Servicios | Agendar | Servicio, fecha preferida, turno, ¿primera vez? | Solicitud de cita |
| Gimnasio | Planes | Elegir plan | Plan, horario preferido, objetivo | Inscripción / clase de prueba |
| Academia | Cursos y ciclos | Inscribirme | Curso, turno, nombre del alumno, colegio | Preinscripción |
| Inmobiliaria | Lotes y casas | Me interesa | Lote, ¿contado o crédito?, fecha de visita | Solicitud de visita |
| Taller | Servicios | Cotizar | Marca, modelo y año, problema, ¿grúa? | Pedido de cotización |

> **Regla:** en rubros de **servicio** (clínica, taller, academia) no hay "carrito con cantidades". Usa **selección de una opción + formulario**. Es más simple y convierte mejor.

### 9.2 Paletas por rubro

Todas cumplen el contraste mínimo. Copia el bloque `:root` y ajusta.

#### 🌿 Lodge / Ecoturismo: "Atardecer en el río"
```css
--marca-950: #0F1F1A;  --marca-800: #1D3B33;  --marca-600: #2F5D50;
--accion: #C25A1B;     /* naranja atardecer, texto blanco */
--acento: #E9B44C;     /* oro, texto oscuro */
--fondo: #F7F3EA;      --fondo-2: #ECE3D0;   --tinta: #1C1A15;
```
Títulos: **Cormorant Garamond** o **Playfair Display** · Texto: **Inter**. Estilo editorial, de revista de viajes.

#### 🦷 Clínica dental / salud: "Limpio y confiable"
```css
--marca-950: #062A33;  --marca-800: #0B4A57;  --marca-600: #0E7C86;
--accion: #0E7C86;     /* teal, texto blanco */
--acento: #7FD1C7;     /* menta, texto oscuro */
--fondo: #F5FAFA;      --fondo-2: #E6F2F2;   --tinta: #10232A;
```
Títulos: **Plus Jakarta Sans** (600–800) · Texto: **Inter**. Muchas formas redondeadas, mucho espacio en blanco y fotos de sonrisas.

#### 💪 Gimnasio: "Energía oscura"
```css
--marca-950: #0B0B0D;  --marca-800: #17171C;  --marca-600: #26262E;
--accion: #D4FF3A;     /* lima neón, texto NEGRO */
--acento: #FF5A1F;     /* naranja intenso */
--fondo: #0B0B0D;      /* fondo oscuro */   --tinta: #F2F2F2;
```
Títulos: **Bebas Neue** u **Oswald** en mayúsculas · Texto: **Inter**. Fotos en blanco y negro con acento neón y ángulos diagonales (`clip-path: polygon(...)`).

#### 🎓 Academia: "Confianza y logro"
```css
--marca-950: #0B1736;  --marca-800: #14285E;  --marca-600: #1F3F94;
--accion: #1F3F94;     /* azul, texto blanco */
--acento: #FFC93C;     /* amarillo, texto oscuro */
--fondo: #F7F8FC;      --fondo-2: #E9EDF8;   --tinta: #141A2E;
```
Títulos: **Lexend** o **Poppins** · Texto: **Inter**. Fotos de ingresantes reales (con permiso), contador de ingresantes y logos de universidades.

#### 🏡 Inmobiliaria: "Tierra y futuro"
```css
--marca-950: #1B1F17;  --marca-800: #2E3A24;  --marca-600: #4B5E34;
--accion: #B5532A;     /* terracota, texto blanco */
--acento: #D9B26A;     /* arena dorada */
--fondo: #F8F5EE;      --fondo-2: #EDE6D6;   --tinta: #1D1B16;
```
Títulos: **DM Serif Display** · Texto: **DM Sans**. Lotes con filtros por zona, precio y área, calculadora de cuotas, mapa y fotos aéreas.

#### 🔧 Taller mecánico: "Industrial"
```css
--marca-950: #111315;  --marca-800: #1E2226;  --marca-600: #2E343A;
--accion: #F2B705;     /* amarillo industrial, texto NEGRO */
--acento: #E2462B;     /* rojo emergencia */
--fondo: #F3F3F1;      --fondo-2: #E4E4E0;   --tinta: #151719;
```
Títulos: **Barlow Condensed** (600–800) · Texto: **Barlow**. Botón de emergencia ("Auxilio 24 h"), marcas que atienden y garantía por escrito.

### 9.3 Secciones especiales por rubro

| Rubro | Agrega | Quita o cambia |
|---|---|---|
| **Lodge** | Paquetes por días, itinerario por día (timeline), qué incluye / no incluye, fauna que verás, selector ES/EN, calificación de TripAdvisor | Delivery, horarios de atención |
| **Clínica** | Doctores con colegiatura (COP/CMP), comparador antes/después, financiamiento en cuotas, preguntas frecuentes, seguros aceptados | Carrito con cantidades |
| **Gimnasio** | Tabla de planes (mensual, trimestral, anual con "Más popular"), horario de clases en tabla, transformaciones, clase de prueba gratis | Galería tipo comida |
| **Academia** | Ciclos y fechas de inicio, docentes, ranking de ingresantes, simulacro gratis, cuenta regresiva al inicio de clases | Delivery |
| **Inmobiliaria** | Filtro de lotes, plano interactivo, calculadora de cuota, documentos en regla (título, partida), visita guiada | Horario por día |
| **Taller** | Servicios con precio "desde", marcas, garantía, emergencias 24 h, fotos del taller | Combo del día → "Promo del mes" |

### 9.4 Ejemplo: `config.js` para una clínica dental

```js
const CONFIG = {
  nombre: "Sonrisa Amazónica",
  eslogan: "Clínica dental",
  whatsapp: "51999999999",
  rating: { valor: 4.9, total: 180, fuente: "Google" },
  anuncio: "Primera evaluación GRATIS este mes",
  logros: [
    { valor: 12, sufijo: "+", texto: "años de experiencia" },
    { valor: 5, sufijo: "k", texto: "pacientes felices" },
    { valor: 0, sufijo: "%", texto: "interés en cuotas" },
  ],
  servicios: [
    { id: "limpieza", nombre: "Limpieza dental", desde: 80, duracion: "45 min", icono: "ph-sparkle", destacado: true,
      descripcion: "Profilaxis + destartraje con ultrasonido.", imagen: foto("...") },
    { id: "ortodoncia", nombre: "Ortodoncia", desde: 150, unidad: "/mes", icono: "ph-smiley", imagen: foto("...") },
  ],
  doctores: [{ nombre: "Dra. Ana Ríos", especialidad: "Ortodoncista", cop: "COP 12345", foto: "..." }],
  turnos: ["Mañana (9–1)", "Tarde (3–8)"],
};
```

Y el mensaje de WhatsApp:

```js
const msg = [
  `Hola ${CONFIG.nombre} 👋, quiero agendar una cita:`,
  "",
  `🦷 Servicio: ${servicio}`,
  `📅 Fecha preferida: ${fecha}`,
  `🕐 Turno: ${turno}`,
  `👤 Nombre: ${nombre}`,
  `🆕 ¿Primera vez?: ${primeraVez ? "Sí" : "No"}`,
].join("\n");
```

---

## 10. Errores que encontramos y cómo los resolvimos

> Esta sección vale oro: son problemas reales que aparecieron al probar.

### 10.1 Scroll horizontal en celular por las animaciones laterales
- **Síntoma:** en una pantalla de 375 px la página medía 455 px y la barra del pedido salía cortada.
- **Causa:** `data-aos="fade-left"` desplaza el elemento 100 px fuera de la pantalla antes de animarlo.
- **Lo que NO funcionó:** `body { overflow-x: clip; }`. Chrome traslada esa regla a la ventana y deja de recortar.
- **Solución:**
  ```css
  main { overflow-x: clip; }   /* "clip" y no "hidden": hidden rompe position: sticky */
  ```
- **Cómo detectarlo:** pega esto en la consola:
  ```js
  [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1)
  ```

### 10.2 Filtros fijos encimados sobre las fotos
- **Síntoma:** al hacer scroll, los chips flotaban sobre las fotos y se veía desordenado.
- **Solución:** darle a la barra de filtros un fondo semitransparente con `backdrop-filter: blur()`. En PC queda como una píldora centrada con sombra.

### 10.3 Contraste insuficiente
- **Síntoma:** el naranja de la guía original (`#E17055`) con texto blanco no se leía bien al sol.
- **Solución:** oscurecer el color del botón (`#C93D24`, contraste 5:1) y dejar los tonos claros solo para decorar.

### 10.4 Fotos que no encajan con el negocio
- **Síntoma:** el "Combo Amazónico" mostraba tacos mexicanos.
- **Solución:** revisar todas las fotos juntas antes de publicar. Una foto equivocada destruye la credibilidad del resto.

### 10.5 Ícono ambiguo
- **Síntoma:** el ícono de bolsa de compras parecía un sobre de correo.
- **Solución:** usar `basket`. Revisa siempre los íconos al tamaño real.

### 10.6 Textos que se parten en celular
- **Síntoma:** "★ 4.8 · 320 reseñas en Google" ocupaba dos líneas, y los horarios se partían.
- **Solución:** acortar el texto visible y dejar el detalle para lectores de pantalla con `.sr-only`. En los horarios, usar `white-space: nowrap` y el formato corto "11 a. m. – 10 p. m.".

### 10.7 Animaciones que no corren en pestañas ocultas
- **Síntoma:** los contadores se quedaban en "0" o "1+".
- **Causa:** `requestAnimationFrame` e `IntersectionObserver` se pausan cuando la pestaña está oculta.
- **Solución:** un `setTimeout` de respaldo que fija el valor final.

### 10.8 El error de una imagen no "burbujea"
- **Síntoma:** un `addEventListener("error")` en `document` no detectaba las imágenes rotas.
- **Solución:** escuchar en **fase de captura**: `addEventListener("error", fn, true)`.

### 10.9 `aggregateRating` en los datos estructurados
- **Problema:** Google no acepta la calificación que el negocio declara de sí mismo.
- **Solución:** no incluirla en el JSON-LD. La calificación se muestra solo como contenido visual.

### 10.10 Botón que pierde el foco al redibujarse
- **Síntoma:** al cambiar de "Agregar" a −/+, quien navega con teclado perdía su posición.
- **Solución:** después de redibujar, devolver el foco al botón equivalente con `requestAnimationFrame(() => boton.focus())`.

### 10.11 Diseño "correcto pero genérico"
- **Síntoma:** la v1 funcionaba pero no convencía.
- **Solución:** ver la [sección 1](#1-qué-construimos-y-por-qué-funciona). Fotos reales, una fuente con personalidad, cursivas de acento, formas orgánicas, microanimaciones y elementos de confianza.

---

## 11. Cómo probar antes de entregar

### En el navegador (Chrome DevTools)

1. `F12` → ícono de celular → **iPhone SE (375 px)** y **Galaxy S20 (360 px)**.
2. Revisa sección por sección:
   - [ ] No hay scroll horizontal (ver el código de la sección 10.1).
   - [ ] Los textos no se cortan ni quedan pegados.
   - [ ] Los botones miden al menos 44 px de alto.
   - [ ] Los filtros se quedan fijos bajo el header.
3. Prueba el flujo completo:
   - [ ] Agregar productos → aparece el toast → el contador del carrito sube.
   - [ ] Abrir el carrito → cambiar cantidades → eliminar.
   - [ ] Enviar sin nombre → no envía y marca el campo en rojo.
   - [ ] Enviar completo → WhatsApp se abre con el mensaje correcto.
   - [ ] Recargar la página → el pedido sigue ahí.
4. Revisa la consola (`F12` → Console): **cero errores en rojo**.
5. Prueba la red lenta: Network → **Slow 3G**. La página debe ser usable en menos de 5 segundos.

### En un celular real

- Abre la URL publicada en tu celular **y en uno de gama baja**.
- Toca cada botón de WhatsApp.
- Revisa con el brillo al máximo, bajo el sol: ¿se lee todo?

### Herramientas gratis

| Herramienta | Qué revisa |
|---|---|
| [PageSpeed Insights](https://pagespeed.web.dev) | Velocidad (apunta a más de 85 en móvil) |
| [WebAIM Contrast](https://webaim.org/resources/contrastchecker/) | Contraste de colores |
| [Rich Results Test](https://search.google.com/test/rich-results) | Datos estructurados (SEO) |
| [opengraph.xyz](https://www.opengraph.xyz) | Cómo se ve el enlace al compartirlo en WhatsApp y Facebook |

---

## 12. Publicar y entregar al cliente

### Publicar (gratis)

1. [app.netlify.com/drop](https://app.netlify.com/drop) → arrastra la carpeta.
2. Cambia el nombre: `nombre-negocio.netlify.app`.
3. Dominio propio: `.pe` (unos S/ 100–130 al año en [punto.pe](https://punto.pe)) o `.com`.

### Checklist de entrega

- [ ] Título, descripción e `og:image` del cliente.
- [ ] Logo y favicon del cliente.
- [ ] WhatsApp, teléfono, dirección y coordenadas correctos.
- [ ] Fotos del cliente o, como mínimo, que coincidan con sus productos.
- [ ] Calificación, reseñas y logros **reales**.
- [ ] Horarios reales: el "Abierto ahora" coincide.
- [ ] Costo de delivery y monto para envío gratis acordados con el cliente.
- [ ] URL agregada a su **Google Business Profile**, Instagram y TikTok.
- [ ] QR impreso para el local (mesas, mostrador, vitrina).

### Paquetes sugeridos

| Paquete | Incluye | Precio sugerido |
|---|---|---|
| **Básico** | Landing de 1 página con WhatsApp, ubicación y horarios | S/ 300–450 |
| **Estándar** | Todo lo de esta guía: catálogo, carrito o solicitud, galería, reseñas, SEO | S/ 600–900 |
| **Premium** | Estándar + dominio + 1 año de hosting + sesión de fotos + QR impresos + 2 cambios al mes | S/ 1 000–1 500 + S/ 50–100/mes |

> 💡 **Para vender:** antes de visitar al negocio, **personaliza la demo con su nombre, sus colores y fotos de su Facebook**. Mostrarle "su" página ya hecha convierte muchísimo más que mostrar un ejemplo genérico.

---

## 13. Paso a paso para una página nueva

### Fase 1: Preparación (30 min)

1. **Copia la carpeta** `restaurante-landing` → `nombre-negocio-landing`.
2. **Investiga al negocio:** Facebook, Instagram, Google Maps. Anota servicios, precios, horarios, reseñas, colores del local y fotos.
3. **Define el módulo de solicitud** (ver la tabla 9.1): ¿pedido, reserva, cita o cotización?

### Fase 2: Diseño (45 min)

4. **Elige la paleta** (sección 9.2) y reemplaza el bloque `:root` de `styles.css`.
5. **Elige la tipografía** y cambia el `<link>` de Google Fonts y las variables `--f-titulo` y `--f-texto`.
6. **Haz el logo:** emblema SVG simple + nombre en dos estilos.
7. **Busca las fotos:** portada, 6–12 productos o servicios, nosotros y galería. Revísalas juntas.

### Fase 3: Contenido (45 min)

8. **Escribe `config.js`** con los datos del negocio.
9. **Escribe los textos del `index.html`:**
   - Título del hero con la fórmula: beneficio + *cursiva* + lugar.
   - Subtítulo con los 3–4 productos o servicios estrella.
   - Historia de "Nosotros" en 2–3 líneas, concreta y local.
   - CTA final con emoción ("¿Se te antojó?", "¿Listo para sonreír?", "¿Empezamos?").
10. **Adapta los íconos** al rubro (sección 4).

### Fase 4: Lógica (30–60 min, solo si cambia el módulo)

11. **Adapta el formulario** del drawer (campos del rubro).
12. **Adapta la plantilla del mensaje** de WhatsApp.
13. **Cambia el `@type`** del JSON-LD (Dentist, LodgingBusiness, HealthClub…).

### Fase 5: Pruebas y publicación (30 min)

14. Sigue la [sección 11](#11-cómo-probar-antes-de-entregar) completa.
15. Publica en Netlify y prueba en un celular real.
16. Entrega con el checklist de la [sección 12](#12-publicar-y-entregar-al-cliente).

**Tiempo total: unas 3–4 horas por página.** Con práctica, menos de 2.

---

## 14. Darle a cada demo un concepto único

> **Problema que tuvimos:** el restaurante, el hostal, el hotel y la tienda de ropa terminaron pareciéndose. Todos tenían fondo crema, botón terracota, acento dorado, títulos en serif elegante, bordes de 18/28 px y sombras suaves. Bonitos, pero "de la misma plantilla".

La solución es elegir primero un **concepto o metáfora** del rubro, y que todo salga de ahí: colores, tipografía, nombres de secciones, formas y animaciones.

### Cómo encontrar el concepto

1. **¿Qué objeto o ritual representa al negocio?** Un ticket, una carta, un pasaporte, un afiche, una receta, un boleto.
2. **¿Qué cultura visual local se puede usar?** Afiches chicha, letreros pintados a mano, mantas, textiles shipibo, señalética de mototaxis.
3. **Renombra las secciones con la metáfora.** "Opiniones" → "Dedicatorias". "Horarios" → "Próximas fechas". "Carrito" → "Comanda".
4. **Cambia al menos 4 de estos 6 ejes** respecto al último demo: paleta, tipografía, forma (bordes y sombras), librería de íconos, librería de animación y estructura del módulo principal.

### Conceptos ya usados (no repetir)

| Demo | Concepto | Tipografía | Paleta | Rasgos únicos |
|---|---|---|---|---|
| **Restaurante** | **Cartel chicha** (afiche de cumbia amazónica) | Bungee + Archivo + IBM Plex Mono | Negro cálido + fosforescentes (rosa, amarillo, verde, cian) | Platos como "artistas", neón ABIERTO, cassette, dedicatorias de radio, comanda-ticket, confeti |
| Hostal | Diario de viaje / mochilero | Bricolage Grotesque + Caveat | Selva + atardecer + oro | Mapa e itinerario, muro de corcho, pase, chat |
| Hotel | Recepción nocturna | Geist + Geist Mono + Caveat | Noche + cobre + latón | Menú de almohadas, tarifas, reglas, recepción |
| Tienda de ropa | Editorial de moda | Bodoni Moda + Manrope | Espresso + arcilla + salvia | Colección, looks, comunidad |

### Ideas de concepto para próximos rubros

| Rubro | Concepto | Elementos |
|---|---|---|
| Clínica dental | **Ficha clínica / odontograma** | Servicios como piezas dentales que se iluminan, cita como "receta", fuente técnica + redonda, blanco clínico con menta |
| Gimnasio | **Tablero de marcador deportivo** | Números LED, cronómetro, planes como "rounds", tipografía condensada, negro + lima neón |
| Academia | **Cuaderno cuadriculado** | Fondo de cuadrícula, resaltador amarillo, notas tipo post-it, cursos como "materias", ranking como libreta de notas |
| Inmobiliaria | **Plano arquitectónico** | Fondo azul de plano (blueprint), líneas de cota, lotes como planos interactivos, fuente técnica |
| Taller mecánico | **Orden de trabajo / tablero de herramientas** | Cinta de peligro amarilla y negra, placas metálicas, checklist de diagnóstico |
| Agencia de turismo | **Boleto de embarque fluvial** | Tours como pasajes, sellos de pasaporte, ruta del río animada |

### Técnicas que dan carácter (usadas en el cartel chicha)

```css
/* Sombras duras tipo serigrafía (en vez de sombras suaves) */
.tarjeta { border: 3px solid var(--tinta); box-shadow: 6px 6px 0 var(--rosa); }
.btn:active { transform: translate(3px, 3px); box-shadow: 1px 1px 0 var(--tinta); } /* se "presiona" */

/* Título con degradado + sombra de color desplazada */
.titulo { background: linear-gradient(180deg, #FFE14D, #FF7A1A); -webkit-background-clip: text; color: transparent;
          filter: drop-shadow(4px 4px 0 #FF2E88); } /* con background-clip usa drop-shadow, no text-shadow */

/* Rayos de sol de fondo */
background: repeating-conic-gradient(from 0deg at 75% 40%, rgba(255,225,77,.08) 0 7deg, transparent 7deg 14deg);

/* Semitono (puntos de imprenta) */
background: radial-gradient(rgba(255,46,136,.5) 1.6px, transparent 1.8px) 0 0 / 14px 14px;

/* Sello de estrella */
clip-path: polygon(50% 0%, 57.8% 10.8%, 69.1% 3.8%, /* … 32 puntos … */);

/* Letrero de neón */
text-shadow: 0 0 3px #fff, 0 0 10px #19E07A, 0 0 22px #19E07A, 0 0 42px #19E07A;

/* Ticket con borde dentado arriba y abajo */
mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / 18px 9px repeat-x,
      linear-gradient(#000 0 0) 0 9px / 100% calc(100% - 18px) no-repeat,
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 18px 9px repeat-x;
```

### Animaciones con GSAP (alternativa a AOS)

```js
gsap.registerPlugin(ScrollTrigger);
// Entrada del hero: las líneas "caen" con rebote y una rotación al azar
gsap.from('[data-anim="hero"]', { y: 46, opacity: 0, rotate: () => gsap.utils.random(-4, 4), ease: "back.out(1.8)", stagger: .11 });
// Bloques al hacer scroll (solo movimiento vertical: no genera scroll horizontal)
const bloques = gsap.utils.toArray('[data-anim]:not([data-anim="hero"])');
gsap.set(bloques, { opacity: 0, y: 40 });
ScrollTrigger.batch(bloques, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, stagger: .1 }) });
```

> ⚠️ No animes con GSAP los elementos que se filtran u ocultan (como las tarjetas de la carta). Si se ocultan antes de entrar en pantalla, pueden quedarse invisibles. Para esos casos usa una animación CSS simple al mostrarlos.

---

## Anexo: la fórmula visual en una tabla

| Ingrediente | Básico (no vende) | Premium (vende) |
|---|---|---|
| Fotos | Ilustraciones, íconos o stock genérico | Fotos reales, cálidas y coherentes |
| Títulos | Sans-serif estándar | Serif o display con **cursiva de acento** |
| Colores | 1 color + gris | Paleta 60-30-10 con intención |
| Fondos | Blanco puro | Crema, papel o arena; secciones alternadas claro/oscuro |
| Formas | Todo rectangular | Píldoras, arcos, esquinas orgánicas |
| Movimiento | Estático | Entradas suaves (AOS), hover con zoom, elementos que flotan |
| Confianza | Nada | Calificación, reseñas, logros, años |
| Urgencia | Nada | Oferta del día, precio tachado, "abierto ahora" |
| Acción | Un botón al final | WhatsApp en el header, el hero, flotante y el CTA final |
| Pedido | "Escríbenos" | Formulario que arma el mensaje completo |

---

*Hecho a partir del proyecto Sabor Amazónico · Puerto Maldonado, 2026.*
