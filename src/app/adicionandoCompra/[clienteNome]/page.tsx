"use client";
import { clienteTipo } from "@/types/clienteTipo";
import { FormEvent, useEffect, useState } from "react";
import {
  atualizandoCliente,
  buscandoClienteBD,
  buscandoPromocoesBD,
} from "./apiCompras";
import sty from "./adcCompraSty.module.css";
import Link from "next/link";
import { compraTipo } from "@/types/compraType";
import { promocaoTipo } from "@/types/promocaoType";

interface Props {
  params: { clienteNome: string };
}

let initControlVar = true;

const Cliente = ({ params }: Props) => {
  const decodedName = decodeURIComponent(params.clienteNome);
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    compras: [
      {
        nomeComprador: "",
        promocao: {
          nome: "",
          descricao: "",
        },
      },
    ],
  });

  const [promocaoSelect, setPromocaoSelect] = useState<promocaoTipo>({
    nome: "",
    descricao: "Sem desconto",
  });

  const [dadosFormCompras, setDadosFormCompras] = useState<compraTipo>({
    nomeComprador: "",
    promocao: promocaoSelect,
  });

  const [promocoes, setPromocoes] = useState<promocaoTipo[]>([]);

  const [estadoPagina, setEstadoPagina] = useState({
    estado: "Identificando Cliente",
  });

  const inicializandoClienteFidel = async () => {
    if (initControlVar) {
      buscandoClienteBD(decodedName).then((clienteEncontrado) => {
        console.log(clienteEncontrado);
        setDadosForm({
          id: clienteEncontrado.id,
          nomeCliente: clienteEncontrado.nomeCliente,
          compras: clienteEncontrado.compras,
        });
        setEstadoPagina({ estado: "Buscando Promoções" });
        buscandoPromocoesBD().then((todasPromocoes) => {
          setPromocoes(todasPromocoes);
          setEstadoPagina({ estado: "Disponível" });
        });
      });
    }
  };

  useEffect(() => {
    inicializandoClienteFidel();
  }, []);

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDadosFormCompras({
      ...dadosFormCompras,
      [event.target.name]: event.target.value,
    });
  };

  const autenticandoFormulario = async (ev: FormEvent) => {
    ev.preventDefault();
    setEstadoPagina({ estado: "Adicionando Promoção" });
    const clienteCompra: clienteTipo = {
      id: dadosForm.id,
      nomeCliente: dadosForm.nomeCliente,
      compras: [
        ...dadosForm.compras,
        {
          nomeComprador: dadosFormCompras.nomeComprador,
          promocao: promocaoSelect,
        },
      ],
    };

    atualizandoCliente(clienteCompra).then(() => {
      console.log("tudo certo");
      setEstadoPagina({ estado: "Disponível" });
    });

    console.log(clienteCompra);
  };

  const modificarPromocao = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nomePromocao = event.target.value;
    const promocoesFiltradas = promocoes.filter((promo) => {
      if (promo.nome == nomePromocao) {
        return promo;
      }
    });
    console.log(promocoesFiltradas);
    setPromocaoSelect(promocoesFiltradas[0]);
  };

  return (
    <div className={`${sty.telaPrincipalCliente}`}>
      {estadoPagina.estado === "Disponível" && (
        <form className={sty.formAdcCliente} onSubmit={autenticandoFormulario}>
          <p className={`text-center mt-4 text-sm text-gray-500`}>
            Cliente identificado:
          </p>
          <h3 className={`text-center`}>{dadosForm.nomeCliente}</h3>
          <p className={`text-center mt-4 text-sm text-gray-500`}>
            Promoção do comprador:
          </p>
          <select
            name="promocao"
            className={`text-center w-[90%] block mx-auto my-2 py-2 `}
            onChange={modificarPromocao}
          >
            {promocoes.map((promocao, index) => {
              return (
                <option key={index} value={promocao.nome}>
                  {promocao.nome}
                </option>
              );
            })}
          </select>

          <p className={`text-center mt-4 text-sm text-gray-500`}>
            Descrição da promoção:
          </p>
          <p className={`  px-4 mt-4 text-center text-sm text-gray-900`}>
            {promocaoSelect.descricao}
          </p>

          <p className={`text-center my-2 text-sm text-gray-500`}>
            Nome do comprador:
          </p>
          <input
            className={`text-center`}
            type="text"
            placeholder="Nome aqui..."
            name="nomeComprador"
            onChange={atualizandoFormulario}
          />
          <button type="submit">Adicionar Compra Fidelidade</button>

          <Link href={"/"} className="btnsLeves my-5 w-[90%] mx-auto">
            Página Inicial
          </Link>
        </form>
      )}

      {estadoPagina.estado == "Identificando Cliente" && (
        <div className={`absolute flex items-center justify-center`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}

      {estadoPagina.estado == "Buscando Promoções" && (
        <div className={`absolute flex items-center justify-center`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}

      {estadoPagina.estado == "Adicionando Promoção" && (
        <div className={`absolute flex items-center justify-center`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Cliente;
