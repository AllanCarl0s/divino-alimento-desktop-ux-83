import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { produtosReferencia, ProdutoReferencia } from '@/data/produtos-referencia';

interface ProductSearchProps {
  value: string;
  onSelect: (productName: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  value,
  onSelect,
  label = "Buscar alimento base",
  placeholder = "Digite para buscar...",
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProdutoReferencia[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter products
  useEffect(() => {
    if (debouncedSearch.trim()) {
      const filtered = produtosReferencia.filter((produto) =>
        produto.nome.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(produtosReferencia);
    }
  }, [debouncedSearch]);

  const handleSelect = (product: ProdutoReferencia) => {
    onSelect(product.nome);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    window.open('/admin/alimentos/new', '_blank');
  };

  return (
    <div className={cn("space-y-2 relative", className)}>
      {label && <Label>{label}</Label>}
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9"
        />
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Results dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border rounded-md shadow-lg">
            <ScrollArea className="max-h-[300px]">
              <div className="p-2">
                {filteredProducts.length === 0 ? (
                  <div className="space-y-3 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhum alimento encontrado
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCreateNew}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar novo alimento base
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product)}
                        className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {product.nome}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {product.categoria}
                            </div>
                          </div>
                          <Badge
                            variant={product.ativo ? 'success' : 'warning'}
                            className="shrink-0"
                          >
                            {product.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </button>
                    ))}
                    
                    {filteredProducts.length > 0 && (
                      <div className="pt-2 mt-2 border-t">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCreateNew}
                          className="w-full justify-start"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar novo alimento base
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};
