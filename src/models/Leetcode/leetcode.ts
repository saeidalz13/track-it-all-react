export interface IAttempts {
  solved: boolean;
  notes?: string;
  language: string;
  createdAt: Date;
}

export interface ILeetcode {
  id: number;
  title: string;
  difficulty: string;
  link: string;
  accRate: number;
  attempts: Array<IAttempts>;
}
