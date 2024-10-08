"use server";
import dataConectClientes from "@/database/connectCliente";
import { clienteTipo } from "@/types/clienteTipo";

export async function atualizandoClientesFidelidade() {
  const connCliente = await dataConectClientes();
  const modelClienteFidelidade = connCliente.model("cliente");

  const todosClientesFidelidade = (await modelClienteFidelidade.find(
    {}
  )) as clienteTipo[];
  console.log(`Numero de clientes no banco: ${todosClientesFidelidade.length}`);
  const plainCliente = JSON.parse(JSON.stringify(todosClientesFidelidade));
  return plainCliente as clienteTipo[];
}
