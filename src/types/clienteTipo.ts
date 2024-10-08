import { compraTipo } from "./compraType";

export type clienteTipo = {
  id?: string;
  nomeCliente: string;
  beneficios: beneficiosTipo[];
  compras: compraTipo[];
};

export type beneficiosTipo = {
  nomeBeneficio: string;
  descricaoBeneficio: string;
};
