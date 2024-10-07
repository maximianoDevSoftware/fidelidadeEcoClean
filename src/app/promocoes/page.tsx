"use client";

import { FormEvent, useState } from "react";
import sty from "./promoPage.module.css";
import Link from "next/link";
import adicionarPromocao, {
  deletarPromocao,
  verificarPromocoes,
} from "./promocoesApi";
import { promocaoTipo } from "@/types/promocaoType";

export default function TelaPromocoes() {
  const [dadosForm, setDadosForm] = useState({
    nome: "",
    descricao: "",
  });

  const [estadoPagina, setEstadoPagina] = useState({
    estado: "Disponível",
  });

  const [promocoes, setPromocoes] = useState<promocaoTipo[]>();

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDadosForm({
      ...dadosForm,
      [event.target.name]: event.target.value,
    });
  };

  const autenticandoFormulario = (ev: FormEvent) => {
    ev.preventDefault();

    console.log(dadosForm);
    setEstadoPagina({ estado: "Salvando Promoção" });
    adicionarPromocao(dadosForm).then((response) => {
      console.log(response);
      setEstadoPagina({ estado: "Disponível" });
    });
  };

  const verinficPromos = () => {
    verificarPromocoes().then((todasPromos) => {
      const adptDados = todasPromos;
      setPromocoes(todasPromos);
      setEstadoPagina({ estado: "Promoções Verificadas" });
    });
  };

  return (
    <>
      {estadoPagina.estado == "Disponível" && (
        <div className={`${sty.telaPrincipalCliente}`}>
          <form
            className={sty.formAdcCliente}
            onSubmit={autenticandoFormulario}
          >
            <h1>Nome da promoção:</h1>
            <input
              type="text"
              placeholder="Nome aqui..."
              name="nome"
              onChange={atualizandoFormulario}
            />
            <h1>Descrição da promoção:</h1>

            <textarea
              name="descricao"
              className={`block w-[90%] mx-auto p-3`}
              rows={4}
              onChange={atualizandoFormulario}
            ></textarea>

            <button type="submit">Adicionar Promoção</button>
            <button
              onClick={() => {
                setEstadoPagina({ estado: "Verificando Promoções..." });
                verinficPromos();
              }}
            >
              Verificar Promoções
            </button>
            <Link href={"/"} className="btnsLeves my-5 w-[90%] mx-auto">
              Página Inicial
            </Link>
          </form>
        </div>
      )}
      {estadoPagina.estado == "Salvando Promoção" && (
        <div className={`${sty.telaPrincipalCliente}`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle}`}>{estadoPagina.estado}</h1>
        </div>
      )}

      {estadoPagina.estado == "Verificando Promoções..." && (
        <div className={`${sty.telaPrincipalCliente}`}>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle}`}>{estadoPagina.estado}</h1>
        </div>
      )}

      {estadoPagina.estado == "Promoções Verificadas" && (
        <div className={`${sty.telaPrincipalCliente}`}>
          <div className={`w-[90%] shadow-sm shadow-black p-3`}>
            <ul>
              {promocoes?.map((promocao, index) => {
                return (
                  <li key={index} className="my-2 relative">
                    <p className={`text-sm text-gray-500`}>
                      Nome da promoção:{" "}
                    </p>
                    <h3 className={`text-sm`}>{promocao.nome}</h3>
                    <p className={`text-sm text-gray-500`}>
                      Descrição da promoção:{" "}
                    </p>
                    <h3 className={`text-sm border-b-2 border-gray-500`}>
                      {promocao.descricao}
                    </h3>
                    <button
                      className={`p-2 shadow-sm shadow-black absolute right-2 top-2`}
                      onClick={(ev) => {
                        console.log("Click delete promoç~çao");
                        deletarPromocao(promocao).then((response) => {
                          console.log(response);
                          setPromocoes(response);
                        });
                      }}
                    >
                      Remover Promoção
                    </button>
                  </li>
                );
              })}
            </ul>

            <a href={"/"} className="btnsLeves my-3">
              Página Inicial
            </a>

            <Link
              href={"/promocoes"}
              className="btnsLeves my-3"
              onClick={() => {
                setEstadoPagina({ estado: "Disponível" });
              }}
            >
              Adicionar Promoções
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
