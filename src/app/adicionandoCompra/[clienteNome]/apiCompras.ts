"use server";
import dataConectClientes from "@/database/connectCliente";
import dataConectPromos from "@/database/connectPromocao";
import { clienteTipo } from "@/types/clienteTipo";
import { promocaoTipo } from "@/types/promocaoType";

export async function buscandoClienteBD(nomeClienteParam: string) {
  const connCliente = await dataConectClientes();
  const modelClienteFidelidade = connCliente.model("cliente");

  const clienteEncontrado = await modelClienteFidelidade.find({
    nomeCliente: nomeClienteParam,
  });
  return JSON.parse(JSON.stringify(clienteEncontrado[0])) as clienteTipo;
}

export async function buscandoPromocoesBD() {
  const connCliente = await dataConectPromos();
  const modelPromocoes = connCliente.model("promocoes");
  const todasPromocoes = await modelPromocoes.find({});
  return JSON.parse(JSON.stringify(todasPromocoes)) as promocaoTipo[];
}

export async function atualizandoCliente(cliente: clienteTipo) {
  const connCliente = await dataConectClientes();
  const modelClienteFidelidade = connCliente.model("cliente");
  await modelClienteFidelidade
    .updateOne(
      { nomeCliente: cliente.nomeCliente }, // Encontra o documento pelo ID
      {
        $set: cliente,
      }
    )
    .then(() => {
      console.log("atualizado client");
    });

  const clienteEncontrado = await modelClienteFidelidade.find({
    nomeCliente: cliente.nomeCliente,
  });
  return JSON.parse(JSON.stringify(clienteEncontrado[0])) as clienteTipo;
}
