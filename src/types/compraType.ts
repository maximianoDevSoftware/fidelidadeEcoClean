import { promocaoTipo } from "./promocaoType";

export type compraTipo = {
  nomeComprador: string;
  dia: Date;
  promocao: promocaoTipo;
  valorCompra: string;
  modoPagamento: string;
};
