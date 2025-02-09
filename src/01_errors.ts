export class PerfilJaCadastradoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilJaCadastradoError";
    }
}

export class PerfilNaoAutorizadoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilNaoAutorizadoError";
    }
}

export class PerfilInativoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilInativoError";
    }
}

export class InteracaoDuplicadaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InteracaoDuplicadaError";
    }
}

export class AmizadeJaExistenteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AmizadeJaExistenteError";
    }
}

export class ValorInvalidoException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValorInvalidoException";
    }
}