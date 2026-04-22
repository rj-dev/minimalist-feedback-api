const { app } = require("./app");

const start = async () => {
  try {
    // Render uses the PORT environment variable
    const port = process.env.PORT || 3000;
    // For cloud environments, we need to listen on 0.0.0.0
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running at port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
