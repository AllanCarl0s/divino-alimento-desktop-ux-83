import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Cesta from "./pages/Cesta";
import Resumo from "./pages/Resumo";
import Relatorio from "./pages/Relatorio";
import Pagamentos from "./pages/Pagamentos";
import Configuracoes from "./pages/Configuracoes";
import PedidoConsumidores from "./pages/PedidoConsumidores";
import NotFound from "./pages/NotFound";

// Fornecedor pages
import FornecedorLogin from "./pages/fornecedor/FornecedorLogin";
import FornecedorOnboarding from "./pages/fornecedor/FornecedorOnboarding";
import PreCadastroProdutos from "./pages/fornecedor/PreCadastroProdutos";
import LojaProdutor from "./pages/fornecedor/LojaProdutor";
import PedidosAberto from "./pages/fornecedor/PedidosAberto";
import PainelGestao from "./pages/fornecedor/PainelGestao";
import FornecedorConfiguracoes from "./pages/fornecedor/FornecedorConfiguracoes";
import Cronograma from "./pages/fornecedor/Cronograma";
import ProdutosVencidos from "./pages/fornecedor/ProdutosVencidos";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMercados from "./pages/admin/AdminMercados";
import AdminPrecos from "./pages/admin/AdminPrecos";
import AdminPrecosLista from "./pages/admin/AdminPrecosLista";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminCategoriaNovo from "./pages/admin/AdminCategoriaNovo";
import AdminCategoriaDados from "./pages/admin/AdminCategoriaDados";
import AdminProdutos from "./pages/admin/AdminProdutos";
import AdminProdutoNovo from "./pages/admin/AdminProdutoNovo";
import AdminProdutoEditar from "./pages/admin/AdminProdutoEditar";
import AdminProdutosComercialivaveis from "./pages/admin/AdminProdutosComercialivaveis";
import AdminProdutoComercializavelNovo from "./pages/admin/AdminProdutoComercializavelNovo";
import AdminProdutoComercializavelEditar from "./pages/admin/AdminProdutoComercializavelEditar";
import AdminProdutosSubmissoes from "./pages/admin/AdminProdutosSubmissoes";
import AdminEstoque from "./pages/admin/AdminEstoque";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminVenda from "./pages/admin/AdminVenda";
import AdminCestas from "./pages/admin/AdminCestas";
import AdminComposicao from "./pages/admin/AdminComposicao";
import AdminResumo from "./pages/admin/AdminResumo";
import AdminGestao from "./pages/admin/AdminGestao";
import AdminPnae from "./pages/admin/AdminPnae";
import AdminPnaeComposicao from "./pages/admin/AdminPnaeComposicao";
import AdminKitandinhaNovoCiclo from "./pages/admin/AdminKitandinhaNovoCiclo";
import AdminKitandinhaComposicao from "./pages/admin/AdminKitandinhaComposicao";
import AdminKitandinhaResumo from "./pages/admin/AdminKitandinhaResumo";
import AdminKitandinhaGestao from "./pages/admin/AdminKitandinhaGestao";
import AdminRelatorios from "./pages/admin/AdminRelatorios";
import AdminCicloIndex from "./pages/admin/AdminCicloIndex";
import AdminCiclo from "./pages/admin/AdminCiclo";
import AdminOferta from "./pages/admin/AdminOferta";
import AdminComposicaoCesta from "./pages/admin/AdminComposicaoCesta";
import AdminComposicaoLote from "./pages/admin/AdminComposicaoLote";
import AdminComposicaoVendaDiretaLiberar from "./pages/admin/AdminComposicaoVendaDiretaLiberar";
import AdminComposicaoVendaDiretaCompor from "./pages/admin/AdminComposicaoVendaDiretaCompor";
import Usuarios from "./pages/Usuarios";
import UsuarioIndex from "./pages/UsuarioIndex";
import Usuario from "./pages/Usuario";
import UsuarioDados from "./pages/UsuarioDados";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cesta" element={<Cesta />} />
          <Route path="/resumo" element={<Resumo />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/pedidoConsumidores/:id" element={<PedidoConsumidores />} />
          
          {/* Fornecedor Routes */}
          <Route path="/fornecedor/login" element={<FornecedorLogin />} />
          <Route path="/fornecedor/onboarding" element={<FornecedorOnboarding />} />
          <Route path="/fornecedor/loja" element={<LojaProdutor />} />
          <Route path="/fornecedor/pre-cadastro" element={<PreCadastroProdutos />} />
          <Route path="/fornecedor/pre-cadastro-produtos" element={<PreCadastroProdutos />} />
          <Route path="/fornecedor/pedidos" element={<PedidosAberto />} />
          <Route path="/fornecedor/pedidos-aberto" element={<PedidosAberto />} />
          <Route path="/fornecedor/gestao" element={<PainelGestao />} />
          <Route path="/fornecedor/painel-gestao" element={<PainelGestao />} />
          <Route path="/fornecedor/cronograma" element={<Cronograma />} />
          <Route path="/fornecedor/produtos-vencidos" element={<ProdutosVencidos />} />
          <Route path="/fornecedor/configuracoes" element={<FornecedorConfiguracoes />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/mercados" element={<AdminMercados />} />
          <Route path="/admin/precos" element={<AdminPrecosLista />} />
          <Route path="/admin/precos/:id" element={<AdminPrecos />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/categorias/novo" element={<AdminCategoriaNovo />} />
          <Route path="/admin/categorias/:id" element={<AdminCategoriaDados />} />
          <Route path="/admin/produtos" element={<AdminProdutos />} />
          <Route path="/admin/produto" element={<AdminProdutoNovo />} />
          <Route path="/admin/produto/:id" element={<AdminProdutoEditar />} />
          <Route path="/admin/produtos-comercializaveis" element={<AdminProdutosComercialivaveis />} />
          <Route path="/admin/produto-comercializavel" element={<AdminProdutoComercializavelNovo />} />
          <Route path="/admin/produto-comercializavel/:id" element={<AdminProdutoComercializavelEditar />} />
          <Route path="/admin/produtos-submissoes" element={<AdminProdutosSubmissoes />} />
          <Route path="/admin/estoque" element={<AdminEstoque />} />
          <Route path="/admin/config" element={<AdminConfig />} />
          <Route path="/admin/venda" element={<AdminVenda />} />
          <Route path="/admin/cestas" element={<AdminCestas />} />
          <Route path="/admin/cestas/composicao/:id" element={<AdminComposicao />} />
          <Route path="/admin/cestas/resumo/:id" element={<AdminResumo />} />
          <Route path="/admin/ciclos/gestao/:id" element={<AdminGestao />} />
          <Route path="/admin/pnae" element={<AdminPnae />} />
          <Route path="/admin/pnae/composicao/:id" element={<AdminPnaeComposicao />} />
          <Route path="/admin/pnae/resumo/:id" element={<AdminResumo />} />
          <Route path="/admin/kitandinha/novo-ciclo" element={<AdminKitandinhaNovoCiclo />} />
          <Route path="/admin/kitandinha/composicao/:id" element={<AdminKitandinhaComposicao />} />
          <Route path="/admin/kitandinha/resumo/:id" element={<AdminKitandinhaResumo />} />
          <Route path="/admin/kitandinha/gestao/:id" element={<AdminKitandinhaGestao />} />
          <Route path="/admin/relatorios" element={<AdminRelatorios />} />
          <Route path="/admin/ciclo-index" element={<AdminCicloIndex />} />
          <Route path="/admin/ciclo" element={<AdminCiclo />} />
          <Route path="/admin/ciclo/:id" element={<AdminCiclo />} />
          <Route path="/oferta/:id" element={<AdminOferta />} />
          <Route path="/admin/composicao-cesta/:id" element={<AdminComposicaoCesta />} />
          <Route path="/admin/composicao-lote/:id" element={<AdminComposicaoLote />} />
          <Route path="/admin/composicao-venda-direta/:id" element={<AdminComposicaoVendaDiretaCompor />} />
          <Route path="/admin/composicao-venda-direta-liberar/:id" element={<AdminComposicaoVendaDiretaLiberar />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuario-index" element={<UsuarioIndex />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/usuario/:id" element={<UsuarioDados />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
