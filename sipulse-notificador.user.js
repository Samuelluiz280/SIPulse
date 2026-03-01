// ==UserScript==
// @name         Sipulse Omnipresente: v2.4
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Duplo Visor, Transferência Automática 
// @match        *://*/*
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';

    const isSipulseTab = window.location.href.includes("hpbx01.brasiltecpar.com.br");

    // ==========================================
    // 1. ESTILOS VISUAIS 
    // ==========================================
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        #omni-botao {
            position: fixed; bottom: 20px; right: 20px; width: 70px; height: 70px;
            background-color: rgba(11, 25, 44, 0.9); border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            cursor: grab; z-index: 2147483647; user-select: none;
            transition: all 0.3s ease; backdrop-filter: blur(5px);
            border: 2px solid #00f0ff;
            box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.4);
        }
        #omni-botao:active { cursor: grabbing; transform: scale(0.95); box-shadow: 0 0 25px #00f0ff, inset 0 0 20px #00f0ff; }
        #omni-botao:hover { transform: scale(1.05); box-shadow: 0 0 20px #00f0ff, inset 0 0 15px #00f0ff; }

        #omni-painel {
            position: fixed; bottom: 100px; right: 20px; width: 270px;
            background-color: rgba(11, 25, 44, 0.95); border-radius: 12px; overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0, 240, 255, 0.2);
            display: none; z-index: 2147483647; backdrop-filter: blur(8px);
            font-family: 'Segoe UI', Arial, sans-serif;
            border: 1px solid #00f0ff;
        }

        .omni-header {
            background-color: transparent; padding: 10px; text-align: center;
            color: #00f0ff; font-size: 12px; font-weight: bold;
            border-bottom: 1px solid rgba(0, 240, 255, 0.4);
            text-shadow: 0 0 5px #00f0ff;
        }
        #omni-ramal-texto { color: #39ff14; text-shadow: 0 0 5px #39ff14; font-size: 14px; }

        #omni-tela-teclado { padding: 15px 20px 20px 20px; }

        /* VISOR 1: LIGAR (AZUL) */
        .omni-visor-bg {
            background-color: rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; margin-bottom: 10px;
            border: 1px solid rgba(0, 240, 255, 0.5); box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
        }
        .omni-input {
            width: 100%; height: 30px; font-size: 22px; color: #00f0ff; text-align: center;
            background: transparent; border: none; outline: none; font-weight: bold;
            letter-spacing: 3px; text-shadow: 0 0 8px #00f0ff;
        }
        .omni-input::placeholder { color: rgba(0, 240, 255, 0.3); text-shadow: none; font-weight: normal; font-size: 14px;}

        /* VISOR 2: TRANSFERIR (MAGENTA) */
        .omni-visor-bg.transfer {
            border: 1px solid rgba(176, 38, 255, 0.5); box-shadow: inset 0 0 10px rgba(176, 38, 255, 0.1);
            margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .omni-input.transfer { color: #b026ff; text-shadow: 0 0 8px #b026ff; }
        .omni-input.transfer::placeholder { color: rgba(176, 38, 255, 0.3); }

        #omni-btn-transferir {
            background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
            padding: 5px; transition: all 0.2s; border-radius: 50%; outline: none;
        }
        #omni-btn-transferir:hover { background: rgba(176, 38, 255, 0.2); box-shadow: 0 0 10px #b026ff; }
        #omni-btn-transferir:active { transform: scale(0.9); }

        /* GRADE E BOTÕES NUMÉRICOS */
        .omni-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .omni-btn-num {
            background: rgba(0, 240, 255, 0.05); color: #00f0ff; border: 1px solid #00f0ff;
            border-radius: 8px; padding: 12px 0; font-size: 18px; font-weight: bold; cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 240, 255, 0.3), inset 0 0 5px rgba(0, 240, 255, 0.2);
            text-shadow: 0 0 5px #00f0ff; transition: all 0.2s;
        }
        .omni-btn-num:hover { background: rgba(0, 240, 255, 0.2); box-shadow: 0 0 15px #00f0ff, inset 0 0 10px #00f0ff; }
        .omni-btn-num:active { transform: scale(0.95); box-shadow: 0 0 20px #00f0ff, inset 0 0 15px #00f0ff; background: rgba(0, 240, 255, 0.4);}

        .omni-linha-acao { display: flex; justify-content: space-between; margin-top: 20px; align-items: center; }
        .omni-btn-acao { border-radius: 50%; width: 55px; height: 55px; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; background: transparent; }

        #omni-btn-ligar { border: 2px solid #39ff14; box-shadow: 0 0 10px rgba(57, 255, 20, 0.5), inset 0 0 10px rgba(57, 255, 20, 0.3); }
        #omni-btn-ligar svg { filter: drop-shadow(0 0 3px #39ff14); }
        #omni-btn-ligar:hover { background: rgba(57, 255, 20, 0.2); box-shadow: 0 0 20px #39ff14, inset 0 0 15px #39ff14; }
        #omni-btn-ligar:active { transform: scale(0.95); }

        #omni-btn-desligar { border: 2px solid #ff073a; box-shadow: 0 0 10px rgba(255, 7, 58, 0.5), inset 0 0 10px rgba(255, 7, 58, 0.3); }
        #omni-btn-desligar svg { filter: drop-shadow(0 0 3px #ff073a); }
        #omni-btn-desligar:hover { background: rgba(255, 7, 58, 0.2); box-shadow: 0 0 20px #ff073a, inset 0 0 15px #ff073a; }
        #omni-btn-desligar:active { transform: scale(0.95); }

        #omni-btn-apagar { border: 2px solid #00f0ff; width: 45px; height: 45px; color:#00f0ff; font-weight:bold; font-size:18px; text-shadow: 0 0 5px #00f0ff; box-shadow: 0 0 8px rgba(0, 240, 255, 0.5), inset 0 0 8px rgba(0, 240, 255, 0.3);}
        #omni-btn-apagar:hover { background: rgba(0, 240, 255, 0.2); box-shadow: 0 0 15px #00f0ff, inset 0 0 10px #00f0ff; }
        #omni-btn-apagar:active { transform: scale(0.95); }

        #omni-tela-chamada { padding: 40px 20px; text-align: center; display: none; background: transparent; }
        .omni-piscar { animation: omni-piscar-anim 1s infinite alternate; }
        @keyframes omni-piscar-anim {
            from { color: #ff073a; text-shadow: 0 0 10px #ff073a; }
            to { color: #fff; text-shadow: 0 0 20px #ff073a, 0 0 30px #ff073a; }
        }
        #omni-titulo-chamada { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        #omni-nome-chamador { font-size: 22px; color: white; font-weight: bold; margin-bottom: 40px; word-wrap: break-word; text-shadow: 0 0 8px #fff;}

        #omni-btn-atender {
            background: rgba(57, 255, 20, 0.1); color: #39ff14; border: 2px solid #39ff14;
            border-radius: 50px; padding: 15px 20px; font-size: 20px; font-weight: bold; cursor: pointer;
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.5), inset 0 0 15px rgba(57, 255, 20, 0.3);
            text-shadow: 0 0 5px #39ff14; width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.2s;
        }
        #omni-btn-atender svg { filter: drop-shadow(0 0 3px #39ff14); }
        #omni-btn-atender:hover { background: rgba(57, 255, 20, 0.3); box-shadow: 0 0 25px #39ff14, inset 0 0 20px #39ff14; }
        #omni-btn-atender:active { transform: scale(0.95); }
    `;
    document.head.appendChild(estilo);


    // 2. INJETAR HTML NA PÁGINA
    
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = `
        <div id="omni-botao" title="Sipulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 35px; height: 35px; filter: drop-shadow(0px 0px 4px #00f0ff); pointer-events: none;">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        </div>

        <div id="omni-painel">
            <div class="omni-header">SIPULSE OMNI | <span id="omni-ramal-texto">Buscando...</span></div>

            <div id="omni-tela-teclado">

                <div class="omni-visor-bg">
                    <input type="text" id="omni-visor" class="omni-input" placeholder="LIGAR PARA..." autocomplete="off"/>
                </div>

                <div class="omni-visor-bg transfer">
                    <input type="text" id="omni-visor-transfer" class="omni-input transfer" placeholder="TRANSFERIR..." autocomplete="off"/>
                    <button id="omni-btn-transferir" title="Executar Transferência Direta">
                        <svg fill="#b026ff" viewBox="0 0 24 24" width="28px" height="28px" style="filter: drop-shadow(0 0 3px #b026ff);">
                            <path d="M16 11l-4-4v3H8c-2.76 0-5 2.24-5 5v2h2v-2c0-1.65 1.35-3 3-3h4v3l4-4z"/>
                        </svg>
                    </button>
                </div>

                <div class="omni-grade">
                    <button class="omni-btn-num">1</button><button class="omni-btn-num">2</button><button class="omni-btn-num">3</button>
                    <button class="omni-btn-num">4</button><button class="omni-btn-num">5</button><button class="omni-btn-num">6</button>
                    <button class="omni-btn-num">7</button><button class="omni-btn-num">8</button><button class="omni-btn-num">9</button>
                    <button class="omni-btn-num">*</button><button class="omni-btn-num">0</button><button class="omni-btn-num">#</button>
                </div>

                <div class="omni-linha-acao">
                    <button id="omni-btn-apagar" class="omni-btn-acao" title="Apagar">X</button>
                    <button id="omni-btn-desligar" class="omni-btn-acao" title="Encerrar Chamada Ativa">
                        <svg fill="#ff073a" viewBox="0 0 24 24" width="28px" height="28px"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                    </button>
                    <button id="omni-btn-ligar" class="omni-btn-acao" title="Fazer Ligação (Visor Azul)">
                        <svg fill="#39ff14" viewBox="0 0 24 24" width="28px" height="28px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </button>
                </div>
            </div>

            <div id="omni-tela-chamada">
                <div id="omni-titulo-chamada" class="omni-piscar">⚠️ ALERTA DE CHAMADA</div>
                <div id="omni-nome-chamador">Desconhecido</div>
                <button id="omni-btn-atender">
                    <svg fill="#39ff14" viewBox="0 0 24 24" width="24px" height="24px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    ATENDER
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(divWrapper);

    
    // 3. LÓGICA DE ARRASTAR O BOTÃO (DRAG & DROP)
    
    const botao = document.getElementById('omni-botao');
    const painel = document.getElementById('omni-painel');
    let isDragging = false;
    let dragStartX, dragStartY, initialLeft, initialTop;

    botao.addEventListener('mousedown', (e) => {
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = botao.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            isDragging = true;
            botao.style.left = (initialLeft + dx) + 'px';
            botao.style.top = (initialTop + dy) + 'px';
            botao.style.bottom = 'auto';
            botao.style.right = 'auto';
        }
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (!isDragging) {
            painel.style.display = painel.style.display === 'block' ? 'none' : 'block';
            if(painel.style.display === 'block') document.getElementById('omni-visor').focus();
        }
    }

    
    // 4. LÓGICA DOS VISORES E TECLADO
    
    const visorLigar = document.getElementById('omni-visor');
    const visorTransferir = document.getElementById('omni-visor-transfer');
    let inputAtivo = visorLigar; // Padrão é o campo de ligar

    // Descobre qual visor você clicou para o teclado físico enviar os números
    visorLigar.addEventListener('focus', () => inputAtivo = visorLigar);
    visorTransferir.addEventListener('focus', () => inputAtivo = visorTransferir);

    // Digita no visor que está ativo
    document.querySelectorAll('.omni-btn-num').forEach(btn => {
        btn.addEventListener('click', (e) => {
            inputAtivo.value += e.target.innerText;
            inputAtivo.focus();
        });
    });

    // Apaga do visor que está ativo
    document.getElementById('omni-btn-apagar').addEventListener('click', () => {
        inputAtivo.value = '';
        inputAtivo.focus();
    });

    // Função de ligar no Enter (para o campo Azul)
    visorLigar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-ligar').click(); }
    });

    // Função de Transferir no Enter (para o campo Magenta)
    visorTransferir.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-transferir').click(); }
    });

    // AÇÃO: Ligar
    document.getElementById('omni-btn-ligar').addEventListener('click', () => {
        if(visorLigar.value.length > 0) {
            GM_setValue('omni_comando', { acao: 'ligar', numero: visorLigar.value, ts: Date.now() });
            painel.style.display = 'none';
            visorLigar.value = '';
        }
    });

    // AÇÃO: Transferir (A MÁGICA ACONTECE AQUI)
    document.getElementById('omni-btn-transferir').addEventListener('click', () => {
        const ramal = visorTransferir.value;
        if(ramal.length > 0) {
            // Envia o comando informando qual é o ramal, o script do outro lado cuida do resto!
            GM_setValue('omni_comando', { acao: 'transferir', numero: ramal, ts: Date.now() });
            painel.style.display = 'none';
            visorTransferir.value = '';
        }
    });

    // AÇÃO: Desligar e Atender
    document.getElementById('omni-btn-desligar').addEventListener('click', () => {
        GM_setValue('omni_comando', { acao: 'desligar', ts: Date.now() });
        painel.style.display = 'none';
    });
    document.getElementById('omni-btn-atender').addEventListener('click', () => {
        GM_setValue('omni_comando', { acao: 'atender', ts: Date.now() });
        painel.style.display = 'none';
    });

    // ==========================================
    // 5. O CÉREBRO E TELEPATIA (SINCRONIZAÇÃO)
    // ==========================================
    const ramalSalvo = GM_getValue('omni_ramal', '');
    if (ramalSalvo) document.getElementById('omni-ramal-texto').innerText = "RAMAL: " + ramalSalvo;

    GM_addValueChangeListener('omni_ramal', (nome, antigo, novo) => {
        if (novo) document.getElementById('omni-ramal-texto').innerText = "RAMAL: " + novo;
    });

    // ---> SE ESTA ABA FOR A ABA DO SIPULSE (MOTOR) <---
    if (isSipulseTab) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") { Notification.requestPermission(); }
        let estadoChamada = false;
        let notificacaoJaDisparada = false;

        setInterval(() => {
            const matchRamal = document.body.innerText.match(/Ramal:\s*(\d+)/i);
            if(matchRamal) { GM_setValue('omni_ramal', matchRamal[1]); }
        }, 5000);

        const observer = new MutationObserver(() => {
            const textoDaTela = document.body.innerText;
            if (textoDaTela.includes("Recebendo chamada de") && !estadoChamada) {
                estadoChamada = true;
                const matchNome = textoDaTela.match(/Recebendo chamada de\s+([^\n]+)/);
                const caller = matchNome ? matchNome[1] : "Desconhecido";
                GM_setValue('omni_estado', { status: 'tocando', caller: caller, ts: Date.now() });

                if (Notification.permission === "granted" && !notificacaoJaDisparada) {
                    notificacaoJaDisparada = true;
                    const notif = new Notification("⚠️ LIGAÇÃO ENTRANDO!", { body: "Clique para atender a chamada.", requireInteraction: true });
                    notif.onclick = function() {
                        window.focus();
                        const btnAtenderOrig = document.querySelector('button#call');
                        if (btnAtenderOrig) btnAtenderOrig.click();
                        this.close();
                    };
                    setTimeout(() => { notificacaoJaDisparada = false; }, 10000);
                }
            }
            else if (!textoDaTela.includes("Recebendo chamada de") && estadoChamada) {
                estadoChamada = false;
                GM_setValue('omni_estado', { status: 'livre', caller: '', ts: Date.now() });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // RECEBE OS COMANDOS (E EXECUTA OS CLIQUES FANTASMAS)
        GM_addValueChangeListener('omni_comando', (nome, antigo, novo) => {
            if (novo.acao === 'atender') {
                const btnAtender = document.querySelector('button#call');
                if (btnAtender) { btnAtender.click(); }
            }
            else if (novo.acao === 'ligar') {
                const inputOriginal = document.getElementById('displaySoftPhone');
                const btnOriginal = document.querySelector('button.btn-call');
                if (inputOriginal && btnOriginal) {
                    inputOriginal.value = novo.numero;
                    inputOriginal.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => { btnOriginal.click(); }, 100);
                }
            }
            else if (novo.acao === 'transferir') {
                // O SCRIPT FANTASMA: CLICANDO NOS BOTÕES DO PAINEL DA TELA
                const executarTransferencia = async () => {
                    // Monta a sequência mágica pedida: *2 + RAMAL + #
                    const sequenciaBipes = '*' + '2' + novo.numero + '#';
                    const botoesDoPainel = Array.from(document.querySelectorAll('button.button-pad'));

                    if (botoesDoPainel.length === 0) {
                        alert("O painel lateral de telefonia precisa estar ABERTO na aba original do Sipulse para o script conseguir clicar nos botões de transferência.");
                        return;
                    }

                    // Clica um por um, bem rápido (150 milissegundos por clique)
                    for (let char of sequenciaBipes) {
                        const btn = botoesDoPainel.find(b => b.innerText.trim() === char);
                        if (btn) {
                            btn.click();
                            await new Promise(resolve => setTimeout(resolve, 150));
                        }
                    }

                    // Finaliza clicando no botão verde!
                    setTimeout(() => {
                        const btnCallOriginal = document.querySelector('button.btn-call');
                        if (btnCallOriginal) btnCallOriginal.click();
                    }, 300);
                };

                executarTransferencia();
            }
            else if (novo.acao === 'desligar') {
                const icons = Array.from(document.querySelectorAll('mat-icon'));
                const endIcon = icons.find(i => i.innerText.trim() === 'call_end');
                if (endIcon && endIcon.closest('button')) {
                    endIcon.closest('button').click();
                }
            }
        });
    }

    GM_addValueChangeListener('omni_estado', (nome, antigo, novo) => {
        const telaTeclado = document.getElementById('omni-tela-teclado');
        const telaChamada = document.getElementById('omni-tela-chamada');
        if (novo.status === 'tocando') {
            document.getElementById('omni-nome-chamador').innerText = novo.caller;
            telaTeclado.style.display = 'none';
            telaChamada.style.display = 'block';
            painel.style.display = 'block';

            botao.style.borderColor = '#ff073a';
            botao.style.boxShadow = '0 0 20px #ff073a, inset 0 0 15px #ff073a';
            botao.querySelector('svg').style.stroke = '#ff073a';
            botao.querySelector('svg').style.filter = 'drop-shadow(0px 0px 5px #ff073a)';
        } else {
            telaChamada.style.display = 'none';
            telaTeclado.style.display = 'block';

            botao.style.borderColor = '#00f0ff';
            botao.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.4)';
            botao.querySelector('svg').style.stroke = '#00f0ff';
            botao.querySelector('svg').style.filter = 'drop-shadow(0px 0px 4px #00f0ff)';
        }
    });
})();
