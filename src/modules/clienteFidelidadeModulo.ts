import mongoose from "mongoose";

export const clienteFidelidadeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },

  nomeCliente: { type: String, required: true },
  documento: { type: String, required: true },
  beneficios: {
    type: [
      {
        nomeBeneficio: String,
        descricaoBeneficio: String,
        valorBeneficio: Number,
      },
    ],
    required: true,
  },
  compras: {
    type: [
      {
        nomeComprador: String,
        dia: Date,
        promocao: {
          nome: String,
          descricaco: String,
        },
        valorCompra: String,
        modoPagamento: String,
      },
    ],
    required: true,
  },
});
