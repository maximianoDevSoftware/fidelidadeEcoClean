"use server";

import dataConectPromos, { fechandoBanco } from "@/database/connectPromocao";
import { promocaoTipo } from "@/types/promocaoType";

export default async function adicionarPromocao(promocao: {
  nome: string;
  descricao: string;
}) {
  console.log("Esta e a promoção");
  console.log(promocao);
  const connCliente = await dataConectPromos();
  const modeloPromocao = connCliente.model("promocoes");
  const gerandoPromocao = new modeloPromocao(promocao);
  gerandoPromocao.save().then(() => {
    console.log("Promoção salva com sucesso.");
  });
  return JSON.stringify({ mensagem: "Promoção adicionada com sucesso." });
}

export async function verificarPromocoes() {
  const connCliente = await dataConectPromos();
  const modeloPromocao = connCliente.model("promocoes");
  const todasPromocoes = await modeloPromocao.find({});
  return JSON.parse(JSON.stringify(todasPromocoes)) as promocaoTipo[];
}

export async function deletarPromocao(promocao: promocaoTipo) {
  console.log("Esta e a promoção");
  console.log(promocao);
  const connCliente = await dataConectPromos();
  const modeloPromocao = connCliente.model("promocoes");

  await modeloPromocao.findOneAndDelete({ nome: promocao.nome }).then(() => {
    console.log("Promoção deletada com sucesso!");
  });

  const todasPromocoes = await modeloPromocao.find({});

  return JSON.parse(JSON.stringify(todasPromocoes)) as promocaoTipo[];
}
