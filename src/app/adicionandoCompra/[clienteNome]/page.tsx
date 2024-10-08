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
<<<<<<< HEAD
import { beneficiosCliente } from "@/app/clientes/beneficiosClientes";
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe

interface Props {
  params: { clienteNome: string };
}

let initControlVar = true;

export default function Cliente({ params }: Props) {
  const decodedName = decodeURIComponent(params.clienteNome);
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    beneficios: [],
<<<<<<< HEAD
    compras: [],
=======
    compras: [
      {
        nomeComprador: "",
        promocao: {
          nome: "",
          descricao: "",
        },
      },
    ],
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
  });

  const [promocaoSelect, setPromocaoSelect] = useState<promocaoTipo>({
    nome: "",
<<<<<<< HEAD
    descricao: "Sem desconto promocional",
=======
    descricao: "Sem desconto",
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
  });

  const [dadosFormCompras, setDadosFormCompras] = useState<compraTipo>({
    nomeComprador: "",
    promocao: promocaoSelect,
<<<<<<< HEAD
    valorCompra: "",
    modoPagamento: "A vista",
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
  });

  const [promocoes, setPromocoes] = useState<promocaoTipo[]>([]);

<<<<<<< HEAD
  const [descontoBene, setDescontoBene] = useState<number>();

=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
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
<<<<<<< HEAD
          valorCompra: dadosFormCompras.valorCompra,
          modoPagamento: dadosFormCompras.modoPagamento,
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
        },
      ],
    };

    atualizandoCliente(clienteCompra).then(() => {
      console.log("tudo certo");
      setEstadoPagina({ estado: "Disponível" });
    });

    console.log(clienteCompra);
  };

<<<<<<< HEAD
  const calculandoDesconto = (valor: string) => {
    const valorTotal = parseFloat(valor.replace(",", "."));

    let valorBeneficioPercentual;
    if (dadosFormCompras.modoPagamento == "A vista") {
      valorBeneficioPercentual = dadosForm.beneficios.map((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Débito") {
      valorBeneficioPercentual = dadosForm.beneficios.map((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Crédito") {
      valorBeneficioPercentual = dadosForm.beneficios.map((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
          console.log("Entramos no crédito");
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Pix") {
      valorBeneficioPercentual = dadosForm.beneficios.map((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Boleto") {
      valorBeneficioPercentual = dadosForm.beneficios.map((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    console.log(valorBeneficioPercentual);
    let percentualDesconto: number = 0;

    let valorDesconto;
    if (valorTotal) {
      valorDesconto = (percentualDesconto * valorTotal) / 100;
    }
    return valorDesconto;
  };

=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
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

<<<<<<< HEAD
          <div
            className={`flex items-center text-center text-sm text-gray-500`}
          >
            <div className={`w-[150px]`}>
              <h3>Valor da Compra</h3>
              <input
                type="number"
                name="valorCompra"
                defaultValue={(0).toFixed(2)}
                className={`text-right`}
                onChange={atualizandoFormulario}
              />
            </div>
            <div>
              <h3>Modo Pagamento</h3>
              <select
                className={`${sty.selectFormAdc} text-left`}
                name="modoPagamento"
                onChange={atualizandoFormulario}
              >
                <option value="A vista">A vista</option>
                <option value="Crédito">Crédito</option>
                <option value="Débito">Débito</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
          </div>

          <h1>
            Desconto do Cliente:{" "}
            <span>{calculandoDesconto(dadosFormCompras.valorCompra)}</span>
          </h1>

=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
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
<<<<<<< HEAD
            <option value="Sem promoção">Sem promoção. </option>
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
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
