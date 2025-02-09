import * as fs from 'fs';
import * as readline from 'readline';
import { RedeSocial } from './05_redesocial';
import { Perfil, PerfilAvancado } from './02_perfil';
import { Publicacao, PublicacaoAvancada } from './03_publicacao';
import { Interacao, TipoInteracao } from './04_interacao';
import { PerfilInativoError, ValorInvalidoException } from './01_errors';

function salvarDados(): void {
    const dados = redeSocial.obterDados();
    fs.writeFileSync('dados.json', JSON.stringify(dados, null, 2), 'utf-8');
    console.log("Dados salvos com sucesso em dados.json!");
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const redeSocial = new RedeSocial();
redeSocial.carregarDados();

rl.on('SIGINT', () => {
    console.log('\n\n** Ctrl+C pressionado. Voltando ao menu principal... **\n');
    menuPrincipal();
});

rl.on('close', () => {
    console.log('\nEncerrando a aplicação...');
    process.exit(0);
});

function menuPrincipal(): void {
    console.log("\n--- Rede Social ---");
    console.log("1. Adicionar Perfil");
    console.log("2. Buscar Perfil");
    console.log("3. Listar Perfis");
    console.log("4. Adicionar Publicação");
    console.log("5. Enviar Solicitação de Amizade");
    console.log("6. Aceitar Solicitação de Amizade");
    console.log("7. Recusar Solicitação de Amizade");
    console.log("8. Listar Publicações");
    console.log("9. Interagir com Publicação");
    console.log("10. Menu Perfil Avançado");
    console.log("0. Sair");

    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case '1':
                adicionarPerfil();
                break;
            case '2':
                buscarPerfil();
                break;
            case '3':
                listarPerfis();
                break;
            case '4':
                adicionarPublicacao();
                break;
            case '5':
                enviarSolicitacaoAmizade();
                break;
            case '6':
                aceitarSolicitacaoAmizade();
                break;
            case '7':
                recusarSolicitacaoAmizade();
                break;
            case '8':
                listarPublicacoes();
                break;
            case '9':
                interagirPublicacao();
                break;
            case '10':
                menuPerfilAvancado();
                break;
            case '0':
                rl.close();  
                break;
            default:
                console.log("Opção inválida!");
                menuPrincipal();
                break;
        }
    });
}

function adicionarPerfil(): void {
    rl.question("ID do perfil: ", (id) => {
        rl.question("Apelido: ", (apelido) => {
            rl.question("Foto (emoji): ", (foto) => {
                rl.question("Email: ", (email) => {
                    rl.question("É um perfil avançado? (S/N): ", (resposta) => {
                        try {
                            let perfil: Perfil;
                            if (resposta.toUpperCase() === 'S') {
                                perfil = new PerfilAvancado(id, apelido, foto, email);
                            } else {
                                perfil = new Perfil(id, apelido, foto, email);
                            }
                            redeSocial.adicionarPerfil(perfil);
                            console.log("Perfil adicionado com sucesso!");

                            // Salvar os dados após adicionar o perfil
                            salvarDados();
                        } catch (error: unknown) {
                            if (error instanceof Error) {
                                console.error(error.message);
                            } else {
                                console.error("Erro desconhecido");
                            }
                        }
                        menuPrincipal();
                    });
                });
            });
        });
    });
}

function buscarPerfil(): void {
    rl.question("Buscar por (1 - Email, 2 - Apelido, 3 - ID): ", (opcao) => {
        switch (opcao) {
            case '1':
                rl.question("Email: ", (email) => {
                    const perfil = redeSocial.buscarPerfilPorEmail(email);
                    if (perfil) {
                        console.log(`Perfil encontrado: ${perfil.apelido}`);
                    } else {
                        console.log("Perfil não encontrado!");
                    }
                    menuPrincipal();
                });
                break;
            case '2':
                rl.question("Apelido: ", (apelido) => {
                    const perfil = redeSocial.buscarPerfilPorApelido(apelido);
                    if (perfil) {
                        console.log(`Perfil encontrado: ${perfil.apelido}`);
                    } else {
                        console.log("Perfil não encontrado!");
                    }
                    menuPrincipal();
                });
                break;
            case '3':
                rl.question("ID: ", (id) => {
                    const perfil = redeSocial.buscarPerfilPorId(id);
                    if (perfil) {
                        console.log(`Perfil encontrado: ${perfil.apelido}`);
                    } else {
                        console.log("Perfil não encontrado!");
                    }
                    menuPrincipal();
                });
                break;
            default:
                console.log("Opção inválida!");
                menuPrincipal();
                break;
        }
    });
}

function listarPerfis(): void {
    const perfis = redeSocial.listarTodosPerfis();
    perfis.forEach(p => console.log(`ID: ${p.id}, Apelido: ${p.apelido}, Email: ${p.email}, Status: ${p.status ? "Ativo" : "Inativo"}`));
    menuPrincipal();
}

function adicionarPublicacao(): void {
    rl.question("ID da publicação: ", (id) => {
        rl.question("Conteúdo: ", (conteudo) => {
            rl.question("ID do perfil: ", (perfilId) => {
                const perfil = redeSocial.buscarPerfilPorId(perfilId);
                if (!perfil) {
                    console.log("Perfil não encontrado!");
                    return menuPrincipal();
                }

                try {
                    if (!perfil.status) {
                        throw new PerfilInativoError("Perfil inativo não pode publicar!");
                    }

                    rl.question("É uma publicação avançada? (S/N): ", (resposta) => {
                        try {
                            let publicacao: Publicacao;
                            if (resposta.toUpperCase() === 'S') {
                                publicacao = new PublicacaoAvancada(id, conteudo, perfil);
                            } else {
                                publicacao = new Publicacao(id, conteudo, perfil);
                            }
                            redeSocial.adicionarPublicacao(publicacao);
                            console.log("Publicação adicionada com sucesso!");

                            // Salvar os dados após adicionar a publicação
                            salvarDados();
                        } catch (error: unknown) {
                            if (error instanceof Error) {
                                console.error(error.message);
                            } else {
                                console.error("Erro desconhecido ao adicionar publicação.");
                            }
                        }
                        menuPrincipal();
                    });
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.error(error.message);
                    } else {
                        console.error("Erro desconhecido ao verificar o status do perfil.");
                    }
                    menuPrincipal();
                }
            });
        });
    });
}


function enviarSolicitacaoAmizade(): void {
    rl.question("ID do remetente: ", (remetenteId) => {
        const remetente = redeSocial.buscarPerfilPorId(remetenteId);
        if (remetente) {
            if (!remetente.status) {
                console.log("Erro: Perfil desativado não pode enviar solicitações de amizade!");
                return menuPrincipal();
            }

            rl.question("ID do destinatário: ", (destinatarioId) => {
                const destinatario = redeSocial.buscarPerfilPorId(destinatarioId);
                if (destinatario) {
                    if (!destinatario.status) {
                        console.log("Erro: Perfil desativado não pode receber solicitações de amizade!");
                        return menuPrincipal();
                    }

                    try {
                        redeSocial.enviarSolicitacaoAmizade(remetente, destinatario);
                        console.log(`Solicitação de amizade enviada para ${destinatario.apelido}`);
                    } catch (error: unknown) {
                        if (error instanceof Error) {
                            console.error(error.message);
                        } else {
                            console.error("Erro desconhecido ao enviar a solicitação de amizade.");
                        }
                    }
                } else {
                    console.log("Destinatário não encontrado!");
                }
                menuPrincipal();
            });
        } else {
            console.log("Remetente não encontrado!");
            menuPrincipal();
        }
    });
}

function aceitarSolicitacaoAmizade(): void {
    rl.question("ID do remetente: ", (remetenteId) => {
        const remetente = redeSocial.buscarPerfilPorId(remetenteId);
        if (remetente) {
            if (!remetente.status) {
                console.log("Erro: Perfil desativado não pode aceitar solicitações de amizade!");
                return menuPrincipal();
            }

            rl.question("ID do destinatário: ", (destinatarioId) => {
                const destinatario = redeSocial.buscarPerfilPorId(destinatarioId);
                if (destinatario) {
                    if (!destinatario.status) {
                        console.log("Erro: Perfil desativado não pode aceitar solicitações de amizade!");
                        return menuPrincipal();
                    }

                    rl.question(`Você deseja aceitar a solicitação de amizade de ${remetente.apelido}? (S/N): `, (resposta) => {
                        if (resposta.toUpperCase() === 'S') {
                            try {
                                redeSocial.aceitarSolicitacaoAmizade(remetente, destinatario);
                                console.log("Solicitação de amizade aceita!");
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.error(error.message);
                                } else {
                                    console.error("Erro desconhecido ao aceitar a solicitação de amizade.");
                                }
                            }
                        } else {
                            console.log("Solicitação de amizade não aceita.");
                        }
                        menuPrincipal();
                    });
                } else {
                    console.log("Destinatário não encontrado!");
                    menuPrincipal();
                }
            });
        } else {
            console.log("Remetente não encontrado!");
            menuPrincipal();
        }
    });
}

function recusarSolicitacaoAmizade(): void {
    rl.question("ID do remetente: ", (remetenteId) => {
        const remetente = redeSocial.buscarPerfilPorId(remetenteId);
        if (remetente) {
            if (!remetente.status) {
                console.log("Erro: Perfil desativado não pode recusar solicitações de amizade!");
                return menuPrincipal();
            }

            rl.question("ID do destinatário: ", (destinatarioId) => {
                const destinatario = redeSocial.buscarPerfilPorId(destinatarioId);
                if (destinatario) {
                    if (!destinatario.status) {
                        console.log("Erro: Perfil desativado não pode recusar solicitações de amizade!");
                        return menuPrincipal();
                    }

                    rl.question(`Você deseja recusar a solicitação de amizade de ${remetente.apelido}? (S/N): `, (resposta) => {
                        if (resposta.toUpperCase() === 'S') {
                            try {
                                redeSocial.recusarSolicitacaoAmizade(remetente, destinatario);
                                console.log("Solicitação de amizade recusada!");
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.error(error.message);
                                } else {
                                    console.error("Erro desconhecido ao recusar a solicitação de amizade.");
                                }
                            }
                        } else {
                            console.log("Solicitação de amizade não recusada.");
                        }
                        menuPrincipal();
                    });
                } else {
                    console.log("Destinatário não encontrado!");
                    menuPrincipal();
                }
            });
        } else {
            console.log("Remetente não encontrado!");
            menuPrincipal();
        }
    });
}

function listarPublicacoes(): void {
    const publicacoes = redeSocial.listarPublicacoes();
    publicacoes.forEach(pub => {
        console.log(`ID: ${pub.id}, Conteúdo: ${pub.conteudo}, Autor: ${pub.perfil.apelido}`);
        if (pub instanceof PublicacaoAvancada) {
            console.log(`Interações: ${pub.listarInteracoes().join(", ")}`);
        }
    });
    menuPrincipal();
}

function interagirPublicacao(): void {
    const publicacoesAvancadas = redeSocial.listarPublicacoes().filter(pub => pub instanceof PublicacaoAvancada) as PublicacaoAvancada[];
    if (publicacoesAvancadas.length === 0) {
        console.log("Nenhuma publicação avançada disponível para interação.");
        menuPrincipal();
        return;
    }

    console.log("Publicações avançadas disponíveis:");
    publicacoesAvancadas.forEach(pub => {
        console.log(`ID: ${pub.id}, Conteúdo: ${pub.conteudo}, Autor: ${pub.perfil.apelido}`);
    });

    rl.question("ID da publicação: ", (publicacaoId) => {
        const publicacao = publicacoesAvancadas.find(pub => pub.id === publicacaoId);
        if (publicacao) {
            rl.question("ID do perfil que vai interagir: ", (perfilId) => {
                const perfil = redeSocial.buscarPerfilPorId(perfilId);
                if (perfil) {
                    if (!perfil.status) {
                        console.log("Erro: Perfil desativado não pode interagir com publicações!");
                        return menuPrincipal();
                    }

                    rl.question("Tipo de interação (CURTIR, NAO_CURTIR, RISO, SURPRESA): ", (tipo) => {
                        try {
                            // se digitar minusculo ele vai colocar para maisculo
                            const tipoInteracao = tipo.toUpperCase() as keyof typeof TipoInteracao;

                            // ver se o tipo de interação esta dentro das que tem disponiveis
                            if (!(tipoInteracao in TipoInteracao)) {
                                throw new ValorInvalidoException("Tipo de interação inválido!");
                            }

                            const interacao = new Interacao(
                                Math.random().toString(36).substring(7),
                                TipoInteracao[tipoInteracao],
                                perfil
                            );
                            redeSocial.adicionarInteracao(publicacao, interacao);
                            console.log("Interação adicionada com sucesso!");
                        } catch (error: unknown) {
                            if (error instanceof Error) {
                                console.error(error.message);
                            } else {
                                console.error("Erro desconhecido ao interagir com a publicação.");
                            }
                        }
                        menuPrincipal();
                    });
                } else {
                    console.log("Perfil não encontrado!");
                    menuPrincipal();
                }
            });
        } else {
            console.log("Publicação não encontrada!");
            menuPrincipal();
        }
    });
}

function menuPerfilAvancado(): void {
    console.log("\n--- Menu Perfil Avançado ---");
    console.log("1. Habilitar Perfil");
    console.log("2. Desabilitar Perfil");
    console.log("0. Voltar ao Menu Principal");

    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case '1':
                habilitarPerfil();
                break;
            case '2':
                desabilitarPerfil();
                break;
            case '0':
                menuPrincipal();
                break;
            default:
                console.log("Opção inválida!");
                menuPerfilAvancado();
                break;
        }
    });
}

function habilitarPerfil(): void {
    rl.question("ID do perfil avançado: ", (perfilAvancadoId) => {
        const perfilAvancado = redeSocial.buscarPerfilPorId(perfilAvancadoId);
        if (perfilAvancado && perfilAvancado instanceof PerfilAvancado) {
            rl.question("ID do perfil a ser habilitado: ", (perfilId) => {
                const perfil = redeSocial.buscarPerfilPorId(perfilId);
                if (perfil) {
                    rl.question(`Você deseja habilitar o perfil ${perfil.apelido}? (S/N): `, (resposta) => {
                        if (resposta.toUpperCase() === 'S') {
                            try {
                                perfilAvancado.habilitarDesabilitarPerfil(perfil, true);
                                console.log("Perfil habilitado com sucesso!");
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.error(error.message);
                                } else {
                                    console.error("Erro desconhecido ao tentar habilitar o perfil.");
                                }
                            }
                        } else {
                            console.log("Operação cancelada.");
                        }
                        menuPerfilAvancado();
                    });
                } else {
                    console.log("Perfil não encontrado!");
                    menuPerfilAvancado();
                }
            });
        } else {
            console.log("Perfil avançado não encontrado ou não tem permissão!");
            menuPerfilAvancado();
        }
    });
}

function desabilitarPerfil(): void {
    rl.question("ID do perfil avançado: ", (perfilAvancadoId) => {
        const perfilAvancado = redeSocial.buscarPerfilPorId(perfilAvancadoId);
        if (perfilAvancado && perfilAvancado instanceof PerfilAvancado) {
            rl.question("ID do perfil a ser desabilitado: ", (perfilId) => {
                const perfil = redeSocial.buscarPerfilPorId(perfilId);
                if (perfil) {
                    rl.question(`Você deseja desabilitar o perfil ${perfil.apelido}? (S/N): `, (resposta) => {
                        if (resposta.toUpperCase() === 'S') {
                            try {
                                perfilAvancado.habilitarDesabilitarPerfil(perfil, false);
                                console.log("Perfil desabilitado com sucesso!");
                            } catch (error: unknown) {
                                if (error instanceof Error) {
                                    console.error(error.message);
                                } else {
                                    console.error("Erro desconhecido ao tentar desabilitar o perfil.");
                                }
                            }
                        } else {
                            console.log("Operação cancelada.");
                        }
                        menuPerfilAvancado();
                    });
                } else {
                    console.log("Perfil não encontrado!");
                    menuPerfilAvancado();
                }
            });
        } else {
            console.log("Perfil avançado não encontrado ou não tem permissão!");
            menuPerfilAvancado();
        }
    });
}

// Iniciar 
menuPrincipal();