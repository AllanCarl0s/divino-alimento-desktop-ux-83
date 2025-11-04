import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type CertificationType = 'organico' | 'transicao' | 'convencional';
export type AgricultureType = 'familiar' | 'nao_familiar';

interface CompositionFiltersProps {
  certificacoes: Set<CertificationType>;
  tiposAgricultura: Set<AgricultureType>;
  onToggleCertificacao: (cert: CertificationType) => void;
  onToggleTipoAgricultura: (tipo: AgricultureType) => void;
  className?: string;
}

const certificacaoLabels: Record<CertificationType, string> = {
  organico: 'Orgânico',
  transicao: 'Transição',
  convencional: 'Convencional',
};

const agriculturaLabels: Record<AgricultureType, string> = {
  familiar: 'Agri. familiar',
  nao_familiar: 'Agri. não familiar',
};

export function CompositionFilters({
  certificacoes,
  tiposAgricultura,
  onToggleCertificacao,
  onToggleTipoAgricultura,
  className,
}: CompositionFiltersProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Certificação */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Certificação:
        </span>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(certificacaoLabels) as [CertificationType, string][]).map(([key, label]) => {
            const isActive = certificacoes.has(key);
            return (
              <Badge
                key={key}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer select-none transition-all min-h-[44px] px-3 py-2',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background hover:bg-accent'
                )}
                onClick={() => onToggleCertificacao(key)}
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Tipo de Agricultura */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Agricultura:
        </span>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(agriculturaLabels) as [AgricultureType, string][]).map(([key, label]) => {
            const isActive = tiposAgricultura.has(key);
            return (
              <Badge
                key={key}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer select-none transition-all min-h-[44px] px-3 py-2',
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background hover:bg-accent'
                )}
                onClick={() => onToggleTipoAgricultura(key)}
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
