export class Assignment {
    _id!: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
    note?: number;
    remarques?: string;
    instruction!: string;
}
