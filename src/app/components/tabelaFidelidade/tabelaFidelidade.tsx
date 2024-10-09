"use client";

import sty from "./tabelaSty.module.css";
import { clienteTipo } from "@/types/clienteTipo";
import { useEffect, useState } from "react";
import { atualizandoClientesFidelidade } from "./apiTabela";
import Link from "next/link";
import { compraTipo } from "@/types/compraType";
import { beneficiosCliente } from "@/app/clientes/beneficiosClientes";

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
            {clienteEvidencia?.nomeCliente.toUpperCase()}
          </h3>{" "}
          <br />
          <p className="p-4 text-xl text-gray-800 inline-block">
            Histórico de Compras:
          </p>
          <ul>
            {clienteEvidencia?.compras.map((compra, index) => {
              const diaDaCompra = new Date(compra.dia);

              return (
                <li
                  className={`w-[300px] mx-auto py-2 text-sm  border-b-2 border-b-green-500 overflow-hidden ${sty.histoFechado}`}
                  key={index}
                  onClick={(ev) => {
                    ev.currentTarget.classList.toggle(sty.histoFechado);
                    if (ev.target === ev.currentTarget) {
                    }
                  }}
                >
                  <h1 className="p-2 flex justify-between">
                    {compra.nomeComprador.toUpperCase()}{" "}
                    <span>{`${diaDaCompra.getDate()}/${
                      diaDaCompra.getMonth() + 1
                    }/${diaDaCompra.getFullYear()}`}</span>
                  </h1>
                  <p className="px-2 py-1 flex justify-between">
                    Horário da Compra:{" "}
                    <span>{`${diaDaCompra.getHours()}:${diaDaCompra.getMinutes()}:${diaDaCompra.getSeconds()}`}</span>
                  </p>
                  <p className="px-2 py-1 flex justify-between">
                    Valor: <span>R$ {compra.valorCompra}</span>
                  </p>
                  <p className="px-2 py-1 flex justify-between">
                    Forma de Pagamento: <span>{`${compra.modoPagamento}`}</span>
                  </p>
                  <p className="px-2 py-1 flex justify-between">
                    Desconto Fidelidade:{" "}
                    <span>{`R$ ${calculandoDesconto(
                      compra.valorCompra,
                      compra,
                      clienteEvidencia
                    )}`}</span>
                  </p>
                  <h1 className="p-2 flex justify-between">
                    {compra.promocao.nome}
                  </h1>
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

const calculandoDesconto = (
  valor: string,
  compra: compraTipo,
  cliente: clienteTipo
) => {
  const valorTotal = parseFloat(valor.replace(",", "."));

  let valorBeneficioPercentual;
  if (compra.modoPagamento == "A vista") {
    valorBeneficioPercentual = cliente.beneficios.filter((beneficio) => {
      if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
        return beneficio.valorBeneficio;
      }
    });
  }

  if (compra.modoPagamento == "Débito") {
    valorBeneficioPercentual = cliente.beneficios.filter((beneficio) => {
      if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
        return beneficio.valorBeneficio;
      }
    });
  }

  if (compra.modoPagamento == "Crédito") {
    valorBeneficioPercentual = cliente.beneficios.filter((beneficio) => {
      if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
        console.log("Entramos no crédito");
        return beneficio.valorBeneficio;
      }
    });
  }

  if (compra.modoPagamento == "Pix") {
    valorBeneficioPercentual = cliente.beneficios.filter((beneficio) => {
      if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
        return beneficio.valorBeneficio;
      }
    });
  }

  if (compra.modoPagamento == "Boleto") {
    valorBeneficioPercentual = cliente.beneficios.filter((beneficio) => {
      if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
        return beneficio.valorBeneficio;
      }
    });
  }

  let valorDesconto;
  if (valorBeneficioPercentual) {
    console.log(valorBeneficioPercentual[0].valorBeneficio);
    valorDesconto =
      (valorBeneficioPercentual[0].valorBeneficio * valorTotal) / 100;
  }
  return valorDesconto?.toFixed(2);
};
