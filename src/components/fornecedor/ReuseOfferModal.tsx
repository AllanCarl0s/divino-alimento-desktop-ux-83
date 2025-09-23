import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, RefreshCw, Plus } from 'lucide-react';
import { PreviousCycleData } from '@/types/product-cycle';

interface ReuseOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousCycleData: PreviousCycleData | null;
  onReuseOffers: () => void;
  onStartFresh: () => void;
}

const ReuseOfferModal: React.FC<ReuseOfferModalProps> = ({
  isOpen,
  onClose,
  previousCycleData,
  onReuseOffers,
  onStartFresh
}) => {
  if (!previousCycleData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <span>Usar ofertas do ciclo anterior?</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <Package className="w-12 h-12 text-primary" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary">
                {previousCycleData.totalProducts}
              </h3>
              <p className="text-sm text-muted-foreground">
                produtos ofertados no ciclo anterior
              </p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-base">
              Encontramos <strong>{previousCycleData.totalProducts} produtos</strong> ofertados no ciclo anterior.
            </p>
            <p className="text-sm text-muted-foreground">
              Deseja trazer esses itens para o ciclo atual?
            </p>
          </div>

          {previousCycleData.products.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Produtos do ciclo anterior:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {previousCycleData.products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    <span>{product.name}</span>
                    <Badge variant="outline" className="text-xs">
                      R$ {product.pricePerUnit?.toFixed(2)}/kg
                    </Badge>
                  </div>
                ))}
                {previousCycleData.products.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-1">
                    e mais {previousCycleData.products.length - 5} produtos...
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={onReuseOffers}
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Trazer e revisar</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onStartFresh}
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Não, começar do zero</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Os produtos reutilizados ficarão como <strong>rascunho</strong> para você revisar e aprovar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReuseOfferModal;