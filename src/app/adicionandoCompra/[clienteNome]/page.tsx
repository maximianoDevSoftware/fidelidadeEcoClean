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

export default function Cliente({ params }: Props) {
  const decodedName = decodeURIComponent(params.clienteNome);
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    beneficios: [],
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
          beneficios: clienteEncontrado.beneficios,
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
      beneficios: dadosForm.beneficios,
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
          <h3 className={`text-center border-b-2 border-green-500`}>
            {dadosForm.nomeCliente.toUpperCase()}
          </h3>

          <p className={`text-center my-2 text-sm text-gray-500`}>
            Nome do comprador:
          </p>
          <input
            className={`text-center`}
            type="text"
            placeholder="Nome aqui..."
            name="nomeComprador"
            value={dadosForm.nomeCliente.toUpperCase()}
            onChange={atualizandoFormulario}
          />

          <p className={`pl-4 mt-4 text-sm text-gray-500`}>
            Benefícios do Cliente:
          </p>
          {dadosForm.beneficios ? (
            dadosForm.beneficios.map((beneficioCliente, index) => {
              return (
                <div className={`pl-4 mt-4 `} key={index}>
                  <p className={`text-sm text-gray-950`}>
                    {beneficioCliente.nomeBeneficio}
                  </p>
                  <p className={`text-sm text-gray-600`}>
                    {beneficioCliente.descricaoBeneficio}
                  </p>
                </div>
              );
            })
          ) : (
            <p className={`pl-4 mt-4 text-sm text-gray-500`}>
              Nenhum benefício encontrado
            </p>
          )}

          <p className={`pl-4 mt-4 text-sm text-gray-500`}>
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

          <p className={`pl-4 mt-4 text-sm text-gray-500`}>
            Descrição da promoção:
          </p>
          <p className={`  px-4 mt-4 text-left text-sm text-gray-900`}>
            {promocaoSelect.descricao}
          </p>

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
}
