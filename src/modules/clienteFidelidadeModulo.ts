import mongoose from "mongoose";

export const clienteFidelidadeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },

  nomeCliente: { type: String, required: true },
  beneficios: {
<<<<<<< HEAD
    type: [
      {
        nomeBeneficio: String,
        descricaoBeneficio: String,
        valorBeneficio: Number,
      },
    ],
=======
    type: [{ nomeBeneficio: String, descricaoBeneficio: String }],
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
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
<<<<<<< HEAD
        valorCompra: String,
        modoPagamento: String,
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
      },
    ],
    required: true,
  },
});
