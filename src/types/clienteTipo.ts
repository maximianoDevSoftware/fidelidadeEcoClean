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
<<<<<<< HEAD
  valorBeneficio: number;
=======
>>>>>>> 98c31bd6f83afdb359ceca34bfac0efa14905cfe
};
