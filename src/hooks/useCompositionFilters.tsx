import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CertificationType, AgricultureType } from '@/components/admin/CompositionFilters';

export function useCompositionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Inicializar com todos os filtros marcados
  const [certificacoes, setCertificacoes] = useState<Set<CertificationType>>(
    new Set(['organico', 'transicao', 'convencional'])
  );
  const [tiposAgricultura, setTiposAgricultura] = useState<Set<AgricultureType>>(
    new Set(['familiar', 'nao_familiar'])
  );

  // Carregar filtros dos query params ao montar
  useEffect(() => {
    const certParam = searchParams.get('cert');
    const agriParam = searchParams.get('agri');

    if (certParam) {
      const certs = certParam.split(',').filter((c): c is CertificationType => 
        ['organico', 'transicao', 'convencional'].includes(c)
      );
      if (certs.length > 0) {
        setCertificacoes(new Set(certs));
      }
    }

    if (agriParam) {
      const tipos = agriParam.split(',').filter((t): t is AgricultureType => 
        ['familiar', 'nao_familiar'].includes(t)
      );
      if (tipos.length > 0) {
        setTiposAgricultura(new Set(tipos));
      }
    }
  }, []);

  // Atualizar query params quando filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (certificacoes.size > 0 && certificacoes.size < 3) {
      params.set('cert', Array.from(certificacoes).join(','));
    } else {
      params.delete('cert');
    }

    if (tiposAgricultura.size > 0 && tiposAgricultura.size < 2) {
      params.set('agri', Array.from(tiposAgricultura).join(','));
    } else {
      params.delete('agri');
    }

    setSearchParams(params, { replace: true });
  }, [certificacoes, tiposAgricultura]);

  const toggleCertificacao = (cert: CertificationType) => {
    setCertificacoes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cert)) {
        newSet.delete(cert);
      } else {
        newSet.add(cert);
      }
      // Não permitir desmarcar todos
      return newSet.size === 0 ? prev : newSet;
    });
  };

  const toggleTipoAgricultura = (tipo: AgricultureType) => {
    setTiposAgricultura(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tipo)) {
        newSet.delete(tipo);
      } else {
        newSet.add(tipo);
      }
      // Não permitir desmarcar todos
      return newSet.size === 0 ? prev : newSet;
    });
  };

  const clearFilters = () => {
    setCertificacoes(new Set(['organico', 'transicao', 'convencional']));
    setTiposAgricultura(new Set(['familiar', 'nao_familiar']));
  };

  const hasActiveFilters = useMemo(() => {
    return certificacoes.size < 3 || tiposAgricultura.size < 2;
  }, [certificacoes, tiposAgricultura]);

  return {
    certificacoes,
    tiposAgricultura,
    toggleCertificacao,
    toggleTipoAgricultura,
    clearFilters,
    hasActiveFilters,
  };
}
