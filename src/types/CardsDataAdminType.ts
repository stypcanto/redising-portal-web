export type CardType = {
    title: string;
    description: string;
    icon: string;  // Nueva propiedad para el ícono
  };
  
  export type CardsDataAdminType = {
    DireccionGeneral: CardType[];
    SDGT: CardType[];
    SDRIST: CardType[];
    DireccionDespacho: CardType[];
  };
  