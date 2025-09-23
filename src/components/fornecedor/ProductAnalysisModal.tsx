import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Check, X, Calendar } from 'lucide-react';
import { ProductInCycle } from '@/types/product-cycle';

interface ProductAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductInCycle | null;
  onSaveDraft: (product: ProductInCycle) => void;
  onApprove: (product: ProductInCycle) => void;
  onReject?: (product: ProductInCycle, reason: string) => void;
}

const ProductAnalysisModal: React.FC<ProductAnalysisModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveDraft,
  onApprove,
  onReject
}) => {
  const [formData, setFormData] = useState<Partial<ProductInCycle>>({});
  const [rejectionReason, setRejectionReason] = useState('');

  React.useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  if (!product) return null;

  const handleSaveDraft = () => {
    onSaveDraft({ ...product, ...formData, status: 'draft' });
    onClose();
  };

  const handleApprove = () => {
    onApprove({ ...product, ...formData, status: 'approved' });
    onClose();
  };

  const handleReject = () => {
    if (onReject && rejectionReason.trim()) {
      onReject({ ...product, ...formData, status: 'rejected' }, rejectionReason);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Análise do Produto</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Header */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div>
                <span>Fornecedor: </span>
                <strong>João da Silva</strong>
              </div>
              <div>
                <span>Unidade: </span>
                <strong>{product.unit} (fator: {product.conversionFactor})</strong>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div>
                <span>Período: </span>
                <strong>Março a Julho</strong>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Data de Submissão: </span>
                <strong>{product.lastUpdated.toLocaleDateString('pt-BR')}</strong>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {product.certified && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  • Certificado
                </Badge>
              )}
              {product.familyFarming && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                  ▲ Agricultura Familiar
                </Badge>
              )}
            </div>
          </div>

          {/* Product Image */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Imagem do Produto</Label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/20">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs">
                  <Upload className="w-3 h-3 mr-1" />
                  Alterar Imagem
                </Button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-base font-medium">
              Valor de Pagamento ao Fornecedor *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="pl-10"
                placeholder="5,00"
                value={formData.pricePerUnit || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/kg</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Descrição do Produto</Label>
            <Textarea
              id="description"
              placeholder="Tomate cereja orgânico cultivado sem agrotóxicos"
              className="min-h-[80px]"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Rejection Reason (if showing reject option) */}
          {onReject && (
            <div className="space-y-2">
              <Label htmlFor="rejection" className="text-base font-medium text-red-600">
                Motivo da Reprovação (opcional)
              </Label>
              <Textarea
                id="rejection"
                placeholder="Descreva o motivo caso vá reprovar o produto..."
                className="min-h-[60px] border-red-200 focus:border-red-400"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            
            <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
              Salvar rascunho
            </Button>
            
            {onReject && (
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                Reprovar
              </Button>
            )}
            
            <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAnalysisModal;