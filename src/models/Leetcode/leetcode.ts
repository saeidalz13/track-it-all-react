export interface IAttempts {
  solved: boolean;
  notes?: string;
}

export interface ILeetcode {
  id: string;
  title: string;
  difficulty: string;
  link: string;
  accRate: number;
  attempts: Array<IAttempts>;
}
