// ==UserScript==
// @name         Sipulse Omnipresente: Global e Arrastável v8
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Balão do Sipulse com Enter para ligar e Ramal sincronizado
// @match        *://*/*
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';

    // Verifica se estamos na aba "Motor" (Sipulse) ou numa aba "Cliente" (qualquer outro site)
    const isSipulseTab = window.location.href.includes("hpbx01.brasiltecpar.com.br");

    // ==========================================
    // 1. ESTILOS VISUAIS (CSS GLOBAL)
    // ==========================================
    const estilo = document.createElement('style');
    estilo.innerHTML = `
        #omni-botao {
            position: fixed; bottom: 20px; right: 20px; width: 65px; height: 65px;
            background-color: #0b3c68; color: white; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            font-size: 30px; cursor: grab; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            z-index: 2147483647; border: 2px solid #fff; user-select: none;
            transition: background-color 0.2s;
        }
        #omni-botao:active { cursor: grabbing; }

        #omni-painel {
            position: fixed; bottom: 100px; right: 20px; width: 260px;
            background-color: #2b2b2b; border-radius: 12px; overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.6); display: none; z-index: 2147483647;
            font-family: 'Segoe UI', Arial, sans-serif; border: 1px solid #444;
        }

        .omni-header {
            background-color: #1a1a1a; padding: 10px; text-align: center;
            color: #aaa; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333;
        }
        #omni-ramal-texto { color: #4CAF50; font-size: 14px; }

        /* TELA TECLADO */
        #omni-tela-teclado { padding: 20px; }
        .omni-visor-bg { background-color: #1e1e1e; padding: 10px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #444; }
        #omni-visor { width: 100%; height: 35px; font-size: 22px; color: white; text-align: center; background: transparent; border: none; outline: none; font-weight: bold; letter-spacing: 2px;}
        .omni-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .omni-btn-num { background: #333; color: white; border: none; border-radius: 8px; padding: 15px 0; font-size: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 0 #1a1a1a; }
        .omni-btn-num:active { transform: translateY(4px); box-shadow: none; }

        .omni-linha-acao { display: flex; justify-content: center; margin-top: 20px; gap: 15px; }
        .omni-btn-acao { border: none; border-radius: 50%; width: 60px; height: 60px; cursor: pointer; display: flex; justify-content: center; align-items: center; }
        #omni-btn-ligar { background-color: #3db82e; box-shadow: 0 4px 0 #28801d; }
        #omni-btn-ligar:active { transform: translateY(4px); box-shadow: none; }
        #omni-btn-apagar { background-color: #d9534f; box-shadow: 0 4px 0 #9c3330; width: 45px; height: 45px; margin-top: 7px; color:white; font-weight:bold; font-size:18px;}
        #omni-btn-apagar:active { transform: translateY(4px); box-shadow: none; }

        /* TELA CHAMADA */
        #omni-tela-chamada { padding: 30px 20px; text-align: center; display: none; background: linear-gradient(180deg, #5c1010 0%, #2b2b2b 100%); }
        .omni-piscar { animation: omni-piscar-anim 1s infinite alternate; }
        @keyframes omni-piscar-anim { from { color: #ff4d4d; } to { color: #ffffff; } }
        #omni-titulo-chamada { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #ff4d4d; }
        #omni-nome-chamador { font-size: 20px; color: white; font-weight: bold; margin-bottom: 30px; word-wrap: break-word;}
        #omni-btn-atender { background-color: #3db82e; color: white; border: none; border-radius: 50px; padding: 15px 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 #28801d; width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; }
        #omni-btn-atender:active { transform: translateY(6px); box-shadow: none; }
    `;
    document.head.appendChild(estilo);

    // ==========================================
    // 2. INJETAR HTML NA PÁGINA
    // ==========================================
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = `
        <div id="omni-botao" title="Sipulse">☎️</div>
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
                    <button id="omni-btn-apagar" class="omni-btn-acao">X</button>
                    <button id="omni-btn-ligar" class="omni-btn-acao">
                        <svg fill="white" viewBox="0 0 24 24" width="30px" height="30px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </button>
                </div>
            </div>

            <div id="omni-tela-chamada">
                <div id="omni-titulo-chamada" class="omni-piscar">⚠️ NOVA LIGAÇÃO</div>
                <div id="omni-nome-chamador">Desconhecido</div>
                <button id="omni-btn-atender">ATENDER</button>
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
    // 4. LÓGICA DO TECLADO E ENTER (TODAS AS ABAS)
    // ==========================================
    const visor = document.getElementById('omni-visor');

    // Digitar pelos botões
    document.querySelectorAll('.omni-btn-num').forEach(btn => {
        btn.addEventListener('click', (e) => { visor.value += e.target.innerText; visor.focus(); });
    });

    // Botão de apagar
    document.getElementById('omni-btn-apagar').addEventListener('click', () => { visor.value = ''; visor.focus(); });

    // NOVIDADE: Clicar ENTER para ligar
    visor.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita que a página recarregue
            document.getElementById('omni-btn-ligar').click();
        }
    });

    // Enviar Comando: LIGAR
    document.getElementById('omni-btn-ligar').addEventListener('click', () => {
        if(visor.value.length > 0) {
            GM_setValue('omni_comando', { acao: 'ligar', numero: visor.value, ts: Date.now() });
            painel.style.display = 'none'; // Esconde o painel ao iniciar a chamada
        }
    });

    // Enviar Comando: ATENDER
    document.getElementById('omni-btn-atender').addEventListener('click', () => {
        GM_setValue('omni_comando', { acao: 'atender', ts: Date.now() });
        painel.style.display = 'none';
    });

    // ==========================================
    // 5. O CÉREBRO E TELEPATIA (SINCRONIZAÇÃO)
    // ==========================================

    // Recupera o Ramal salvo anteriormente assim que a página abre
    const ramalSalvo = GM_getValue('omni_ramal', '');
    if (ramalSalvo) {
        document.getElementById('omni-ramal-texto').innerText = "RAMAL: " + ramalSalvo;
    }

    // Fica a ouvir atualizações do Ramal (para as abas que não são o Sipulse)
    GM_addValueChangeListener('omni_ramal', (nome, antigo, novo) => {
        if (novo) document.getElementById('omni-ramal-texto').innerText = "RAMAL: " + novo;
    });

    // ---> SE ESTA ABA FOR A ABA DO SIPULSE (MOTOR) <---
    if (isSipulseTab) {
        let estadoChamada = false;

        // Procura o Ramal a cada 5 segundos e partilha com as outras abas
        setInterval(() => {
            const matchRamal = document.body.innerText.match(/Ramal:\s*(\d+)/i);
            if(matchRamal) {
                const numeroRamal = matchRamal[1];
                document.getElementById('omni-ramal-texto').innerText = "RAMAL: " + numeroRamal;
                GM_setValue('omni_ramal', numeroRamal); // Transmite o ramal para todos
            }
        }, 5000);

        // Fica a ler a tela à procura de chamadas
        const observer = new MutationObserver(() => {
            const textoDaTela = document.body.innerText;
            if (textoDaTela.includes("Recebendo chamada de") && !estadoChamada) {
                estadoChamada = true;
                const matchNome = textoDaTela.match(/Recebendo chamada de\s+([^\n]+)/);
                const caller = matchNome ? matchNome[1] : "Desconhecido";

                GM_setValue('omni_estado', { status: 'tocando', caller: caller, ts: Date.now() });
            }
            else if (!textoDaTela.includes("Recebendo chamada de") && estadoChamada) {
                estadoChamada = false;
                GM_setValue('omni_estado', { status: 'livre', caller: '', ts: Date.now() });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Fica a ouvir as ordens das outras abas
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
                    setTimeout(() => { btnOriginal.click(); }, 100);
                } else {
                    alert("Atenção: O teclado lateral original na aba do Sipulse precisa estar aberto para ligar!");
                }
            }
        });
    }

    // ---> EM TODAS AS ABAS <---
    // Fica a ouvir o estado do telefone
    GM_addValueChangeListener('omni_estado', (nome, antigo, novo) => {
        const telaTeclado = document.getElementById('omni-tela-teclado');
        const telaChamada = document.getElementById('omni-tela-chamada');

        if (novo.status === 'tocando') {
            document.getElementById('omni-nome-chamador').innerText = novo.caller;
            telaTeclado.style.display = 'none';
            telaChamada.style.display = 'block';
            painel.style.display = 'block'; // Pula na tela!
            botao.style.backgroundColor = '#ff4d4d'; // Fica vermelho
        } else {
            telaChamada.style.display = 'none';
            telaTeclado.style.display = 'block';
            botao.style.backgroundColor = '#0b3c68'; // Volta ao azul
        }
    });

})();
