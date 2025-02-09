// perfil.ts
import { Publicacao } from './03_publicacao';
import { AmizadeJaExistenteError, PerfilInativoError, PerfilNaoAutorizadoError } from './01_errors';

export class Perfil {
    id: string;
    apelido: string;
    foto: string;
    email: string;
    status: boolean;
    amigos: Perfil[];
    postagens: Publicacao[];

    constructor(id: string, apelido: string, foto: string, email: string) {
        this.id = id;
        this.apelido = apelido;
        this.foto = foto;
        this.email = email;
        this.status = true; // Ativo por padrão
        this.amigos = [];
        this.postagens = [];
    }

    adicionarAmigo(amigo: Perfil): void {
        if (this.amigos.includes(amigo)) {
            throw new AmizadeJaExistenteError("Amizade já existe!");
        }
        this.amigos.push(amigo);
    }

    removerAmigo(amigo: Perfil): void {
        const index = this.amigos.indexOf(amigo);
        if (index !== -1) {
            this.amigos.splice(index, 1);
        }
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        if (!this.status) {
            throw new PerfilInativoError("Perfil inativo não pode publicar!");
        }
        this.postagens.push(publicacao);
    }

    listarAmigos(): string[] {
        return this.amigos.map(amigo => amigo.apelido);
    }

    listarPostagens(): string[] {
        return this.postagens.map(pub => pub.conteudo);
    }

    ativarDesativar(status: boolean): void {
        this.status = status;
    }

    toJSON() {
        return {
            id: this.id,
            apelido: this.apelido,
            foto: this.foto,
            email: this.email,
            status: this.status,
            amigos: this.amigos.map(amigo => amigo.id), // Armazena apenas IDs para evitar recursão
            postagens: this.postagens.map(pub => pub.id) // Armazena IDs das postagens
        };
    }
}

export class PerfilAvancado extends Perfil {
    habilitarDesabilitarPerfil(perfil: Perfil, status: boolean): void {
        if (!(this instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError("Apenas perfis avançados podem habilitar/desabilitar outros perfis!");
        }
        perfil.ativarDesativar(status);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tipo: 'avancado' 
        };
    }
}
