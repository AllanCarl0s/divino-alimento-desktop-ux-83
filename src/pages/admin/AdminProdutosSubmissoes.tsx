import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { ArrowLeft, Eye, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProductSubmission {
  id: string;
  productName: string;
  supplierName: string;
  submittedDate: string;
  status: 'Pendente' | 'Aprovado' | 'Reprovado';
  imageUrl: string;
  description: string;
  pricePerUnit: number;
  unit: string;
}

interface AnalysisModalProps {
  open: boolean;
  onClose: () => void;
  submission: ProductSubmission | null;
  onApprove: (id: string, description: string, price: number) => void;
  onReject: (id: string, reason: string) => void;
}

const AdminProdutosSubmissoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ProductSubmission[]>([
    {
      id: '1',
      productName: 'Tomate Orgânico',
      supplierName: 'Fazenda Verde',
      submittedDate: '2024-01-15',
      status: 'Pendente',
      imageUrl: '/placeholder.svg',
      description: 'Tomate orgânico cultivado sem agrotóxicos',
      pricePerUnit: 4.50,
      unit: 'kg'
    },
    {
      id: '2',
      productName: 'Alface Americana',
      supplierName: 'Horta do Sol',
      submittedDate: '2024-01-14',
      status: 'Pendente',
      imageUrl: '/placeholder.svg',
      description: 'Alface fresca colhida diariamente',
      pricePerUnit: 3.00,
      unit: 'unidade'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<ProductSubmission | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const openAnalysisModal = (submission: ProductSubmission) => {
    setCurrentSubmission(submission);
    setEditedDescription(submission.description);
    setEditedPrice(submission.pricePerUnit.toString());
    setSelectedImage(submission.imageUrl);
    setRejectionReason('');
    setIsModalOpen(true);
  };

  const handleApprove = (id: string, description: string, price: number) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: 'Aprovado' as const } : sub
      )
    );
    toast({
      title: "Produto aprovado",
      description: "O produto foi aprovado com sucesso.",
    });
    setIsModalOpen(false);
  };

  const handleReject = (id: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da reprovação.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: 'Reprovado' as const } : sub
      )
    );
    toast({
      title: "Produto reprovado",
      description: "O produto foi reprovado.",
    });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'success' | 'destructive'> = {
      'Pendente': 'warning',
      'Aprovado': 'success',
      'Reprovado': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const pendingCount = submissions.filter(s => s.status === 'Pendente').length;

  return (
    <ResponsiveLayout 
      leftHeaderContent={
        <Button 
          variant="ghost" 
          size="icon-sm"
          onClick={() => navigate('/admin/dashboard')}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            Produtos (Submissões)
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Aprovar produtos enviados por fornecedores
          </p>
          {pendingCount > 0 && (
            <Badge variant="warning" className="mt-2">
              {pendingCount} {pendingCount === 1 ? 'produto pendente' : 'produtos pendentes'}
            </Badge>
          )}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <img 
                        src={submission.imageUrl} 
                        alt={submission.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{submission.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Fornecedor: {submission.supplierName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Enviado em: {new Date(submission.submittedDate).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="mt-2">
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {submission.status === 'Pendente' && (
                    <Button
                      onClick={() => openAnalysisModal(submission)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analisar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Analisar Produto</DialogTitle>
              <DialogDescription>
                Revise as informações e aprove ou reprove o produto
              </DialogDescription>
            </DialogHeader>

            {currentSubmission && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <img 
                    src={selectedImage} 
                    alt={currentSubmission.productName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nome do Produto</Label>
                  <Input value={currentSubmission.productName} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input value={currentSubmission.supplierName} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editedPrice">Valor por {currentSubmission.unit}</Label>
                  <Input
                    id="editedPrice"
                    type="number"
                    step="0.01"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editedDescription">Descrição</Label>
                  <Textarea
                    id="editedDescription"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Motivo da Reprovação (opcional)</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Informe o motivo caso reprove o produto..."
                    rows={2}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={() => currentSubmission && handleReject(currentSubmission.id, rejectionReason)}
                className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Reprovar
              </Button>
              <Button
                onClick={() => currentSubmission && handleApprove(
                  currentSubmission.id,
                  editedDescription,
                  parseFloat(editedPrice)
                )}
                className="w-full sm:w-auto"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutosSubmissoes;
