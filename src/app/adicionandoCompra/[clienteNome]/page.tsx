"use client";
import { beneficiosTipo, clienteTipo } from "@/types/clienteTipo";
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
import { beneficiosCliente } from "@/app/clientes/beneficiosClientes";

interface Props {
  params: { clienteNome: string };
}

let initControlVar = true;

export default function Cliente({ params }: Props) {
  const decodedName = decodeURIComponent(params.clienteNome);
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    documento: "",
    beneficios: [],
    compras: [],
  });

  const [promocaoSelect, setPromocaoSelect] = useState<promocaoTipo>({
    nome: "Sem promoção.",
    descricao: "Sem desconto promocional",
  });

  const [dadosFormCompras, setDadosFormCompras] = useState<compraTipo>({
    nomeComprador: dadosForm.nomeCliente,
    dia: new Date(),
    promocao: promocaoSelect,
    valorCompra: "",
    modoPagamento: "A vista",
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
          documento: clienteEncontrado.documento,
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
      documento: dadosForm.documento,
      beneficios: dadosForm.beneficios,
      compras: [
        ...dadosForm.compras,
        {
          nomeComprador: dadosFormCompras.nomeComprador
            ? dadosFormCompras.nomeComprador
            : dadosForm.nomeCliente,
          dia: new Date(),
          promocao: promocaoSelect,
          valorCompra: dadosFormCompras.valorCompra,
          modoPagamento: dadosFormCompras.modoPagamento,
        },
      ],
    };

    atualizandoCliente(clienteCompra).then(() => {
      console.log("tudo certo");
      setEstadoPagina({ estado: "Disponível" });
    });

    console.log(clienteCompra);
  };

  const calculandoDesconto = (valor: string) => {
    const valorTotal = parseFloat(valor.replace(",", "."));
    console.log(valorTotal);

    let valorBeneficioPercentual: beneficiosTipo[] = [
      {
        nomeBeneficio: "Sem benefício",
        descricaoBeneficio: "Sem descrição de beneficio",
        valorBeneficio: 1,
      },
    ];
    if (dadosFormCompras.modoPagamento == "A vista") {
      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });

      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[2].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Débito") {
      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });

      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[2].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Crédito") {
      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
          console.log("Entramos no crédito");
          return beneficio.valorBeneficio;
        }
      });

      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[2].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Pix") {
      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[0].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });

      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[2].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    if (dadosFormCompras.modoPagamento == "Boleto") {
      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[1].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });

      valorBeneficioPercentual = dadosForm.beneficios.filter((beneficio) => {
        if (beneficio.nomeBeneficio == beneficiosCliente[2].nomeBeneficio) {
          return beneficio.valorBeneficio;
        }
      });
    }

    let valorDesconto;
    if (valorBeneficioPercentual[0].valorBeneficio) {
      valorDesconto =
        (valorBeneficioPercentual[0].valorBeneficio * valorTotal) / 100;
    }
    return valorDesconto?.toFixed(2);
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
            defaultValue={dadosForm.nomeCliente.toUpperCase()}
            onChange={atualizandoFormulario}
          />

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
            Desconto do Cliente: R${" "}
            <span className={`border-b-2 border-black`}>
              {dadosFormCompras.valorCompra
                ? calculandoDesconto2(
                    dadosFormCompras.valorCompra,
                    dadosFormCompras,
                    dadosForm
                  )
                : "0,00"}
            </span>
          </h1>

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
            <option value="Sem promoção">Sem promoção. </option>
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
        <div
          className={`absolute flex items-center justify-center w-[100dvw] h-[100dvh]`}
        >
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}

      {estadoPagina.estado == "Buscando Promoções" && (
        <div
          className={`absolute flex items-center justify-center w-[100dvw] h-[100dvh]`}
        >
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}

      {estadoPagina.estado == "Adicionando Promoção" && (
        <div
          className={`absolute flex items-center justify-center w-[100dvw] h-[100dvh]`}
        >
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle} text-center`}>
            {estadoPagina.estado}
          </h1>
        </div>
      )}
    </div>
  );
}

const calculandoDesconto2 = (
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
