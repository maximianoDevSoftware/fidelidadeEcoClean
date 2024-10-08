import mongoose from "mongoose";

export const clienteFidelidadeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },

  nomeCliente: { type: String, required: true },
  beneficios: {
    type: [{ nomeBeneficio: String, descricaoBeneficio: String }],
    required: true,
  },
  compras: {
    type: [
      {
        nomeComprador: String,
        promocao: {
          nome: String,
          descricaco: String,
        },
      },
    ],
    required: true,
  },
});
