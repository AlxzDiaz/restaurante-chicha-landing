/* ==========================================================
   CONFIGURACIÓN DEL RESTAURANTE
   Todo lo que cambia de un cliente a otro está en este archivo.
   No hace falta tocar main.js para personalizar la página.
   ========================================================== */

// Fotos de Unsplash (licencia gratuita, uso comercial permitido).
// Para un cliente real: reemplaza por sus fotos, p. ej. "images/platos/juane.webp"
const foto = (id, w = 640) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const CONFIG = {
  nombre: "Sabor Amazónico",
  eslogan: "Cocina de la selva",

  // WhatsApp: código de país + número, sin "+", espacios ni guiones
  whatsapp: "51999999999",
  telefono: "+51 999 999 999",
  instagram: "@saboramazonico",

  direccion: "Jr. Arequipa 123",
  ciudad: "Puerto Maldonado",
  region: "Madre de Dios",
  // En Google Maps: clic derecho sobre el local → copiar coordenadas
  ubicacion: { lat: -12.5937, lng: -69.1893 },

  // Deja una red en "" para ocultarla
  redes: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },

  // Barra superior. Déjala en "" para ocultarla.
  anuncio: "Delivery gratis en Puerto Maldonado por pedidos desde S/ 40",

  // Usa los datos REALES del perfil de Google del cliente
  rating: { valor: 4.8, total: 320, fuente: "Google" },

  delivery: { tiempo: "30–40 min", costo: 5, gratisDesde: 40 },
  pagos: ["Yape", "Plin", "Efectivo", "Tarjeta"],

  // El "cartel" del inicio: los platos se anuncian como artistas de cumbia
  cartel: {
    presenta: "Puerto Maldonado presenta",
    estelares: ["El Juane", "La Patarashca", "Los Patacones", "El Camu Camu"],
    invitado: "¡El Paiche a la parrilla!",
    platoEstrella: { nombre: "Patarashca", precio: 30 },
  },

  // "Lado A" del cassette: la historia del negocio, como un tracklist
  historia: [
    { anio: "2014", titulo: "La primera parrilla", texto: "Una mesa, una parrilla y la receta de juane de la abuela, en el mercado." },
    { anio: "2017", titulo: "Llegó el paiche", texto: "Sumamos pescados de río y la patarashca en hoja de bijao." },
    { anio: "2020", titulo: "Delivery a todo Puerto", texto: "Empezamos a llevar la sazón a las casas por WhatsApp." },
    { anio: "Hoy", titulo: "La casa llena", texto: "Más de 15 mil platos servidos y la misma leña de siempre." },
  ],

  // Números que generan confianza (se animan al aparecer)
  logros: [
    { valor: 10, sufijo: "+", texto: "años cocinando" },
    { valor: 15, sufijo: "k", texto: "platos servidos" },
    { valor: 4.8, sufijo: "★", texto: "en Google", decimales: 1 },
  ],

  // dias: 0 = domingo, 1 = lunes … 6 = sábado. Horas en formato 24 h.
  horarios: [
    { etiqueta: "Lunes a sábado", dias: [1, 2, 3, 4, 5, 6], abre: "11:00", cierra: "22:00" },
    { etiqueta: "Domingo", dias: [0], abre: "11:00", cierra: "21:00" },
  ],

  // Promoción destacada. Pon combo: null para ocultar la sección.
  combo: {
    nombre: "Combo Amazónico",
    descripcion: "Juane de arroz + refresco de camu camu + porción de patacones. El favorito de los almuerzos.",
    precio: 22,
    precioAntes: 31,
    imagen: foto("1783408355383-db6bcee73099", 900),
  },

  // icono: nombres de Remix Icon (remixicon.com) · color: rosa | amarillo | verde | cian | naranja
  categorias: [
    { id: "fondos", nombre: "Fondos", icono: "ri-restaurant-2-fill", color: "rosa" },
    { id: "entradas", nombre: "Entradas", icono: "ri-bowl-fill", color: "amarillo" },
    { id: "bebidas", nombre: "Bebidas", icono: "ri-goblet-fill", color: "verde" },
    { id: "postres", nombre: "Postres", icono: "ri-cake-3-fill", color: "cian" },
  ],

  // destacado: true muestra la etiqueta "Favorito"
  platos: [
    { categoria: "fondos", nombre: "Patarashca de doncella", precio: 30, destacado: true, imagen: foto("1783469567371-f1a384ea2edd"),
      descripcion: "Pescado de río sazonado con ajíes y sachaculantro, cocinado en hoja de bijao a la brasa." },
    { categoria: "fondos", nombre: "Juane de arroz", precio: 15, destacado: true, imagen: foto("1584208632869-05fa2b2a5934"),
      descripcion: "Arroz con gallina de chacra, aceituna y huevo, envuelto en hoja de bijao." },
    { categoria: "fondos", nombre: "Paiche a la parrilla", precio: 35, imagen: foto("1665401015549-712c0dc5ef85"),
      descripcion: "Filete del gigante de la Amazonía a la brasa, con patacones y ensalada fresca." },
    { categoria: "fondos", nombre: "Tacacho con cecina", precio: 18, imagen: foto("1563336522-c3bd728d3b45"),
      descripcion: "Plátano verde machacado con manteca y chicharrón, servido con cecina ahumada." },

    { categoria: "entradas", nombre: "Patacones con ají de cocona", precio: 10, imagen: foto("1762884601729-0eeeafbdfb8a"),
      descripcion: "Plátano verde frito y crocante, con nuestro ají de cocona de la casa." },
    { categoria: "entradas", nombre: "Cecina frita con yuca", precio: 14, imagen: foto("1535400255456-984241443b29"),
      descripcion: "Cecina ahumada dorada a la sartén con yuca sancochada y sarza criolla." },
    { categoria: "entradas", nombre: "Inchicapi de gallina", precio: 12, imagen: foto("1665593998976-d957f2827fe7"),
      descripcion: "Sopa tradicional de gallina con maní, maíz, yuca y sachaculantro." },

    { categoria: "bebidas", nombre: "Refresco de camu camu", precio: 6, destacado: true, imagen: foto("1662959486986-b97be12e607e"),
      descripcion: "La fruta con más vitamina C del mundo, bien helada." },
    { categoria: "bebidas", nombre: "Jugo de cocona", precio: 6, imagen: foto("1628961915805-4c92c885ce61"),
      descripcion: "Cocona fresca licuada, con el toque ácido de la selva." },
    { categoria: "bebidas", nombre: "Aguajina helada", precio: 7, imagen: foto("1534353473418-4cfa6c56fd38"),
      descripcion: "Bebida tradicional de aguaje, cremosa y refrescante." },

    { categoria: "postres", nombre: "Torta de castaña", precio: 9, destacado: true, imagen: foto("1603194202969-12a5dbd29d34"),
      descripcion: "Torta húmeda con castaña de Madre de Dios y manjar blanco." },
    { categoria: "postres", nombre: "Helado de copoazú", precio: 8, imagen: foto("1579954115563-e72bf1381629"),
      descripcion: "Helado artesanal de copoazú, cremoso y aromático." },
  ],

  galeria: [
    foto("1702827496398-b906ab2dd926", 800),
    foto("1649039721832-016222650b4d", 600),
    foto("1622688717978-52b2089546c8", 600),
    foto("1547573854-74d2a71d0826", 600),
    foto("1540714605746-4f474eefc6d4", 600),
    foto("1526069631228-723c945bea6b", 800),
  ],

  // Usa reseñas REALES del cliente (copiadas de Google o Facebook)
  testimonios: [
    { nombre: "María C.", fuente: "Google", estrellas: 5,
      texto: "El juane es igualito al de mi abuela. Atención rápida y el refresco de camu camu, buenazo." },
    { nombre: "Jorge R.", fuente: "Facebook", estrellas: 5,
      texto: "Pedimos por WhatsApp para la oficina y llegó todo calientito. El paiche a la parrilla, recomendadísimo." },
    { nombre: "Lucía T.", fuente: "Google", estrellas: 5,
      texto: "Lugar familiar, precios justos y porciones generosas. La torta de castaña es obligatoria." },
    { nombre: "Carlos M.", fuente: "Google", estrellas: 4,
      texto: "La patarashca en hoja de bijao es otra cosa. Vine por un turista y ahora vengo cada semana." },
  ],
};
