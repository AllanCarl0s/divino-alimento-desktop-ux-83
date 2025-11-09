import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProductGroup, Oferta } from '@/utils/product-grouping';
import { FilterDropdown, FilterOption } from './FilterDropdown';
import { MobileFiltersSheet, FilterSection } from './MobileFiltersSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatBRL } from '@/utils/currency';
import { useCompositionStore } from '@/stores/compositionStore';

interface ProductGroupItemProps {
  group: ProductGroup;
  onQuantidadeChange: (variantId: string, quantidade: number) => void;
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
  onQuantidadeChange,
  isExpanded,
  onToggleExpand,
}: ProductGroupItemProps) {
  const isMobile = useIsMobile();
  const [certificacaoFilter, setCertificacaoFilter] = useState<Set<string>>(new Set());
  const [agriculturaFilter, setAgriculturaFilter] = useState<Set<string>>(new Set());
  const { getVariantComputed, setDraft } = useCompositionStore();
  
  // Calcular quantos estão selecionados (draft > 0)
  const selectedCount = useMemo(() => {
    return group.variantes.filter(v => {
      const computed = getVariantComputed(v.id);
      return computed.draft > 0;
    }).length;
  }, [group.variantes, getVariantComputed]);

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
    // Limpar todos os drafts do grupo
    group.variantes.forEach(v => {
      setDraft(v.id, 0);
    });
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
    // Define quantidade padrão de 1
    setDraft(maisBarato.id, 1);
    onQuantidadeChange(maisBarato.id, 1);
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
              disabled={selectedCount === 0 && totalActiveFilters === 0}
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
              {/* Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-1">Sel.</div>
                <div className="col-span-2">Unidade</div>
                <div className="col-span-2">Fornecedor</div>
                <div className="col-span-1 text-right">Preço Unit.</div>
                <div className="col-span-1 text-right" aria-label="Quantidade ofertada">Ofertados</div>
                <div className="col-span-1 text-right" aria-label="Quantidade disponível">Disponível</div>
                <div className="col-span-2">Pedidos</div>
                <div className="col-span-2 text-right" aria-label="Valor acumulado">Valor acumulado</div>
              </div>

              {/* Variantes */}
              {filteredVariantes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma variante corresponde aos filtros aplicados.
                </div>
              ) : (
                filteredVariantes.map((variante) => {
                const computed = getVariantComputed(variante.id);
                const { draft, disponivel, valorAcum } = computed;
                const maxAllowed = disponivel;

                return (
                  <>
                    {/* Desktop View */}
                    <div
                      key={variante.id}
                      className={`hidden md:grid grid-cols-12 gap-4 items-center py-3 px-2 rounded transition-colors ${
                        draft > 0 ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="col-span-2">
                        {variante.unidade}
                      </div>
                      <div className="col-span-2 truncate">
                        {variante.fornecedor}
                      </div>
                      <div className="col-span-1 text-right">
                        {formatBRL(variante.valor)}
                      </div>
                      <div className="col-span-1 text-right">
                        <span className="text-sm">{variante.quantidadeOfertada}</span>
                      </div>
                      <div className="col-span-1 text-right" title="Quantidade disponível considerando alocações anteriores deste ciclo.">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm">{disponivel}</span>
                          {disponivel > 0 ? (
                            <Badge className="bg-[#E6F7EC] text-[#1E8E3E] hover:bg-[#E6F7EC] text-xs px-2 py-0">
                              OK
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-[#F1F3F4] text-[#5F6368] hover:bg-[#F1F3F4] text-xs px-2 py-0">
                              Esgotado
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={draft}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setDraft(variante.id, value);
                            onQuantidadeChange(variante.id, value);
                          }}
                          className="w-full"
                          min="0"
                          max={maxAllowed}
                        />
                      </div>
                      <div className="col-span-2 text-right" title="Soma dos valores já alocados neste ciclo para esta variante.">
                        <span className={`text-sm ${valorAcum > 0 ? 'font-medium' : ''}`}>
                          {formatBRL(valorAcum)}
                        </span>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div
                      key={`${variante.id}-mobile`}
                      className={`md:hidden p-4 rounded-lg space-y-3 ${
                        draft > 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'
                      }`}
                    >
                      {/* Linha 1: Produto • Fornecedor */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {variante.unidade} • {variante.fornecedor}
                          </div>
                        </div>
                      </div>

                      {/* Linha 2: Unidade | Preço Unit. */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Unidade</span>
                          <div className="font-medium">{variante.unidade}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Preço Unit.</span>
                          <div className="font-medium">{formatBRL(variante.valor)}</div>
                        </div>
                      </div>

                      {/* Linha 3: Ofertados | Disponível */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Ofertados</span>
                          <div className="font-medium">{variante.quantidadeOfertada}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Disponível</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{disponivel}</span>
                            {disponivel > 0 ? (
                              <Badge className="bg-[#E6F7EC] text-[#1E8E3E] hover:bg-[#E6F7EC] text-xs px-2 py-0">
                                OK
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-[#F1F3F4] text-[#5F6368] hover:bg-[#F1F3F4] text-xs px-2 py-0">
                                Esgotado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Linha 4: Pedidos | Valor acumulado */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Pedidos</span>
                          <Input
                            type="number"
                            value={draft}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setDraft(variante.id, value);
                              onQuantidadeChange(variante.id, value);
                            }}
                            className="w-full mt-1"
                            min="0"
                            max={maxAllowed}
                          />
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Valor acumulado</span>
                          <div className={`font-medium ${valorAcum > 0 ? 'font-semibold' : ''}`}>
                            {formatBRL(valorAcum)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
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
