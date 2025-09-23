import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Edit, Trash2, AlertTriangle, Check } from 'lucide-react';
import { ProductInCycle } from '@/types/product-cycle';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProductCycleCardProps {
  product: ProductInCycle;
  onUpdate: (product: ProductInCycle) => void;
  onEdit: (product: ProductInCycle) => void;
  onRemove: (productId: string) => void;
}

const ProductCycleCard: React.FC<ProductCycleCardProps> = ({
  product,
  onUpdate,
  onEdit,
  onRemove
}) => {
  const [localProduct, setLocalProduct] = useState(product);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field: keyof ProductInCycle, value: any) => {
    setLocalProduct(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localProduct);
    setHasChanges(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const },
      approved: { label: 'Aprovado', variant: 'default' as const },
      rejected: { label: 'Reprovado', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isValid = localProduct.pricePerUnit && localProduct.pricePerUnit > 0 && localProduct.expiryDate;
  const showValidationErrors = hasChanges && !isValid;

  return (
    <Card className={cn(
      "shadow-sm hover:shadow-md transition-shadow",
      showValidationErrors && "border-red-300 bg-red-50/30",
      localProduct.status === 'approved' && "border-green-300 bg-green-50/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{localProduct.name}</h3>
            <p className="text-sm text-muted-foreground">
              {localProduct.unit} (fator: {localProduct.conversionFactor})
            </p>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusBadge(localProduct.status)}
              {localProduct.certified && (
                <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                  Certificado
                </Badge>
              )}
              {localProduct.familyFarming && (
                <Badge variant="outline" className="text-xs text-yellow-700 bg-yellow-50">
                  Agricultura Familiar
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(localProduct)}
              className="focus-ring"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(localProduct.id)}
              className="focus-ring text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor={`price-${localProduct.id}`} className="text-sm font-medium">
              Preço do Ciclo *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
              <Input
                id={`price-${localProduct.id}`}
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className={cn(
                  "pl-8 pr-10",
                  !localProduct.pricePerUnit && hasChanges && "border-red-300"
                )}
                value={localProduct.pricePerUnit || ''}
                onChange={(e) => handleFieldChange('pricePerUnit', parseFloat(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/{localProduct.unit}</span>
            </div>
          </div>

          {/* Expiry Date Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data de Validade *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !localProduct.expiryDate && "text-muted-foreground",
                    !localProduct.expiryDate && hasChanges && "border-red-300"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localProduct.expiryDate ? (
                    format(localProduct.expiryDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localProduct.expiryDate}
                  onSelect={(date) => handleFieldChange('expiryDate', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Quantity Field */}
          <div className="space-y-2">
            <Label htmlFor={`quantity-${localProduct.id}`} className="text-sm font-medium">
              Quantidade Disponível
            </Label>
            <div className="relative">
              <Input
                id={`quantity-${localProduct.id}`}
                type="number"
                min="0"
                placeholder="0"
                className="pr-10"
                value={localProduct.availableQuantity || ''}
                onChange={(e) => handleFieldChange('availableQuantity', parseInt(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{localProduct.unit}</span>
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {showValidationErrors && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {!localProduct.pricePerUnit || localProduct.pricePerUnit <= 0 
                ? 'Preço é obrigatório' 
                : 'Data de validade é obrigatória'}
            </span>
          </div>
        )}

        {/* Save Changes Button */}
        {hasChanges && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!isValid}
              size="sm"
              className="flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </Button>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground flex items-center justify-between">
          <span>Atualizado em {localProduct.lastUpdated.toLocaleDateString('pt-BR')}</span>
          <span>por {localProduct.updatedBy}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCycleCard;