// src/config/corsConfig.js
const allowedOriginsDev = [
  "http://localhost:3000",   // Frontend local
  "http://127.0.0.1:3000"
];

// Em produção você altera para o domínio real do frontend
const allowedOriginsProd = [
  "https://meu-front.com",
  "https://www.meu-front.com"
];

module.exports = function getCorsOptions() {
  const ambiente = process.env.NODE_ENV || "development";

  const allowedOrigins =
    ambiente === "production" ? allowedOriginsProd : allowedOriginsDev;

  return {
    origin: function (origin, callback) {
      // Permite aplicações sem origem (ex: Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origem bloqueada pelo CORS: " + origin));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Permite envio de cookies/token
  };
};
