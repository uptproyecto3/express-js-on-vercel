// api/proxy.js
export default async function handler(req, res) {
  // 1️⃣ dominio base de tu API en InfinityFree
  const baseUrl = "https://manualprojumi.ct.ws";

  // 2️⃣ recibe el parámetro "endpoint"
  const endpoint = req.query.endpoint || "";
  if (!endpoint) {
    return res.status(400).json({ error: "Falta el parámetro 'endpoint'" });
  }

  // 3️⃣ construye la URL completa
  const url = `${baseUrl}/${endpoint}`;

  try {
    // 4️⃣ reenvía el método y el cuerpo original
    const options = {
      method: req.method,
      headers: { "Content-Type": "application/json" },
    };

    // si la petición incluye cuerpo (ej. POST), lo reenviamos
    if (req.method !== "GET" && req.body) {
      options.body = JSON.stringify(req.body);
    }

    // 5️⃣ hacemos la solicitud al backend real
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");

    // 6️⃣ configuramos cabeceras CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 7️⃣ enviamos la respuesta según el tipo de contenido
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error("Error del proxy:", error);
    res.status(500).json({ error: "Error al contactar con la API de InfinityFree" });
  }
}