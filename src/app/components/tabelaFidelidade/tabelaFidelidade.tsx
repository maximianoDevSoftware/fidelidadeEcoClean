"use client";

import sty from "./tabelaSty.module.css";
import { clienteTipo } from "@/types/clienteTipo";
import { useEffect, useState } from "react";
import { atualizandoClientesFidelidade } from "./apiTabela";
import Link from "next/link";

let travaInicial = false;

export default function TabelaFidelidade() {
  const [clientes, setClientes] = useState<clienteTipo[]>();
  const [clienteEvidencia, setClienteEvidencia] = useState<clienteTipo>();

  const [estadoPagina, setEstadoPagina] = useState({
    estado: "Verificando Clientes...",
  });
  const inicializandoTabela = async () => {
    if (!travaInicial) {
      const todosClientes = await atualizandoClientesFidelidade();
      setClientes(todosClientes);
      setEstadoPagina({ estado: "Disponível" });
    }
  };

  useEffect(() => {
    inicializandoTabela();
  }, []);

  return (
    <>
      {estadoPagina.estado == "Disponível" && (
        <div>
          <table className="tabelaFidelidade">
            <thead>
              <tr>
                <th>Nome do Cliente:</th>
                <th>Número de Compras:</th>
                <th>Nome do Comprador:</th>
                <th>Promoção do Comprador:</th>
              </tr>
            </thead>
            <tbody>
              {clientes?.map((cliente) => {
                return (
                  <tr key={cliente.id}>
                    <td
                      onClick={() => {
                        setClienteEvidencia(cliente);
                        setEstadoPagina({ estado: "Historico Cliente" });
                      }}
                      className="clienteNome cursor-pointer"
                    >
                      {cliente.nomeCliente}
                    </td>
                    <td className="clienteNumCompras">
                      {cliente.compras ? cliente.compras.length : "0"}
                    </td>
                    <td className="compradorNome">
                      {cliente.compras[0]
                        ? cliente.compras[cliente.compras.length - 1]
                            .nomeComprador
                        : "Sem Comprador."}
                    </td>
                    <td className="promocaoNome">
                      {cliente.compras[0]
                        ? cliente.compras[cliente.compras.length - 1].promocao
                            .nome
                        : "Sem Promoção."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {estadoPagina.estado == "Verificando Clientes..." && (
        <div className={`w-[100%] flex items-center justify-center h-[300px]`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle}`}>{estadoPagina.estado}</h1>
        </div>
      )}

      {estadoPagina.estado == "Historico Cliente" && (
        <div>
          <p className="p-4 text-sm text-gray-500 inline-block">
            Nome do Cliente:
          </p>
          <h3 className="p-2 text-xl text-gray-800 inline-block">
            {clienteEvidencia?.nomeCliente}
          </h3>{" "}
          <br />
          <p className="p-4 text-xl text-gray-800 inline-block">
            Histórico de Compras:
          </p>
          <ul>
            <li className="flex items-center justify-between px-4 py-2 text-sm text-gray-400">
              <h1 className="p-2">Nome comprador</h1>
              <h1 className="p-2">Promoção do comprador</h1>
            </li>
            {clienteEvidencia?.compras.map((compra, index) => {
              return (
                <li
                  className="flex items-center justify-between px-4 py-2 text-sm"
                  key={index}
                >
                  <h1 className="p-2">{compra.nomeComprador}</h1>
                  <h1 className="p-2">{compra.promocao.nome}</h1>
                </li>
              );
            })}
          </ul>
          <Link
            href={"/"}
            className="btnsLeves my-3 mx-8"
            onClick={() => {
              setEstadoPagina({ estado: "Disponível" });
            }}
          >
            Tabela Clientes
          </Link>
        </div>
      )}
    </>
  );
}
