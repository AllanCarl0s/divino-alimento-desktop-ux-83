import { create } from 'zustand';

interface CompositionState {
  // Dados base das variantes
  offeredByVariantId: Record<string, number>;
  priceByVariantId: Record<string, number>;
  
  // Quantidades já commitadas anteriormente (vem do backend)
  committedPrevByVariantId: Record<string, number>;
  
  // Quantidades em rascunho (digitadas agora pelo usuário)
  currentDraftByVariantId: Record<string, number>;
  
  // Actions
  initialize: (variants: Array<{
    id: string;
    quantidadeOfertada: number;
    valor: number;
    pedidosAcumulados?: number;
  }>) => void;
  
  setDraft: (variantId: string, quantity: number) => void;
  clearDraft: () => void;
  commitDraft: () => void;
  
  // Computed getters
  getVariantComputed: (variantId: string) => {
    ofertados: number;
    prev: number;
    draft: number;
    disponivel: number;
    valorAcum: number;
  };
}

export const useCompositionStore = create<CompositionState>((set, get) => ({
  offeredByVariantId: {},
  priceByVariantId: {},
  committedPrevByVariantId: {},
  currentDraftByVariantId: {},
  
  initialize: (variants) => {
    const offered: Record<string, number> = {};
    const price: Record<string, number> = {};
    
    variants.forEach(v => {
      offered[v.id] = v.quantidadeOfertada;
      price[v.id] = v.valor;
    });
    
    set({
      offeredByVariantId: offered,
      priceByVariantId: price,
      committedPrevByVariantId: {}, // Sempre inicia vazio
      currentDraftByVariantId: {},
    });
  },
  
  setDraft: (variantId, quantity) => {
    const state = get();
    const ofertados = state.offeredByVariantId[variantId] || 0;
    const prev = state.committedPrevByVariantId[variantId] || 0;
    
    // Clamp: min=0, max=ofertados-prev
    const maxAllowed = Math.max(0, ofertados - prev);
    const clamped = Math.max(0, Math.min(quantity, maxAllowed));
    
    set({
      currentDraftByVariantId: {
        ...state.currentDraftByVariantId,
        [variantId]: clamped,
      },
    });
  },
  
  clearDraft: () => {
    set({ currentDraftByVariantId: {} });
  },
  
  commitDraft: () => {
    const state = get();
    const newCommitted = { ...state.committedPrevByVariantId };
    
    Object.entries(state.currentDraftByVariantId).forEach(([id, draft]) => {
      newCommitted[id] = (newCommitted[id] || 0) + draft;
    });
    
    set({
      committedPrevByVariantId: newCommitted,
      currentDraftByVariantId: {},
    });
  },
  
  getVariantComputed: (variantId) => {
    const state = get();
    const ofertados = state.offeredByVariantId[variantId] || 0;
    const prev = state.committedPrevByVariantId[variantId] || 0;
    const draft = state.currentDraftByVariantId[variantId] || 0;
    const price = state.priceByVariantId[variantId] || 0;
    
    const disponivel = Math.max(0, ofertados - prev - draft);
    const valorAcum = price * (prev + draft);
    
    return {
      ofertados,
      prev,
      draft,
      disponivel,
      valorAcum,
    };
  },
}));
