import { promocaloSchema } from "@/modules/promocaoModule";
import mongoose from "mongoose";

// Create the model instance outside the function

const dataConectPromos = async () => {
  const uri =
    "mongodb+srv://renatomaximianojr:R1FL4X6xFM9xE2aX@clusterrenato.asbtntk.mongodb.net/ecoCleanFidelidade?retryWrites=true&w=majority&appName=clusterRenato";
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  } as mongoose.ConnectOptions;

  const conn = await mongoose.createConnection(uri, clientOptions).asPromise();
  await conn.model("promocoes", promocaloSchema, "promos-bd");
  console.log("Conectado ao Banco de Dados: EcoClean Fidelidade.");
  console.log("Coleção contactada: promos-bd.");
  return conn;
};

export const fechandoBanco = async () => {
  await mongoose.disconnect();
};

export default dataConectPromos;
