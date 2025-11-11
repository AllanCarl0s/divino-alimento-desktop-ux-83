import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MinhaCesta from "./pages/MinhaCesta";
import PedidoConsumidores from "./pages/PedidoConsumidores";
import ConsumidorPagamentos from "./pages/consumidor/ConsumidorPagamentos";
import ConsumidorSelecionarCiclo from "./pages/consumidor/ConsumidorSelecionarCiclo";
import ConsumidorRelatorioPedidos from "./pages/consumidor/ConsumidorRelatorioPedidos";
import ConsumidorRelatorioPedidosResultado from "./pages/consumidor/ConsumidorRelatorioPedidosResultado";
import NotFound from "./pages/NotFound";

// Fornecedor pages
import LojaProdutor from "./pages/fornecedor/LojaProdutor";
import FornecedorSelecionarCiclo from "./pages/fornecedor/FornecedorSelecionarCiclo";
import FornecedorSelecionarCicloEntregas from "./pages/fornecedor/FornecedorSelecionarCicloEntregas";
import FornecedorEntregas from "./pages/fornecedor/FornecedorEntregas";

// Admin pages
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
import AdminCicloIndex from "./pages/admin/AdminCicloIndex";
import AdminCiclo from "./pages/admin/AdminCiclo";
import AdminOferta from "./pages/admin/AdminOferta";
import AdminComposicaoCesta from "./pages/admin/AdminComposicaoCesta";
import AdminComposicaoLote from "./pages/admin/AdminComposicaoLote";
import AdminComposicaoVendaDiretaLiberar from "./pages/admin/AdminComposicaoVendaDiretaLiberar";
import AdminLiberarVendaDireta from "./pages/admin/AdminLiberarVendaDireta";
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
import UsuarioDados from "./pages/UsuarioDados";
import UsuarioNovo from "./pages/UsuarioNovo";
import AdminMercadoDashboard from './pages/adminmercado/AdminMercadoDashboard';
import AdminMercadoMercados from './pages/adminmercado/AdminMercadoMercados';
import AdminMercadoPrecos from './pages/adminmercado/AdminMercadoPrecos';
import AdminMercadoPrecosGestao from './pages/adminmercado/AdminMercadoPrecosGestao';
import AdminMercadoCicloIndex from './pages/adminmercado/AdminMercadoCicloIndex';
import AdminMercadoCiclo from './pages/adminmercado/AdminMercadoCiclo';
import AdminMercadoComposicaoCesta from './pages/adminmercado/AdminMercadoComposicaoCesta';
import AdminMercadoComposicaoLote from './pages/adminmercado/AdminMercadoComposicaoLote';
import AdminMercadoMigrarOfertas from './pages/adminmercado/AdminMercadoMigrarOfertas';
import AdminMercadoRelatorioFornecedores from './pages/adminmercado/AdminMercadoRelatorioFornecedores';
import AdminMercadoRelatorioFornecedoresResultado from './pages/adminmercado/AdminMercadoRelatorioFornecedoresResultado';
import AdminMercadoRelatorioConsumidores from './pages/adminmercado/AdminMercadoRelatorioConsumidores';
import AdminMercadoRelatorioConsumidoresResultado from './pages/adminmercado/AdminMercadoRelatorioConsumidoresResultado';
import AdminMercadoRelatorioFornecedoresCiclo from './pages/adminmercado/AdminMercadoRelatorioFornecedoresCiclo';
import AdminMercadoRelatorioConsumidoresCiclo from './pages/adminmercado/AdminMercadoRelatorioConsumidoresCiclo';

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
          
          {/* Consumidor Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/minhaCesta/:id" element={<ProtectedRoute><MinhaCesta /></ProtectedRoute>} />
          <Route path="/consumidor/selecionar-ciclo" element={<ProtectedRoute><ConsumidorSelecionarCiclo /></ProtectedRoute>} />
          <Route path="/pedidoConsumidores/:id" element={<ProtectedRoute><PedidoConsumidores /></ProtectedRoute>} />
          <Route path="/consumidor/pagamentos" element={<ProtectedRoute><ConsumidorPagamentos /></ProtectedRoute>} />
          <Route path="/consumidor/relatorio-pedidos" element={<ProtectedRoute><ConsumidorRelatorioPedidos /></ProtectedRoute>} />
          <Route path="/consumidor/relatorio-pedidos-resultado/:cicloId" element={<ProtectedRoute><ConsumidorRelatorioPedidosResultado /></ProtectedRoute>} />
          
          {/* Fornecedor Routes */}
          <Route path="/fornecedor/loja" element={<ProtectedRoute><LojaProdutor /></ProtectedRoute>} />
          <Route path="/fornecedor/selecionar-ciclo" element={<ProtectedRoute><FornecedorSelecionarCiclo /></ProtectedRoute>} />
          <Route path="/fornecedor/selecionar-ciclo-entregas" element={<ProtectedRoute><FornecedorSelecionarCicloEntregas /></ProtectedRoute>} />
          <Route path="/fornecedor/entregas/:cicloId" element={<ProtectedRoute><FornecedorEntregas /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          
          {/* Admin Mercado Routes */}
          <Route path="/adminmercado/dashboard" element={<ProtectedRoute><AdminMercadoDashboard /></ProtectedRoute>} />
          <Route path="/adminmercado/mercados" element={<ProtectedRoute><AdminMercadoMercados /></ProtectedRoute>} />
          <Route path="/adminmercado/precos" element={<ProtectedRoute><AdminMercadoPrecos /></ProtectedRoute>} />
          <Route path="/adminmercado/precos/:id" element={<ProtectedRoute><AdminMercadoPrecosGestao /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo-index" element={<ProtectedRoute><AdminMercadoCicloIndex /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo" element={<ProtectedRoute><AdminMercadoCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/ciclo/:id" element={<ProtectedRoute><AdminMercadoCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/composicao-cesta/:cicloId" element={<ProtectedRoute><AdminMercadoComposicaoCesta /></ProtectedRoute>} />
          <Route path="/adminmercado/composicao-lote/:cicloId" element={<ProtectedRoute><AdminMercadoComposicaoLote /></ProtectedRoute>} />
          <Route path="/adminmercado/migrar-ofertas/:cicloId" element={<ProtectedRoute><AdminMercadoMigrarOfertas /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-fornecedores/resultado" element={<ProtectedRoute><AdminMercadoRelatorioFornecedoresResultado /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-fornecedores/:cicloId" element={<ProtectedRoute><AdminMercadoRelatorioFornecedores /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-consumidores/resultado" element={<ProtectedRoute><AdminMercadoRelatorioConsumidoresResultado /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorio-consumidores/:cicloId" element={<ProtectedRoute><AdminMercadoRelatorioConsumidores /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorios/fornecedores-ciclo" element={<ProtectedRoute><AdminMercadoRelatorioFornecedoresCiclo /></ProtectedRoute>} />
          <Route path="/adminmercado/relatorios/consumidores-ciclo" element={<ProtectedRoute><AdminMercadoRelatorioConsumidoresCiclo /></ProtectedRoute>} />

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
          <Route path="/admin/ciclo-index" element={<ProtectedRoute><AdminCicloIndex /></ProtectedRoute>} />
          <Route path="/admin/ciclo" element={<ProtectedRoute><AdminCiclo /></ProtectedRoute>} />
          <Route path="/admin/ciclo/:id" element={<ProtectedRoute><AdminCiclo /></ProtectedRoute>} />
          <Route path="/oferta/:id" element={<ProtectedRoute><AdminOferta /></ProtectedRoute>} />
          <Route path="/admin/composicao-cesta/:id" element={<ProtectedRoute><AdminComposicaoCesta /></ProtectedRoute>} />
          <Route path="/admin/composicao-lote/:id" element={<ProtectedRoute><AdminComposicaoLote /></ProtectedRoute>} />
          <Route path="/admin/composicao-venda-direta/:id" element={<ProtectedRoute><AdminComposicaoVendaDiretaLiberar /></ProtectedRoute>} />
          <Route path="/admin/composicao-venda-direta-liberar/:id" element={<ProtectedRoute><AdminComposicaoVendaDiretaLiberar /></ProtectedRoute>} />
          <Route path="/admin/liberar-venda-direta/:id" element={<ProtectedRoute><AdminLiberarVendaDireta /></ProtectedRoute>} />
          <Route path="/admin/entregas-fornecedores/:id" element={<ProtectedRoute><AdminEntregasFornecedores /></ProtectedRoute>} />
          <Route path="/admin/pedidos-consumidores/:id" element={<ProtectedRoute><AdminPedidosConsumidores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-fornecedores" element={<ProtectedRoute><AdminRelatorioFornecedores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-fornecedores/resultado" element={<ProtectedRoute><AdminRelatorioFornecedoresResultado /></ProtectedRoute>} />
          <Route path="/admin/relatorio-consumidores" element={<ProtectedRoute><AdminRelatorioConsumidores /></ProtectedRoute>} />
          <Route path="/admin/relatorio-consumidores/resultado" element={<ProtectedRoute><AdminRelatorioConsumidoresResultado /></ProtectedRoute>} />
          <Route path="/admin/migrar-ofertas/:destinoId" element={<ProtectedRoute><AdminMigrarOfertas /></ProtectedRoute>} />
          <Route path="/admin/pagamentos-gerar" element={<ProtectedRoute><AdminPagamentosGerar /></ProtectedRoute>} />
          <Route path="/admin/pagamentos-gerir" element={<ProtectedRoute><AdminPagamentosGerir /></ProtectedRoute>} />
          <Route path="/usuario" element={<ProtectedRoute><UsuarioNovo /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="/usuario-index" element={<ProtectedRoute><UsuarioIndex /></ProtectedRoute>} />
          <Route path="/usuario/:id" element={<ProtectedRoute><UsuarioDados /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
