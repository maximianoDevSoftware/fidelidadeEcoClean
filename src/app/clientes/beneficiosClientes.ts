"use client";

import { beneficiosTipo } from "@/types/clienteTipo";

export const beneficiosCliente: beneficiosTipo[] = [
  {
    nomeBeneficio: "Compra a vista, ou na data de vencimento do Cliente Fiel",
    descricaoBeneficio:
      "Desconto de 10% no total da compra do Cliente Fiel EcoClean.",
    valorBeneficio: 10,
  },
  {
    nomeBeneficio: "Compra parcelada Cliente Fiel",
    descricaoBeneficio:
      "Compras parceladas do cliente fiel recebem 5% de desconto do valor total.",
    valorBeneficio: 5,
  },
  {
    nomeBeneficio: "Moradores/Funcionários Cliente Fiel EcoClean",
    descricaoBeneficio:
      "Compras no pix, débido, dinheiro, crédito à vista. Desconto de 5% para este cliente.",
    valorBeneficio: 5,
  },
];
