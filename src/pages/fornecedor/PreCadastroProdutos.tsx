import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, Camera, Calendar, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PreCadastroProdutos = () => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    conversionFactor: '1',
    certified: false,
    familyFarming: false,
    characteristics: '',
    harvestDate: '',
    harvestPeriod: [] as string[],
    priorityMarket: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const units = [
    { value: 'kg', label: 'Quilograma (kg)', factor: '1' },
    { value: 'g', label: 'Grama (g)', factor: '0.001' },
    { value: 'ton', label: 'Tonelada (ton)', factor: '1000' },
    { value: 'l', label: 'Litro (l)', factor: '1' },
    { value: 'ml', label: 'Mililitro (ml)', factor: '0.001' },
    { value: 'duzia', label: 'Dúzia', factor: '0.5' },
    { value: 'centena', label: 'Centena', factor: '4' },
    { value: 'unidade', label: 'Unidade', factor: '0.1' }
  ];

  const months = [
    { value: 'janeiro', label: 'Janeiro' },
    { value: 'fevereiro', label: 'Fevereiro' },
    { value: 'marco', label: 'Março' },
    { value: 'abril', label: 'Abril' },
    { value: 'maio', label: 'Maio' },
    { value: 'junho', label: 'Junho' },
    { value: 'julho', label: 'Julho' },
    { value: 'agosto', label: 'Agosto' },
    { value: 'setembro', label: 'Setembro' },
    { value: 'outubro', label: 'Outubro' },
    { value: 'novembro', label: 'Novembro' },
    { value: 'dezembro', label: 'Dezembro' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUnitChange = (value: string) => {
    const selectedUnit = units.find(unit => unit.value === value);
    setFormData(prev => ({
      ...prev,
      unit: value,
      conversionFactor: selectedUnit?.factor || '1'
    }));
  };

  const handleMonthToggle = (monthValue: string) => {
    setFormData(prev => ({
      ...prev,
      harvestPeriod: prev.harvestPeriod.includes(monthValue)
        ? prev.harvestPeriod.filter(month => month !== monthValue)
        : [...prev.harvestPeriod, monthValue]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unidade é obrigatória';
    }

    if (!formData.conversionFactor || isNaN(Number(formData.conversionFactor))) {
      newErrors.conversionFactor = 'Fator de conversão deve ser um número válido';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'saveAndReturn' = 'save') => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Metadados salvos!",
        description: "Você pode ofertar este produto no ciclo.",
      });
      
      if (action === 'saveAndReturn') {
        navigate('/fornecedor/loja');
      }
    }, 1500);
  };

  const handleSaveMetadata = () => {
    const form = document.createElement('form');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent = () => true;
    handleSubmit(event as any, 'save');
  };

  const handleSaveAndReturn = () => {
    const form = document.createElement('form');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent = () => true;
    handleSubmit(event as any, 'saveAndReturn');
  };

  return (
    <ResponsiveLayout 
      headerContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/fornecedor/loja')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-4 lg:space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="font-poppins text-xl lg:text-2xl text-gradient-primary flex items-center space-x-2">
              <Package className="w-5 h-5 lg:w-6 lg:h-6" />
              <span>Pré-cadastro de Produto</span>
            </CardTitle>
            <p className="text-sm lg:text-base text-muted-foreground">
              Cadastre seus produtos para ofertar nos ciclos
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Informações Básicas</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: Tomate Orgânico"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`focus-ring ${errors.name ? 'border-destructive' : ''}`}
                    required
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-1 text-sm text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-sm font-medium">
                      Unidade *
                    </Label>
                    <Select value={formData.unit} onValueChange={handleUnitChange}>
                      <SelectTrigger className={`focus-ring ${errors.unit ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.unit && (
                      <div className="flex items-center space-x-1 text-sm text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.unit}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversionFactor" className="text-sm font-medium">
                      Fator (kg) *
                    </Label>
                    <Input
                      id="conversionFactor"
                      type="number"
                      step="0.001"
                      placeholder="1.0"
                      value={formData.conversionFactor}
                      onChange={(e) => handleInputChange('conversionFactor', e.target.value)}
                      className={`focus-ring ${errors.conversionFactor ? 'border-destructive' : ''}`}
                      required
                    />
                    {errors.conversionFactor && (
                      <div className="flex items-center space-x-1 text-sm text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.conversionFactor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Fator de conversão:</strong> Indica quantos quilos equivale 1 unidade do seu produto. 
                    Ex: 1 dúzia de ovos = 0,5 kg
                  </p>
                </div>
              </div>

              <Separator />

              {/* Certificações */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Certificações e Características</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Produto Certificado</Label>
                      <p className="text-xs text-muted-foreground">Possui certificação orgânica ou similar</p>
                    </div>
                    <Switch
                      checked={formData.certified}
                      onCheckedChange={(checked) => handleInputChange('certified', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Agricultura Familiar</Label>
                      <p className="text-xs text-muted-foreground">Produção de agricultura familiar</p>
                    </div>
                    <Switch
                      checked={formData.familyFarming}
                      onCheckedChange={(checked) => handleInputChange('familyFarming', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="characteristics" className="text-sm font-medium">
                    Outras Características
                  </Label>
                  <Textarea
                    id="characteristics"
                    placeholder="Ex: Livre de agrotóxicos, produção sustentável..."
                    value={formData.characteristics}
                    onChange={(e) => handleInputChange('characteristics', e.target.value)}
                    className="focus-ring resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Cronograma */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Cronograma de Produção</span>
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Período de Colheita
                  </Label>
                  <div className="grid grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/20">
                    {months.map((month) => (
                      <div key={month.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={month.value}
                          checked={formData.harvestPeriod.includes(month.value)}
                          onCheckedChange={() => handleMonthToggle(month.value)}
                        />
                        <Label 
                          htmlFor={month.value} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {month.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.harvestPeriod.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selecionados: {formData.harvestPeriod.map(month => 
                        months.find(m => m.value === month)?.label
                      ).join(', ')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priorityMarket" className="text-sm font-medium">
                    Mercado Prioritário
                  </Label>
                  <Input
                    id="priorityMarket"
                    type="text"
                    placeholder="Ex: Mercado Local, Regional"
                    value={formData.priorityMarket}
                    onChange={(e) => handleInputChange('priorityMarket', e.target.value)}
                    className="focus-ring"
                  />
                </div>
              </div>

              <Separator />

              {/* Foto do Produto */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Imagem do Produto</span>
                </h3>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Adicione uma foto do seu produto
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Escolher Foto
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos aceitos: JPG, PNG (máx. 5MB)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Observações Adicionais
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Informações importantes sobre o produto..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="focus-ring resize-none"
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/fornecedor/loja')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSaveMetadata}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Salvando..." : "Salvar Metadados"}
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveAndReturn}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Salvando..." : "Salvar e Voltar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default PreCadastroProdutos;