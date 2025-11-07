import { FilterDropdown, FilterOption } from "./FilterDropdown";
import { MobileFiltersSheet, FilterSection } from "./MobileFiltersSheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type CertificationType = 'organico' | 'transicao' | 'convencional';
export type AgricultureType = 'familiar' | 'nao_familiar';

interface CompositionFiltersProps {
  certificacoes: Set<CertificationType>;
  tiposAgricultura: Set<AgricultureType>;
  onToggleCertificacao: (cert: CertificationType) => void;
  onToggleTipoAgricultura: (tipo: AgricultureType) => void;
  onClearAll?: () => void;
  className?: string;
}

const certificacaoLabels: Record<CertificationType, string> = {
  organico: 'Produto orgânico',
  transicao: 'Produto em transição agroecológica',
  convencional: 'Produto convencional',
};

const agriculturaLabels: Record<AgricultureType, string> = {
  familiar: 'Agricultura familiar',
  nao_familiar: 'Agricultura não familiar',
};

export function CompositionFilters({
  certificacoes,
  tiposAgricultura,
  onToggleCertificacao,
  onToggleTipoAgricultura,
  onClearAll,
  className = "",
}: CompositionFiltersProps) {
  const isMobile = useIsMobile();

  const certificacaoOptions: FilterOption[] = (Object.keys(certificacaoLabels) as CertificationType[]).map((cert) => ({
    value: cert,
    label: certificacaoLabels[cert],
  }));

  const agriculturaOptions: FilterOption[] = (Object.keys(agriculturaLabels) as AgricultureType[]).map((tipo) => ({
    value: tipo,
    label: agriculturaLabels[tipo],
  }));

  const handleClearCertificacao = () => {
    // Reset to all selected (default state)
    (Object.keys(certificacaoLabels) as CertificationType[]).forEach((cert) => {
      if (!certificacoes.has(cert)) {
        onToggleCertificacao(cert);
      }
    });
  };

  const handleClearAgricultura = () => {
    // Reset to all selected (default state)
    (Object.keys(agriculturaLabels) as AgricultureType[]).forEach((tipo) => {
      if (!tiposAgricultura.has(tipo)) {
        onToggleTipoAgricultura(tipo);
      }
    });
  };

  const handleClearAll = () => {
    handleClearCertificacao();
    handleClearAgricultura();
    onClearAll?.();
  };

  if (isMobile) {
    const sections: FilterSection[] = [
      {
        title: "Certificação",
        options: certificacaoOptions,
        selectedValues: certificacoes,
        onToggle: onToggleCertificacao,
      },
      {
        title: "Agricultura",
        options: agriculturaOptions,
        selectedValues: tiposAgricultura,
        onToggle: onToggleTipoAgricultura,
      },
    ];

    return (
      <MobileFiltersSheet
        sections={sections}
        onClearAll={handleClearAll}
        className={className}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FilterDropdown
        title="Certificação"
        options={certificacaoOptions}
        selectedValues={certificacoes}
        onToggle={onToggleCertificacao}
        onClear={handleClearCertificacao}
      />
      <FilterDropdown
        title="Agricultura"
        options={agriculturaOptions}
        selectedValues={tiposAgricultura}
        onToggle={onToggleTipoAgricultura}
        onClear={handleClearAgricultura}
      />
    </div>
  );
}
