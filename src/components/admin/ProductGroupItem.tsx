import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductGroup, Oferta } from '@/utils/product-grouping';
import { FilterDropdown, FilterOption } from './FilterDropdown';
import { MobileFiltersSheet, FilterSection } from './MobileFiltersSheet';
import { useIsMobile } from '@/hooks/use-mobile';

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

const certificacaoOptions: FilterOption[] = [
  { value: 'organico', label: 'Produto orgânico' },
  { value: 'transicao', label: 'Produto em transição agroecológica' },
  { value: 'convencional', label: 'Produto convencional' },
];

const agriculturaOptions: FilterOption[] = [
  { value: 'familiar', label: 'Agricultura familiar' },
  { value: 'nao_familiar', label: 'Agricultura não familiar' },
];

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
  const isMobile = useIsMobile();
  const [certificacaoFilter, setCertificacaoFilter] = useState<Set<string>>(new Set());
  const [agriculturaFilter, setAgriculturaFilter] = useState<Set<string>>(new Set());

  const toggleCertificacao = (value: string) => {
    const newSet = new Set(certificacaoFilter);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setCertificacaoFilter(newSet);
  };

  const toggleAgricultura = (value: string) => {
    const newSet = new Set(agriculturaFilter);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setAgriculturaFilter(newSet);
  };

  const clearFilters = () => {
    setCertificacaoFilter(new Set());
    setAgriculturaFilter(new Set());
  };

  const handleClearAll = () => {
    clearFilters();
    onClear();
  };

  // Filter variants based on selected filters
  const filteredVariantes = useMemo(() => {
    let filtered = group.variantes;

    // Apply certification filter
    if (certificacaoFilter.size > 0) {
      filtered = filtered.filter((v) => {
        const cert = v.certificacao || 'convencional';
        return certificacaoFilter.has(cert);
      });
    }

    // Apply agriculture filter
    if (agriculturaFilter.size > 0) {
      filtered = filtered.filter((v) => {
        const agr = v.tipo_agricultura || 'familiar';
        return agriculturaFilter.has(agr);
      });
    }

    return filtered;
  }, [group.variantes, certificacaoFilter, agriculturaFilter]);

  const handleEscolherMaisBarato = () => {
    if (filteredVariantes.length === 0) return;
    const maisBarato = filteredVariantes.reduce((prev, current) => 
      current.valor < prev.valor ? current : prev
    );
    onToggleVariant(maisBarato.id);
  };

  const totalActiveFilters = certificacaoFilter.size + agriculturaFilter.size;

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

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isMobile ? (
              <MobileFiltersSheet
                sections={[
                  {
                    title: 'Certificação',
                    options: certificacaoOptions,
                    selectedValues: certificacaoFilter,
                    onToggle: toggleCertificacao,
                  },
                  {
                    title: 'Tipo de agricultura',
                    options: agriculturaOptions,
                    selectedValues: agriculturaFilter,
                    onToggle: toggleAgricultura,
                  },
                ]}
                onClearAll={clearFilters}
                className="min-w-[100px]"
              />
            ) : (
              <>
                <FilterDropdown
                  title="Certificação"
                  options={certificacaoOptions}
                  selectedValues={certificacaoFilter}
                  onToggle={toggleCertificacao}
                  onClear={clearFilters}
                  className="min-w-[120px]"
                />
                <FilterDropdown
                  title="Agricultura"
                  options={agriculturaOptions}
                  selectedValues={agriculturaFilter}
                  onToggle={toggleAgricultura}
                  onClear={clearFilters}
                  className="min-w-[120px]"
                />
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleEscolherMaisBarato}
              className="h-9 text-xs"
              disabled={filteredVariantes.length === 0}
            >
              Mais barato
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={selectedVariantIds.size === 0 && totalActiveFilters === 0}
              className="h-9 text-xs"
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
              <div className="grid grid-cols-14 gap-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-1">Sel.</div>
                <div className="col-span-1">Unidade</div>
                <div className="col-span-3">Fornecedor</div>
                <div className="col-span-2">Preço Unit.</div>
                <div className="col-span-1">Ofertados</div>
                <div className="col-span-1">Disponível</div>
                <div className="col-span-2">Pedidos</div>
                <div className="col-span-3">Valor acumulado</div>
              </div>

              {/* Variantes */}
              {filteredVariantes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma variante corresponde aos filtros aplicados.
                </div>
              ) : (
                filteredVariantes.map((variante) => {
                const isSelected = selectedVariantIds.has(variante.id);
                const pedidos = quantidades.get(variante.id) || 0;
                const disponivel = variante.quantidadeOfertada - pedidos;
                const valorAcumulado = pedidos * variante.valor;

                return (
                  <div
                    key={variante.id}
                    className={`grid grid-cols-14 gap-3 items-center py-3 px-2 rounded transition-colors ${
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
                    <div className="col-span-1">
                      <Label htmlFor={variante.id} className="cursor-pointer text-sm">
                        {variante.unidade}
                      </Label>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={variante.id} className="cursor-pointer truncate block text-sm">
                        {variante.fornecedor}
                      </Label>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={variante.id} className="cursor-pointer text-sm">
                        R$ {variante.valor.toFixed(2).replace('.', ',')}
                      </Label>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm">{variante.quantidadeOfertada}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium">{disponivel}</span>
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
                    <div className="col-span-3">
                      <span className="text-sm font-semibold">
                        R$ {valorAcumulado.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
