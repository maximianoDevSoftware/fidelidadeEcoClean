import { promocaoTipo } from "./promocaoType";

export type compraTipo = {
  nomeComprador: string;
  promocao: promocaoTipo;
  valorCompra: string;
  modoPagamento: string;
};
