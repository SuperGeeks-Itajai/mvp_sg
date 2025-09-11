DROP SCHEMA IF EXISTS escola CASCADE;
CREATE SCHEMA escola;

-- Usuário: base para alunos e funcionários
CREATE TABLE escola.usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aluno', 'funcionario')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Módulo
CREATE TABLE escola.modulo (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- Aluno (herda de usuário)
CREATE TABLE escola.aluno (
    id INT PRIMARY KEY REFERENCES escola.usuario(id) ON DELETE CASCADE,
    turma VARCHAR(50),
    modulo_atual INT REFERENCES escola.modulo(id)
);

-- Funcionário (herda de usuário)
CREATE TABLE escola.funcionario (
    id INT PRIMARY KEY REFERENCES escola.usuario(id) ON DELETE CASCADE,
    cargo VARCHAR(50) NOT NULL
);

-- Aula
CREATE TABLE escola.aula (
    id SERIAL PRIMARY KEY,
    modulo_id INT REFERENCES escola.modulo(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    conteudo TEXT,
    ordem INT NOT NULL,
    resumo TEXT,
    CONSTRAINT ordem_unica_por_modulo UNIQUE (modulo_id, ordem)
);

-- Histórico de atividades concluídas por alunos
CREATE TABLE escola.historico (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES escola.aluno(id) ON DELETE CASCADE,
    aula_id INT REFERENCES escola.aula(id) ON DELETE CASCADE,
    concluido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historico_unico UNIQUE (aluno_id, aula_id)
);

-- Faltas dos alunos (substitui array de datas)
CREATE TABLE escola.falta (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES escola.aluno(id) ON DELETE CASCADE,
    data DATE NOT NULL
);
