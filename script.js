const QUESTOES = [
    { q: "Qual é o metal líquido em temperatura ambiente?", op: ["Ferro", "Mercúrio", "Chumbo", "Zinco"], c: 1 },
    { q: "Qual país tem o formato parecido com uma bota?", op: ["Espanha", "Grécia", "Itália", "Portugal"], c: 2 },
    { q: "Quantos segundos existem em 2 minutos?", op: ["60", "90", "120", "180"], c: 2 },
    { q: "Qual é o maior deserto quente do mundo?", op: ["Atacama", "Saara", "Gobi", "Kalahari"], c: 1 },
    { q: "Quem pintou a obra Mona Lisa?", op: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], c: 2 },
    { q: "Qual é o satélite natural da Terra?", op: ["Fobos", "Titã", "Lua", "Europa"], c: 2 },
    { q: "Quantos estados possui o Brasil?", op: ["25", "26", "27", "28"], c: 1 },
    { q: "Qual é o animal terrestre mais rápido do mundo?", op: ["Leão", "Guepardo", "Cavalo", "Antílope"], c: 1 },
    { q: "Em qual cidade fica a Torre Eiffel?", op: ["Londres", "Berlim", "Paris", "Roma"], c: 2 },
    { q: "Qual é o resultado de 15 x 4?", op: ["45", "50", "60", "75"], c: 2 },
    { q: "Qual vitamina é produzida pela pele com a luz do sol?", op: ["Vitamina A", "Vitamina B12", "Vitamina C", "Vitamina D"], c: 3 },
    { q: "Qual é o rio mais extenso do mundo em volume de água?", op: ["Nilo", "Amazonas", "Yangtzé", "Mississipi"], c: 1 },
    { q: "Quantas teclas tem um piano padrão?", op: ["66", "76", "88", "96"], c: 2 },
    { q: "Qual gás é essencial para a respiração humana?", op: ["Hélio", "Oxigênio", "Nitrogênio", "Argônio"], c: 1 },
    { q: "Qual é a moeda oficial do Japão?", op: ["Yuan", "Won", "Iene", "Dólar"], c: 2 },
    { q: "Quantos lados tem um octógono?", op: ["6", "7", "8", "9"], c: 2 },
    { q: "Quem foi o primeiro homem a pisar na Lua?", op: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], c: 2 },
    { q: "Qual é o menor país do mundo em área territorial?", op: ["Mônaco", "Vaticano", "San Marino", "Malta"], c: 1 },
    { q: "Qual órgão humano filtra o sangue e produz urina?", op: ["Fígado", "Pâncreas", "Rim", "Baço"], c: 2 },
    { q: "Qual é a velocidade aproximada da luz no vácuo?", op: ["300 mil km/s", "150 mil km/s", "30 mil km/s", "3 mil km/s"], c: 0 }
];

const VALORES = "1000,2000,3000,5000,10000,20000,30000,50000,75000,100000,150000,200000,250000,300000,350000,400000,500000,600000,750000,1000000".split(",").map(Number);

const CHAVE_RANKING = "mega_quiz_milhao_rank";

let jogo = {
    nome: "",
    perguntas: [],
    atual: 0,
    premio: 0,
    ativo: false,
    respondeu: false,
    pulos: 3,
    dobroLivre: true,
    dobroAtivo: false,
    origemRanking: "inicial"
};

function trocarTela(idTela) {
    ["tela-inicial", "tela-jogo", "tela-final", "tela-ranking"].forEach(id => {
        document.getElementById(id).classList.add("escondido");
    });
    document.getElementById(idTela).classList.remove("escondido");
}

function formatarDinheiro(valor) {
    return "R$ " + Number(valor).toLocaleString("pt-BR");
}

function verificarEnter(evento) {
    if (evento.key === "Enter") iniciarJogo();
}

function iniciarJogo() {
    const input = document.getElementById("nome-jogador");
    const apelido = input.value.trim();

    if (!apelido) {
        alert("Por favor, digite seu apelido antes de começar!");
        input.focus();
        return;
    }

    jogo = {
        nome: apelido,
        perguntas: [...QUESTOES].sort(() => Math.random() - 0.5),
        atual: 0,
        premio: 0,
        ativo: true,
        respondeu: false,
        pulos: 3,
        dobroLivre: true,
        dobroAtivo: false,
        origemRanking: "inicial"
    };

    trocarTela("tela-jogo");
    mostrarQuestao();
}

function mostrarQuestao() {
    if (!jogo.ativo) return;
    if (jogo.atual >= jogo.perguntas.length) return encerrarPartida("vitoria");

    jogo.respondeu = false;
    const item = jogo.perguntas[jogo.atual];
    const total = jogo.perguntas.length;

    document.getElementById("numero-pergunta").textContent = `Questão ${jogo.atual + 1} / ${total}`;
    document.getElementById("pontuacao").textContent = `Prêmio: ${formatarDinheiro(jogo.premio)}`;
    document.getElementById("progresso").style.width = `${(jogo.atual / total) * 100}%`;
    document.getElementById("pergunta").textContent = item.q;
    document.getElementById("mensagem").textContent = "";
    document.getElementById("btn-continuar").classList.add("escondido");

    const btnPular = document.getElementById("btn-pular");
    btnPular.disabled = jogo.pulos <= 0;
    btnPular.textContent = `⏭ Pular (${jogo.pulos})`;

    const btnDobro = document.getElementById("btn-dobro");
    btnDobro.disabled = !jogo.dobroLivre || jogo.premio === 0;
    btnDobro.textContent = jogo.dobroAtivo ? "🔥 Dobro ATIVO" : "🔥 Dobro ou Nada";

    const box = document.getElementById("alternativas");
    box.innerHTML = "";

    item.op.forEach((texto, i) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "alternativa";
        botao.textContent = `${String.fromCharCode(65 + i)}) ${texto}`;
        botao.onclick = () => checarResposta(i);
        box.appendChild(botao);
    });
}

function checarResposta(escolha) {
    if (!jogo.ativo || jogo.respondeu) return;
    jogo.respondeu = true;

    const item = jogo.perguntas[jogo.atual];
    const botoes = document.getElementById("alternativas").querySelectorAll("button");
    const acertou = escolha === item.c;

    document.getElementById("btn-pular").disabled = true;
    document.getElementById("btn-dobro").disabled = true;

    botoes.forEach((btn, i) => {
        btn.disabled = true;
        if (i === item.c) btn.classList.add("correta");
        else if (i === escolha) btn.classList.add("errada");
    });

    const msg = document.getElementById("mensagem");

    if (acertou) {
        if (jogo.dobroAtivo) {
            jogo.premio *= 2;
            jogo.dobroAtivo = false;
            msg.textContent = `⚡ SENSACIONAL! Prêmio dobrado para ${formatarDinheiro(jogo.premio)}!`;
        } else {
            jogo.premio = VALORES[jogo.atual];
            msg.textContent = `✅ Resposta certa! Você garantiu ${formatarDinheiro(jogo.premio)}!`;
        }

        document.getElementById("pontuacao").textContent = `Prêmio: ${formatarDinheiro(jogo.premio)}`;
        const btnContinuar = document.getElementById("btn-continuar");
        btnContinuar.textContent = jogo.atual === jogo.perguntas.length - 1 ? "VER RESULTADO 🏆" : "AVANÇAR ➔";
        btnContinuar.classList.remove("escondido");
    } else {
        if (jogo.dobroAtivo) {
            jogo.premio = 0;
            jogo.dobroAtivo = false;
            msg.textContent = "💥 Você arriscou no Dobro ou Nada e perdeu tudo!";
        } else {
            jogo.premio = Math.floor(jogo.premio / 2);
            msg.textContent = `❌ Resposta errada! Você leva metade: ${formatarDinheiro(jogo.premio)}.`;
        }

        document.getElementById("pontuacao").textContent = `Prêmio: ${formatarDinheiro(jogo.premio)}`;
        setTimeout(() => encerrarPartida("derrota"), 2000);
    }
}

function proximaPergunta() {
    jogo.atual++;
    mostrarQuestao();
}

function usarPulo() {
    if (!jogo.ativo || jogo.respondeu || jogo.pulos <= 0) return;
    jogo.pulos--;
    jogo.atual++;
    mostrarQuestao();
}

function ativarDobro() {
    if (!jogo.ativo || jogo.respondeu || !jogo.dobroLivre || jogo.premio === 0) return;
    jogo.dobroLivre = false;
    jogo.dobroAtivo = true;

    const btnDobro = document.getElementById("btn-dobro");
    btnDobro.disabled = true;
    btnDobro.textContent = "🔥 Dobro ATIVO";
    document.getElementById("mensagem").textContent = `⚠️ Dobro ou Nada ativado! Acerte para ganhar ${formatarDinheiro(jogo.premio * 2)} ou erre e zere tudo!`;
}

function desistirJogo() {
    if (!jogo.ativo || jogo.respondeu) return;
    encerrarPartida("desistencia");
}

function encerrarPartida(motivo) {
    jogo.ativo = false;
    jogo.origemRanking = "final";

    const info = {
        vitoria: { titulo: "🏆 VOCÊ ZEROU O JOGO!", texto: `Parabéns, ${jogo.nome}! Você respondeu todas as 20 questões!` },
        desistencia: { titulo: "🏳️ Parada Estratégica!", texto: `Mandou bem, ${jogo.nome}! Você decidiu parar e garantir seu prêmio.` },
        derrota: { titulo: "💔 Fim de Jogo!", texto: `Não foi dessa vez, ${jogo.nome}, tente novamente!` }
    };

    document.getElementById("resultado-titulo").textContent = info[motivo].titulo;
    document.getElementById("resultado-texto").textContent = info[motivo].texto;
    document.getElementById("resultado-premio").textContent = `Prêmio Final: ${formatarDinheiro(jogo.premio)}`;

    if (jogo.premio > 0) {
        const lista = JSON.parse(localStorage.getItem(CHAVE_RANKING) || "[]");
        lista.push({ nome: jogo.nome, premio: jogo.premio, data: new Date().toLocaleDateString("pt-BR") });
        lista.sort((a, b) => b.premio - a.premio);
        localStorage.setItem(CHAVE_RANKING, JSON.stringify(lista.slice(0, 10)));
    }

    trocarTela("tela-final");
}

function voltarInicio() {
    trocarTela("tela-inicial");
}

function abrirRanking(origem) {
    jogo.origemRanking = origem;
    const lista = JSON.parse(localStorage.getItem(CHAVE_RANKING) || "[]");
    const ul = document.getElementById("lista-ranking");
    ul.innerHTML = lista.length === 0 ? "<li>Nenhum jogador registrado ainda.</li>" : "";

    lista.forEach((item, i) => {
        const li = document.createElement("li");
        const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}º`;
        li.textContent = `${medalha} ${item.nome} — ${formatarDinheiro(item.premio)} (${item.data})`;
        ul.appendChild(li);
    });

    trocarTela("tela-ranking");
}

function fecharRanking() {
    trocarTela("tela-" + jogo.origemRanking);
}

function limparRanking() {
    if (confirm("Deseja apagar todo o histórico do ranking?")) {
        localStorage.removeItem(CHAVE_RANKING);
        abrirRanking(jogo.origemRanking);
    }
}

