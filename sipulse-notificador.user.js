// ==UserScript==
// @name         Sipulse Omnipresente: v11
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  Balão Neon puro código, sem botão de recusar
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
    // 1. ESTILOS VISUAIS (CSS GLOBAL)
    // ==========================================
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        /* EFEITO NEON DO BOTÃO FLUTUANTE */
        #omni-botao {
            position: fixed; bottom: 20px; right: 20px; width: 70px; height: 70px;
            background-color: #0b192c; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            cursor: grab; z-index: 2147483647; user-select: none;
            transition: all 0.3s ease;
            /* Borda e sombra NEON Azul */
            border: 2px solid #00f0ff;
            box-shadow: 0 0 10px #00f0ff, inset 0 0 10px #00f0ff;
        }
        #omni-botao:active { cursor: grabbing; transform: scale(0.95); box-shadow: 0 0 20px #00f0ff, inset 0 0 20px #00f0ff; }
        #omni-botao:hover { transform: scale(1.05); box-shadow: 0 0 15px #00f0ff, inset 0 0 15px #00f0ff; }

        #omni-painel {
            position: fixed; bottom: 100px; right: 20px; width: 260px;
            background-color: #2b2b2b; border-radius: 12px; overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.6); display: none; z-index: 2147483647;
            font-family: 'Segoe UI', Arial, sans-serif; border: 1px solid #444;
        }

        .omni-header { background-color: #1a1a1a; padding: 10px; text-align: center; color: #aaa; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; }
        #omni-ramal-texto { color: #4CAF50; font-size: 14px; }

        /* TELA TECLADO */
        #omni-tela-teclado { padding: 20px; }
        .omni-visor-bg { background-color: #1e1e1e; padding: 10px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #444; }
        #omni-visor { width: 100%; height: 35px; font-size: 22px; color: white; text-align: center; background: transparent; border: none; outline: none; font-weight: bold; letter-spacing: 2px;}
        .omni-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .omni-btn-num { background: #333; color: white; border: none; border-radius: 8px; padding: 15px 0; font-size: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #1a1a1a; }
        .omni-btn-num:active { transform: translateY(4px); box-shadow: none; }

        .omni-linha-acao { display: flex; justify-content: space-between; margin-top: 20px; align-items: center; }
        .omni-btn-acao { border: none; border-radius: 50%; width: 55px; height: 55px; cursor: pointer; display: flex; justify-content: center; align-items: center; }

        #omni-btn-ligar { background-color: #3db82e; box-shadow: 0 4px 0 #28801d; }
        #omni-btn-ligar:active { transform: translateY(4px); box-shadow: none; }

        #omni-btn-desligar { background-color: #d9534f; box-shadow: 0 4px 0 #9c3330; }
        #omni-btn-desligar:active { transform: translateY(4px); box-shadow: none; }

        #omni-btn-apagar { background-color: #555; box-shadow: 0 4px 0 #333; width: 40px; height: 40px; color:white; font-weight:bold; font-size:16px;}
        #omni-btn-apagar:active { transform: translateY(4px); box-shadow: none; }

        /* TELA CHAMADA */
        #omni-tela-chamada { padding: 30px 20px; text-align: center; display: none; background: linear-gradient(180deg, #5c1010 0%, #2b2b2b 100%); }
        .omni-piscar { animation: omni-piscar-anim 1s infinite alternate; }
        @keyframes omni-piscar-anim { from { color: #ff4d4d; } to { color: #ffffff; } }
        #omni-titulo-chamada { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ff4d4d; }
        #omni-nome-chamador { font-size: 20px; color: white; font-weight: bold; margin-bottom: 30px; word-wrap: break-word;}

        #omni-btn-atender { background-color: #3db82e; color: white; border: none; border-radius: 50px; padding: 15px 20px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 5px 0 #28801d; width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px;}
        #omni-btn-atender:active { transform: translateY(5px); box-shadow: none; }
    `;
    document.head.appendChild(estilo);

    // ==========================================
    // 2. INJETAR HTML NA PÁGINA
    // ==========================================
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
                <div class="omni-visor-bg"><input type="text" id="omni-visor" placeholder="Número..." autocomplete="off"/></div>
                <div class="omni-grade">
                    <button class="omni-btn-num">1</button><button class="omni-btn-num">2</button><button class="omni-btn-num">3</button>
                    <button class="omni-btn-num">4</button><button class="omni-btn-num">5</button><button class="omni-btn-num">6</button>
                    <button class="omni-btn-num">7</button><button class="omni-btn-num">8</button><button class="omni-btn-num">9</button>
                    <button class="omni-btn-num">*</button><button class="omni-btn-num">0</button><button class="omni-btn-num">#</button>
                </div>
                <div class="omni-linha-acao">
                    <button id="omni-btn-apagar" class="omni-btn-acao" title="Apagar">X</button>
                    <button id="omni-btn-desligar" class="omni-btn-acao" title="Encerrar Chamada Ativa">
                        <svg fill="white" viewBox="0 0 24 24" width="28px" height="28px"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                    </button>
                    <button id="omni-btn-ligar" class="omni-btn-acao" title="Ligar">
                        <svg fill="white" viewBox="0 0 24 24" width="28px" height="28px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </button>
                </div>
            </div>

            <div id="omni-tela-chamada">
                <div id="omni-titulo-chamada" class="omni-piscar">⚠️ NOVA LIGAÇÃO</div>
                <div id="omni-nome-chamador">Desconhecido</div>

                <button id="omni-btn-atender">
                    <svg fill="white" viewBox="0 0 24 24" width="22px" height="22px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    ATENDER
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(divWrapper);

    // ==========================================
    // 3. LÓGICA DE ARRASTAR O BOTÃO (DRAG & DROP)
    // ==========================================
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

    // ==========================================
    // 4. LÓGICA DO TECLADO E AÇÕES (TODAS AS ABAS)
    // ==========================================
    const visor = document.getElementById('omni-visor');
    document.querySelectorAll('.omni-btn-num').forEach(btn => {
        btn.addEventListener('click', (e) => { visor.value += e.target.innerText; visor.focus(); });
    });
    document.getElementById('omni-btn-apagar').addEventListener('click', () => { visor.value = ''; visor.focus(); });
    visor.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('omni-btn-ligar').click();
        }
    });

    document.getElementById('omni-btn-ligar').addEventListener('click', () => {
        if(visor.value.length > 0) {
            GM_setValue('omni_comando', { acao: 'ligar', numero: visor.value, ts: Date.now() });
            painel.style.display = 'none';
        }
    });

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
                    const notif = new Notification("⚠️ LIGAÇÃO ENTRANDO!", { body: "Clique para atender automaticamente.", requireInteraction: true });
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

        // Ouve as ordens das outras abas
        GM_addValueChangeListener('omni_comando', (nome, antigo, novo) => {
            if (novo.acao === 'atender') {
                const btnAtender = document.querySelector('button#call');
                if (btnAtender) { btnAtender.click(); window.focus(); }
            }
            else if (novo.acao === 'ligar') {
                const inputOriginal = document.getElementById('displaySoftPhone');
                const btnOriginal = document.querySelector('button.btn-call');
                if (inputOriginal && btnOriginal) {
                    inputOriginal.value = novo.numero;
                    inputOriginal.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => { btnOriginal.click(); window.focus(); }, 100);
                }
            }
            else if (novo.acao === 'desligar') {
                // Procura pelo ícone de desligar na tela
                const icons = Array.from(document.querySelectorAll('mat-icon'));
                const endIcon = icons.find(i => i.innerText.trim() === 'call_end');
                if (endIcon && endIcon.closest('button')) {
                    endIcon.closest('button').click();
                } else {
                    console.warn("Não encontrei o botão de desligar na tela original do Sipulse.");
                }
            }
        });
    }

    // ---> EM TODAS AS ABAS <---
    GM_addValueChangeListener('omni_estado', (nome, antigo, novo) => {
        const telaTeclado = document.getElementById('omni-tela-teclado');
        const telaChamada = document.getElementById('omni-tela-chamada');
        if (novo.status === 'tocando') {
            document.getElementById('omni-nome-chamador').innerText = novo.caller;
            telaTeclado.style.display = 'none';
            telaChamada.style.display = 'block';
            painel.style.display = 'block';

            // O botão fica com neon vermelho quando toca
            botao.style.borderColor = '#ff4d4d';
            botao.style.boxShadow = '0 0 15px #ff4d4d, inset 0 0 10px #ff4d4d';
            botao.querySelector('svg').style.stroke = '#ff4d4d';
        } else {
            telaChamada.style.display = 'none';
            telaTeclado.style.display = 'block';

            // Volta ao neon azul
            botao.style.borderColor = '#00f0ff';
            botao.style.boxShadow = '0 0 10px #00f0ff, inset 0 0 10px #00f0ff';
            botao.querySelector('svg').style.stroke = '#00f0ff';
        }
    });
})();
