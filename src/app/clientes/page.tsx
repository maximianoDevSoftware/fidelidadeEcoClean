"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import sty from "./styClientesRots.module.css";
import { clienteTipo } from "@/types/clienteTipo";
import { adicionandoCliente } from "./minhaApi";
import { useQRCode } from "next-qrcode";
import Link from "next/link";

export default function TelaAdcClientes() {
  const [dadosForm, setDadosForm] = useState<clienteTipo>({
    nomeCliente: "",
    compras: [],
  });

  const [estadoPagina, setEstadoPagina] = useState({
    estado: "Disponível",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDadosForm({
      ...dadosForm,
      [event.target.name]: event.target.value,
    });
  };

  const autenticandoFormulario = async (ev: FormEvent) => {
    ev.preventDefault();
    console.log("Criando cliente: " + dadosForm.nomeCliente);
    setEstadoPagina({ estado: "Salvando Cliente..." });
    const dadosFinal: clienteTipo = {
      nomeCliente: dadosForm.nomeCliente.toLowerCase(),
      compras: dadosForm.compras,
    };
    const cliente = await adicionandoCliente(dadosFinal);
    console.log("Cliente criado: ", cliente);
    setEstadoPagina({ estado: "Gerando QR Code..." });
    setQrCodeUrl(`http://localhost:3000/${cliente.nomeCliente}`);
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
            {`http://localhost:3000/${dadosForm.nomeCliente}`}
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
