export interface BookChapter {
  number: number;
  title: string;
  href: string;
}

export interface EpubBook {
  id: string;
  title: string;
  author: string;
  chapters: BookChapter[];
}

export interface EpubChapter {
  number: number;
  title: string;
  href: string;
}