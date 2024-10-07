import { compraTipo } from "./compraType";

export type clienteTipo = {
  id?: string;
  nomeCliente: string;
  compras: compraTipo[];
};
