import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Search, CheckCircle, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { produtosReferencia, categorias, ProdutoReferencia } from '@/data/produtos-referencia';
import { ProductInCycle } from '@/types/product-cycle';
import { useToast } from '@/hooks/use-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (product: Omit<ProductInCycle, 'id' | 'lastUpdated' | 'updatedBy'>) => void;
  onApprove: (product: Omit<ProductInCycle, 'id' | 'lastUpdated' | 'updatedBy'>) => void;
}

const unidades = ['kg', 'litro', 'duzia'] as const;
type Unidade = typeof unidades[number];

const mercados = [
  'Mercado Central',
  'Mercado da Vila',
  'Supermercado Local',
  'Feira Orgânica'
];

export default function AddProductModal({ isOpen, onClose, onSaveDraft, onApprove }: AddProductModalProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    unit: '' as Unidade,
    conversionFactor: 1,
    pricePerUnit: '',
    expiryDate: undefined as Date | undefined,
    availableQuantity: '',
    certified: false,
    familyFarming: false,
    image: '',
    description: '',
    mercadoPrioritario: ''
  });

  // Filter reference products
  const filteredProducts = useMemo(() => {
    return produtosReferencia.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || produto.categoria === categoryFilter;
      return matchesSearch && matchesCategory && produto.ativo;
    });
  }, [searchTerm, categoryFilter]);

  const handleReferenceSelect = (produto: ProdutoReferencia) => {
    setFormData(prev => ({
      ...prev,
      name: produto.nome,
      unit: produto.unidade,
      pricePerUnit: produto.preco_referencia.toString()
    }));
    
    toast({
      title: "Referência aplicada",
      description: "Revise preço e validade para este ciclo."
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'unit', 'pricePerUnit', 'expiryDate', 'mercadoPrioritario'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }
    if (!unidades.includes(formData.unit)) {
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      name: '',
      unit: '' as Unidade,
      conversionFactor: 1,
      pricePerUnit: '',
      expiryDate: undefined,
      availableQuantity: '',
      certified: false,
      familyFarming: false,
      image: '',
      description: '',
      mercadoPrioritario: ''
    });
    setSearchTerm('');
    setCategoryFilter('all');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveDraft = () => {
    if (!formData.name || !formData.unit || !formData.mercadoPrioritario) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos nome, unidade e mercado prioritário.",
        variant: "destructive"
      });
      return;
    }

    const product: Omit<ProductInCycle, 'id' | 'lastUpdated' | 'updatedBy'> = {
      productId: `prod-${Date.now()}`,
      name: formData.name,
      unit: formData.unit,
      conversionFactor: formData.conversionFactor,
      pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
      expiryDate: formData.expiryDate,
      availableQuantity: formData.availableQuantity ? parseInt(formData.availableQuantity) : undefined,
      status: 'draft',
      certified: formData.certified,
      familyFarming: formData.familyFarming,
      image: formData.image,
      description: formData.description
    };

    onSaveDraft(product);
    handleClose();
  };

  const handleApprove = () => {
    if (!validateForm()) {
      toast({
        title: "Validação falhou",
        description: "Preço e validade são obrigatórios para aprovar produto.",
        variant: "destructive"
      });
      return;
    }

    const product: Omit<ProductInCycle, 'id' | 'lastUpdated' | 'updatedBy'> = {
      productId: `prod-${Date.now()}`,
      name: formData.name,
      unit: formData.unit,
      conversionFactor: formData.conversionFactor,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      expiryDate: formData.expiryDate!,
      availableQuantity: formData.availableQuantity ? parseInt(formData.availableQuantity) : undefined,
      status: 'approved',
      certified: formData.certified,
      familyFarming: formData.familyFarming,
      image: formData.image,
      description: formData.description
    };

    onApprove(product);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Referência (Opcional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Referência (Opcional)</h3>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reference Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Preço Ref.</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{produto.categoria}</Badge>
                      </TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>R$ {produto.preco_referencia.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReferenceSelect(produto)}
                        >
                          Usar como base
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum produto encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Formulário do Produto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Produto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Tomate Orgânico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  placeholder="Ex: Hortaliças"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade *</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map(unidade => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço do Ciclo (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Validade *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => handleInputChange('expiryDate', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade Disponível</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => handleInputChange('availableQuantity', e.target.value)}
                  placeholder="Ex: 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mercado">Mercado Prioritário *</Label>
                <Select value={formData.mercadoPrioritario} onValueChange={(value) => handleInputChange('mercadoPrioritario', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mercado" />
                  </SelectTrigger>
                  <SelectContent>
                    {mercados.map(mercado => (
                      <SelectItem key={mercado} value={mercado}>
                        {mercado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva seu produto..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar Produto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}