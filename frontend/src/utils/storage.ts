export const STORAGE_KEYS = {
  VIEW_TYPE: 'product_view_type'
} as const;

export const getStoredViewType = (): 'grid' | 'list' | 'detailed' => {
  const storedView = localStorage.getItem(STORAGE_KEYS.VIEW_TYPE);
  return (storedView as 'grid' | 'list' | 'detailed') || 'grid';
};

export const setStoredViewType = (viewType: 'grid' | 'list' | 'detailed'): void => {
  localStorage.setItem(STORAGE_KEYS.VIEW_TYPE, viewType);
}; 