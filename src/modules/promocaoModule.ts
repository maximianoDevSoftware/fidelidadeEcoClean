import mongoose from "mongoose";

export const promocaloSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },

  nome: { type: String, required: true },
  descricao: { type: String, required: true },
});
