// ==UserScript==
// @name         Sipulse Omnipresente v2.8
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Purificador de Números, Dark Glass e Anti-Duplicação
// @match        *://*/*
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';


    if (window.top !== window.self) return;


    if (document.getElementById('sipulse-omni-master-container')) {
        return;
    }

    const isSipulseTab = window.location.href.includes("hpbx01.brasiltecpar.com.br");

    const LINK_IMAGEM_FUNDO = "https://static.wixstatic.com/media/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png/v1/fill/w_1851,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png";


    const estilo = document.createElement('style');
    estilo.innerHTML = `
        /* BOTÃO FLUTUANTE PREMIUM */
        #omni-botao {
            position: fixed; bottom: 20px; right: 20px; width: 65px; height: 65px;
            background-color: rgba(11, 40, 75, 0.9);
            border-radius: 50%; display: flex; justify-content: center; align-items: center;
            cursor: grab; z-index: 2147483647; user-select: none;
            transition: all 0.3s ease; backdrop-filter: blur(5px);
            border: 1px solid rgba(0, 195, 255, 0.6);
            box-shadow: 0 5px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(0, 195, 255, 0.3);
        }
        #omni-botao:active { cursor: grabbing; transform: scale(0.95); }
        #omni-botao:hover { transform: scale(1.05); box-shadow: 0 8px 25px rgba(0, 195, 255, 0.5); border-color: #00c3ff;}

        /* PAINEL CRISTALINO COM IMAGEM NÍTIDA */
        #omni-painel {
            position: fixed; bottom: 100px; right: 20px; width: 270px;
            background-image: linear-gradient(rgba(4, 15, 30, 0.1), rgba(4, 15, 30, 0.8)), url('${LINK_IMAGEM_FUNDO}');
            background-size: cover;
            background-position: center;
            border-radius: 12px; overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.8), 0 0 10px rgba(0, 195, 255, 0.3);
            display: none; z-index: 2147483647;
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            border: 1px solid rgba(0, 195, 255, 0.4);
        }

        .omni-header {
            background-color: rgba(0, 0, 0, 0.6); padding: 12px 10px; text-align: center;
            color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 1px;
            border-bottom: 1px solid rgba(0, 195, 255, 0.3);
            backdrop-filter: blur(4px);
        }
        #omni-ramal-texto { color: #00c3ff; font-size: 14px; margin-left: 5px; text-shadow: 0 0 5px rgba(0, 195, 255, 0.5); }

        #omni-tela-teclado { padding: 15px 20px 20px 20px; }

        /* VISOR 1: LIGAR */
        .omni-visor-bg {
            background-color: rgba(0, 0, 0, 0.65); padding: 8px; border-radius: 8px; margin-bottom: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);
            backdrop-filter: blur(6px);
        }
        .omni-input {
            width: 100%; height: 30px; font-size: 22px; color: #ffffff; text-align: center;
            background: transparent; border: none; outline: none; font-weight: bold; letter-spacing: 2px;
        }
        .omni-input::placeholder { color: rgba(255, 255, 255, 0.5); font-weight: normal; font-size: 14px; letter-spacing: 0px;}

        /* VISOR 2: TRANSFERIR */
        .omni-visor-bg.transfer {
            border: 1px solid rgba(255, 193, 7, 0.4);
            margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .omni-input.transfer { color: #ffc107; font-size: 20px;}
        .omni-input.transfer::placeholder { color: rgba(255, 193, 7, 0.5); }

        #omni-btn-transferir {
            background: rgba(255, 193, 7, 0.15); border: 1px solid rgba(255, 193, 7, 0.2); cursor: pointer; display: flex; align-items: center; justify-content: center;
            padding: 6px; transition: all 0.2s; border-radius: 50%; outline: none;
        }
        #omni-btn-transferir:hover { background: rgba(255, 193, 7, 0.3); box-shadow: 0 0 10px rgba(255, 193, 7, 0.4);}
        #omni-btn-transferir:active { transform: scale(0.9); }

        /* GRADE E BOTÕES NUMÉRICOS */
        .omni-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .omni-btn-num {
            background: rgba(0, 0, 0, 0.55); color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px; padding: 12px 0; font-size: 19px; font-weight: 600; cursor: pointer;
            transition: all 0.2s;
            backdrop-filter: blur(8px);
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
        .omni-btn-num:hover { background: rgba(0, 0, 0, 0.7); border-color: rgba(0, 195, 255, 0.5); box-shadow: 0 0 10px rgba(0, 195, 255, 0.3); }
        .omni-btn-num:active { transform: scale(0.95); background: rgba(0, 195, 255, 0.3);}

        /* LINHA DE AÇÕES */
        .omni-linha-acao { display: flex; justify-content: space-between; margin-top: 22px; align-items: center; }
        .omni-btn-acao { border-radius: 50%; width: 52px; height: 52px; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.2s; border: none; }

        #omni-btn-ligar { background-color: #3db82e; box-shadow: 0 4px 10px rgba(0,0,0,0.6), 0 0 15px rgba(61, 184, 46, 0.3); border: 1px solid rgba(61, 184, 46, 0.8);}
        #omni-btn-ligar:hover { background-color: #44cc33; box-shadow: 0 0 20px rgba(61, 184, 46, 0.6);}
        #omni-btn-ligar:active { transform: scale(0.92); }

        #omni-btn-desligar { background-color: #d9534f; box-shadow: 0 4px 10px rgba(0,0,0,0.6), 0 0 15px rgba(217, 83, 79, 0.3); border: 1px solid rgba(217, 83, 79, 0.8);}
        #omni-btn-desligar:hover { background-color: #e85a55; box-shadow: 0 0 20px rgba(217, 83, 79, 0.6);}
        #omni-btn-desligar:active { transform: scale(0.92); }

        #omni-btn-apagar { background-color: rgba(0,0,0,0.6); border: 1px solid rgba(255, 255, 255, 0.2); width: 42px; height: 42px; color:rgba(255,255,255,0.9); font-weight:bold; font-size:16px; backdrop-filter: blur(6px);}
        #omni-btn-apagar:hover { background-color: rgba(0,0,0,0.8); color: #fff; border-color: #00c3ff;}
        #omni-btn-apagar:active { transform: scale(0.92); }

        /* TELA CHAMADA ENTRANDO */
        #omni-tela-chamada { padding: 40px 20px; text-align: center; display: none; background: rgba(217, 83, 79, 0.2); border-radius: 0 0 12px 12px; backdrop-filter: blur(8px);}
        .omni-piscar { animation: omni-piscar-anim 1s infinite alternate; }
        @keyframes omni-piscar-anim { from { color: #ff9999; } to { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.8); } }
        #omni-titulo-chamada { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #ffcccc; letter-spacing: 1px;}
        #omni-nome-chamador { font-size: 22px; color: white; font-weight: bold; margin-bottom: 40px; word-wrap: break-word; text-shadow: 0 2px 5px rgba(0,0,0,0.9);}

        #omni-btn-atender {
            background-color: #3db82e; color: white; border: 1px solid rgba(61, 184, 46, 0.8);
            border-radius: 50px; padding: 15px 20px; font-size: 18px; font-weight: bold; cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5), 0 0 20px rgba(61, 184, 46, 0.4); width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.2s;
        }
        #omni-btn-atender:hover { background-color: #44cc33; box-shadow: 0 0 25px rgba(61, 184, 46, 0.6);}
        #omni-btn-atender:active { transform: scale(0.95); }
    `;
    document.head.appendChild(estilo);

    // ==========================================
    // 2. INJETAR HTML NA PÁGINA (COM ID MESTRE)
    // ==========================================
    const divWrapper = document.createElement('div');
    divWrapper.id = 'sipulse-omni-master-container';
    divWrapper.innerHTML = `
        <div id="omni-botao" title="Sipulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00c3ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 30px; height: 30px; filter: drop-shadow(0px 0px 4px #00c3ff); pointer-events: none;">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        </div>

        <div id="omni-painel">
            <div class="omni-header">SIPULSE OMNI <span id="omni-ramal-texto">Buscando...</span></div>

            <div id="omni-tela-teclado">

                <div class="omni-visor-bg">
                    <input type="text" id="omni-visor" class="omni-input" placeholder="Ligar para..." autocomplete="off"/>
                </div>

                <div class="omni-visor-bg transfer">
                    <input type="text" id="omni-visor-transfer" class="omni-input transfer" placeholder="Transferir para..." autocomplete="off"/>
                    <button id="omni-btn-transferir" title="Executar Transferência Direta">
                        <svg fill="#ffc107" viewBox="0 0 24 24" width="22px" height="22px">
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
                        <svg fill="white" viewBox="0 0 24 24" width="26px" height="26px"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>
                    </button>
                    <button id="omni-btn-ligar" class="omni-btn-acao" title="Fazer Ligação">
                        <svg fill="white" viewBox="0 0 24 24" width="26px" height="26px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </button>
                </div>
            </div>

            <div id="omni-tela-chamada">
                <div id="omni-titulo-chamada" class="omni-piscar">⚠️ ALERTA DE CHAMADA</div>
                <div id="omni-nome-chamador">Desconhecido</div>
                <button id="omni-btn-atender">
                    <svg fill="white" viewBox="0 0 24 24" width="24px" height="24px"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    ATENDER
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(divWrapper);

    // ==========================================
    // 3. LÓGICA DE ARRASTAR O BOTÃO
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
    // 4. LÓGICA DOS VISORES, TECLADO E PURIFICADOR
    // ==========================================
    const visorLigar = document.getElementById('omni-visor');
    const visorTransferir = document.getElementById('omni-visor-transfer');
    let inputAtivo = visorLigar;

    visorLigar.addEventListener('focus', () => inputAtivo = visorLigar);
    visorTransferir.addEventListener('focus', () => inputAtivo = visorTransferir);

    // 🧼 O PURIFICADOR DE NÚMEROS (REGEX)
    // Tudo que for digitado ou colado nesses campos, perde letras, espaços e símbolos!
    const limparCaracteres = function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    };
    visorLigar.addEventListener('input', limparCaracteres);
    visorTransferir.addEventListener('input', limparCaracteres);

    // Digita pelos botões da tela
    document.querySelectorAll('.omni-btn-num').forEach(btn => {
        btn.addEventListener('click', (e) => {
            inputAtivo.value += e.target.innerText;
            inputAtivo.focus();
        });
    });

    document.getElementById('omni-btn-apagar').addEventListener('click', () => { inputAtivo.value = ''; inputAtivo.focus(); });

    visorLigar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-ligar').click(); }
    });

    visorTransferir.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-transferir').click(); }
    });

    document.getElementById('omni-btn-ligar').addEventListener('click', () => {
        if(visorLigar.value.length > 0) {
            GM_setValue('omni_comando', { acao: 'ligar', numero: visorLigar.value, ts: Date.now() });
            painel.style.display = 'none';
            visorLigar.value = '';
        }
    });

    document.getElementById('omni-btn-transferir').addEventListener('click', () => {
        const ramal = visorTransferir.value;
        if(ramal.length > 0) {
            GM_setValue('omni_comando', { acao: 'transferir', numero: ramal, ts: Date.now() });
            painel.style.display = 'none';
            visorTransferir.value = '';
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
    // 5. O CÉREBRO E TELEPATIA
    // ==========================================
    const ramalSalvo = GM_getValue('omni_ramal', '');
    if (ramalSalvo) document.getElementById('omni-ramal-texto').innerText = "| RAMAL: " + ramalSalvo;

    GM_addValueChangeListener('omni_ramal', (nome, antigo, novo) => {
        if (novo) document.getElementById('omni-ramal-texto').innerText = "| RAMAL: " + novo;
    });

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
                const executarTransferencia = async () => {
                    const sequenciaBipes = '*' + '2' + novo.numero + '#';
                    const botoesDoPainel = Array.from(document.querySelectorAll('button.button-pad'));

                    if (botoesDoPainel.length === 0) return;

                    for (let char of sequenciaBipes) {
                        const btn = botoesDoPainel.find(b => b.innerText.trim() === char);
                        if (btn) {
                            btn.click();
                            await new Promise(resolve => setTimeout(resolve, 150));
                        }
                    }
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

            botao.style.borderColor = '#ff6b6b';
            botao.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.8), inset 0 0 10px rgba(255, 107, 107, 0.4)';
            botao.querySelector('svg').style.stroke = '#ff6b6b';
        } else {
            telaChamada.style.display = 'none';
            telaTeclado.style.display = 'block';

            botao.style.borderColor = '#00c3ff';
            botao.style.boxShadow = '0 5px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(0, 195, 255, 0.3)';
            botao.querySelector('svg').style.stroke = '#00c3ff';
        }
    });
})();
