import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Cesta from "./pages/Cesta";
import MinhaCesta from "./pages/MinhaCesta";
import Resumo from "./pages/Resumo";
import Relatorio from "./pages/Relatorio";
import Pagamentos from "./pages/Pagamentos";
import Configuracoes from "./pages/Configuracoes";
import PedidoConsumidores from "./pages/PedidoConsumidores";
import ConsumidorRelatorio from "./pages/consumidor/ConsumidorRelatorio";
import ConsumidorPagamentos from "./pages/consumidor/ConsumidorPagamentos";
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
import FornecedorRelatorioEntregas from "./pages/fornecedor/FornecedorRelatorioEntregas";
import FornecedorPagamentos from "./pages/fornecedor/FornecedorPagamentos";
import FornecedorEntregas from "./pages/fornecedor/FornecedorEntregas";

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
import AdminConfig from "./pages/admin/AdminConfig";
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
import AdminCicloIndex from "./pages/admin/AdminCicloIndex";
import AdminCiclo from "./pages/admin/AdminCiclo";
import AdminOferta from "./pages/admin/AdminOferta";
import AdminComposicaoCesta from "./pages/admin/AdminComposicaoCesta";
import AdminComposicaoLote from "./pages/admin/AdminComposicaoLote";
import AdminComposicaoVendaDiretaLiberar from "./pages/admin/AdminComposicaoVendaDiretaLiberar";
import AdminComposicaoVendaDiretaCompor from "./pages/admin/AdminComposicaoVendaDiretaCompor";
import AdminEntregasFornecedores from "./pages/admin/AdminEntregasFornecedores";
import AdminPedidosConsumidores from "./pages/admin/AdminPedidosConsumidores";
import AdminRelatorioFornecedores from "./pages/admin/AdminRelatorioFornecedores";
import AdminRelatorioFornecedoresResultado from "./pages/admin/AdminRelatorioFornecedoresResultado";
import AdminRelatorioConsumidores from "./pages/admin/AdminRelatorioConsumidores";
import AdminRelatorioConsumidoresResultado from "./pages/admin/AdminRelatorioConsumidoresResultado";
import AdminMigrarOfertas from "./pages/admin/AdminMigrarOfertas";
import AdminPagamentosGerar from "./pages/admin/AdminPagamentosGerar";
import AdminPagamentosGerir from "./pages/admin/AdminPagamentosGerir";
import Usuarios from "./pages/Usuarios";
import UsuarioIndex from "./pages/UsuarioIndex";
import Usuario from "./pages/Usuario";
import UsuarioDados from "./pages/UsuarioDados";
import AdminMercadoDashboard from './pages/adminmercado/AdminMercadoDashboard';
import AdminMercadoMercados from './pages/adminmercado/AdminMercadoMercados';
import AdminMercadoPrecos from './pages/adminmercado/AdminMercadoPrecos';
import AdminMercadoPrecosDetalhes from './pages/adminmercado/AdminMercadoPrecosDetalhes';
import AdminMercadoCicloIndex from './pages/adminmercado/AdminMercadoCicloIndex';
import AdminMercadoCiclo from './pages/adminmercado/AdminMercadoCiclo';
import AdminMercadoComposicaoLote from './pages/adminmercado/AdminMercadoComposicaoLote';
import AdminMercadoMigrarOfertas from './pages/adminmercado/AdminMercadoMigrarOfertas';
import AdminMercadoRelatorioFornecedores from './pages/adminmercado/AdminMercadoRelatorioFornecedores';
import AdminMercadoRelatorioConsumidores from './pages/adminmercado/AdminMercadoRelatorioConsumidores';
import AdminMercadoRelatorioFornecedoresCiclo from './pages/adminmercado/AdminMercadoRelatorioFornecedoresCiclo';
import AdminMercadoRelatorioConsumidoresCiclo from './pages/adminmercado/AdminMercadoRelatorioConsumidoresCiclo';
import AdminMercadoPagamentosGerar from './pages/adminmercado/AdminMercadoPagamentosGerar';
import AdminMercadoPagamentosGerir from './pages/adminmercado/AdminMercadoPagamentosGerir';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ProtectedRoute requireAuth={false}><Index /></ProtectedRoute>} />
          <Route path="/login" element={<ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>} />
          <Route path="/registro" element={<ProtectedRoute requireAuth={false}><Register /></ProtectedRoute>} />
          <Route path="/verificar-email" element={<ProtectedRoute requireAuth={false}><VerifyEmail /></ProtectedRoute>} />
          
          {/* Consumidor Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cesta" element={<ProtectedRoute><Cesta /></ProtectedRoute>} />
          <Route path="/minhaCesta/:id" element={<ProtectedRoute><MinhaCesta /></ProtectedRoute>} />
          <Route path="/resumo" element={<ProtectedRoute><Resumo /></ProtectedRoute>} />
          <Route path="/relatorio" element={<ProtectedRoute><Relatorio /></ProtectedRoute>} />
          <Route path="/pagamentos" element={<ProtectedRoute><Pagamentos /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="/pedidoConsumidores/:id" element={<ProtectedRoute><PedidoConsumidores /></ProtectedRoute>} />
          <Route path="/consumidor/relatorio/:id" element={<ProtectedRoute><ConsumidorRelatorio /></ProtectedRoute>} />
          <Route path="/consumidor/pagamentos" element={<ProtectedRoute><ConsumidorPagamentos /></ProtectedRoute>} />
          
          {/* Fornecedor Routes */}
          <Route path="/fornecedor/login" element={<ProtectedRoute requireAuth={false}><FornecedorLogin /></ProtectedRoute>} />
          <Route path="/fornecedor/onboarding" element={<ProtectedRoute><FornecedorOnboarding /></ProtectedRoute>} />
          <Route path="/fornecedor/loja" element={<ProtectedRoute><LojaProdutor /></ProtectedRoute>} />
          <Route path="/fornecedor/pre-cadastro" element={<ProtectedRoute><PreCadastroProdutos /></ProtectedRoute>} />
          <Route path="/fornecedor/pre-cadastro-produtos" element={<ProtectedRoute><PreCadastroProdutos /></ProtectedRoute>} />
          <Route path="/fornecedor/pedidos" element={<ProtectedRoute><PedidosAberto /></ProtectedRoute>} />
          <Route path="/fornecedor/pedidos-aberto" element={<ProtectedRoute><PedidosAberto /></ProtectedRoute>} />
          <Route path="/fornecedor/gestao" element={<ProtectedRoute><PainelGestao /></ProtectedRoute>} />
          <Route path="/fornecedor/painel-gestao" element={<ProtectedRoute><PainelGestao /></ProtectedRoute>} />
          <Route path="/fornecedor/cronograma" element={<ProtectedRoute><Cronograma /></ProtectedRoute>} />
          <Route path="/fornecedor/produtos-vencidos" element={<ProtectedRoute><ProdutosVencidos /></ProtectedRoute>} />
          <Route path="/fornecedor/configuracoes" element={<ProtectedRoute><FornecedorConfiguracoes /></ProtectedRoute>} />
          <Route path="/fornecedor/relatorio-entregas" element={<ProtectedRoute><FornecedorRelatorioEntregas /></ProtectedRoute>} />
          <Route path="/fornecedor/entregas/:cicloId" element={<ProtectedRoute><FornecedorEntregas /></ProtectedRoute>} />
          <Route path="/fornecedor/pagamentos" element={<ProtectedRoute><FornecedorPagamentos /></ProtectedRoute>} />
          <Route path="/fornecedor/ofertas" element={<ProtectedRoute><LojaProdutor /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<ProtectedRoute requireAuth={false}><AdminLogin /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          
          {/* Admin Mercado Routes */}
          <Route path="/adminmercado/dashboard" element={<ProtectedRoute><AdminMercadoDashboard /></ProtectedRoute>} />
          <Route path="/adminmercado/mercados" element={<ProtectedRoute><AdminMercadoMercados /></ProtectedRoute>} />
          <Route path="/adminmercado/precos" element={<ProtectedRoute><AdminMercadoPrecos /></ProtectedRoute>} />
          <Route path="/adminmercado/precos/:id" element={<ProtectedRoute><AdminMercadoPrecosDetalhes /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo-index" element={<ProtectedRoute><AdminMercadoCicloIndex /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo" element={<ProtectedRoute><AdminMercadoCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo/:id" element={<ProtectedRoute><AdminMercadoCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/composicao-lote/:cicloId" element={<ProtectedRoute><AdminMercadoComposicaoLote /></ProtectedRoute>} />
          <Route path="/adminmercado/migrar-ofertas/:cicloId" element={<ProtectedRoute><AdminMercadoMigrarOfertas /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-fornecedores/:cicloId" element={<ProtectedRoute><AdminMercadoRelatorioFornecedores /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-consumidores/:cicloId" element={<ProtectedRoute><AdminMercadoRelatorioConsumidores /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorios/fornecedores-ciclo" element={<ProtectedRoute><AdminMercadoRelatorioFornecedoresCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorios/consumidores-ciclo" element={<ProtectedRoute><AdminMercadoRelatorioConsumidoresCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/pagamentos/gerar" element={<ProtectedRoute><AdminMercadoPagamentosGerar /></ProtectedRoute>} />
          <Route path="/adminmercado/pagamentos/gerir" element={<ProtectedRoute><AdminMercadoPagamentosGerir /></ProtectedRoute>} />
          
          <Route path="/admin/mercados" element={<ProtectedRoute><AdminMercados /></ProtectedRoute>} />
          <Route path="/admin/precos" element={<ProtectedRoute><AdminPrecosLista /></ProtectedRoute>} />
          <Route path="/admin/precos/:id" element={<ProtectedRoute><AdminPrecos /></ProtectedRoute>} />
          <Route path="/admin/categorias" element={<ProtectedRoute><AdminCategorias /></ProtectedRoute>} />
          <Route path="/admin/categorias/novo" element={<ProtectedRoute><AdminCategoriaNovo /></ProtectedRoute>} />
          <Route path="/admin/categorias/:id" element={<ProtectedRoute><AdminCategoriaDados /></ProtectedRoute>} />
          <Route path="/admin/produtos" element={<ProtectedRoute><AdminProdutos /></ProtectedRoute>} />
          <Route path="/admin/alimentos" element={<ProtectedRoute><AdminProdutos /></ProtectedRoute>} />
          <Route path="/admin/produto" element={<ProtectedRoute><AdminProdutoNovo /></ProtectedRoute>} />
          <Route path="/admin/alimento" element={<ProtectedRoute><AdminProdutoNovo /></ProtectedRoute>} />
          <Route path="/admin/produto/:id" element={<ProtectedRoute><AdminProdutoEditar /></ProtectedRoute>} />
          <Route path="/admin/alimento/:id" element={<ProtectedRoute><AdminProdutoEditar /></ProtectedRoute>} />
          <Route path="/admin/produtos-comercializaveis" element={<ProtectedRoute><AdminProdutosComercialivaveis /></ProtectedRoute>} />
          <Route path="/admin/produto-comercializavel" element={<ProtectedRoute><AdminProdutoComercializavelNovo /></ProtectedRoute>} />
          <Route path="/admin/produto-comercializavel/:id" element={<ProtectedRoute><AdminProdutoComercializavelEditar /></ProtectedRoute>} />
          <Route path="/admin/config" element={<ProtectedRoute><AdminConfig /></ProtectedRoute>} />
          <Route path="/admin/cestas" element={<ProtectedRoute><AdminCestas /></ProtectedRoute>} />
          <Route path="/admin/cestas/composicao/:id" element={<ProtectedRoute><AdminComposicao /></ProtectedRoute>} />
          <Route path="/admin/cestas/resumo/:id" element={<ProtectedRoute><AdminResumo /></ProtectedRoute>} />
          <Route path="/admin/ciclos/gestao/:id" element={<ProtectedRoute><AdminGestao /></ProtectedRoute>} />
          <Route path="/admin/pnae" element={<ProtectedRoute><AdminPnae /></ProtectedRoute>} />
          <Route path="/admin/pnae/composicao/:id" element={<ProtectedRoute><AdminPnaeComposicao /></ProtectedRoute>} />
          <Route path="/admin/pnae/resumo/:id" element={<ProtectedRoute><AdminResumo /></ProtectedRoute>} />
          <Route path="/admin/kitandinha/novo-ciclo" element={<ProtectedRoute><AdminKitandinhaNovoCiclo /></ProtectedRoute>} />
          <Route path="/admin/kitandinha/composicao/:id" element={<ProtectedRoute><AdminKitandinhaComposicao /></ProtectedRoute>} />
          <Route path="/admin/kitandinha/resumo/:id" element={<ProtectedRoute><AdminKitandinhaResumo /></ProtectedRoute>} />
          <Route path="/admin/kitandinha/gestao/:id" element={<ProtectedRoute><AdminKitandinhaGestao /></ProtectedRoute>} />
          <Route path="/admin/ciclo-index" element={<ProtectedRoute><AdminCicloIndex /></ProtectedRoute>} />
          <Route path="/admin/ciclo" element={<ProtectedRoute><AdminCiclo /></ProtectedRoute>} />
          <Route path="/admin/ciclo/:id" element={<ProtectedRoute><AdminCiclo /></ProtectedRoute>} />
          <Route path="/oferta/:id" element={<ProtectedRoute><AdminOferta /></ProtectedRoute>} />
          <Route path="/admin/composicao-cesta/:id" element={<ProtectedRoute><AdminComposicaoCesta /></ProtectedRoute>} />
          <Route path="/admin/composicao-lote/:id" element={<ProtectedRoute><AdminComposicaoLote /></ProtectedRoute>} />
          <Route path="/admin/composicao-venda-direta/:id" element={<ProtectedRoute><AdminComposicaoVendaDiretaCompor /></ProtectedRoute>} />
          <Route path="/admin/composicao-venda-direta-liberar/:id" element={<ProtectedRoute><AdminComposicaoVendaDiretaLiberar /></ProtectedRoute>} />
          <Route path="/admin/entregas-fornecedores/:id" element={<ProtectedRoute><AdminEntregasFornecedores /></ProtectedRoute>} />
          <Route path="/admin/pedidos-consumidores/:id" element={<ProtectedRoute><AdminPedidosConsumidores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-fornecedores" element={<ProtectedRoute><AdminRelatorioFornecedores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-fornecedores/resultado" element={<ProtectedRoute><AdminRelatorioFornecedoresResultado /></ProtectedRoute>} />
          <Route path="/admin/relatorio-consumidores" element={<ProtectedRoute><AdminRelatorioConsumidores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-consumidores/resultado" element={<ProtectedRoute><AdminRelatorioConsumidoresResultado /></ProtectedRoute>} />
          <Route path="/admin/migrar-ofertas/:destinoId" element={<ProtectedRoute><AdminMigrarOfertas /></ProtectedRoute>} />
          <Route path="/admin/pagamentos-gerar" element={<ProtectedRoute><AdminPagamentosGerar /></ProtectedRoute>} />
          <Route path="/admin/pagamentos-gerir" element={<ProtectedRoute><AdminPagamentosGerir /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="/usuario-index" element={<ProtectedRoute><UsuarioIndex /></ProtectedRoute>} />
          <Route path="/usuario" element={<ProtectedRoute><Usuario /></ProtectedRoute>} />
          <Route path="/usuario/:id" element={<ProtectedRoute><UsuarioDados /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
