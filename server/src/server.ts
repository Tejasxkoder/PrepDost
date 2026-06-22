import app from "./app.js"
import { connectDatabase } from "./config/database.js"

const PORT = Number(process.env.PORT) || 5000

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log("Server Started")
      console.log(`Port: ${PORT}`)
      console.log(
        `Environment: ${
          process.env.NODE_ENV ?? "development"
        }`
      )
    })
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    )

    process.exit(1)
  }
}

void startServer()