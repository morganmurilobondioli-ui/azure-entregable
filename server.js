const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  {
    id: "laptop-pro-14",
    name: "Laptop Pro 14",
    category: "laptops",
    price: 3899,
    stock: 12,
    image: "/images/laptop-pro-14.png",
    tags: ["estudio", "estudiar", "laptop", "oficina", "programacion"],
    specs: "Intel Core i5, 16 GB RAM, SSD 512 GB, pantalla 14 pulgadas.",
  },
  {
    id: "phone-x5",
    name: "Smartphone X5",
    category: "celulares",
    price: 1499,
    stock: 18,
    image: "/images/phone-x5.png",
    tags: ["bateria", "camara", "celular", "smartphone", "movil"],
    specs: "Pantalla AMOLED, 128 GB, camara 50 MP, bateria de larga duracion.",
  },
  {
    id: "headset-air",
    name: "Headset Air",
    category: "audio",
    price: 299,
    stock: 35,
    image: "/images/headset-air.png",
    tags: ["gaming", "trabajo", "audifono", "headset", "audio"],
    specs: "Bluetooth, cancelacion de ruido, microfono integrado.",
  },
  {
    id: "tablet-note",
    name: "Tablet Note",
    category: "tablets",
    price: 1099,
    stock: 9,
    image: "/images/tablet-note.png",
    tags: ["estudio", "estudiar", "tablet", "diseno", "portatil"],
    specs: "Pantalla 10.5 pulgadas, lapiz digital, 128 GB, Wi-Fi.",
  },
];

const metrics = {
  conversations: 0,
  messages: 0,
  recommendations: 0,
  escalations: 0,
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (_req, res) => {
  res.json({ products });
});

app.get("/api/metrics", (_req, res) => {
  res.json(metrics);
});

app.post("/api/chat", (req, res) => {
  const message = String(req.body?.message || "").trim();
  const normalized = normalize(message);
  metrics.messages += 1;

  if (!message) {
    return res.json({
      reply: "Escribeme tu consulta sobre productos, pagos, envios, garantia o soporte tecnico.",
      quickReplies: defaultQuickReplies(),
    });
  }

  const answer = buildAnswer(normalized);
  if (answer.intent === "recommendation") metrics.recommendations += 1;
  if (answer.intent === "escalation") metrics.escalations += 1;

  res.json({
    reply: answer.reply,
    intent: answer.intent,
    products: answer.products || [],
    quickReplies: answer.quickReplies || defaultQuickReplies(),
  });
});

app.post("/api/chat/start", (_req, res) => {
  metrics.conversations += 1;
  res.json({
    reply: "Hola, soy el asistente virtual de InnovVentas. Puedo ayudarte con productos, pagos, envios, garantia o soporte tecnico.",
    quickReplies: defaultQuickReplies(),
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`InnovVentas chatbot running on port ${PORT}`);
});

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buildAnswer(text) {
  if (hasAny(text, ["stock", "disponible", "disponibilidad", "inventario"])) {
    return {
      intent: "stock",
      reply: `Tenemos stock disponible: ${products
        .map((p) => `${p.name} (${p.stock} uds.)`)
        .join(", ")}. Si quieres, dime tu presupuesto y uso para recomendarte una opcion.`,
      quickReplies: ["Recomiendame una laptop", "Metodos de pago", "Garantia"],
    };
  }

  if (hasAny(text, ["pago", "tarjeta", "cuotas", "yape", "plin", "transferencia"])) {
    return {
      intent: "payment",
      reply: "Aceptamos tarjeta, transferencia y billeteras digitales. Para compras mayores, se puede validar pago en cuotas segun el banco. El comprobante se envia al correo registrado.",
      quickReplies: ["Envios", "Seguir pedido", "Garantia"],
    };
  }

  if (hasAny(text, ["envio", "delivery", "entrega", "retiro", "llega"])) {
    return {
      intent: "shipping",
      reply: "Los envios se calculan segun la zona. En capital suelen tomar 24 a 48 horas; en provincia, 3 a 5 dias habiles. Tambien puedes retirar en tienda si el producto esta disponible.",
      quickReplies: ["Disponibilidad", "Metodos de pago", "Seguir pedido"],
    };
  }

  if (hasAny(text, ["garantia", "devolucion", "cambio", "reclamo"])) {
    return {
      intent: "warranty",
      reply: "Los productos cuentan con garantia del fabricante. Para cambios o devoluciones, conserva comprobante y empaque. Si el producto presenta falla, podemos derivarte a soporte para revisar el caso.",
      quickReplies: ["Soporte tecnico", "Escalar con asesor", "Ver productos"],
    };
  }

  if (hasAny(text, ["pedido", "seguimiento", "orden", "estado"])) {
    return {
      intent: "order",
      reply: "Para revisar el estado de un pedido necesito el numero de orden. En esta demo no consulto datos reales, pero en produccion el bot se conectaria al sistema de pedidos de InnovVentas.",
      quickReplies: ["Envios", "Escalar con asesor", "Metodos de pago"],
    };
  }

  if (hasAny(text, ["soporte", "falla", "problema", "no prende", "configurar", "tecnico"])) {
    return {
      intent: "support",
      reply: "Para soporte basico: verifica carga, reinicia el equipo y confirma que los cables o accesorios esten conectados. Si el problema continua, puedo derivarte a un asesor con el detalle de la incidencia.",
      quickReplies: ["Escalar con asesor", "Garantia", "Ver productos"],
    };
  }

  if (hasAny(text, ["asesor", "humano", "persona", "agente", "reclamar"])) {
    return {
      intent: "escalation",
      reply: "He registrado que necesitas apoyo humano. En un entorno real abriria un ticket con ventas o soporte y enviaria el resumen de esta conversacion.",
      quickReplies: ["Ver productos", "Garantia", "Envios"],
    };
  }

  if (hasAny(text, ["recomienda", "recomendacion", "laptop", "celular", "gaming", "estudio", "oficina", "diseno", "tablet", "audio"])) {
    const recommended = recommendProducts(text);
    return {
      intent: "recommendation",
      reply: "Estas opciones encajan con lo que buscas. Puedes agregarlas al carrito o preguntarme por especificaciones, stock o garantia.",
      products: recommended,
      quickReplies: ["Disponibilidad", "Metodos de pago", "Envios"],
    };
  }

  return {
    intent: "fallback",
    reply: "Puedo ayudarte con disponibilidad, especificaciones, pagos, envios, garantia, seguimiento de pedidos o soporte tecnico. Prueba preguntando: 'recomiendame una laptop para estudiar'.",
    quickReplies: defaultQuickReplies(),
  };
}

function recommendProducts(text) {
  const matches = products.filter((product) => {
    return product.tags.some((tag) => text.includes(tag)) || text.includes(product.category) || text.includes(product.name.toLowerCase());
  });
  return (matches.length ? matches : products.slice(0, 3)).slice(0, 3);
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function defaultQuickReplies() {
  return ["Ver productos", "Disponibilidad", "Metodos de pago", "Envios", "Garantia", "Soporte tecnico"];
}
