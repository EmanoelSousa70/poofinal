// redesocial.ts
import * as fs from 'fs';
import { Perfil } from './02_perfil';
import { Publicacao, PublicacaoAvancada } from './03_publicacao';
import { Interacao } from './04_interacao';
import { PerfilJaCadastradoError, PerfilInativoError, AmizadeJaExistenteError } from './01_errors';

export class RedeSocial {
    perfis: Perfil[];
    publicacoes: Publicacao[];
    solicitacoesAmizade: Map<Perfil, Perfil>;

    constructor() {
        this.perfis = [];
        this.publicacoes = [];
        this.solicitacoesAmizade = new Map();
        this.carregarDados(); // Carrega os dados ao iniciar
    }

    adicionarPerfil(perfil: Perfil): void {
        if (this.perfis.some(p => p.id === perfil.id || p.email === perfil.email)) {
            throw new PerfilJaCadastradoError("Perfil já cadastrado!");
        }
        this.perfis.push(perfil);
        this.salvarDados(); 
    }

    buscarPerfilPorEmail(email: string): Perfil | undefined {
        return this.perfis.find(p => p.email === email);
    }

    buscarPerfilPorApelido(apelido: string): Perfil | undefined {
        return this.perfis.find(p => p.apelido === apelido);
    }

    buscarPerfilPorId(id: string): Perfil | undefined {
        return this.perfis.find(p => p.id === id);
    }

    listarTodosPerfis(): Perfil[] {
        return this.perfis;
    }

    adicionarPublicacao(publicacao: Publicacao): void {
        if (!publicacao.perfil.status) {
            throw new PerfilInativoError("Perfil inativo não pode publicar!");
        }
        this.publicacoes.push(publicacao);
        this.salvarDados(); // Salva os dados após adicionar uma publicação
    }

    listarPublicacoes(): Publicacao[] {
        return this.publicacoes;
    }

    enviarSolicitacaoAmizade(remetente: Perfil, destinatario: Perfil): void {
        if (!remetente.status || !destinatario.status) {
            throw new PerfilInativoError("Perfis desativados não podem enviar ou receber solicitações de amizade!");
        }
        if (remetente.amigos.includes(destinatario)) {
            throw new AmizadeJaExistenteError("Amizade já existe!");
        }
        this.solicitacoesAmizade.set(remetente, destinatario);
        this.salvarDados(); // salvar dados sempre que enviar pedido de amizade
    }

    aceitarSolicitacaoAmizade(remetente: Perfil, destinatario: Perfil): void {
        if (!remetente.status || !destinatario.status) {
            throw new PerfilInativoError("Perfis desativados não podem aceitar solicitações de amizade!");
        }
        if (this.solicitacoesAmizade.get(remetente) === destinatario) {
            remetente.adicionarAmigo(destinatario);
            destinatario.adicionarAmigo(remetente);
            this.solicitacoesAmizade.delete(remetente);
            this.salvarDados(); // Salva os dados depois q aceitar a amizade
        }
    }

    recusarSolicitacaoAmizade(remetente: Perfil, destinatario: Perfil): void {
        if (!remetente.status || !destinatario.status) {
            throw new PerfilInativoError("Perfis desativados não podem recusar solicitações de amizade!");
        }
        if (this.solicitacoesAmizade.get(remetente) === destinatario) {
            this.solicitacoesAmizade.delete(remetente);
            this.salvarDados(); // Salva os dados depois q recusar a amizade
        }
    }

    adicionarInteracao(publicacao: PublicacaoAvancada, interacao: Interacao): void {
        if (!interacao.perfil.status) {
            throw new PerfilInativoError("Perfil desativado não pode interagir com publicações!");
        }
        publicacao.adicionarInteracao(interacao);
        this.salvarDados(); // Salva os dados sempre q alguem interagir
    }

    public salvarDados(): void {
        const dados = {
            perfis: this.perfis.map(p => p.toJSON()),
            publicacoes: this.publicacoes.map(p => p.toJSON()),
            solicitacoesAmizade: Array.from(this.solicitacoesAmizade.entries()).map(([r, d]) => [r.id, d.id])
        };

        try {
            fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2));
            console.log('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    public carregarDados(): void {
        if (fs.existsSync('dados.json')) {
            const dados = JSON.parse(fs.readFileSync('dados.json', 'utf-8'));
    
            // Reconstruir perfis
            this.perfis = dados.perfis.map((p: any) => {
                const perfil = new Perfil(p.id, p.apelido, p.foto, p.email);
                perfil.status = p.status;
                return perfil;
            });
    
            // Reconstruir publicações
            this.publicacoes = dados.publicacoes.map((pub: any) => {
                const perfil = this.perfis.find(p => p.id === pub.perfilId)!;
                const publicacao = new Publicacao(pub.id, pub.conteudo, perfil);
                publicacao.dataHora = new Date(pub.dataHora);
                return publicacao;
            });
    
            // Reconstruir solicitações de amizade
            if (Array.isArray(dados.solicitacoesAmizade)) {
                this.solicitacoesAmizade = new Map(
                    dados.solicitacoesAmizade.map(([remetenteId, destinatarioId]: [string, string]) => {
                        const remetente = this.perfis.find(p => p.id === remetenteId)!;
                        const destinatario = this.perfis.find(p => p.id === destinatarioId)!;
                        return [remetente, destinatario];
                    })
                );
            } else {
                this.solicitacoesAmizade = new Map();
            }
        }
    }
    
  
    public obterDados(): { perfis: Perfil[], publicacoes: Publicacao[], solicitacoesAmizade: Map<Perfil, Perfil> } {
        return {
            perfis: this.perfis,
            publicacoes: this.publicacoes,
            solicitacoesAmizade: this.solicitacoesAmizade
        };
    }
}
