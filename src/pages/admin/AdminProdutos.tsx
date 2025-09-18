import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Package, CheckCircle, X, Edit, Search, Upload, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockSubmissions = [
  {
    id: 1,
    name: 'Tomate Cereja',
    supplier: 'João da Silva',
    unit: 'kg',
    conversionFactor: 1,
    certified: true,
    familyFarming: true,
    harvestPeriod: 'Março a Julho',
    description: 'Tomate cereja orgânico cultivado sem agrotóxicos',
    submissionDate: '2024-02-15',
    status: 'pendente',
    image: '/public/lovable-uploads/00c320e7-a99d-4c71-a87f-548f186305d0.png',
    paymentValue: ''
  },
  {
    id: 2,
    name: 'Rúcula Selvagem',
    supplier: 'Maria Fernandes',
    unit: 'maço',
    conversionFactor: 0.2,
    certified: false,
    familyFarming: true,
    harvestPeriod: 'Todo ano',
    description: 'Rúcula cultivada em sistema hidropônico',
    submissionDate: '2024-02-18',
    status: 'pendente',
    image: '/public/lovable-uploads/075f4442-f5fb-4f92-a192-635abe87b383.png',
    paymentValue: ''
  }
];

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: typeof mockSubmissions[0] | null;
}

const AdminProdutos = () => {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [analysisModal, setAnalysisModal] = useState<AnalysisModalProps>({
    isOpen: false,
    onClose: () => {},
    submission: null
  });
  const [reason, setReason] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [paymentValue, setPaymentValue] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const openAnalysisModal = (submission: typeof mockSubmissions[0]) => {
    setAnalysisModal({
      isOpen: true,
      onClose: () => setAnalysisModal(prev => ({ ...prev, isOpen: false })),
      submission
    });
    setReason('');
    setEditedDescription(submission.description);
    setPaymentValue(submission.paymentValue || '');
    setSelectedImage(submission.image || '');
  };

  const handleReject = () => {
    if (!analysisModal.submission || !reason.trim()) return;

    setSubmissions(submissions.filter(s => s.id !== analysisModal.submission!.id));
    
    toast({
      title: "Produto reprovado",
      description: "O fornecedor foi notificado sobre a reprovação.",
      variant: "destructive"
    });

    analysisModal.onClose();
  };

  const handleApprove = () => {
    if (!analysisModal.submission || !paymentValue.trim()) return;

    setSubmissions(submissions.filter(s => s.id !== analysisModal.submission!.id));
    
    toast({
      title: "Produto aprovado!",
      description: "O produto foi aprovado e está disponível no sistema.",
    });

    analysisModal.onClose();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pendente: { label: 'Aguardando Aprovação', variant: 'outline' as const },
      aprovado: { label: 'Aprovado', variant: 'default' as const },
      reprovado: { label: 'Reprovado', variant: 'destructive' as const }
    };
    
    return <Badge variant={config[status as keyof typeof config]?.variant || 'outline'}>
      {config[status as keyof typeof config]?.label || status}
    </Badge>;
  };

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="focus-ring text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Produtos (Submissões)</h1>
          <p className="text-sm text-muted-foreground">
            {submissions.length} {submissions.length === 1 ? 'produto aguardando' : 'produtos aguardando'} aprovação
          </p>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <div>
                <h3 className="font-medium text-foreground">Todas as submissões processadas!</h3>
                <p className="text-sm text-muted-foreground">
                  Não há produtos aguardando aprovação no momento.
                </p>
              </div>
              <Button onClick={() => navigate('/admin/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-poppins flex items-center space-x-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span>{submission.name}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(submission.status)}
                        <Badge variant="secondary" className="text-xs">
                          {submission.supplier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Unidade:</span>
                        <p className="font-medium">{submission.unit} (fator: {submission.conversionFactor})</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Período:</span>
                        <p className="font-medium">{submission.harvestPeriod}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">Descrição:</span>
                      <p className="text-sm mt-1">{submission.description}</p>
                    </div>

                    <div className="flex items-center space-x-4 mt-3 text-xs">
                      {submission.certified && (
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Certificado</span>
                        </span>
                      )}
                      {submission.familyFarming && (
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Agricultura Familiar</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => openAnalysisModal(submission)}
                  >
                    <Search className="w-4 h-4" />
                    <span>Analisar</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analysis Modal */}
        <Dialog open={analysisModal.isOpen} onOpenChange={analysisModal.onClose}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Análise do Produto</DialogTitle>
            </DialogHeader>

            {analysisModal.submission && (
              <div className="py-4 space-y-6">
                {/* Product Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">{analysisModal.submission.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Fornecedor:</span>
                      <p className="font-medium">{analysisModal.submission.supplier}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Unidade:</span>
                      <p className="font-medium">{analysisModal.submission.unit} (fator: {analysisModal.submission.conversionFactor})</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Período:</span>
                      <p className="font-medium">{analysisModal.submission.harvestPeriod}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data de Submissão:</span>
                      <p className="font-medium">{new Date(analysisModal.submission.submissionDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs">
                    {analysisModal.submission.certified && (
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Certificado</span>
                      </span>
                    )}
                    {analysisModal.submission.familyFarming && (
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Agricultura Familiar</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Image */}
                <div className="space-y-3">
                  <Label>Imagem do Produto</Label>
                  <div className="border rounded-lg p-4 text-center space-y-3">
                    {selectedImage ? (
                      <div className="space-y-2">
                        <img 
                          src={selectedImage} 
                          alt={analysisModal.submission.name}
                          className="mx-auto max-h-48 rounded-lg object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedImage('')}
                          className="flex items-center space-x-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Alterar Imagem</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedImage('/public/lovable-uploads/36ccc781-03ee-494d-9194-3b6dfe4b1e24.png')}
                          className="flex items-center space-x-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Carregar Imagem</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Value */}
                <div className="space-y-2">
                  <Label htmlFor="payment">Valor de Pagamento ao Fornecedor *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                    <Input
                      id="payment"
                      type="text"
                      placeholder="5,00/kg"
                      value={paymentValue}
                      onChange={(e) => setPaymentValue(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Produto</Label>
                  <Textarea
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                {/* Rejection Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo da Reprovação (opcional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Descreva o motivo caso vá reprovar o produto..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={analysisModal.onClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={!reason.trim()}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reprovar
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={!paymentValue.trim()}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Aprovar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutos;