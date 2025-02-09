// interacao.ts
import { Perfil } from './02_perfil';

export enum TipoInteracao {
    CURTIR = "👍",
    NAO_CURTIR = "👎",
    RISO = "😂",
    SURPRESA = "😮"
}

export class Interacao {
    id: string;
    tipo: TipoInteracao;
    perfil: Perfil;

    constructor(id: string, tipo: TipoInteracao, perfil: Perfil) {
        this.id = id;
        this.tipo = tipo;
        this.perfil = perfil;
    }

    toJSON() {
        return {
            id: this.id,
            tipo: this.tipo,
            perfilId: this.perfil.id // Armazena apenas o ID do perfil
        };
    }
}
