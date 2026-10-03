/* ==========================================================
   Landing de restaurante · concepto "Cartel Chicha" · lógica
   Lee los datos de CONFIG (js/config.js) y arma la página.
   ========================================================== */
(function () {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const soles = (n) => "S/ " + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const estrellas = (n) => `${"★".repeat(Math.round(n))}<span class="vacia">${"★".repeat(5 - Math.round(n))}</span>`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FALLBACK = { fondos: "images/platos/fondos.svg", entradas: "images/platos/entradas.svg", bebidas: "images/platos/bebidas.svg", postres: "images/platos/postres.svg" };
  const colorDe = Object.fromEntries(CONFIG.categorias.map((c) => [c.id, c.color || "rosa"]));
  const COLORES = ["amarillo", "rosa", "verde", "cian"];

  /* ---------- 0. Si una foto no carga, usar la ilustración de respaldo ---------- */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback;
  }, true); // "true": el evento error de <img> no burbujea

  /* ---------- 1. Datos generales ---------- */
  $$("[data-config]").forEach((el) => { el.textContent = CONFIG[el.dataset.config]; });
  // Nombre en dos colores: primera palabra amarilla, el resto rosa
  $$("[data-logo]").forEach((el) => {
    const [primera, ...resto] = CONFIG.nombre.split(" ");
    el.innerHTML = `<span class="w1">${esc(primera)}</span>${resto.length ? ` <span class="w2">${esc(resto.join(" "))}</span>` : ""}`;
  });

  $$("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa || `Hola ${CONFIG.nombre}, quiero hacer un pedido.`);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-red]").forEach((a) => {
    const url = CONFIG.redes[a.dataset.red];
    if (url) a.href = url; else a.remove();
  });
  $("#tel").href = "tel:" + CONFIG.telefono.replace(/\s/g, "");
  $("#anio").textContent = new Date().getFullYear();

  const direccionCompleta = `${CONFIG.direccion}, ${CONFIG.ciudad}, ${CONFIG.region}`;
  $("#direccion").textContent = direccionCompleta;
  $("#footer-direccion").textContent = direccionCompleta;
  $("#ticket-dir").textContent = `${CONFIG.direccion} · ${CONFIG.ciudad}`;
  $("#delivery-tiempo").textContent = CONFIG.delivery.tiempo;
  $("#pagos-corto").textContent = CONFIG.pagos.slice(0, 2).join(" · ");
  $("#pagos").innerHTML = CONFIG.pagos.map((p) => `<li>${esc(p)}</li>`).join("");
  $("#select-pago").innerHTML = CONFIG.pagos.map((p) => `<option>${esc(p)}</option>`).join("");

  /* ---------- 2. Ticker superior ---------- */
  const avisos = [
    CONFIG.anuncio,
    `Delivery en ${CONFIG.delivery.tiempo}`,
    `Paga con ${CONFIG.pagos.join(" · ")}`,
    CONFIG.rating ? `${CONFIG.rating.valor.toFixed(1)} ★ en ${CONFIG.rating.fuente}` : null,
    "Pide por WhatsApp",
  ].filter(Boolean);
  const tira = avisos.map((a) => `${esc(a)} <i class="ri-star-fill"></i>`).join(" ");
  $("#ticker").innerHTML = `<span>${tira}</span><span>${tira}</span>`;

  /* ---------- 3. Cartel (hero) ---------- */
  const cartel = CONFIG.cartel;
  $("#presenta").textContent = cartel.presenta;
  $("#lineup").innerHTML = cartel.estelares.map((e) => `<li>${esc(e)}</li>`).join("");
  $("#invitado").textContent = cartel.invitado;
  $("#estrella-precio").textContent = "S/ " + cartel.platoEstrella.precio;
  $("#estrella-nombre").textContent = cartel.platoEstrella.nombre;

  const r = CONFIG.rating;
  if (r) {
    $("#rating").innerHTML = `<strong>★ ${r.valor.toFixed(1)}</strong><small>${r.total} reseñas · ${esc(r.fuente)}</small>`;
    $("#resumen-rating").innerHTML = `<span class="num">${r.valor.toFixed(1)}</span>
      <span><span class="estrellas" role="img" aria-label="${r.valor} de 5 estrellas">${estrellas(r.valor)}</span><br><small>${r.total} reseñas en ${esc(r.fuente)}</small></span>`;
  }

  /* ---------- 4. Pedido (estado + persistencia) ---------- */
  const productos = new Map(); // id → { nombre, precio }
  CONFIG.platos.forEach((p, i) => productos.set("p" + i, { nombre: p.nombre, precio: p.precio }));
  if (CONFIG.combo) productos.set("combo", { nombre: CONFIG.combo.nombre, precio: CONFIG.combo.precio });

  const CLAVE = "pedido-" + CONFIG.nombre;
  const pedido = new Map(); // id → cantidad
  try {
    JSON.parse(localStorage.getItem(CLAVE) || "[]").forEach(([id, n]) => { if (productos.has(id) && n > 0) pedido.set(id, n); });
  } catch (_) { /* almacenamiento no disponible */ }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify([...pedido])); } catch (_) { /* nada */ } };

  function cambiar(id, delta) {
    const antes = pedido.get(id) || 0;
    const n = antes + delta;
    if (n > 0) pedido.set(id, n); else pedido.delete(id);
    guardar();
    actualizarTodo();
    if (delta > 0 && antes === 0) {
      avisar(`¡${productos.get(id).nombre} a la comanda!`);
      const btn = $("#comanda-btn"); btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    }
  }

  const stepperHTML = (id, n, nombre) => `
    <div class="stepper">
      <button type="button" data-id="${id}" data-op="-1" aria-label="Quitar un ${esc(nombre)}"><i class="ri-${n === 1 ? "delete-bin-6-line" : "subtract-line"}"></i></button>
      <span>${n}</span>
      <button type="button" data-id="${id}" data-op="1" aria-label="Agregar otro ${esc(nombre)}"><i class="ri-add-line"></i></button>
    </div>`;

  /* ---------- 5. Función estelar (combo) ---------- */
  if (CONFIG.combo) {
    const c = CONFIG.combo;
    $("#combo-img").src = c.imagen;
    $("#combo-img").alt = c.nombre;
    $("#combo-nombre").textContent = c.nombre;
    $("#combo-desc").textContent = c.descripcion;
    $("#combo-precio").textContent = soles(c.precio);
    $("#combo-antes").textContent = c.precioAntes ? soles(c.precioAntes) : "";
    if (c.precioAntes) $("#combo-ahorro").textContent = "S/ " + (c.precioAntes - c.precio);
    else $(".estallido--combo").remove();
    $("#combo-agregar").addEventListener("click", () => cambiar("combo", 1));
  } else {
    $("#combo").remove();
  }

  /* ---------- 6. La carta ---------- */
  const filtros = $("#filtros");
  const grid = $("#platos");

  filtros.innerHTML = [{ id: "todos", nombre: "Todo", icono: "ri-layout-grid-fill", color: "amarillo" }, ...CONFIG.categorias]
    .map((c) => `<button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === "todos"}" style="--c: var(--${c.color})"><i class="${c.icono}" aria-hidden="true"></i>${esc(c.nombre)}</button>`)
    .join("");

  grid.innerHTML = CONFIG.platos.map((p, i) => `
    <li class="plato" data-cat="${p.categoria}" style="--c: var(--${colorDe[p.categoria]})">
      <div class="plato__media">
        <img src="${esc(p.imagen)}" data-fallback="${FALLBACK[p.categoria]}" alt="${esc(p.nombre)}" width="640" height="480" loading="lazy" decoding="async">
        ${p.destacado ? '<span class="plato__tag"><i class="ri-star-fill"></i> Favorito</span>' : ""}
        <span class="plato__precio">S/ ${p.precio}</span>
      </div>
      <div class="plato__cuerpo">
        <h3 class="plato__nombre">${esc(p.nombre)}</h3>
        <p class="plato__desc">${esc(p.descripcion)}</p>
        <div class="plato__accion" data-id="p${i}"></div>
      </div>
    </li>`).join("");

  filtros.addEventListener("click", (e) => {
    const boton = e.target.closest(".chip");
    if (!boton) return;
    const cat = boton.dataset.cat;
    $$(".chip", filtros).forEach((c) => c.setAttribute("aria-pressed", c === boton));
    $$(".plato", grid).forEach((li) => {
      li.hidden = cat !== "todos" && li.dataset.cat !== cat;
      li.classList.remove("aparece"); void li.offsetWidth; li.classList.add("aparece");
    });
    filtros.scrollTo({ left: boton.offsetLeft - (filtros.clientWidth - boton.offsetWidth) / 2, behavior: "smooth" });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  function pintarAcciones() {
    $$(".plato__accion", grid).forEach((cont) => {
      const id = cont.dataset.id;
      const n = pedido.get(id) || 0;
      const nombre = productos.get(id).nombre;
      if (cont.dataset.n === String(n)) return;
      cont.dataset.n = n;
      cont.innerHTML = n === 0
        ? `<button type="button" class="btn btn--add" data-id="${id}" data-op="1" aria-label="Agregar ${esc(nombre)} a la comanda"><i class="ri-add-line"></i>Agregar</button>`
        : stepperHTML(id, n, nombre);
    });
  }

  // Un solo manejador para todos los botones +/− (carta y comanda)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-op][data-id]");
    if (!b) return;
    const { id, op } = b.dataset;
    const enComanda = !!b.closest(".comanda");
    cambiar(id, Number(op));
    // Devolver el foco a un control equivalente tras redibujar (teclado)
    requestAnimationFrame(() => {
      const mismo = $$(`[data-id="${id}"][data-op="${op}"]`).find((x) => !!x.closest(".comanda") === enComanda)
        || $$(`[data-id="${id}"][data-op]`).find((x) => !!x.closest(".comanda") === enComanda);
      if (mismo) mismo.focus();
    });
  });

  /* ---------- 7. Comanda: ticket, totales y envío por WhatsApp ---------- */
  const drawer = $("#drawer");
  const form = $("#form-pedido");

  // N° de comanda por sesión (decorativo, también va en el mensaje)
  let numero;
  try { numero = sessionStorage.getItem("comanda-n"); } catch (_) { /* nada */ }
  if (!numero) {
    numero = String(Math.floor(1000 + Math.random() * 9000));
    try { sessionStorage.setItem("comanda-n", numero); } catch (_) { /* nada */ }
  }
  $("#ticket-n").textContent = numero;

  function calcular() {
    let items = 0, subtotal = 0;
    pedido.forEach((n, id) => { items += n; subtotal += n * productos.get(id).precio; });
    const esDelivery = form.entrega.value === "Delivery";
    const d = CONFIG.delivery;
    const envio = esDelivery && subtotal > 0 && subtotal < d.gratisDesde ? d.costo : 0;
    return { items, subtotal, envio, total: subtotal + envio, esDelivery };
  }

  function actualizarTodo() {
    pintarAcciones();
    const { items, subtotal, envio, total, esDelivery } = calcular();

    $("#comanda-n").hidden = items === 0;
    $("#comanda-n").textContent = items;
    $("#barra").hidden = items === 0;
    $("#barra-n").textContent = items;
    $("#barra-total").textContent = soles(total);
    document.body.classList.toggle("con-pedido", items > 0);

    $("#items").innerHTML = [...pedido].map(([id, n]) => {
      const p = productos.get(id);
      return `<li class="item">
        <div class="item__linea"><span>${n} x ${esc(p.nombre)}</span><span class="item__puntos"></span><span>${(n * p.precio).toFixed(2)}</span></div>
        <div class="item__pie"><span>${soles(p.precio)} c/u</span>${stepperHTML(id, n, p.nombre)}</div>
      </li>`;
    }).join("");
    $("#vacio").hidden = items > 0;
    $("#enviar").disabled = items === 0;
    $("#campo-direccion").hidden = !esDelivery;
    $("#fila-envio").hidden = !esDelivery;
    $("#t-subtotal").textContent = soles(subtotal);
    $("#t-envio").textContent = envio ? soles(envio) : "Gratis";
    $("#t-total").textContent = soles(total);
    const falta = CONFIG.delivery.gratisDesde - subtotal;
    $("#aviso-envio").textContent = esDelivery && subtotal > 0 && falta > 0 ? `» Agrega ${soles(falta)} más y el delivery es gratis` : "";
  }

  const abrir = () => {
    $("#ticket-fecha").textContent = new Date().toLocaleString("es-PE", { timeZone: "America/Lima", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    actualizarTodo();
    drawer.showModal();
  };
  $("#barra").addEventListener("click", abrir);
  $("#comanda-btn").addEventListener("click", abrir);
  $("#drawer-cerrar").addEventListener("click", () => drawer.close());
  drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); }); // clic fuera del ticket
  form.addEventListener("change", (e) => { if (e.target.name === "entrega") actualizarTodo(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const direccion = form.direccion.value.trim();
    const { subtotal, envio, total, esDelivery } = calcular();

    form.nombre.setAttribute("aria-invalid", String(!nombre));
    form.direccion.setAttribute("aria-invalid", String(esDelivery && !direccion));
    if (!nombre) return form.nombre.focus();
    if (esDelivery && !direccion) return form.direccion.focus();

    const lineas = [...pedido].map(([id, n]) => `• ${n} x ${productos.get(id).nombre} — ${soles(n * productos.get(id).precio)}`);
    const msg = [
      `Hola ${CONFIG.nombre} 👋, te mando mi comanda N° ${numero}:`,
      "",
      ...lineas,
      "",
      `Subtotal: ${soles(subtotal)}`,
      esDelivery ? `Envío: ${envio ? soles(envio) : "Gratis"}` : null,
      `*Total: ${soles(total)}*`,
      "",
      `👤 Nombre: ${nombre}`,
      `🛵 Entrega: ${form.entrega.value}`,
      esDelivery ? `📍 Dirección: ${direccion}` : null,
      `💳 Pago: ${form.pago.value}`,
      form.notas.value.trim() ? `📝 Notas: ${form.notas.value.trim()}` : null,
    ].filter((l) => l !== null).join("\n");

    window.open(waLink(msg), "_blank", "noopener");
    if (window.confetti && !reduceMotion) {
      confetti({ particleCount: 140, spread: 85, origin: { y: .75 }, colors: ["#FF2E88", "#FFE14D", "#19E07A", "#2BD4FF", "#FF7A1A"] });
    }
  });

  /* ---------- 8. Toast ---------- */
  let toastTimer;
  function avisar(texto) {
    const t = $("#toast");
    t.innerHTML = `<i class="ri-checkbox-circle-fill" aria-hidden="true"></i>${esc(texto)}`;
    t.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("visible"), 1800);
  }

  /* ---------- 9. Horarios, neón "Abierto" y próximas fechas (hora de Perú) ---------- */
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const aMinutos = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const formatoHora = (hhmm) => {
    let [h, m] = hhmm.split(":").map(Number);
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12;
    return m === 0 ? `${h} ${sufijo}` : `${h}:${String(m).padStart(2, "0")} ${sufijo}`;
  };
  const horarioDe = (dia) => CONFIG.horarios.find((h) => h.dias.includes(dia));

  function ahoraEnLima() {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Lima", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const valor = (tipo) => partes.find((p) => p.type === tipo).value;
    return {
      dia: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday")),
      minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
    };
  }

  function pintarHorarios() {
    const { dia, minutos } = ahoraEnLima();
    const hoy = horarioDe(dia);
    const abierto = !!hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra);
    const rango = (h) => `${formatoHora(h.abre)} – ${formatoHora(h.cierra)}`;

    $("#fechas-lista").innerHTML = CONFIG.horarios.map((h) => {
      const esHoy = h === hoy;
      return `<li class="fecha${esHoy ? " fecha--hoy" : ""}">
        <span class="fecha__dias">${esc(h.etiqueta)}</span>
        <span class="fecha__hora">${rango(h)}</span>
        <span class="fecha__lugar">${esc(CONFIG.direccion)} · ${esc(CONFIG.ciudad)}</span>
        <span class="fecha__estado">${esHoy ? (abierto ? "¡En vivo!" : "Hoy") : "Semanal"}</span>
      </li>`;
    }).join("");
    $("#footer-horarios").innerHTML = CONFIG.horarios.map((h) =>
      `<li><i class="ri-time-fill" aria-hidden="true"></i><span>${esc(h.etiqueta)}<br>${rango(h)}</span></li>`).join("");

    const neon = $("#neon");
    const texto = $("#estado-texto");
    neon.dataset.estado = abierto ? "abierto" : "cerrado";
    neon.textContent = abierto ? "Abierto" : "Cerrado";
    if (abierto) { texto.textContent = `Hoy hasta las ${formatoHora(hoy.cierra)}`; return; }
    if (hoy && minutos < aMinutos(hoy.abre)) { texto.textContent = `Abrimos hoy a las ${formatoHora(hoy.abre)}`; return; }
    for (let d = 1; d <= 7; d++) {
      const sig = horarioDe((dia + d) % 7);
      if (sig) { texto.textContent = `Abrimos ${d === 1 ? "mañana" : "el " + DIAS[(dia + d) % 7]} a las ${formatoHora(sig.abre)}`; return; }
    }
  }
  pintarHorarios();
  setInterval(pintarHorarios, 60 * 1000);

  /* ---------- 10. Historia: tracklist + logros animados ---------- */
  $("#tracklist").innerHTML = (CONFIG.historia || []).map((t, i) => `
    <li>
      <span class="track__n">${String(i + 1).padStart(2, "0")}</span>
      <div><strong>${esc(t.titulo)}</strong><p>${esc(t.texto)}</p></div>
      <span class="track__t">${esc(t.anio)}</span>
    </li>`).join("");

  $("#logros").innerHTML = CONFIG.logros.map((l) =>
    `<li><strong data-valor="${l.valor}" data-dec="${l.decimales || 0}" data-sufijo="${esc(l.sufijo || "")}">0</strong><span>${esc(l.texto)}</span></li>`).join("");
  const valorFinal = (el) => Number(el.dataset.valor).toFixed(Number(el.dataset.dec)) + el.dataset.sufijo;
  const animarNumero = (el) => {
    const fin = Number(el.dataset.valor), dec = Number(el.dataset.dec), suf = el.dataset.sufijo;
    const t0 = performance.now(), dur = 1400;
    setTimeout(() => { el.textContent = valorFinal(el); }, dur + 100); // respaldo si rAF está pausado
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (fin * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  $$("#logros strong").forEach((el) => {
    if (reduceMotion || !("IntersectionObserver" in window)) { el.textContent = valorFinal(el); return; }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { animarNumero(el); io.disconnect(); } }, { threshold: .6 });
    io.observe(el);
  });

  /* ---------- 11. Galería tipo película (dos filas en sentidos opuestos) ---------- */
  const fotos = CONFIG.galeria;
  const fila = (lista, conAlt) => {
    const figs = (alt) => lista.map((src, i) =>
      `<figure><img src="${esc(src)}" data-fallback="images/local.svg" alt="${alt ? `Foto ${i + 1} de nuestra cocina` : ""}" decoding="async"></figure>`).join(""); // sin lazy: la cinta se mueve y no debe mostrar marcos vacíos
    // 3 copias para que el desfile sea infinito incluso en pantallas muy anchas; las copias son decorativas
    const copia = `<div style="display:contents" aria-hidden="true">${figs(false)}</div>`;
    return `<div class="pelicula__fila"${conAlt ? "" : ' aria-hidden="true"'}><div class="pelicula__pista">${figs(conAlt)}${copia}${copia}</div></div>`;
  };
  const corte = Math.ceil(fotos.length / 2);
  $("#pelicula").innerHTML = fila(fotos, true) + fila(fotos.slice(corte).concat(fotos.slice(0, corte)), false);
  const ig = $("#ig-link");
  ig.textContent = CONFIG.instagram;
  ig.href = CONFIG.redes.instagram || "#";

  /* ---------- 12. Dedicatorias ---------- */
  $("#testimonios").innerHTML = CONFIG.testimonios.map((t, i) => `
    <li class="dedicatoria" style="--c: var(--${COLORES[i % COLORES.length]})" data-anim>
      <span class="dedicatoria__num"><i class="ri-mic-fill" aria-hidden="true"></i> Dedicatoria N° ${String(i + 1).padStart(2, "0")}</span>
      <blockquote>“${esc(t.texto)}”</blockquote>
      <footer>Saludos de <strong>${esc(t.nombre)}</strong>
        <span class="estrellas" role="img" aria-label="${t.estrellas} de 5 estrellas">${estrellas(t.estrellas)}</span>
        <span>vía ${esc(t.fuente)}</span></footer>
    </li>`).join("");

  /* ---------- 13. Mapa ---------- */
  const { lat, lng } = CONFIG.ubicacion;
  $("#mapa").src = `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
  $("#como-llegar").href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  /* ---------- 14. Menú móvil ---------- */
  const toggle = $("#nav-toggle");
  const nav = $("#nav");
  const cerrarMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("abierto");
  };
  toggle.addEventListener("click", () => {
    const abrirMenu = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(abrirMenu));
    toggle.setAttribute("aria-label", abrirMenu ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("abierto", abrirMenu);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) cerrarMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  /* ---------- 15. SEO local: datos estructurados ---------- */
  const precios = CONFIG.platos.map((p) => p.precio);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: CONFIG.nombre,
    servesCuisine: "Amazónica",
    telephone: CONFIG.telefono,
    priceRange: `S/ ${Math.min(...precios)} – S/ ${Math.max(...precios)}`,
    url: location.href.split("#")[0],
    paymentAccepted: CONFIG.pagos.join(", "),
    address: { "@type": "PostalAddress", streetAddress: CONFIG.direccion, addressLocality: CONFIG.ciudad, addressRegion: CONFIG.region, addressCountry: "PE" },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    openingHoursSpecification: CONFIG.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]),
      opens: h.abre, closes: h.cierra,
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);

  /* ---------- 16. Inicio + animaciones con GSAP ---------- */
  actualizarTodo();

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    // Entrada del cartel: las líneas "caen" como letras pegadas en un afiche
    gsap.from('[data-anim="hero"]', { y: 46, opacity: 0, rotate: () => gsap.utils.random(-4, 4), duration: .75, ease: "back.out(1.8)", stagger: .11 });
    gsap.from("#cartel-visual", { opacity: 0, scale: .82, rotate: 8, duration: 1, ease: "back.out(1.6)", delay: .3 });
    // Resto de bloques: aparecen al hacer scroll (solo movimiento vertical: no genera scroll horizontal)
    const bloques = gsap.utils.toArray('[data-anim]:not([data-anim="hero"])');
    gsap.set(bloques, { opacity: 0, y: 40 });
    ScrollTrigger.batch(bloques, {
      start: "top 90%", once: true,
      onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .1, overwrite: true }),
    });
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();
