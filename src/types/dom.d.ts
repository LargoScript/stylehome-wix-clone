// DOM типи та розширення

export interface HTMLElementWithDataset extends HTMLElement {
  dataset: {
    index?: string;
    bound?: string;
    aos?: string;
    aosDelay?: string;
    aosDuration?: string;
    [key: string]: string | undefined;
  };
}

export interface CarouselTrack extends HTMLElementWithDataset {
  style: CSSStyleDeclaration & {
    transform: string;
    transition: string;
  };
}

export interface ServicesSection extends HTMLElement {
  style: CSSStyleDeclaration & {
    setProperty: (name: string, value: string) => void;
  };
}
