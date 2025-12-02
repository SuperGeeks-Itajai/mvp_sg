const corsOptions = {
  origin: "http://localhost:5173", // domínio do frontend React
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = () => corsOptions;
