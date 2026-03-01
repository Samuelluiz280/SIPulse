// ==UserScript==
// @name         Notificador e Auto-Atendimento - Sipulse
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Notifica e atende a chamada ao clicar na notificação
// @match        *://hpbx01.brasiltecpar.com.br/*
// @grant        window.focus
// ==/UserScript==

(function() {
    'use strict';

    // 1. Pede permissão para mostrar notificações no Windows/Mac
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    let notificacaoJaDisparada = false;

    function tocarNotificacao() {
        if (Notification.permission === "granted" && !notificacaoJaDisparada) {
            notificacaoJaDisparada = true;

            const notificacao = new Notification("📞 LIGAÇÃO NO SIPULSE!", {
                body: "Clique AQUI para abrir a aba e ATENDER a chamada automaticamente.",
                requireInteraction: true // A notificação fica na tela até você agir
            });

            // O que acontece quando você clica na notificação:
            notificacao.onclick = function() {
                window.focus(); // Traz a aba para a frente
                
                // Procura exatamente o botão verde que descobrimos no código
                const botaoVerde = document.querySelector('button#call'); 
                
                if (botaoVerde) {
                    botaoVerde.click(); // Dá o clique virtual no botão verde!
                    console.log("Chamada atendida com sucesso pelo script!");
                } else {
                    console.warn("O botão verde não estava carregado a tempo.");
                }

                this.close(); // Fecha a notificação do Windows
            };

            // Pausa de 10 segundos para não enviar várias notificações da mesma chamada
            setTimeout(() => { notificacaoJaDisparada = false; }, 10000);
        }
    }

    // 2. O "Vigia" que deteta a chamada na tela
    const observer = new MutationObserver((mutations) => {
        const textoDaTela = document.body.innerText;

        // Quando a frase mágica aparecer, ele dispara a notificação
        if (textoDaTela.includes("Recebendo chamada de") && !notificacaoJaDisparada) {
            tocarNotificacao();
        }
    });

    // Inicia o vigia na página
    observer.observe(document.body, { childList: true, subtree: true });

})();
