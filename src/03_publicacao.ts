// publicacao.ts
import { Perfil } from './02_perfil';
import { Interacao } from './04_interacao';
import { InteracaoDuplicadaError } from './01_errors';

export class Publicacao {
    id: string;
    conteudo: string;
    dataHora: Date;
    perfil: Perfil;

    constructor(id: string, conteudo: string, perfil: Perfil) {
        this.id = id;
        this.conteudo = conteudo;
        this.dataHora = new Date();
        this.perfil = perfil;
    }

    toJSON() {
        return {
            id: this.id,
            conteudo: this.conteudo,
            dataHora: this.dataHora.toISOString(), //  Date para string
            perfilId: this.perfil.id // Armazena  o ID do perfil
        };
    }
}

export class PublicacaoAvancada extends Publicacao {
    interacoes: Interacao[];

    constructor(id: string, conteudo: string, perfil: Perfil) {
        super(id, conteudo, perfil);
        this.interacoes = [];
    }

    adicionarInteracao(interacao: Interacao): void {
        if (this.interacoes.some(i => i.perfil === interacao.perfil)) {
            throw new InteracaoDuplicadaError("Usuário já interagiu com esta publicação!");
        }
        this.interacoes.push(interacao);
    }

    listarInteracoes(): string[] {
        return this.interacoes.map(i => `${i.perfil.apelido} ${i.tipo}`);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tipo: 'avancada', 
            interacoes: this.interacoes.map(i => i.toJSON()) 
        };
    }
}
