import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductGroup, Oferta } from '@/utils/product-grouping';

interface ProductGroupItemProps {
  group: ProductGroup;
  selectedVariantIds: Set<string>;
  quantidades: Map<string, number>;
  onToggleVariant: (variantId: string) => void;
  onQuantidadeChange: (variantId: string, quantidade: number) => void;
  onClear: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function ProductGroupItem({
  group,
  selectedVariantIds,
  quantidades,
  onToggleVariant,
  onQuantidadeChange,
  onClear,
  isExpanded,
  onToggleExpand,
}: ProductGroupItemProps) {

  const handleEscolherMaisBarato = () => {
    const maisBarato = group.variantes.reduce((prev, current) => 
      current.valor < prev.valor ? current : prev
    );
    onToggleVariant(maisBarato.id);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <div className="border rounded-lg overflow-hidden">
        {/* Linha-mãe */}
        <div className="bg-muted/30 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
                aria-label={isExpanded ? "Colapsar grupo" : "Expandir grupo"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{group.produto_base}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {group.totalVariantes} {group.totalVariantes === 1 ? 'variante' : 'variantes'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Menor preço: R$ {group.minPreco.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEscolherMaisBarato}
              className="text-xs"
            >
              Mais barato
            </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                disabled={selectedVariantIds.size === 0}
                className="text-xs"
              >
                Limpar
              </Button>
          </div>
        </div>

        {/* Linhas-filhas */}
        <CollapsibleContent>
          <div className="p-4 pt-0">
            <div className="space-y-2 mt-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-1">Sel.</div>
                <div className="col-span-2">Unidade</div>
                <div className="col-span-3">Fornecedor</div>
                <div className="col-span-2">Preço Unit.</div>
                <div className="col-span-2">Ofertados</div>
                <div className="col-span-2">Pedidos</div>
              </div>

              {/* Variantes */}
              {group.variantes.map((variante) => {
                const isSelected = selectedVariantIds.has(variante.id);
                const pedidos = quantidades.get(variante.id) || 0;

                return (
                  <div
                    key={variante.id}
                    className={`grid grid-cols-12 gap-4 items-center py-3 px-2 rounded transition-colors ${
                      isSelected ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="col-span-1">
                      <Checkbox
                        id={variante.id}
                        checked={isSelected}
                        onCheckedChange={() => onToggleVariant(variante.id)}
                        disabled={variante.quantidadeOfertada === 0}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={variante.id} className="cursor-pointer">
                        {variante.unidade}
                      </Label>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={variante.id} className="cursor-pointer truncate block">
                        {variante.fornecedor}
                      </Label>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={variante.id} className="cursor-pointer">
                        R$ {variante.valor.toFixed(2).replace('.', ',')}
                      </Label>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm">{variante.quantidadeOfertada}</span>
                    </div>
                    <div className="col-span-2">
                      {isSelected ? (
                        <Input
                          type="number"
                          value={pedidos}
                          onChange={(e) => onQuantidadeChange(variante.id, parseInt(e.target.value) || 0)}
                          className="w-full"
                          min="0"
                          max={variante.quantidadeOfertada}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
