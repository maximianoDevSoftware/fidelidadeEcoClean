"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import sty from "./styClientesRots.module.css";
import { beneficiosTipo, clienteTipo } from "@/types/clienteTipo";
import { adicionandoCliente } from "./minhaApi";
import { useQRCode } from "next-qrcode";
import Link from "next/link";
import { beneficiosCliente } from "./beneficiosClientes";

export default function TelaAdcClientes() {
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    documento: "",
    beneficios: [],
    compras: [],
  });

  const [estadoPagina, setEstadoPagina] = useState({
    estado: "Disponível",
  });

  const [stateBeneficos, setStateBeneficios] = useState<beneficiosTipo[]>();

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDadosForm({
      ...dadosForm,
      [event.target.name]: event.target.value,
    });
  };

  const adicionarBeneficio = (
    nomeBen: string,
    descricaoBen: string,
    valorBen: number
  ) => {
    console.log("Benenfício inserido com sucesso");
    const novoBeneficio: beneficiosTipo = {
      nomeBeneficio: nomeBen,
      descricaoBeneficio: descricaoBen,
      valorBeneficio: valorBen,
    };
    console.log(novoBeneficio);
    setDadosForm((prevState) => ({
      ...prevState,
      beneficios: [...prevState.beneficios, novoBeneficio],
    }));
  };

  // Função para remover um benefício
  const removerBeneficio = (nomeBen: string) => {
    console.log("Removendo beneficio com sucesso!");
    setDadosForm((prevState) => ({
      ...prevState,
      beneficios: prevState.beneficios.filter(
        (beneficio) => beneficio.nomeBeneficio !== nomeBen
      ),
    }));
  };

  const autenticandoFormulario = async (ev: FormEvent) => {
    ev.preventDefault();
    console.log("Criando cliente: " + dadosForm.nomeCliente);
    const beneficios = setEstadoPagina({ estado: "Salvando Cliente..." });

    const dadosFinal: clienteTipo = {
      nomeCliente: dadosForm.nomeCliente.toLowerCase(),
      documento: dadosForm.documento,
      beneficios: dadosForm.beneficios,
      compras: dadosForm.compras,
    };

    console.log(dadosFinal);
    const cliente = await adicionandoCliente(dadosFinal);
    console.log("Cliente criado: ", cliente);
    setEstadoPagina({ estado: "Gerando QR Code..." });
    console.log(
      `https://fidelidade-eco-clean-zeta.vercel.app/adicionandoCompra/${cliente.nomeCliente}`
    );
    setQrCodeUrl(
      `https://fidelidade-eco-clean-zeta.vercel.app/adicionandoCompra/${cliente.nomeCliente}`
    );
    setEstadoPagina({ estado: "QR Code Gerado" });
  };

  return (
    <div className={sty.telaPrincipalCliente}>
      {estadoPagina.estado === "Disponível" && (
        <form className={sty.formAdcCliente} onSubmit={autenticandoFormulario}>
          <h1>Nome do cliente:</h1>
          <input
            type="text"
            placeholder="Nome aqui..."
            name="nomeCliente"
            onChange={atualizandoFormulario}
          />

          <h3 className={`w-[90%] mx-auto`}>Documento do cliente:</h3>
          <input
            type="text"
            placeholder="RG, CPF ou CNPJ"
            name="documento"
            onChange={atualizandoFormulario}
          />

          <h3 className={`w-[90%] mx-auto`}>Lista de Benefícios:</h3>

          {beneficiosCliente.map((beneficio, index) => {
            let ctrl = false;
            return (
              <div
                key={index}
                className="w-[90%] mx-auto relative pl-10 my-3 pb-2 border-b-2 border-b-gray-400"
              >
                <input
                  type="checkbox"
                  name="nomeBeneficio"
                  id={`nomeBeneficioID${index}`}
                  className={sty.btnFlex + " absolute left-[10px] top-[0px]"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      console.log("Achei essa bosta");
                      adicionarBeneficio(
                        beneficio.nomeBeneficio,
                        beneficio.descricaoBeneficio,
                        beneficio.valorBeneficio
                      );
                    } else {
                      removerBeneficio(beneficio.nomeBeneficio);
                    }
                  }}
                />
                <label htmlFor={`nomeBeneficioID${index}`}>
                  <h3>{beneficio.nomeBeneficio}</h3>
                  <p className="text-sm">{beneficio.descricaoBeneficio}</p>
                </label>
              </div>
            );
          })}

          <button type="submit">Adicionar Cliente</button>

          <Link href={"/"} className="btnsLeves my-5 w-[90%] mx-auto">
            Página Inicial
          </Link>
        </form>
      )}
      {estadoPagina.estado === "Salvando Cliente..." && (
        <>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle}`}>{estadoPagina.estado}</h1>
        </>
      )}
      {estadoPagina.estado === "Gerando QR Code..." && (
        <>
          <div className={sty.loadingCircle}></div>
          <h1 className={`${sty.estadoPaginaTitle}`}>{estadoPagina.estado}</h1>
        </>
      )}
      {estadoPagina.estado === "QR Code Gerado" && qrCodeUrl && (
        <div>
          <h1 className="text-center">
            QR Code gerado para <br />{" "}
            {`https://fidelidade-eco-clean-zeta.vercel.app/adicionandoCompra/${dadosForm.nomeCliente.toLowerCase()}`}
          </h1>
          <QRCodeCanvas text={qrCodeUrl} />

          <a href={"/"} className="btnsLeves my-3">
            Página Inicial
          </a>

          <Link
            href={"/clientes"}
            className="btnsLeves my-3"
            onClick={() => {
              setEstadoPagina({ estado: "Disponível" });
            }}
          >
            Adicionar outro Cliente
          </Link>
        </div>
      )}
    </div>
  );
}

function QRCodeCanvas({ text }: { text: string }) {
  const { Canvas } = useQRCode();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.querySelector("canvas");
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "qrcode.jpg", { type: "image/jpeg" });
            const data = {
              files: [file],
              title: "QR Code",
              text: "Aqui está o QR code gerado.",
            };
            try {
              await navigator.share(data);
            } catch (error) {
              console.error("Erro ao compartilhar:", error);
            }
          }
        }, "image/jpeg");
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Manipulações adicionais no canvas
    }
  }, []);

  return (
    <>
      <div
        ref={canvasRef}
        className="rounded-xl shadow-sm shadow-gray-500 my-3 flex items-center justify-center overflow-hidden bg-white"
      >
        <Canvas
          text={text}
          options={{
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: "#010599FF",
              light: "#fff",
            },
          }}
        />
      </div>

      <button className="btnsLeves w-[100%]" onClick={handleShare}>
        Enviar QR Code
      </button>
    </>
  );
}
