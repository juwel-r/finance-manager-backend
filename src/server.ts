/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env.config";

let server: Server;

const main = async () => {
  try {
    mongoose.connect(envVar.DB_URL as string);
    console.log("DB Connected");
    server = app.listen(envVar.PORT, () => {
      console.log("Gizmo Tech is live...");
    });
  } catch (error) {
    console.log(error);
  }
};

main();

process.on("uncaughtException", (error) => {
  console.log("uncaughtException error detected, server shutting down!", error.name);
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("unhandledRejection", (error: any) => {
  console.log("unhandledRejection error detected, server shutting down!", error.name);
  if (server) {
    server.close();
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Signal Termination received, shutting down server!");
  process.exit(0);
});
