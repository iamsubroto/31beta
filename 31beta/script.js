(function () {
  "use strict";

  /* ==========================================================================
     Configuration & Constants (matching source)
     ========================================================================== */
  const STORAGE_KEY = "omc-lang";
  const DEFAULT_WHATSAPP = "528110169320";
  const DEFAULT_VIDEO_URL =
    "https://vioniko.s3.us-west-2.amazonaws.com/videos/plantacionganodermadeganoexcel.mp4";

  function getWhatsAppNumber() {
    const raw = (document.body && document.body.getAttribute("data-whatsapp")) || "";
    const digits = raw.replace(/\D+/g, "");
    return digits || DEFAULT_WHATSAPP;
  }

  function getVideoUrl() {
    const raw = (document.body && document.body.getAttribute("data-video")) || "";
    return raw.trim() || DEFAULT_VIDEO_URL;
  }

  function toEmbedVideoUrl(url) {
    try {
      const parsed = new URL(url, window.location.href);
      const host = parsed.hostname.toLowerCase();
      let videoId = "";
      if (host === "youtu.be") {
        videoId = parsed.pathname.replace(/^\//, "").split("/")[0];
      } else if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
        if (parsed.pathname === "/watch") {
          videoId = parsed.searchParams.get("v") || "";
        } else if (parsed.pathname.startsWith("/embed/")) {
          videoId = parsed.pathname.slice("/embed/".length).split("/")[0];
        } else if (parsed.pathname.startsWith("/shorts/")) {
          videoId = parsed.pathname.slice("/shorts/".length).split("/")[0];
        }
      }
      if (videoId) {
        return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(videoId) + "?autoplay=1&rel=0";
      }
    } catch (_) {
      /* fallback to raw URL */
    }
    return url;
  }

  const PRODUCT_PRICES = {
    "GanoCafé Classic": {
      subscribe: { originalUsd: 50, finalUsd: 25, savePercent: 50 },
      oneTime: { originalUsd: 50, finalUsd: 33, savePercent: 34 },
      title: { es: "GanoCafé Classic", en: "GanoCafé Classic" },
    },
    "GanoCafé 3 en 1": {
      subscribe: { originalUsd: 50, finalUsd: 25, savePercent: 50 },
      oneTime: { originalUsd: 50, finalUsd: 33, savePercent: 34 },
      title: { es: "GanoCafé 3 en 1", en: "GanoCafé 3 in 1" },
    },
    "GanoCafé Schokolade": {
      subscribe: { originalUsd: 50, finalUsd: 26, savePercent: 50 },
      oneTime: { originalUsd: 50, finalUsd: 34, savePercent: 34 },
      title: { es: "GanoCafé Schokolade", en: "GanoCafé Schokolade" },
    },
  };

  const OPTION_LABELS = {
    subscribe: { es: "Suscríbete y ahorra", en: "Subscribe & save" },
    oneTime: { es: "Compra una vez", en: "Buy once" },
  };

  const WA_MESSAGES = {
    general: {
      es: "¡Hola! Me interesa el Original Mushroom Coffee GE ☕🍄",
      en: "Hi! I'm interested in Original Mushroom Coffee GE ☕🍄",
    },
    moreInfo: {
      es: "Hola, quiero más información sobre el café con ganoderma",
      en: "Hi, I'd like more information about the ganoderma coffee",
    },
    tryCoffee: {
      es: "Hola, quiero probar el café con ganoderma. Ayúdame a elegir el producto y hacer mi pedido.",
      en: "Hi, I'd like to try the ganoderma coffee. Help me choose a product and place my order.",
    },
    startBusiness: {
      es: "Hola, quiero empezar mi negocio distribuyendo la marca. Ayúdame a elegir el paquete adecuado.",
      en: "Hi, I want to start my business distributing the brand. Help me choose the right package.",
    },
  };

  const ROUTE_META = {
    home: {
      title: "Original Mushroom Coffee GE | Café con Ganoderma",
      description:
        "Café con extracto de ganoderma desde 1995, presente en más de 15 países de Latinoamérica. Pide por WhatsApp.",
    },
    distribuye: {
      title: "Distribuye la Marca | Original Mushroom Coffee GE",
      description:
        "Convierte el café en tu negocio: distribuye una marca con respaldo desde 1995, operación en 16 países y un sistema completo listo para operar.",
    },
  };

  /* ==========================================================================
     Translations (exact ES / EN strings from React source)
     ========================================================================== */
  const I18N = {
    "footer.sub": {
      es: "Desde 1995 · Más de 15 países de Latinoamérica",
      en: "Since 1995 · More than 15 Latin American countries",
    },

    /* Home */
    "home.banner": {
      es: "¡Pide hoy por WhatsApp y recibe atención personalizada!",
      en: "Order today on WhatsApp and get personalized service!",
    },
    "home.heroEyebrow": {
      es: "Desde 1995 · Presentes en más de 15 países de Latinoamérica",
      en: "Since 1995 · Present in more than 15 Latin American countries",
    },
    "home.heroTitle": {
      es: "Café que se antoja. Ganoderma que te cuida.",
      en: "Coffee you'll crave. Ganoderma that cares for you.",
    },
    "home.heroSubtitle": {
      es: "Impulsado por la naturaleza para darte energía duradera, mente clara y bienestar diario.",
      en: "Powered by nature to give you lasting energy, a clear mind and everyday wellness.",
    },
    "home.benefit1": { es: "Enfoque", en: "Focus" },
    "home.benefit2": { es: "Energía", en: "Energy" },
    "home.benefit3": { es: "Digestión", en: "Digestion" },
    "home.benefit4": { es: "Defensas", en: "Immunity" },
    "home.heroImgAlt": {
      es: "Los tres productos: GanoCafé Classic, GanoCafé 3 en 1 y GanoCafé Schokolade, con sus bebidas preparadas calientes y frías",
      en: "The three products: GanoCafé Classic, GanoCafé 3 in 1 and GanoCafé Schokolade, with their hot and iced drinks",
    },
    "home.stat1": { es: "Desde", en: "Since" },
    "home.stat2": { es: "Países de Latinoamérica", en: "Latin American countries" },
    "home.stat3": { es: "Ganodermas seleccionados", en: "Selected ganodermas" },
    "home.stat4": { es: "Sabor a café", en: "Coffee flavor" },
    "home.ganodermaImgAlt": {
      es: "Beneficios del ganoderma: apoya el sistema inmunológico, da energía, mejora la circulación, el sueño y la piel, oxigena y desintoxica el cuerpo",
      en: "Ganoderma benefits: supports the immune system, boosts energy, improves circulation, sleep and skin, oxygenates and detoxifies the body",
    },
    "home.videoKicker": { es: "Las plantaciones", en: "The plantations" },
    "home.videoPlayAria": {
      es: "Reproducir el video de las plantaciones",
      en: "Play the plantation video",
    },
    "home.videoIframeTitle": {
      es: "Video de las plantaciones de ganoderma",
      en: "Video of the ganoderma plantations",
    },
    "home.videoImgAlt": {
      es: "Invernaderos de ganoderma con filas de cultivo en un paisaje tropical",
      en: "Ganoderma greenhouses with rows of crops in a tropical landscape",
    },
    "home.videoTitle": {
      es: "Dale click para que conozcas las plantaciones",
      en: "Click to see the plantations",
    },
    "home.videoDesc": {
      es: "Un recorrido real por los invernaderos donde crece el ganoderma que llega a tu taza.",
      en: "A real walk through the greenhouses where the ganoderma in your cup is grown.",
    },
    "home.videoBtn": { es: "Ver el video", en: "Watch the video" },
    "home.ctaOrder": { es: "Pedir por WhatsApp", en: "Order on WhatsApp" },
    "home.ctaInfo": { es: "Quiero más información", en: "I want more information" },
    "home.trust1": { es: "Presentes en +15 países", en: "Present in 15+ countries" },
    "home.trust2": { es: "Atención directa y cercana", en: "Direct, personal service" },
    "home.sevenDaysLead": {
      es: "Siente la diferencia en solo",
      en: "Feel the difference in just",
    },
    "home.sevenDaysNum": { es: "7 días", en: "7 days" },
    "home.originKicker": { es: "Nuestro origen", en: "Our origin" },
    "home.originTitle": {
      es: "Del invernadero a tu taza",
      en: "From the greenhouse to your cup",
    },
    "home.originSubtitle": {
      es: "No cualquier ganoderma sirve. Así se cultiva el que llega a tu café.",
      en: "Not just any ganoderma will do. This is how we grow the one that reaches your coffee.",
    },
    "home.origin1Title": { es: "Desde Malasia", en: "From Malaysia" },
    "home.origin1Desc": {
      es: "Nuestro ganoderma viene de Malasia, de donde salen las mejores cepas del mundo.",
      en: "Our ganoderma comes from Malaysia, home of the finest strains in the world.",
    },
    "home.origin2Title": {
      es: "Invernaderos con clima controlado",
      en: "Climate-controlled greenhouses",
    },
    "home.origin2Desc": {
      es: "Cultivado con temperatura y humedad controladas, para que el hongo crezca fuerte y limpio.",
      en: "Grown with controlled temperature and humidity, so the mushroom grows strong and clean.",
    },
    "home.origin3Title": {
      es: "Ganoderma cosechado a mano",
      en: "Hand-harvested ganoderma",
    },
    "home.origin3Desc": {
      es: "Se recolecta a mano, en su punto justo. Sin prisas y sin mezclas de relleno.",
      en: "Picked by hand at just the right moment. No rushing and no filler blends.",
    },
    "home.origin4Title": {
      es: "Extracto de los 6 ganodermas con mayores beneficios",
      en: "Extract of the 6 most beneficial ganodermas",
    },
    "home.origin4Desc": {
      es: "Extraemos lo activo de seis variedades, no el polvo: por eso tu taza rinde de verdad.",
      en: "We extract the active part of six varieties, not the powder: that's why your cup truly delivers.",
    },
    "home.productsKicker": { es: "Nuestros productos", en: "Our products" },
    "home.productsTitle": { es: "Elige tu favorito", en: "Pick your favorite" },
    "home.productsSubtitle": {
      es: "Tres formas de disfrutar el poder del ganoderma, caliente o fría, una para cada momento del día. Desliza cada producto para verlo en las dos versiones.",
      en: "Three ways to enjoy the power of ganoderma, hot or iced, one for every moment of the day. Swipe each product to see both versions.",
    },
    "home.badgeHot": { es: "Caliente", en: "Hot" },
    "home.badgeIced": { es: "Fría", en: "Iced" },
    "home.swipeHint": { es: "Desliza →", en: "Swipe →" },
    "home.prodClassicTitle": { es: "GanoCafé Classic", en: "GanoCafé Classic" },
    "home.prodClassicMeta": { es: "30 sobres de 3 g", en: "30 sachets of 3 g" },
    "home.prodClassicDesc": {
      es: "Café negro enriquecido con ganoderma lucidum. Intenso, de cuerpo completo y sin azúcar: para los que aman el café de verdad.",
      en: "Black coffee enriched with Ganoderma lucidum. Bold, full-bodied and sugar-free: for true coffee lovers.",
    },
    "home.prodClassicHotAlt": {
      es: "Caja de GanoCafé Classic con ganoderma, preparación caliente",
      en: "GanoCafé Classic box with ganoderma, served hot",
    },
    "home.prodClassicIcedAlt": {
      es: "GanoCafé Classic preparado como bebida fría con hielo",
      en: "GanoCafé Classic prepared as an iced drink",
    },
    "home.prod3in1Title": { es: "GanoCafé 3 en 1", en: "GanoCafé 3 in 1" },
    "home.prod3in1Meta": { es: "20 sobres de 21 g", en: "20 sachets of 21 g" },
    "home.prod3in1Desc": {
      es: "Café, crema y un toque de dulzor con ganoderma lucidum. Cremoso y listo en segundos: tu taza perfecta sin complicaciones.",
      en: "Coffee, creamer and a touch of sweetness with Ganoderma lucidum. Creamy and ready in seconds: your perfect cup, no fuss.",
    },
    "home.prod3in1HotAlt": {
      es: "Caja de GanoCafé 3 en 1 con ganoderma, preparación caliente",
      en: "GanoCafé 3 in 1 box with ganoderma, served hot",
    },
    "home.prod3in1IcedAlt": {
      es: "GanoCafé 3 en 1 preparado como bebida fría con hielo",
      en: "GanoCafé 3 in 1 prepared as an iced drink",
    },
    "home.prodSchokoTitle": { es: "GanoCafé Schokolade", en: "GanoCafé Schokolade" },
    "home.prodSchokoMeta": { es: "20 sobres de 20 g", en: "20 sachets of 20 g" },
    "home.prodSchokoDesc": {
      es: "Chocolate caliente enriquecido con ganoderma lucidum. Rico, reconfortante y perfecto para toda la familia.",
      en: "Hot chocolate enriched with Ganoderma lucidum. Rich, comforting and perfect for the whole family.",
    },
    "home.prodSchokoHotAlt": {
      es: "Caja de GanoCafé Schokolade con ganoderma, preparación caliente",
      en: "GanoCafé Schokolade box with ganoderma, served hot",
    },
    "home.prodSchokoIcedAlt": {
      es: "GanoCafé Schokolade preparado como bebida fría con hielo",
      en: "GanoCafé Schokolade prepared as an iced drink",
    },
    "home.optSubscribe": { es: "Suscríbete y ahorra", en: "Subscribe & save" },
    "home.optOneTime": { es: "Compra una vez", en: "Buy once" },
    "home.saveWord": { es: "Ahorra", en: "Save" },
    "home.orderNow": { es: "Pedir ahora", en: "Order now" },
    "home.diffKicker": {
      es: "Lo que nos hace diferentes",
      en: "What makes us different",
    },
    "home.diffTitle": {
      es: "Un mejor estándar para tu café de cada día",
      en: "A higher standard for your everyday coffee",
    },
    "home.diffSubtitle": {
      es: "Combinamos lo mejor del café con el poder del ganoderma, para que cada taza sea un ritual de bienestar.",
      en: "We combine the best of coffee with the power of ganoderma, so every cup becomes a wellness ritual.",
    },
    "home.diff1Title": { es: "Sabor 100% a café", en: "100% coffee flavor" },
    "home.diff1Desc": {
      es: "Usamos extracto de ganoderma, no polvo de hongo. Por eso sabe a café y nada más: sin sabor a tierra ni a medicinas.",
      en: "We use ganoderma extract, not mushroom powder. That's why it tastes like coffee and nothing else: no earthy or medicinal taste.",
    },
    "home.diff2Title": { es: "Ganoderma de verdad", en: "Real ganoderma" },
    "home.diff2Desc": {
      es: "Extracto de los 6 ganodermas con mayores beneficios, cosechados a mano en invernaderos de clima controlado en Malasia.",
      en: "Extract of the 6 most beneficial ganodermas, hand-harvested in climate-controlled greenhouses in Malaysia.",
    },
    "home.diff3Title": {
      es: "Energía sin nervios",
      en: "Energy without the jitters",
    },
    "home.diff3Desc": {
      es: "Disfruta tu café con un despertar suave, sin bajones ni ansiedad a media tarde.",
      en: "Enjoy your coffee with a smooth wake-up, without crashes or mid-afternoon anxiety.",
    },
    "home.compareKicker": { es: "Compara", en: "Compare" },
    "home.compareTitle": {
      es: "Café regular vs. nuestro café",
      en: "Regular coffee vs. our coffee",
    },
    "home.compareCol1": { es: "Característica", en: "Feature" },
    "home.compareCol2": { es: "Café regular", en: "Regular coffee" },
    "home.compareCol3": { es: "Nuestro café", en: "Our coffee" },
    "home.compareRow1": { es: "Cero acidez", en: "Zero acidity" },
    "home.compareRow2": {
      es: "Sin sensación de taquicardia ni nerviosismo",
      en: "No racing heart or jitters",
    },
    "home.compareRow3": {
      es: "Café real que sabe a café",
      en: "Real coffee that tastes like coffee",
    },
    "home.compareRow4": {
      es: "Con extracto de ganoderma",
      en: "With ganoderma extract",
    },
    "home.compareRow5": {
      es: "Listo en segundos, caliente o frío",
      en: "Ready in seconds, hot or iced",
    },
    "home.compareRowCost": { es: "Costo por taza", en: "Cost per cup" },
    "home.compareRegularCost": {
      es: "Desde $3.00 usd en cafetería",
      en: "From $3.00 usd at a coffee shop",
    },
    "home.compareOurCost": {
      es: "Desde $0.83 usd por sobre",
      en: "From $0.83 usd per sachet",
    },
    "home.sachetClassicSub": {
      es: "$0.83 usd por sobre",
      en: "$0.83 usd per sachet",
    },
    "home.sachetClassicOne": {
      es: "con suscripción ($1.10 usd compra única)",
      en: "with subscription ($1.10 usd one-time purchase)",
    },
    "home.sachet3in1Sub": {
      es: "$1.25 usd por sobre",
      en: "$1.25 usd per sachet",
    },
    "home.sachet3in1One": {
      es: "con suscripción ($1.65 usd compra única)",
      en: "with subscription ($1.65 usd one-time purchase)",
    },
    "home.sachetSchokoSub": {
      es: "$1.30 usd por sobre",
      en: "$1.30 usd per sachet",
    },
    "home.sachetSchokoOne": {
      es: "con suscripción ($1.70 usd compra única)",
      en: "with subscription ($1.70 usd one-time purchase)",
    },
    "home.compareDisclaimer": {
      es: "Comparación de experiencia de consumo y precio. No sustituye consejo médico ni pretende curar enfermedades.",
      en: "Comparison of drinking experience and price. It does not replace medical advice and is not intended to cure any disease.",
    },
    "home.testimonialsKicker": { es: "Testimonios", en: "Testimonials" },
    "home.testimonialsTitle": {
      es: "Lo que dicen quienes ya lo probaron",
      en: "What people who tried it are saying",
    },
    "home.testimonial1": {
      es: "“Desde que probé el 3 en 1 no me dio agruras, es algo que sufría mucho con el café normal.”",
      en: "“Since I tried the 3 in 1 I haven't had heartburn, something I used to suffer a lot with regular coffee.”",
    },
    "home.testimonial2": {
      es: "“Esa noche dormí muy a gusto después de tomarme mi taza de cacao, hace mucho que padecía de insomnio.”",
      en: "“That night I slept really well after my cup of cocoa. I had been struggling with insomnia for a long time.”",
    },
    "home.testimonial3": {
      es: "“El café negro me dio esa claridad mental durante el día, adicional mi energía emocional subió al 100%.”",
      en: "“The black coffee gave me mental clarity throughout the day, and my emotional energy went up to 100%.”",
    },
    "home.readyTitle": {
      es: "¿Listo para tu primera taza?",
      en: "Ready for your first cup?",
    },
    "home.readySubtitle": {
      es: "Escríbenos y te ayudamos con tu pedido.",
      en: "Message us and we'll help you with your order.",
    },
    "home.readyBtn": {
      es: "Escríbenos por WhatsApp",
      en: "Message us on WhatsApp",
    },
    "home.bizKicker": { es: "Modelo de negocio", en: "Business model" },
    "home.bizTitle": {
      es: "Convierte el café en tu negocio",
      en: "Turn coffee into your business",
    },
    "home.bizSubtitle": {
      es: "Distribuye una marca con historia, producto de consumo diario y presencia en más de 15 países.",
      en: "Distribute a brand with history, a product people use every day and presence in more than 15 countries.",
    },
    "home.biz1Title": { es: "Producto probado", en: "Proven product" },
    "home.biz1Desc": {
      es: "Vendes un café con casi 30 años de historia y presencia en más de 15 países. No empiezas de cero.",
      en: "You sell a coffee with almost 30 years of history and presence in more than 15 countries. You don't start from scratch.",
    },
    "home.biz2Title": { es: "Tu propio negocio", en: "Your own business" },
    "home.biz2Desc": {
      es: "Tú pones el ritmo: distribuye la marca en tu ciudad y haz crecer tu cartera de clientes.",
      en: "You set the pace: distribute the brand in your city and grow your customer base.",
    },
    "home.biz3Title": { es: "Consumo diario", en: "Daily consumption" },
    "home.biz3Desc": {
      es: "El café se toma todos los días: tus clientes vuelven a comprar una y otra vez, y tu negocio crece con ellos.",
      en: "People drink coffee every day: your customers buy again and again, and your business grows with them.",
    },
    "home.bizBtn": {
      es: "Quiero distribuir la marca",
      en: "I want to distribute the brand",
    },

    /* Distribuye */
    "dist.back": { es: "Volver", en: "Back" },
    "dist.heroKicker": { es: "Oportunidad de negocio", en: "Business opportunity" },
    "dist.heroTitle": {
      es: "No cambiamos hábitos. Solo los mejoramos.",
      en: "We don't change habits. We just make them better.",
    },
    "dist.heroSubtitle": {
      es: "La gente ya toma café todos los días. Tu negocio no es convencerla de un hábito nuevo: es ofrecerle una mejor versión del que ya ama.",
      en: "People already drink coffee every day. Your business isn't convincing them of a new habit: it's offering a better version of the one they already love.",
    },
    "dist.heroBtn": {
      es: "Quiero distribuir la marca",
      en: "I want to distribute the brand",
    },
    "dist.indKicker": { es: "La industria", en: "The industry" },
    "dist.indTitle": {
      es: "Dos gigantes que crecen todos los días",
      en: "Two giants that grow every day",
    },
    "dist.indSubtitle": {
      es: "El café es uno de los productos más consumidos del planeta, y la industria del bienestar no deja de crecer. Tu producto vive justo donde se cruzan.",
      en: "Coffee is one of the most consumed products on the planet, and the wellness industry keeps growing. Your product lives right where they meet.",
    },
    "dist.ind1Num": { es: "+2,000 millones", en: "2+ billion" },
    "dist.ind1Desc": {
      es: "de tazas de café se beben cada día en el mundo",
      en: "cups of coffee are drunk every day around the world",
    },
    "dist.ind2Num": { es: "El 2.º producto", en: "The #2 product" },
    "dist.ind2Desc": {
      es: "más comercializado del planeta, solo detrás del petróleo",
      en: "most traded on the planet, second only to oil",
    },
    "dist.ind3Num": { es: "+6 billones USD", en: "$6+ trillion USD" },
    "dist.ind3Desc": {
      es: "vale la industria global del bienestar y sigue creciendo",
      en: "is the value of the global wellness industry, and it keeps growing",
    },
    "dist.ind4Num": { es: "Consumo diario", en: "Daily consumption" },
    "dist.ind4Desc": {
      es: "el café no se vende una vez: se compra todos los días",
      en: "coffee isn't sold once: people buy it every day",
    },
    "dist.probKicker": { es: "El problema", en: "The problem" },
    "dist.probTitle": {
      es: "Iniciar un negocio tradicional cuesta caro",
      en: "Starting a traditional business is expensive",
    },
    "dist.probSubtitle": {
      es: "Antes de vender tu primer producto, un negocio convencional ya te debe miles de dólares.",
      en: "Before you sell your first product, a conventional business already costs you thousands of dollars.",
    },
    "dist.prob1Title": { es: "Renta y local", en: "Rent and storefront" },
    "dist.prob1Desc": {
      es: "Miles de dólares al mes antes de vender tu primer producto.",
      en: "Thousands of dollars a month before you sell your first product.",
    },
    "dist.prob2Title": { es: "Empleados", en: "Employees" },
    "dist.prob2Desc": {
      es: "Sueldos, turnos, rotación y responsabilidades que no descansan.",
      en: "Salaries, shifts, turnover and responsibilities that never stop.",
    },
    "dist.prob3Title": { es: "Inventario", en: "Inventory" },
    "dist.prob3Desc": {
      es: "Capital detenido en anaqueles, con riesgo de caducidad y merma.",
      en: "Money stuck on shelves, at risk of expiring or going to waste.",
    },
    "dist.prob4Title": { es: "Logística", en: "Logistics" },
    "dist.prob4Desc": {
      es: "Envíos, devoluciones y almacenes que se comen tu margen.",
      en: "Shipping, returns and warehouses that eat up your margin.",
    },
    "dist.solKicker": { es: "La solución", en: "The solution" },
    "dist.solTitle": { es: "El modelo inteligente", en: "The smart model" },
    "dist.solP1": {
      es: "Distribuye una marca con respaldo desde 1995 y presencia en más de 15 países de Latinoamérica, con un sistema operativo completo ya listo para operar: producto, envíos, oficina virtual y educación.",
      en: "Distribute a brand backed since 1995 and present in more than 15 Latin American countries, with a complete system ready to run: product, shipping, virtual office and training.",
    },
    "dist.solP2": {
      es: "Tú no construyes la empresa. La empresa ya existe: tú construyes tu negocio sobre ella.",
      en: "You don't build the company. The company already exists: you build your business on top of it.",
    },
    "dist.modelsKicker": { es: "Comparativa", en: "Comparison" },
    "dist.modelsTitle": {
      es: "Las 3 formas de distribuir un producto",
      en: "The 3 ways to distribute a product",
    },
    "dist.model1Title": { es: "Menudeo tradicional", en: "Traditional retail" },
    "dist.model1Desc": {
      es: "Compras o rentas un local, surtes producto y vendes al público de tu zona. Altos costos fijos y tu negocio depende de que abras la puerta todos los días.",
      en: "You buy or rent a store, stock product and sell to people in your area. High fixed costs, and your business depends on opening the door every day.",
    },
    "dist.model2Title": { es: "Venta directa", en: "Direct sales" },
    "dist.model2Desc": {
      es: "Vendes al mayoreo o al cliente final. Si no vendes, no ganas: es intercambiar tiempo por dinero, y cuando paras, para el ingreso.",
      en: "You sell wholesale or to the end customer. If you don't sell, you don't earn: you trade time for money, and when you stop, the income stops.",
    },
    "dist.model3Badge": { es: "El modelo inteligente", en: "The smart model" },
    "dist.model3Title": {
      es: "Marketing relacional",
      en: "Relationship marketing",
    },
    "dist.model3Desc": {
      es: "El modelo inteligente: conectas al cliente final directamente con la empresa y cada vez que compra, generas una regalía. Haces el trabajo una vez bien hecho y cobras por siempre.",
      en: "The smart model: you connect the end customer directly with the company, and every time they buy, you earn a royalty. Do the work well once and keep getting paid.",
    },
    "dist.invKicker": { es: "Cómo iniciar", en: "How to start" },
    "dist.invTitle": {
      es: "Una inversión blindada",
      en: "A protected investment",
    },
    "dist.invSubtitle": {
      es: "Sin renta, sin empleados, sin logística. Desde el paquete base, todo esto ya está incluido:",
      en: "No rent, no employees, no logistics. Starting with the base package, all of this is already included:",
    },
    "dist.base1": {
      es: "40% de descuento en productos",
      en: "40% discount on products",
    },
    "dist.base2": {
      es: "Operación en 16 países para distribuir la marca",
      en: "Operations in 16 countries to distribute the brand",
    },
    "dist.base3": {
      es: "Sistema de envíos automatizado a todos los países",
      en: "Automated shipping system to every country",
    },
    "dist.base4": {
      es: "Oficina virtual 24/7 para administrar tu negocio",
      en: "24/7 virtual office to manage your business",
    },
    "dist.base5": {
      es: "Acompañamiento de un profesional para desarrollar el negocio",
      en: "Guidance from a professional to grow your business",
    },
    "dist.base6": {
      es: "Página personalizada para promover tu negocio",
      en: "Personalized website to promote your business",
    },
    "dist.base7": {
      es: "Sistema de educación continua",
      en: "Ongoing training system",
    },
    "dist.maintTitle": {
      es: "Bajo costo de mantenimiento",
      en: "Low maintenance cost",
    },
    "dist.maintLeadBefore": { es: "Compra al menos ", en: "Buy at least " },
    "dist.maintLeadStrong": { es: "50 puntos cada mes", en: "50 points each month" },
    "dist.maintLeadAfter": {
      es: " para mantener tu negocio activo y recibir regalías.",
      en: " to keep your business active and receive royalties.",
    },
    "dist.maintDt1": {
      es: "Compra mínima mensual",
      en: "Minimum monthly purchase",
    },
    "dist.maintDd1": { es: "50 puntos", en: "50 points" },
    "dist.maintDt2": { es: "Productos en promedio", en: "Average products" },
    "dist.maintDd2": { es: "4 productos", en: "4 products" },
    "dist.maintDt3": { es: "Costo mensual promedio", en: "Average monthly cost" },
    "dist.maintNote": {
      es: "La cantidad de productos y el costo son aproximados; el requisito es comprar al menos 50 puntos al mes.",
      en: "The number of products and the cost are approximate; the requirement is to buy at least 50 points per month.",
    },
    "dist.pkgKicker": { es: "Paquetes de inicio", en: "Starter packages" },
    "dist.pkgTitle": { es: "Elige cómo arrancar", en: "Choose how to start" },
    "dist.pkgSubtitle": {
      es: "Todos los paquetes incluyen los 7 beneficios generales. La diferencia es cuánto producto y cuánto beneficio extra llevas desde el inicio.",
      en: "Every package includes the 7 general benefits. The difference is how much product and extra benefit you get from the start.",
    },
    "dist.pkg1Name": { es: "Básico", en: "Basic" },
    "dist.pkg1Desc": {
      es: "La puerta de entrada al negocio.",
      en: "Your entry point into the business.",
    },
    "dist.pkg1Item1": { es: "4 productos", en: "4 products" },
    "dist.pkg1Item2": {
      es: "Los 7 beneficios generales de la empresa",
      en: "The company's 7 general benefits",
    },
    "dist.pkg2Name": { es: "Emprendedor", en: "Entrepreneur" },
    "dist.pkg2Desc": {
      es: "Producto para empezar a mover.",
      en: "Product to start moving.",
    },
    "dist.pkg2Item1": {
      es: "7 a 9 productos (según país)",
      en: "7 to 9 products (depending on country)",
    },
    "dist.pkg2Item2": {
      es: "+5% adicional en ganancias por 2 meses",
      en: "+5% extra earnings for 2 months",
    },
    "dist.pkg2Item3": {
      es: "Bono de $25 USD por cada referido que adquiera este paquete",
      en: "$25 USD bonus for each referral who gets this package",
    },
    "dist.pkg3Name": { es: "Profesional", en: "Professional" },
    "dist.pkg3Desc": {
      es: "Para arrancar con inventario serio.",
      en: "To start with serious inventory.",
    },
    "dist.pkg3Item1": {
      es: "20 a 23 productos (según país)",
      en: "20 to 23 products (depending on country)",
    },
    "dist.pkg3Item2": {
      es: "+6% adicional en ganancias por 4 meses",
      en: "+6% extra earnings for 4 months",
    },
    "dist.pkg3Item3": {
      es: "Bono de $75 USD por cada referido que adquiera este paquete",
      en: "$75 USD bonus for each referral who gets this package",
    },
    "dist.pkg4Badge": { es: "Máximo beneficio", en: "Maximum benefit" },
    "dist.pkg4Name": { es: "Máximo Beneficio", en: "Maximum Benefit" },
    "dist.pkg4Desc": {
      es: "La posición más fuerte desde el día uno.",
      en: "The strongest position from day one.",
    },
    "dist.pkg4Item1": {
      es: "40 a 47 productos (según país)",
      en: "40 to 47 products (depending on country)",
    },
    "dist.pkg4Item2": {
      es: "+7% adicional en ganancias por 6 meses",
      en: "+7% extra earnings for 6 months",
    },
    "dist.pkg4Item3": {
      es: "Bono de $150 USD por cada referido que adquiera este paquete",
      en: "$150 USD bonus for each referral who gets this package",
    },
    "dist.pkgBtn": { es: "Comenzar con este", en: "Start with this one" },
    "dist.earnKicker": { es: "Tus ingresos", en: "Your income" },
    "dist.earnTitle": { es: "3 maneras de ganar", en: "3 ways to earn" },
    "dist.earn1Title": { es: "Ganancia inmediata", en: "Immediate profit" },
    "dist.earn1Desc": {
      es: "Compra tu paquete, obtén 40% de descuento y genera ganancias desde tu primera venta con tu página personalizada.",
      en: "Buy your package, get a 40% discount and earn from your very first sale with your personalized website.",
    },
    "dist.earn2Title": { es: "Ingresos recurrentes", en: "Recurring income" },
    "dist.earn2Desc": {
      es: "Fideliza clientes que compran directo a la empresa y genera ingresos cada vez que consumen, mes tras mes.",
      en: "Build loyal customers who buy directly from the company and earn every time they reorder, month after month.",
    },
    "dist.earn3Title": {
      es: "Bonos por recomendación",
      en: "Referral bonuses",
    },
    "dist.earn3Desc": {
      es: "Recomienda la distribución de la marca y genera un bono por cada persona que inicie con su paquete.",
      en: "Recommend distributing the brand and earn a bonus for every person who starts with their package.",
    },
    "dist.commKicker": { es: "La clave", en: "The key" },
    "dist.commTitle": {
      es: "Vender solo vs. construir comunidad",
      en: "Selling alone vs. building a community",
    },
    "dist.commQuote": {
      es: "“Es preferible ganar el 1% del esfuerzo de 100 personas que el 100% de nuestro propio esfuerzo. Por eso, en lugar de salir a vender miles de productos, creamos comunidades de consumo.”",
      en: "“It's better to earn 1% of the effort of 100 people than 100% of our own effort. That's why, instead of going out to sell thousands of products, we build consumer communities.”",
    },
    "dist.commSoloTitle": {
      es: "Una persona vendiendo sola",
      en: "One person selling alone",
    },
    "dist.commSoloDesc": {
      es: "Si dejas de vender, dejas de ganar. Tu ingreso tiene techo: las horas de tu día.",
      en: "If you stop selling, you stop earning. Your income has a ceiling: the hours in your day.",
    },
    "dist.commGroupTitle": {
      es: "Una comunidad que crece",
      en: "A growing community",
    },
    "dist.commGroupDesc": {
      es: "Fidelizas clientes y ellos recomiendan. El crecimiento se duplica solo: 4, 8, 16, 32…",
      en: "You build loyal customers and they recommend you. Growth multiplies on its own: 4, 8, 16, 32…",
    },
    "dist.dup1": { es: "Tú fidelizas", en: "You build loyalty with" },
    "dist.dup2": { es: "Ellos comparten con 5", en: "They share with 5" },
    "dist.dup3": {
      es: "Esos 25 comparten con 5",
      en: "Those 25 share with 5",
    },
    "dist.dup4": {
      es: "Y la comunidad crece a",
      en: "And the community grows to",
    },
    "dist.sup1": {
      es: "La empresa hace los envíos",
      en: "The company handles shipping",
    },
    "dist.sup2": {
      es: "Un call center trabaja por ti",
      en: "A call center works for you",
    },
    "dist.sup3": {
      es: "Una página presenta por ti",
      en: "A website presents for you",
    },
    "dist.incomeBefore": {
      es: "Si tu comunidad consume 4 productos al mes, podrías generar ingresos de hasta ",
      en: "If your community consumes 4 products a month, you could earn up to ",
    },
    "dist.incomeAfter": {
      es: ", escalables creando más comunidades.",
      en: ", and scale it by building more communities.",
    },
    "dist.formKicker": { es: "Comienza hoy", en: "Start today" },
    "dist.formTitle": {
      es: "Inicia tu distribución profesional",
      en: "Start your professional distribution",
    },
    "dist.formSubtitle": {
      es: "Déjanos tus datos y un profesional te contacta para ayudarte a elegir tu paquete y arrancar paso a paso.",
      en: "Leave us your details and a professional will contact you to help you choose your package and get started step by step.",
    },
    "dist.labelName": { es: "Nombre completo", en: "Full name" },
    "dist.phName": { es: "Tu nombre", en: "Your name" },
    "dist.labelEmail": { es: "Correo electrónico", en: "Email" },
    "dist.phEmail": {
      es: "tucorreo@ejemplo.com",
      en: "you@example.com",
    },
    "dist.formError": {
      es: "Revisa tus datos e inténtalo de nuevo, por favor.",
      en: "Please check your details and try again.",
    },
    "dist.formBtn": {
      es: "Quiero distribuir la marca",
      en: "I want to distribute the brand",
    },
    "dist.formSending": { es: "Enviando...", en: "Sending..." },
    "dist.thanksDesc": {
      es: "Recibimos tus datos. Muy pronto te contactamos para contarte cómo distribuir la marca en tu país.",
      en: "We received your details. We'll contact you soon to explain how to distribute the brand in your country.",
    },
    "dist.pathsKicker": {
      es: "Elige tu siguiente paso",
      en: "Choose your next step",
    },
    "dist.pathsTitle": {
      es: "¿Quieres probarlo o empezar tu negocio?",
      en: "Want to try it or start your business?",
    },
    "dist.pathsSubtitle": {
      es: "Toca la opción que quieras y se abre tu WhatsApp con el mensaje listo.",
      en: "Tap the option you want and your WhatsApp opens with the message ready to send.",
    },
    "dist.path1Title": { es: "Quiero probar", en: "I want to try it" },
    "dist.path1Desc": {
      es: "Pide tu producto por WhatsApp y compruébalo tú mismo.",
      en: "Order your product on WhatsApp and see for yourself.",
    },
    "dist.path2Title": {
      es: "Quiero empezar mi negocio",
      en: "I want to start my business",
    },
    "dist.path2Desc": {
      es: "Hablamos de paquetes y del plan para arrancar paso a paso.",
      en: "We'll talk packages and the plan to get started step by step.",
    },
  };

  /* ==========================================================================
     State
     ========================================================================== */
  const state = {
    lang: "es",
    route: "home",
    selectedPrices: {
      "GanoCafé Classic": "subscribe",
      "GanoCafé 3 en 1": "subscribe",
      "GanoCafé Schokolade": "subscribe",
    },
    videoPlaying: false,
    formStatus: "idle", // "idle" | "enviando" | "ok" | "error"
    submittedFirstName: "",
  };

  /* ==========================================================================
     Helpers
     ========================================================================== */
  function t(es, en) {
    return state.lang === "en" ? en : es;
  }

  function wa(msg) {
    return "https://wa.me/" + getWhatsAppNumber() + "?text=" + encodeURIComponent(msg);
  }

  function usd(n) {
    return "$" + n.toFixed(2) + " usd";
  }

  function loadSavedLang() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") return saved;
    } catch (_) {
      /* localStorage unavailable */
    }
    return "es";
  }

  function saveLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* localStorage unavailable */
    }
  }

  /* ==========================================================================
     i18n Rendering
     ========================================================================== */
  function updateProductCtaHref(card) {
    const productName = card.getAttribute("data-product");
    const product = PRODUCT_PRICES[productName];
    if (!product) return;
    const option = state.selectedPrices[productName] || "subscribe";
    const priceInfo = product[option];
    const titulo = product.title[state.lang];
    const optionLabel = OPTION_LABELS[option][state.lang];
    const prefix = t("¡Hola! Quiero el", "Hi! I want the");
    const msg = prefix + " " + titulo + " ☕🍄 (" + optionLabel + ": " + usd(priceInfo.finalUsd) + ")";
    const cta = card.querySelector("[data-product-cta]");
    if (cta) cta.setAttribute("href", wa(msg));
  }

  function updateThanksHeading() {
    const heading = document.getElementById("distributor-form-thanks-heading");
    if (!heading || !state.submittedFirstName) return;
    heading.textContent = t("¡Gracias, ", "Thank you, ") + state.submittedFirstName + "!";
  }

  function updateFormSubmitText() {
    const span = document.getElementById("distributor-form-submit-text");
    if (!span) return;
    if (state.formStatus === "enviando") {
      span.textContent = I18N["dist.formSending"][state.lang];
    } else {
      span.textContent = I18N["dist.formBtn"][state.lang];
    }
  }

  function applyLanguage(lang, persist) {
    state.lang = lang === "en" ? "en" : "es";
    if (persist) saveLang(state.lang);
    document.documentElement.lang = state.lang;

    // Sync hidden campaign/form idioma inputs
    document.querySelectorAll('input[name="idioma"]').forEach(function (input) {
      input.value = state.lang;
    });

    // Update all language toggle buttons across views
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      const code = btn.getAttribute("data-lang-btn");
      const active = code === state.lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // Update text content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const entry = I18N[key];
      if (entry) el.textContent = entry[state.lang];
    });

    // Update alt attributes
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-alt");
      const entry = I18N[key];
      if (entry) el.setAttribute("alt", entry[state.lang]);
    });

    // Update aria-label attributes
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria");
      const entry = I18N[key];
      if (entry) el.setAttribute("aria-label", entry[state.lang]);
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      const entry = I18N[key];
      if (entry) el.setAttribute("placeholder", entry[state.lang]);
    });

    // Update static WhatsApp links
    document.querySelectorAll("[data-wa-key]").forEach(function (a) {
      const key = a.getAttribute("data-wa-key");
      const entry = WA_MESSAGES[key];
      if (entry) a.setAttribute("href", wa(entry[state.lang]));
    });

    // Update product WhatsApp links
    document.querySelectorAll(".product-card[data-product]").forEach(updateProductCtaHref);

    // Update active video player title/aria-label if playing
    const iframe = document.querySelector("#plantation-video-media iframe");
    if (iframe) {
      iframe.setAttribute("title", I18N["home.videoIframeTitle"][state.lang]);
    }
    const videoEl = document.querySelector("#plantation-video-media video");
    if (videoEl) {
      videoEl.setAttribute("aria-label", I18N["home.videoIframeTitle"][state.lang]);
    }

    // Update form dynamic labels
    updateFormSubmitText();
    updateThanksHeading();
  }

  /* ==========================================================================
     Hash Routing (#/ and #/distribuye + section anchors)
     ========================================================================== */
  const DISTRIBUYE_ANCHORS = new Set(["paquetes", "formulario-distribuidor", "mantenimiento-mensual"]);

  function parseRouteFromHash() {
    const raw = (window.location.hash || "").replace(/^#/, "");
    if (!raw || raw === "/" || raw === "home") {
      return { route: "home", anchor: "" };
    }
    if (raw === "/distribuye" || raw === "distribuye") {
      return { route: "distribuye", anchor: "" };
    }
    if (raw.startsWith("/distribuye#")) {
      return { route: "distribuye", anchor: raw.slice("/distribuye#".length) };
    }
    if (DISTRIBUYE_ANCHORS.has(raw)) {
      return { route: "distribuye", anchor: raw };
    }
    if (raw.startsWith("/#")) {
      return { route: "home", anchor: raw.slice(2) };
    }
    return { route: "home", anchor: raw };
  }

  function applyRoute(shouldScroll) {
    const parsed = parseRouteFromHash();
    const prevRoute = state.route;
    state.route = parsed.route;

    const homeEl = document.getElementById("page-home");
    const distEl = document.getElementById("page-distribuye");
    if (homeEl) homeEl.hidden = state.route !== "home";
    if (distEl) distEl.hidden = state.route !== "distribuye";

    const meta = ROUTE_META[state.route];
    document.title = meta.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", meta.description);

    if (shouldScroll) {
      if (parsed.anchor) {
        const target = document.getElementById(parsed.anchor);
        if (target) {
          target.scrollIntoView();
          return;
        }
      }
      if (prevRoute !== state.route || !parsed.anchor) {
        window.scrollTo(0, 0);
      }
    }
  }

  /* ==========================================================================
     Product Pricing Radio Options
     ========================================================================== */
  function initPricingOptions() {
    document.querySelectorAll(".product-card[data-product]").forEach(function (card) {
      const productName = card.getAttribute("data-product");
      const labels = card.querySelectorAll(".price-option[data-price-option]");

      labels.forEach(function (label) {
        const input = label.querySelector('input[type="radio"]');
        if (!input) return;

        input.addEventListener("change", function () {
          if (!input.checked) return;
          const option = label.getAttribute("data-price-option");
          state.selectedPrices[productName] = option;

          labels.forEach(function (other) {
            other.classList.toggle(
              "is-selected",
              other.getAttribute("data-price-option") === option
            );
          });
          updateProductCtaHref(card);
        });
      });
    });
  }

  /* ==========================================================================
     Product Image Swipe Carousels
     ========================================================================== */
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      const track = carousel.querySelector("[data-carousel-track]");
      const dots = carousel.querySelectorAll("[data-carousel-dot]");
      const hint = carousel.querySelector("[data-carousel-hint]");
      if (!track) return;

      track.addEventListener(
        "scroll",
        function () {
          if (!track.clientWidth) return;
          const activeIndex = Math.round(track.scrollLeft / track.clientWidth);
          dots.forEach(function (dot, idx) {
            dot.classList.toggle("is-active", idx === activeIndex);
          });
          if (hint) {
            hint.hidden = activeIndex !== 0;
          }
        },
        { passive: true }
      );
    });
  }

  /* ==========================================================================
     Plantation Video Player
     ========================================================================== */
  function initVideoPlayer() {
    const mediaWrap = document.getElementById("plantation-video-media");
    const bodyWrap = document.getElementById("plantation-video-body");
    const ctaBtn = document.getElementById("plantation-video-cta");
    if (!mediaWrap) return;

    function playVideo() {
      if (state.videoPlaying) return;
      state.videoPlaying = true;

      const frameContainer = document.createElement("div");
      frameContainer.className = "video-iframe-wrap";

      const videoUrl = getVideoUrl();
      let videoEl = null;
      if (/\.(mp4|webm|ogg)($|\?)/i.test(videoUrl)) {
        videoEl = document.createElement("video");
        videoEl.src = videoUrl;
        videoEl.poster = "./assets/images/plantacion-ganoderma.jpg";
        videoEl.controls = true;
        videoEl.autoplay = true;
        videoEl.playsInline = true;
        videoEl.setAttribute("playsinline", "");
        videoEl.setAttribute("webkit-playsinline", "");
        videoEl.setAttribute("controlslist", "nodownload noplaybackrate");
        videoEl.disablePictureInPicture = true;
        videoEl.disableRemotePlayback = true;
        videoEl.setAttribute("disableremoteplayback", "");
        videoEl.setAttribute("aria-label", I18N["home.videoIframeTitle"][state.lang]);
        videoEl.className = "video-iframe";
        videoEl.style.backgroundColor = "#000";
        videoEl.addEventListener("contextmenu", function (ev) {
          ev.preventDefault();
        });
        videoEl.addEventListener("dragstart", function (ev) {
          ev.preventDefault();
        });
        frameContainer.appendChild(videoEl);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = toEmbedVideoUrl(videoUrl);
        iframe.title = I18N["home.videoIframeTitle"][state.lang];
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        iframe.className = "video-iframe";
        frameContainer.appendChild(iframe);
      }

      mediaWrap.innerHTML = "";
      mediaWrap.appendChild(frameContainer);

      if (videoEl && videoEl.play) {
        videoEl.play().catch(function () {});
      }

      if (bodyWrap) bodyWrap.classList.add("is-playing");
      if (ctaBtn) ctaBtn.hidden = true;
    }

    document.querySelectorAll("[data-video-play]").forEach(function (btn) {
      btn.addEventListener("click", playVideo);
    });
  }

  /* ==========================================================================
     Distributor Lead Form (standard POST to Vioniko autoresponder, matching 30beta)
     ========================================================================== */
  function initDistributorForm() {
    const form = document.getElementById("distributor-form");
    const errorEl = document.getElementById("distributor-form-error");
    const submitBtn = document.getElementById("distributor-form-submit");
    const nombreInput = document.getElementById("nombre");
    const whatsappInput = document.getElementById("whatsapp");
    const emailInput = document.getElementById("email");

    if (!form) return;

    function setFormState(next) {
      state.formStatus = next;
      if (errorEl) errorEl.hidden = next !== "error";
      if (submitBtn) submitBtn.disabled = next === "enviando";
      updateFormSubmitText();
    }

    form.addEventListener("submit", function (e) {
      const n = (nombreInput ? nombreInput.value : "").trim();
      const w = (whatsappInput ? whatsappInput.value : "").trim();
      const m = (emailInput ? emailInput.value : "").trim();

      if (!n || !w || !m) {
        e.preventDefault();
        setFormState("error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)) {
        e.preventDefault();
        setFormState("error");
        return;
      }

      setFormState("enviando");
    });
  }

  /* ==========================================================================
     Bootstrap
     ========================================================================== */
  function init() {
    // Current copyright year
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });

    // Language toggle handlers
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const code = btn.getAttribute("data-lang-btn");
        applyLanguage(code, true);
      });
    });

    initPricingOptions();
    initCarousels();
    initVideoPlayer();
    initDistributorForm();

    // Apply initial language from localStorage (matches React useEffect hydration)
    applyLanguage(loadSavedLang(), false);

    // Apply initial route & listen for hash changes
    applyRoute(Boolean(window.location.hash));
    window.addEventListener("hashchange", function () {
      applyRoute(true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
