export interface IAttempts {
  solved: boolean;
  notes?: string;
  language: string;
  createdAt: Date;
}

export interface ILeetcodeTag {
  tag: string;
  link: string;
}

export interface ILeetcode {
  id: number;
  title: string;
  difficulty: string;
  link: string;
  accRate: number;
  attempts: Array<IAttempts>;
  tags: Array<ILeetcodeTag>;
}
