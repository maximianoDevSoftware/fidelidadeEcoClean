import Link from "next/link";
import TabelaFidelidade from "./components/tabelaFidelidade/tabelaFidelidade";

export default function Home() {
  return (
    <div className="telaPrincipal">
      <div className="cabecalhoControle">
        <h1 className="tituloPagina">Controle de Fidelidade EcoClean</h1>
        <div className="flex items-center justify-between px-5">
          <Link className="adcPromo" href="/promocoes ">
            Adicionar Promoção
          </Link>
          <Link className="adcPromo" href="/clientes">
            Adicionar Cliente
          </Link>
        </div>
        <div className="flex items-center justify-between px-5">
          <h1 className="tituloPromo">Promoção atual:</h1>
          <h1 className="promoNome">Descontos Sanchês</h1>
        </div>

        <TabelaFidelidade></TabelaFidelidade>
      </div>
    </div>
  );
}
