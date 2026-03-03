// ==UserScript==
// @name         Sipulse Omnipresente: v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Barra de Pesquisa Inteligente Integrada com Filas e Pessoas
// @match        *://*/*
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;
    if (document.getElementById('sipulse-omni-master-container')) return;

    const isSipulseTab = window.location.href.includes("hpbx01.brasiltecpar.com.br");

    const LINK_IMAGEM_FUNDO = "https://static.wixstatic.com/media/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png/v1/fill/w_1851,h_900,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/300e5a_95808568788d49c6a0e1a90a4dcfebf8~mv2.png";


    const LISTA_DE_RAMAIS = [
        // === FILAS GERAIS ===
        { nome: "FILA CSA-GGNET", setor: "Fila", ramal: "101000" },
        { nome: "FILA COMERCIAL-CAÇADOR", setor: "Fila", ramal: "102000" },
        { nome: "FILA COMERCIAL-RIO-DO-SUL", setor: "Fila", ramal: "192000" },
        { nome: "FILA COMERCIAL-SÃO-MATEUS-DO-SUL", setor: "Fila", ramal: "322000" },
        { nome: "FILA COMERCIAL-SANTA-CECILIA", setor: "Fila", ramal: "332000" },
        { nome: "FILA CSA-GEGNET-N2", setor: "Fila", ramal: "101099" },
        { nome: "FILA COMERCIAL-PAPANDUVA", setor: "Fila", ramal: "212000" },
        { nome: "FILA ALT-CTV-COMERCIAL", setor: "Fila", ramal: "422000" },
        { nome: "FILA ALT-JCA-COMERCIAL", setor: "Fila", ramal: "302000" },
        { nome: "FILA ENGENHARIA", setor: "Fila", ramal: "101300" },
        { nome: "FILA VOC", setor: "Fila", ramal: "101200" },
        { nome: "FILA COMERCIAL-ITUPORANGA", setor: "Fila", ramal: "232000" },
        { nome: "FILA LOGÍSTICA-CAÇADOR", setor: "Fila", ramal: "105200" },
        { nome: "FILA COMERCIAL-IRINEOPOLIS", setor: "Fila", ramal: "202000" },
        { nome: "FILA ALT-CDR-NOC", setor: "Fila", ramal: "101100" },
        { nome: "FILA ALT-CDR-MONITORAMENTO", setor: "Fila", ramal: "107400" },
        { nome: "FILA ALT-CTA-COMERCIAL", setor: "Fila", ramal: "372000" },
        { nome: "FILA ALT-SAO-BENTO-DO-SUL", setor: "Fila", ramal: "532000" },
        { nome: "FILA COMERCIAL-CANOINHAS", setor: "Fila", ramal: "262000" },
        { nome: "FILA COMERCIAL-ITAIOPOLIS", setor: "Fila", ramal: "272000" },
        { nome: "FILA ESTOQUE-CAÇADOR", setor: "Fila", ramal: "104400" },
        { nome: "FILA COMERCIAL-UNIÃO-DA-VITÓRIA", setor: "Fila", ramal: "342000" },
        { nome: "FILA ALT-CTA-OUVIDORIA", setor: "Fila", ramal: "376300" },
        { nome: "FILA COMERCIAL-FRAIBURGO", setor: "Fila", ramal: "352100" },
        { nome: "FILA LOGÍSTICA-CAÇADOR 2", setor: "Fila", ramal: "105210" },
        { nome: "FILA ALT-MFA-COMERCIAL", setor: "Fila", ramal: "282000" },
        { nome: "FILA ALT-NOC-SUPERVISAO", setor: "Fila", ramal: "101199" },
        { nome: "FILA ALT-RIN-COMERCIAL", setor: "Fila", ramal: "522000" },
        { nome: "FILA ALT-RON-COMERCIAL", setor: "Fila", ramal: "572000" },
        { nome: "FILA SAC-NEGOCIACAO", setor: "Fila", ramal: "103498" },
        { nome: "FILA COMERCIAL-IBIRAMA", setor: "Fila", ramal: "382000" },
        { nome: "FILA COMERCIAL-TANGARÁ", setor: "Fila", ramal: "352200" },
        { nome: "FILA COMERCIAL-CURITIBANOS", setor: "Fila", ramal: "492000" },
        { nome: "FILA LOGÍSTICA-VIDEIRA", setor: "Fila", ramal: "355200" },
        { nome: "FILA COMERCIAL-VIDEIRA", setor: "Fila", ramal: "352000" },
        { nome: "FILA COMERCIAL-PRESIDENTE-GETULIO", setor: "Fila", ramal: "392000" },
        { nome: "FILA COMERCIAL-TRÊS-BARRAS", setor: "Fila", ramal: "402000" },
        { nome: "FILA GGNET-SAC-RETENÇÃO", setor: "Fila", ramal: "103400" },
        { nome: "FILA COMERCIAL-PINHEIRO-PRETO", setor: "Fila", ramal: "352300" },
        { nome: "FILA TI-GGNET", setor: "Fila", ramal: "101400" },
        { nome: "FILA LOGISTICA-ITAPOA", setor: "Fila", ramal: "605200" },
        { nome: "FILA ITEL-COMERCIAL", setor: "Fila", ramal: "602000" },
        { nome: "FILA CANCELAMENTO-GGNET", setor: "Fila", ramal: "104500" },
        { nome: "FILA COMERCIAL-IRATI", setor: "Fila", ramal: "802000" },
        { nome: "FILA ALT-0800-COMERCIAL", setor: "Fila", ramal: "378000" },
        { nome: "FILA ALT-ADU-MDT-PYE-QND", setor: "Fila", ramal: "502000" },
        { nome: "FILA ALT-CCO-COMERCIAL", setor: "Fila", ramal: "162000" },
        { nome: "FILA COMERCIAL-SALTO-VELOSO", setor: "Fila", ramal: "142000" },
        { nome: "FILA GGNET-SAC-FINANCEIRO", setor: "Fila", ramal: "101900" },

        // === PESSOAS ===
        { nome: "LUANA APARECIDA GOMES DO ROSARIO", setor: "ADM Financeiro", ramal: "104012" },
        { nome: "FABIANA BATISTA DO NASCIMENTO", setor: "ADM Financeiro", ramal: "104013" },
        { nome: "ANDRESSA DA SILVA BAHLS", setor: "ADM Financeiro", ramal: "104016" },
        { nome: "ALINE MORAES TROCZNSKI", setor: "ADM Financeiro", ramal: "104018" },
        { nome: "DAIANE ROSSETTO", setor: "ADM Financeiro", ramal: "104019" },
        { nome: "VIVIANE TAIS FARIAS DOS SANTOS", setor: "ADM Financeiro", ramal: "104022" },
        { nome: "RAFAEL ANTONIO DA SILVA", setor: "ADM Financeiro", ramal: "104023" },
        { nome: "VALDIRENE HEBERLE RAMIRES DE OLIVEIRA", setor: "ADM Financeiro", ramal: "104024" },
        { nome: "LUCIANA DAS GRACAS DE OLIVEIRA", setor: "ADM Financeiro", ramal: "104027" },
        { nome: "ANA JULIA POSTELNIK CASTANHA", setor: "ADM Financeiro", ramal: "104028" },
        { nome: "FERNANDA APARECIDA DO AMARAL", setor: "ADM Financeiro", ramal: "104029" },
        { nome: "GRASIELE LEISMANN DO AMARAL", setor: "ADM Financeiro", ramal: "104030" },
        { nome: "TALITA GRASIELE PACHECO", setor: "ADM Financeiro", ramal: "104034" },
        { nome: "SUSANA GOMES DE ALMEIDA", setor: "ADM Financeiro", ramal: "104035" },
        { nome: "YASMIN CRISTINA FERREIRA", setor: "ADM Financeiro", ramal: "104040" },
        { nome: "CLAUDIA WAGNER DE LIMA", setor: "ADM Financeiro", ramal: "184010" },
        { nome: "IVANIA SALETE KLEEMANN BAZZO", setor: "ADM Financeiro", ramal: "184011" },
        { nome: "JULIA EMMANUELLE LOTTI ROCHA", setor: "ADM Financeiro", ramal: "184015" },
        { nome: "ANALICE SIQUEIRA KRAUSE", setor: "ADM Financeiro", ramal: "184026" },
        { nome: "ANDRESSA DA SILVA LINDNER", setor: "ADM Financeiro", ramal: "184027" },
        { nome: "GABRIELE BAI DIDEK", setor: "ADM Financeiro", ramal: "609010" },
        { nome: "TAINA NATALI VALCARENGHI LOCH", setor: "Administrativo", ramal: "107012" },
        { nome: "ALINE APARECIDA RODRIGUES", setor: "Administrativo", ramal: "107014" },
        { nome: "ANTONELA ALVES", setor: "Administrativo", ramal: "107018" },
        { nome: "LOUISE DE SOUZA ALBIGAUS", setor: "Administrativo", ramal: "107019" },
        { nome: "BRUNA DE BARROS FURTADO", setor: "Administrativo", ramal: "107020" },
        { nome: "CRISTIANE APARECIDA BUSATTO", setor: "Administrativo", ramal: "162010" },
        { nome: "JENIFER PISTOR", setor: "Administrativo", ramal: "162011" },
        { nome: "THAIS EDUARDA HEFNNER TONKOVITCH", setor: "Administrativo", ramal: "162022" },
        { nome: "ALINE BOTH PERTUZATTI", setor: "Administrativo", ramal: "164010" },
        { nome: "RODRIGO GABRIEL BARATA DA SILVA", setor: "Administrativo", ramal: "164012" },
        { nome: "SABRINA ORSO", setor: "Administrativo", ramal: "164014" },
        { nome: "TANARA APARECIDA BELLEI", setor: "Administrativo", ramal: "164016" },
        { nome: "JULIANA CAROLINA MACHADO", setor: "Administrativo", ramal: "164019" },
        { nome: "MARIVANE SERPA GUARAGNI", setor: "Administrativo", ramal: "164021" },
        { nome: "BIANCA SCHUSTER PORTELA", setor: "Administrativo", ramal: "164022" },
        { nome: "ELIANE DE FANTE", setor: "Administrativo", ramal: "167020" },
        { nome: "GIULIA MATOS FERNANDES", setor: "Administrativo", ramal: "167021" },
        { nome: "ANDRESSA MARCHIORO", setor: "Administrativo", ramal: "167022" },
        { nome: "BIANCA DE OLIVEIRA", setor: "Administrativo", ramal: "177016" },
        { nome: "ANALICE THEISEN BARCELOS", setor: "Administrativo", ramal: "177018" },
        { nome: "ANDREZA PEREIRA DE LORENA", setor: "Administrativo", ramal: "287011" },
        { nome: "SUELEN DO PRADO", setor: "Administrativo", ramal: "287012" },
        { nome: "EVELIN TALIA BANDEIRA DOS SANTOS", setor: "Administrativo", ramal: "371934" },
        { nome: "PAOLA CRISTINA SANTOS DA SILVA", setor: "Administrativo", ramal: "373410" },
        { nome: "DANIEL CRISTIAN DA SILVA POLLI", setor: "Administrativo", ramal: "373411" },
        { nome: "ADAO DOMINGOS DE SOUZA", setor: "Administrativo", ramal: "377010" },
        { nome: "BRUNA SELLA BLASKOWSKI", setor: "Administrativo", ramal: "377012" },
        { nome: "TATIANE POMPERMAIER", setor: "Administrativo", ramal: "377016" },
        { nome: "JANE IARA PEDROSO OBUGALSKI", setor: "Administrativo", ramal: "422010" },
        { nome: "SUSIANE APARECIDA VIEIRA FRANCA", setor: "Administrativo", ramal: "804016" },
        { nome: "BIANCA CIBELE BALBINOT", setor: "Administrativo", ramal: "164023" },
        { nome: "PATRICIA MACHADO", setor: "Almoxarifado", ramal: "104410" },
        { nome: "VANESA GABRIELA VERONESE", setor: "Almoxarifado", ramal: "104412" },
        { nome: "ADILSON FAUSTINO DOS SANTOS", setor: "Almoxarifado", ramal: "104413" },
        { nome: "ANA PAULA PAIM PADILHA", setor: "Almoxarifado", ramal: "104418" },
        { nome: "DOUGLAS CAMPOS PAULINO", setor: "Almoxarifado", ramal: "164412" },
        { nome: "MATHEUS HENRIQUE KOPSELL", setor: "Almoxarifado", ramal: "164413" },
        { nome: "ALDORI NASATO", setor: "Almoxarifado", ramal: "194410" },
        { nome: "CRISTIAN THOMAZ ALBRECHT", setor: "Almoxarifado", ramal: "284420" },
        { nome: "MILLENNE MARIA DE FREITAS", setor: "Almoxarifado", ramal: "354410" },
        { nome: "ANDERSON FISCHER DA SILVA", setor: "Almoxarifado", ramal: "504420" },
        { nome: "REINALDO OSSOSKI", setor: "Almoxarifado", ramal: "504433" },
        { nome: "LUIZ ANTONIO CASTILHO DOS SANTOS", setor: "Callback", ramal: "101344" },
        { nome: "DIOGO GARCIA VAZ", setor: "Callback", ramal: "105411" },
        { nome: "GUILHERME FELIPE WOLFF", setor: "Callback", ramal: "105412" },
        { nome: "ALDACIR URUPUCKNA FILHO", setor: "Callback", ramal: "105413" },
        { nome: "CLEITON REICHARDT", setor: "Callback", ramal: "105414" },
        { nome: "GUILHERME SCHWEITZER", setor: "Callback", ramal: "355410" },
        { nome: "GILBERT NICOLAS DAMASCENO CORREA", setor: "Callback", ramal: "355415" },
        { nome: "PAULO ROBERTO LUGUES", setor: "Callback", ramal: "371310" },
        { nome: "MATHEUS MARTINS SOARES", setor: "Callback", ramal: "545010" },
        { nome: "BEATRIZ APARECIDA LIMA PINTO", setor: "Callback", ramal: "605010" },
        { nome: "RENAN PABLO DO ROSARIO DE MATTOS", setor: "CGR", ramal: "102411" },
        { nome: "ALEFE FERNANDO RAMOS RIBEIRO", setor: "CGR", ramal: "102412" },
        { nome: "GIOVANI PIMENTEL DE CÓRDOVA", setor: "CGR", ramal: "102418" },
        { nome: "ESCSP", setor: "CGR", ramal: "102423" },
        { nome: "JOAO MIGUEL HILDEBRANDO", setor: "CGR", ramal: "102424" },
        { nome: "HENRIQUE CRISTOVAO CAMARGO", setor: "CGR", ramal: "102426" },
        { nome: "VITOR DELUQUE DE OLIVEIRA", setor: "CGR", ramal: "351112" },
        { nome: "BRED MICHAEL DA ROSA ADAMI", setor: "CGR", ramal: "351113" },
        { nome: "BRUNO PUSTELNIK", setor: "Comercial", ramal: "102012" },
        { nome: "FABIANI MENDES ABRAO RIBAS", setor: "Comercial", ramal: "102013" },
        { nome: "EDE CARLOS VIEIRA", setor: "Comercial", ramal: "102016" },
        { nome: "ELESSANDRO GUSTAVO DREHMER", setor: "Comercial", ramal: "102017" },
        { nome: "ANDRESSA BATISTA", setor: "Comercial", ramal: "102022" },
        { nome: "ROSANGELA APARECIDA FERREIRA", setor: "Comercial", ramal: "102023" },
        { nome: "MARCOS AURELIO", setor: "Comercial", ramal: "102025" },
        { nome: "BRENDA XAVIER DOS SANTOS", setor: "Comercial", ramal: "102026" },
        { nome: "MARCIA SCHUSTER", setor: "Comercial", ramal: "102036" },
        { nome: "VANESSA DOS SANTOS ALVES", setor: "Comercial", ramal: "132011" },
        { nome: "GABRIELA MOREIRA MISTURINI", setor: "Comercial", ramal: "142010" },
        { nome: "JESSICA GALVAO", setor: "Comercial", ramal: "152015" },
        { nome: "LETICIA GRAFITI", setor: "Comercial", ramal: "162012" },
        { nome: "FERNANDO FRANCISCO PINHO", setor: "Comercial", ramal: "162013" },
        { nome: "CASSIANO BENTO DA SILVA", setor: "Comercial", ramal: "162015" },
        { nome: "GABRIEL FERNANDO DA SILVA", setor: "Comercial", ramal: "162023" },
        { nome: "WANESSA PEREIRA AMARANTE BRITO", setor: "Comercial", ramal: "192012" },
        { nome: "ALAN MIGUEL VARELA", setor: "Comercial", ramal: "192014" },
        { nome: "SUELEN DA CUNHA", setor: "Comercial", ramal: "192015" },
        { nome: "ANA CAROLINE DA ROCHA", setor: "Comercial", ramal: "202015" },
        { nome: "NOELE BEATRIZ PIRES SZALEK", setor: "Comercial", ramal: "212011" },
        { nome: "LUANA FRANCINE DE ALMEIDA", setor: "Comercial", ramal: "232011" },
        { nome: "DEBORA SCHIKORSKI", setor: "Comercial", ramal: "232012" },
        { nome: "SCHEILA LUISA DOS SANTOS", setor: "Comercial", ramal: "242010" },
        { nome: "ANTONIO EDSON SOARES FRAGOSO", setor: "Comercial", ramal: "262010" },
        { nome: "MILENA ALVES DE LIMA", setor: "Comercial", ramal: "262013" },
        { nome: "GUILHERME RAFAEL WENDT", setor: "Comercial", ramal: "262015" },
        { nome: "MARAJOARA D OLIVEIRA", setor: "Comercial", ramal: "262018" },
        { nome: "JESSICA ALVES DE MIRANDA", setor: "Comercial", ramal: "272011" },
        { nome: "VIVIANE ANIE DOS SANTOS", setor: "Comercial", ramal: "282010" },
        { nome: "MARILUCE FONSECA SILVA", setor: "Comercial", ramal: "282016" },
        { nome: "JESSICA GRACIELE DE ASSUMPÇÃO", setor: "Comercial", ramal: "282017" },
        { nome: "BRUNA FERNANDES", setor: "Comercial", ramal: "292011" },
        { nome: "KALYNE NAYARA SIMON", setor: "Comercial", ramal: "302010" },
        { nome: "DALVAN CAMILO DE BORTOLI", setor: "Comercial", ramal: "302012" },
        { nome: "MARCIELI IONE DROBINHESKI", setor: "Comercial", ramal: "322010" },
        { nome: "GABRIEL MADZGALA SANTA ANA", setor: "Comercial", ramal: "322011" },
        { nome: "JULIANE CASTILHO STANSKI", setor: "Comercial", ramal: "322012" },
        { nome: "JEAN SOUZA PEREIRA", setor: "Comercial", ramal: "332011" },
        { nome: "CAMILA VIEIRA SANTOS", setor: "Comercial", ramal: "342011" },
        { nome: "RONALDO JOSE DAS CHAGAS", setor: "Comercial", ramal: "342012" },
        { nome: "SANDRA CHOJNACKI RUCKL", setor: "Comercial", ramal: "342013" },
        { nome: "NEIDE DAIANE JOBINS ONEVETCH", setor: "Comercial", ramal: "342014" },
        { nome: "MARIANA CRISTINA MUDREK", setor: "Comercial", ramal: "342016" },
        { nome: "ITALO JHUAN CALISTRO", setor: "Comercial", ramal: "342017" },
        { nome: "LARISSA PEDROSO", setor: "Comercial", ramal: "352010" },
        { nome: "DAIANE APARECIDA SARMENTO", setor: "Comercial", ramal: "352014" },
        { nome: "ANA PAULA PAZ MAURICIO", setor: "Comercial", ramal: "352015" },
        { nome: "GABRIELA CAROLINE PEPPES", setor: "Comercial", ramal: "352024" },
        { nome: "SUELEN CRISTINA MENDES", setor: "Comercial", ramal: "362011" },
        { nome: "JESSICA DOS SANTOS PADILHA", setor: "Comercial", ramal: "362012" },
        { nome: "JULIA DE OLIVEIRA", setor: "Comercial", ramal: "372010" },
        { nome: "JONAS PEREIRA DA SILVA JUNIOR", setor: "Comercial", ramal: "372012" },
        { nome: "JENIFFER COUTINHO DOS SANTOS", setor: "Comercial", ramal: "372015" },
        { nome: "MARCOS ROBERTO DOS SANTOS", setor: "Comercial", ramal: "372020" },
        { nome: "CHRISTIANE PEREIRA DA SILVA", setor: "Comercial", ramal: "373412" },
        { nome: "MARIA CAROLINA ROSA", setor: "Comercial", ramal: "382010" },
        { nome: "TALYTA CAROLYNE FILOCREAO", setor: "Comercial", ramal: "392010" },
        { nome: "ANA CAROLINA DE LIMA", setor: "Comercial", ramal: "402010" },
        { nome: "MILENE EDUARDA DANNEMANN", setor: "Comercial", ramal: "432010" },
        { nome: "BIANCA ALVES RIBEIRO", setor: "Comercial", ramal: "442011" },
        { nome: "RAISSA CRISTINA OLIVEIRA", setor: "Comercial", ramal: "442012" },
        { nome: "LAIS KARLA RODRIGUES DA SILVA", setor: "Comercial", ramal: "462010" },
        { nome: "GRAZIELE MOCELIN", setor: "Comercial", ramal: "482010" },
        { nome: "NAIARA APARECIDA PORTELLA", setor: "Comercial", ramal: "492013" },
        { nome: "JULIA DA CRUZ GONCALVES", setor: "Comercial", ramal: "502011" },
        { nome: "PEDRO LEONARDO GOGOLA", setor: "Comercial", ramal: "502012" },
        { nome: "MARIA ALICE SURA", setor: "Comercial", ramal: "502016" },
        { nome: "TATIANE OSSOSKI MARTINS", setor: "Comercial", ramal: "502018" },
        { nome: "CRISTHY ELLYN MOLETTA", setor: "Comercial", ramal: "502019" },
        { nome: "JULIANA TAIMARA DA CRUZ", setor: "Comercial", ramal: "502021" },
        { nome: "LEILIANE MARTINS", setor: "Comercial", ramal: "522018" },
        { nome: "NATALI RUDNICK ADRIANO", setor: "Comercial", ramal: "522019" },
        { nome: "JULIA APARECIDA DORNELES", setor: "Comercial", ramal: "532025" },
        { nome: "ANTONIO DAVI VAZ LIMA", setor: "Comercial", ramal: "542010" },
        { nome: "CLAUDIA VILA", setor: "Comercial", ramal: "572010" },
        { nome: "ALANA SILVEIRA SANTOS", setor: "Comercial", ramal: "572014" },
        { nome: "SUZANE REGINA ALVES", setor: "Comercial", ramal: "602013" },
        { nome: "GISSELLE BUENO", setor: "Comercial", ramal: "602015" },
        { nome: "THASSILA THAISSA DE JESUS", setor: "Comercial", ramal: "602016" },
        { nome: "NARAYENE DIUNISIO ALEXANDRE", setor: "Comercial", ramal: "602054" },
        { nome: "JACKSON KRUGER", setor: "Comercial", ramal: "602055" },
        { nome: "RUBIANE THEURER SEBERINO", setor: "Comercial", ramal: "604010" },
        { nome: "ANA LUIZA BASTOS", setor: "Comercial", ramal: "607010" },
        { nome: "YASMIN GABRIELA FELDHAUS", setor: "Comercial", ramal: "609011" },
        { nome: "TULIO PEREK", setor: "Comercial", ramal: "802014" },
        { nome: "TALITA DE FREITAS", setor: "Comercial", ramal: "802016" },
        { nome: "TATIANA CRISTINA LIMA", setor: "Comercial", ramal: "802018" },
        { nome: "LEANDRO DENKEWICZ", setor: "Comercial", ramal: "802020" },
        { nome: "SILVIA APARECIDA OLEINIK", setor: "Compras", ramal: "104416" },
        { nome: "MARINDIA FORTES", setor: "Compras", ramal: "174311" },
        { nome: "EDEMIR MATEUS DE AZEVEDO", setor: "Compras", ramal: "184356" },
        { nome: "POLLIANNA RAFAELA DA SILVA", setor: "Contabilidade", ramal: "104221" },
        { nome: "TAIS ZIMMERMANN", setor: "Contabilidade", ramal: "104236" },
        { nome: "SAMANTHA NICHELE", setor: "Contabilidade", ramal: "184230" },
        { nome: "JOSE ADAO FUCK NETO", setor: "Coordenação Comercial", ramal: "282013" },
        { nome: "MARCIO MARCELINO DE GODOI", setor: "Coordenação Comercial", ramal: "492011" },
        { nome: "JOAO PAULO STEFANES", setor: "Coordenação CS", ramal: "101810" },
        { nome: "RICARDO MURILLO SILVEIRA", setor: "Coordenação Operacional", ramal: "178413" },
        { nome: "BRUNO BUCHHOLZ", setor: "Coordenação Operacional", ramal: "193015" },
        { nome: "PAOLA MULLER", setor: "Coordenação Operacional", ramal: "305230" },
        { nome: "JESSE TURCATEL", setor: "Coordenação Operacional", ramal: "308410" },
        { nome: "SILVIO ZBITKOWSKI", setor: "Coordenação Operacional", ramal: "345110" },
        { nome: "JEISON ALEX CORDEIRO", setor: "Coordenação Operacional", ramal: "345211" },
        { nome: "ANDERSON LUIZ ADAMS", setor: "Coordenação Operacional", ramal: "508413" },
        { nome: "MATEUS DE ANDRADE", setor: "Coordenação Operacional", ramal: "608410" },
        { nome: "PHELLIP BONAVIGO DE QUADROS", setor: "CSA", ramal: "101010" },
        { nome: "CLEONICE GONCALVES MARTINS", setor: "CSA", ramal: "471010" },
        { nome: "ADRIANO DE LIMA", setor: "CSA", ramal: "101011" },
        { nome: "ALINE DOS SANTOS", setor: "CSA", ramal: "101013" },
        { nome: "ANDREY WESLEY DA SILVA", setor: "CSA", ramal: "101014" },
        { nome: "ANNA GIULLIA SGARBI", setor: "CSA", ramal: "101015" },
        { nome: "ARIANA OLIVEIRA SCHULTZ", setor: "CSA", ramal: "101016" },
        { nome: "ARTHUR SCHIRRMANN ALVES", setor: "CSA", ramal: "101017" },
        { nome: "DAIANE GARCIA DA SILVA", setor: "CSA", ramal: "101018" },
        { nome: "ELDER JUNIOR LAVA", setor: "CSA", ramal: "101019" },
        { nome: "ERICK RENAN RIBEIRO", setor: "CSA", ramal: "101020" },
        { nome: "FLAVIO AUGUSTO FURTUOSO", setor: "CSA", ramal: "101021" },
        { nome: "GILSON COUSSEAU", setor: "CSA", ramal: "101022" },
        { nome: "GUILHERME RECALCATTE VOGEL", setor: "CSA", ramal: "101023" },
        { nome: "ISRAEL LOPES MATIUSCH", setor: "CSA", ramal: "101024" },
        { nome: "IZAQUE LINS", setor: "CSA", ramal: "101025" },
        { nome: "JHONATA KAUA DOS SANTOS", setor: "CSA", ramal: "101026" },
        { nome: "JOAO AUGUSTO MARQUES", setor: "CSA", ramal: "101027" },
        { nome: "JULIANO CESAR DOS SANTOS", setor: "CSA", ramal: "101028" },
        { nome: "JULIANO TEODORO GONÇALVES", setor: "CSA", ramal: "101029" },
        { nome: "KAUAN GUSTAVO LEITE", setor: "CSA", ramal: "101030" },
        { nome: "LEONEL ANTONIO DE OLIVEIRA", setor: "CSA", ramal: "101032" },
        { nome: "LETICIA FRITSCH", setor: "CSA", ramal: "101033" },
        { nome: "LUCAS ITANAAN LIMAS", setor: "CSA", ramal: "101035" },
        { nome: "LUIZ HENRIQUE COSTENARO", setor: "CSA", ramal: "101036" },
        { nome: "LUIZ HENRIQUE GUIDOTTI", setor: "CSA", ramal: "101037" },
        { nome: "LUIZ PAULO PADILHA DA SILVA", setor: "CSA", ramal: "101038" },
        { nome: "MATIAS GRAFFE", setor: "CSA", ramal: "101039" },
        { nome: "MAURO MORIGGI", setor: "CSA", ramal: "101040" },
        { nome: "NATHAN GABRIEL MACHADO", setor: "CSA", ramal: "101041" },
        { nome: "NICOLAS ABATTI", setor: "CSA", ramal: "101042" },
        { nome: "PAULO AMADEUS SCHULTZ", setor: "CSA", ramal: "101043" },
        { nome: "PAULO CEZAR SOARES", setor: "CSA", ramal: "101044" },
        { nome: "ROBSON GIRARDI", setor: "CSA", ramal: "101045" },
        { nome: "RYAN VINICIUS CORREIA", setor: "CSA", ramal: "101046" },
        { nome: "SAMUEL LUIZ ALMEIDA", setor: "CSA", ramal: "101047" },
        { nome: "VINICIOS JOSE CARDOSO", setor: "CSA", ramal: "101049" },
        { nome: "VINICIUS ANTUNES RIBEIRO", setor: "CSA", ramal: "101050" },
        { nome: "VINICIUS EDUARDO CARDOSO", setor: "CSA", ramal: "101051" },
        { nome: "VITOR CHAVES MARTINS", setor: "CSA", ramal: "101052" },
        { nome: "WILLIAN VINICIUS HEUSSER", setor: "CSA", ramal: "101053" },
        { nome: "YGOR AUGUSTO DOS SANTOS", setor: "CSA", ramal: "101054" },
        { nome: "ATHOS HENRIQUE DE ARUDA", setor: "CSA", ramal: "471012" },
        { nome: "DAVI ALEXANDRE PERES", setor: "CSA", ramal: "471013" },
        { nome: "ISABELLA CHRISTINA SOUZA", setor: "CSA", ramal: "471014" },
        { nome: "JOAO VINICIUS DE AGUIAR", setor: "CSA", ramal: "471015" },
        { nome: "KARINA VIEIRA TOMITA", setor: "CSA", ramal: "471016" },
        { nome: "LEONARDO ELOI CORREA", setor: "CSA", ramal: "471017" },
        { nome: "LUIZ FELIPE COIMBRA", setor: "CSA", ramal: "471018" },
        { nome: "OLIVIO CICHOVICZ NETO", setor: "CSA", ramal: "471019" },
        { nome: "PEDRO HENRIQUE GONCALVES", setor: "CSA", ramal: "471021" },
        { nome: "RAFAEL SILVA BESS", setor: "CSA", ramal: "471022" },
        { nome: "RODRIGO MARIN ADÃO", setor: "CSA", ramal: "471023" },
        { nome: "TAMIRES DIAS CAMARGO", setor: "CSA", ramal: "471024" },
        { nome: "YURI INACIO ELEUTERIO", setor: "CSA", ramal: "471027" },
        { nome: "LUCAS LEITE QUEIROZ", setor: "CSA", ramal: "471028" },
        { nome: "JOAO VICTOR REINALDO", setor: "CSA", ramal: "471029" },
        { nome: "VINICIUS MELO DA SILVEIRA", setor: "CSA", ramal: "471030" },
        { nome: "MARCELO AFONSO", setor: "Diretoria", ramal: "106010" },
        { nome: "GILMAR BALBINOT", setor: "Diretoria", ramal: "106011" },
        { nome: "JOAO FERNANDO HUINKA", setor: "Engenharia", ramal: "285210" },
        { nome: "MARCOS CAVALI", setor: "Engenharia", ramal: "101316" },
        { nome: "VITOR FONSECA", setor: "Engenharia", ramal: "101317" },
        { nome: "INGRIDY DE SOUZA", setor: "Engenharia", ramal: "101318" },
        { nome: "GUILHERME LUIZ PEDON", setor: "Engenharia", ramal: "101319" },
        { nome: "LUCAS JOSE AGOSTI", setor: "Engenharia", ramal: "101327" },
        { nome: "BERNARDO SPANHOLO", setor: "Engenharia", ramal: "101369" },
        { nome: "WILLIAN HENRIQUE PAIMEL", setor: "Engenharia", ramal: "161311" },
        { nome: "ALECIO DANSIGUER JUNIOR", setor: "Engenharia", ramal: "161314" },
        { nome: "MATEUS RODRIGUES DA SILVA", setor: "Engenharia", ramal: "161315" },
        { nome: "EVANDRO DE LIMA RODRIGUES", setor: "Engenharia", ramal: "173011" },
        { nome: "THIAGO AUGUSTO RANKEL", setor: "Engenharia", ramal: "281312" },
        { nome: "GIANDERSON ISLER GIRARDI", setor: "Engenharia", ramal: "301315" },
        { nome: "MARCOS COELHO DA SILVA", setor: "Engenharia", ramal: "371313" },
        { nome: "LUCAS MIGUEL VOLOCH", setor: "Engenharia", ramal: "371320" },
        { nome: "MAIKON FERNANDO PEDROSO", setor: "Engenharia", ramal: "501311" },
        { nome: "LUAN NOGUEIRA", setor: "Engenharia", ramal: "501314" },
        { nome: "DOUGLAS RODRIGUES DE BASTOS", setor: "Engenharia", ramal: "501317" },
        { nome: "DEVERSON MIRANDA DA COSTA", setor: "Engenharia", ramal: "508412" },
        { nome: "PAULO ROBERTO BRAGA JUNIOR", setor: "Engenharia", ramal: "605014" },
        { nome: "CAMILA CRISTINA GALLINA", setor: "Entregas e Soluções", ramal: "102810" },
        { nome: "EVERTON LUIZ GOULART", setor: "Entregas e Soluções", ramal: "171331" },
        { nome: "RODRIGO NASCIMENTO PICCOLO", setor: "Entregas e Soluções", ramal: "172710" },
        { nome: "ALEX BRUNO BUENO MAASS", setor: "Entregas e Soluções", ramal: "172714" },
        { nome: "ESTAÇÂO SARANDI", setor: "Infraestrutura", ramal: "103011" },
        { nome: "WELLIGTON DE OLIVEIRA LUZ", setor: "Infraestrutura", ramal: "175512" },
        { nome: "RAFAEL GRESCHECHEM", setor: "Infraestrutura", ramal: "263011" },
        { nome: "WILLIAN RONALDO DE SOUZA", setor: "Infraestrutura", ramal: "263015" },
        { nome: "JEAN CARLO ENGEL", setor: "Infraestrutura", ramal: "263020" },
        { nome: "GILVANO PORTA JUNIOR", setor: "Infraestrutura", ramal: "265111" },
        { nome: "JACKSON SEIDEL VICENTE", setor: "Infraestrutura", ramal: "265112" },
        { nome: "SAMUEL DE OLIVEIRA DOS SANTOS", setor: "Infraestrutura", ramal: "345214" },
        { nome: "ALECHANDRE FELIPHE LAMONATTO", setor: "Infraestrutura", ramal: "355216" },
        { nome: "ERICA ZAINE WOUCSUK", setor: "Logistica", ramal: "805212" },
        { nome: "VICTOR NICOLAS VALENTE", setor: "Logistica", ramal: "175214" },
        { nome: "MARCIO ROBERTO HONORIO", setor: "Logistica", ramal: "195211" },
        { nome: "LAIANE GONCALVES DURAU", setor: "Logistica", ramal: "265213" },
        { nome: "ELEN JAINE CORDEIRO", setor: "Logistica", ramal: "265214" },
        { nome: "ERIC FELIPE ALVES CARDOSO", setor: "Logistica", ramal: "285211" },
        { nome: "ROGER DHORDAN ALMEIDA", setor: "Logistica", ramal: "285213" },
        { nome: "ALINE FRACARI PEREIRA", setor: "Logistica", ramal: "301310" },
        { nome: "EDUARDO CALVARIO DOS SANTOS", setor: "Logistica", ramal: "344410" },
        { nome: "MAICON GABRIEL ZIPPERER", setor: "Logistica", ramal: "345111" },
        { nome: "JOAO VICTOR DA MOTTA", setor: "Logistica", ramal: "345210" },
        { nome: "GABRIEL HERNESTO TALASZ", setor: "Logistica", ramal: "345212" },
        { nome: "JORDAN ANDRE DE OLIVEIRA", setor: "Logistica", ramal: "345215" },
        { nome: "ALAN RODRIGO ALVES PACHECO", setor: "Logistica", ramal: "345410" },
        { nome: "GESSICA APARECIDA MARQUES", setor: "Logistica", ramal: "355214" },
        { nome: "GILVANDRO GUILL", setor: "Logistica", ramal: "355217" },
        { nome: "BRUNO RAFAEL PEREZ BRANDA", setor: "Logistica", ramal: "375214" },
        { nome: "ALISON VINICIUS DALCOMUNI", setor: "Logistica", ramal: "375215" },
        { nome: "PAMELA MAHARA SCHOLTZ", setor: "Logistica", ramal: "375224" },
        { nome: "MARLON LUCAS CARVALHO", setor: "Logistica", ramal: "505215" },
        { nome: "JULIANA BAUM", setor: "Logistica", ramal: "505230" },
        { nome: "LAIS BUBA", setor: "Logistica", ramal: "505232" },
        { nome: "MONICA ROOS", setor: "Logistica", ramal: "605220" },
        { nome: "GUILHERME RANGEL RIBAS", setor: "Logistica", ramal: "805214" },
        { nome: "LUCAS DA ROCHA LIMA", setor: "Marketing", ramal: "108110" },
        { nome: "GLAUCIA MARIA FERREIRA", setor: "Marketing", ramal: "188110" },
        { nome: "HELLANA TAMIRIZ DOS SANTOS", setor: "Menor Aprendiz", ramal: "287015" },
        { nome: "JULIE VITORIA ALVES FERNANDES", setor: "Menor Aprendiz", ramal: "371939" },
        { nome: "MONITORAMENTO ALT", setor: "Monitoramento", ramal: "107410" },
        { nome: "MONITORAMENTO ALT", setor: "Monitoramento", ramal: "107411" },
        { nome: "MONITORAMENTO ALT", setor: "Monitoramento", ramal: "107414" },
        { nome: "IOHANA JOHANN DA ROSA", setor: "Monitoramento", ramal: "107415" },
        { nome: "MONITORAMENTO ALT", setor: "Monitoramento", ramal: "107416" },
        { nome: "LUIZ FERNANDO BORILLE", setor: "Monitoramento", ramal: "107417" },
        { nome: "GUILHERME LOPES MOREIRA", setor: "NOC", ramal: "101114" },
        { nome: "MARCOS EDUARDO SANTOS", setor: "NOC", ramal: "101116" },
        { nome: "THOMAS MORIGGI", setor: "NOC", ramal: "101125" },
        { nome: "WILLIAN MOREIRA DE SOUZA", setor: "NOC", ramal: "101127" },
        { nome: "DIOGO OLIVEIRA DA SILVA", setor: "NOC", ramal: "101129" },
        { nome: "LUIZ EDUARDO COUTO", setor: "NOC", ramal: "101131" },
        { nome: "SAULO MULLER NOGUEIRA", setor: "NOC", ramal: "101134" },
        { nome: "GABRIEL TEODORO KUSS", setor: "NOC", ramal: "101139" },
        { nome: "CDRCGRCLIENTEESCALA", setor: "NOC", ramal: "101140" },
        { nome: "THIAGO EVERTON TELES", setor: "NOC", ramal: "101142" },
        { nome: "NOSC 12x36", setor: "NOC", ramal: "107445" },
        { nome: "NOSC 12x36", setor: "NOC", ramal: "107446" },
        { nome: "GUILHERME TAVARES PEREIRA", setor: "NOC", ramal: "371112" },
        { nome: "VALMOR VALDEVINO JUNIOR", setor: "Operacional", ramal: "101329" },
        { nome: "JEAN CARLOS ALVES RIBEIRO", setor: "Operacional", ramal: "105110" },
        { nome: "VALMOR VALDEVINO JUNIOR", setor: "Operacional", ramal: "352610" },
        { nome: "KETLIN MAYARA LENARTOVICZ", setor: "Qualidade", ramal: "107412" },
        { nome: "HENRIQUE GIOPPO ROMAN ROSS", setor: "Qualidade", ramal: "107413" },
        { nome: "LUIS GUSTAVO PORTELA", setor: "Qualidade", ramal: "805215" },
        { nome: "MAGALI APARECIDA DE LIMA", setor: "Recepção", ramal: "109010" },
        { nome: "LUCILENE TOIGO BELENS", setor: "RH", ramal: "106110" },
        { nome: "JOSIANE DE OLIVEIRA", setor: "RH", ramal: "106111" },
        { nome: "VANUSA SCAPINELLI", setor: "RH", ramal: "109110" },
        { nome: "PATRICIA DA LUZ", setor: "RH", ramal: "109112" },
        { nome: "SANDRA APARECIDA ADLER", setor: "RH", ramal: "166110" },
        { nome: "LUCIANO PADILHA DE MORAIS", setor: "RH", ramal: "166111" },
        { nome: "FRANCIELI LICHAK", setor: "RH", ramal: "166113" },
        { nome: "ANA PAULA MIRANDA DEFAVERI", setor: "RH", ramal: "166115" },
        { nome: "ELISANGELA BRUKER", setor: "RH", ramal: "606110" },
        { nome: "VINICIUS TORRES DAS NEVES", setor: "SAC", ramal: "371932" },
        { nome: "FABIANA CRISTINA RIBEIRO", setor: "SAC", ramal: "371935" },
        { nome: "AMANDA LEITE CONSTANTINO", setor: "SAC", ramal: "371937" },
        { nome: "WILKER MATHEUS CARVALHO", setor: "SAC", ramal: "371938" },
        { nome: "JULIA CAROLINA BUTEVICZ", setor: "SAC Financeiro", ramal: "101910" },
        { nome: "ADRIANO CASATTI SOARES", setor: "SAC Financeiro", ramal: "101911" },
        { nome: "GRAZIELA MARQUES", setor: "SAC Financeiro", ramal: "101912" },
        { nome: "FABIANA TEIXEIRA SPOTTI", setor: "SAC Financeiro", ramal: "371911" },
        { nome: "YARA JANAINA SILVA AGNES", setor: "SAC Financeiro", ramal: "371933" },
        { nome: "CINTHYA GABRIELLY DE OLIVEIRA", setor: "SAC Financeiro", ramal: "103410" },
        { nome: "JULIA CARLIM DOS REIS", setor: "SAC Financeiro", ramal: "103411" },
        { nome: "NATASHA NOELLE ALVES", setor: "SAC Financeiro", ramal: "373413" },
        { nome: "MARCOS MOREIRA", setor: "Segurança do Trabalho", ramal: "102510" },
        { nome: "GABRIEL MIOTTO SIQUEIRA", setor: "Suporte", ramal: "185011" },
        { nome: "ADRIANO GIO DICK", setor: "Suporte", ramal: "185012" },
        { nome: "BRUNO SBARAINI", setor: "Suporte", ramal: "185015" },
        { nome: "ROBERTO SILVA HINCKEL", setor: "Suporte", ramal: "185018" },
        { nome: "SUZAN LOUISE JUVINSKI", setor: "NOC", ramal: "371115" },
        { nome: "MANASSES GABRIEL BATISTI", setor: "NOC", ramal: "371122" },
        { nome: "VITOR LUIZ MANTOVANI", setor: "NOC", ramal: "371312" },
        { nome: "MAIKON DA ROCHA LEITE", setor: "Suporte", ramal: "371321" },
        { nome: "GIOVANE DE SOUZA BARBOSA DIAS", setor: "Suporte", ramal: "471043" },
        { nome: "LUIS FELIPE DE MARQUE", setor: "Suporte", ramal: "371325" },
        { nome: "JESSE FERNANDO BUENO", setor: "T.I.", ramal: "9021028" },
        { nome: "LUCAS ANANIAS SCHULTZ", setor: "T.I.", ramal: "9021030" },
        { nome: "JUMARIANA SOUZA BORBA", setor: "T.I.", ramal: "107025" },
        { nome: "LUCAS MARTINE BRASIL", setor: "T.I.", ramal: "171336" },
        { nome: "FABIO JUNGLOS", setor: "T.I.", ramal: "174910" },
        { nome: "JOAO CARLOS CAMPOS DA SILVA", setor: "T.I.", ramal: "181417" },
        { nome: "MATHEUS LUIZ PICININ", setor: "VOC", ramal: "101210" },
        { nome: "GERSON LEONARDO PIAIA", setor: "VOC", ramal: "101211" },
        { nome: "ALECXANDRO XAVIER JAQUES", setor: "VOC", ramal: "101212" },
        { nome: "GUILHERME DE CARVALHO", setor: "VOC", ramal: "101214" },
        { nome: "MATHEUS DE ALMEIDA", setor: "VOC", ramal: "101215" },
        { nome: "Evylyn Raissa Oliveira Da Silva", setor: "Comercial", ramal: "452010" },
        { nome: "Ana Laura Giembra", setor: "SAC Financeiro", ramal: "101913" },
        { nome: "Franciele De Souza", setor: "SAC Financeiro", ramal: "101914" },
        { nome: "Gabriela Garcia", setor: "SAC Financeiro", ramal: "101915" },
        { nome: "Isabelly Cristina Alves", setor: "SAC Financeiro", ramal: "101916" },
        { nome: "Karoline Nogueira De Moura", setor: "SAC Financeiro", ramal: "101917" },
        { nome: "Lucas Ryan Cordeiro", setor: "SAC Financeiro", ramal: "101918" },
        { nome: "Stephany Fernandes Pereira", setor: "SAC Financeiro", ramal: "101919" },
        { nome: "Talita Camargo Biela", setor: "SAC Financeiro", ramal: "101920" },
        { nome: "Melina Serra Andre", setor: "SAC Financeiro", ramal: "371912" },
        { nome: "Evelyn Cristhine Bueno Soares", setor: "SAC Financeiro", ramal: "371913" },
        { nome: "Adrea Caroline Lopes", setor: "CSA", ramal: "101055" },
        { nome: "Patrick Moraes Barbosa", setor: "CSA", ramal: "101056" },
        { nome: "Rafael Do Nascimento Antunes", setor: "CSA", ramal: "101057" },
        { nome: "Matheus Varela Stefanes", setor: "CSA", ramal: "101058" },
        { nome: "Vinicius Kammer de Assunção", setor: "CSA", ramal: "471031" },
        { nome: "Weslley Cristian Conceição", setor: "CSA", ramal: "471032" },
        { nome: "Eliabe de Castro Santos Júnior", setor: "CSA", ramal: "471033" },
        { nome: "Filipe Vieira Rosenbrock", setor: "CSA", ramal: "471034" },
        { nome: "Astro Pereira de Oliveira", setor: "CSA", ramal: "471035" },
        { nome: "Anna Júlia Massierer de Souza", setor: "CSA", ramal: "471036" },
        { nome: "Felipe Pereira da Silva Sabino", setor: "CSA", ramal: "471037" },
        { nome: "Felipe de Oliveira Piassa Costa", setor: "CSA", ramal: "471038" },
        { nome: "Gabriel da Silva Marcolla", setor: "CSA", ramal: "471039" },
        { nome: "Bruno Hamon Porto", setor: "CSA", ramal: "471040" },
        { nome: "Joao Victor Cunha", setor: "SAC", ramal: "371113" },
        { nome: "Higor Conceicao Rocha", setor: "CSA", ramal: "101059" },
        { nome: "Yury Bajuk Batista", setor: "CSA", ramal: "101060" },
        { nome: "Emanuel Cesar Xavier", setor: "CSA", ramal: "101061" },
        { nome: "Kessyla Yasmini Moldenhauer", setor: "CSA", ramal: "101062" },
        { nome: "Juliano Teodoro Goncalves", setor: "CSA", ramal: "101063" },
        { nome: "Andressa Aline Martins Dos Santos", setor: "CSA", ramal: "101064" },
        { nome: "Juan Jackson Pereira", setor: "CSA", ramal: "101065" },
        { nome: "Carolina Camargo Campos", setor: "CSA", ramal: "471044" },
        { nome: "Henrique Cesar Silva Nascimento", setor: "CSA", ramal: "471045" },
        { nome: "Alessandro Wagner Oliveira", setor: "NOC", ramal: "101143" },
        { nome: "Luiz Henrique da Silva Seibel", setor: "NOC", ramal: "101145" },
        { nome: "Jonatas Gabriel De Quadros Melo", setor: "NOC", ramal: "101146" },
        { nome: "Rebeca Pereira Mendes", setor: "NOC", ramal: "101147" },
        { nome: "Johel Paiva Lima", setor: "NOC", ramal: "101148" },
        { nome: "Luna Da Rocha Carvalho Terra", setor: "NOC", ramal: "101149" },
        { nome: "Andre Luis Evangelista Martins", setor: "NOC", ramal: "101150" },
        { nome: "FELIPE MAYER", setor: "NOC", ramal: "101117" },
        { nome: "ANDRE VINICIUS PEREIRA", setor: "NOC", ramal: "101118" },
        { nome: "LEONARDO CESAR SCOLARO", setor: "NOC", ramal: "101119" },
        { nome: "LEANDRO ANDRE ELIAS", setor: "NOC", ramal: "101120" },
        { nome: "WESLEY RUAN DOS SANTOS", setor: "NOC", ramal: "101122" },
        { nome: "EMANUELLY PIRES DE CAMARGO", setor: "NOC", ramal: "101121" },
        { nome: "IGOR KNUTZ RIBAS", setor: "NOC", ramal: "101123" },
        { nome: "EVERTON RAFAEL BELUCIO", setor: "NOC", ramal: "101110" },
        { nome: "Julio Cesar Dos Santos Arruda", setor: "CSA", ramal: "101066" },
        { nome: "Joao Paulo Marchinhacki", setor: "CSA", ramal: "101068" },
        { nome: "Ana Paula Ribeiro Susin", setor: "CSA", ramal: "101069" },
        { nome: "Pedro Alex Schneider Costa", setor: "AGENT", ramal: "101070" },
        { nome: "Gustavo Lima Vosgrau", setor: "CSA", ramal: "101071" },
        { nome: "Mauro heron Resende Morais", setor: "CSA", ramal: "101072" },
        { nome: "Thiago José Aques Schissel", setor: "CSA", ramal: "101073" },
        { nome: "Karlin Emanueli Correa", setor: "Logistica", ramal: "345217" },
        { nome: "Camila De Oliveira Campos", setor: "Logistica", ramal: "602012" },
        { nome: "Gissele Bueno", setor: "Logistica", ramal: "605212" },
        { nome: "Ana luiza Silva de Oliveira", setor: "Logistica", ramal: "605214" },
        { nome: "Gabriel Cremm da Silva", setor: "Comercial", ramal: "532026" },
        { nome: "Arilson Krindges", setor: "Logistica", ramal: "165211" },
        { nome: "Gustavo David Pires", setor: "Logistica", ramal: "605213" }
    ];


    const estilo = document.createElement('style');
    estilo.innerHTML = `
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

        #omni-painel {
            position: fixed; bottom: 100px; right: 20px; width: 270px;
            background-image: linear-gradient(rgba(4, 15, 30, 0.1), rgba(4, 15, 30, 0.8)), url('${LINK_IMAGEM_FUNDO}');
            background-size: cover; background-position: center;
            border-radius: 12px; overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.8), 0 0 10px rgba(0, 195, 255, 0.3);
            display: none; z-index: 2147483647;
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            border: 1px solid rgba(0, 195, 255, 0.4);
        }

        .omni-header {
            background-color: rgba(0, 0, 0, 0.6); padding: 12px 10px; text-align: center;
            color: #ffffff; font-size: 13px; font-weight: 600; letter-spacing: 1px;
            border-bottom: 1px solid rgba(0, 195, 255, 0.3); backdrop-filter: blur(4px);
        }
        #omni-ramal-texto { color: #00c3ff; font-size: 14px; margin-left: 5px; text-shadow: 0 0 5px rgba(0, 195, 255, 0.5); }

        .omni-busca-container { padding: 10px 20px 0 20px; position: relative; }
        #omni-input-busca {
            width: 100%; padding: 8px 12px 8px 30px; border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(0, 195, 255, 0.3);
            color: white; font-size: 13px; outline: none; backdrop-filter: blur(5px);
            box-sizing: border-box; transition: all 0.2s;
        }
        #omni-input-busca:focus { background-color: rgba(0, 0, 0, 0.6); border-color: #00c3ff; }
        #omni-input-busca::placeholder { color: rgba(255, 255, 255, 0.5); }
        .omni-icone-lupa { position: absolute; left: 28px; top: 17px; font-size: 12px; color: rgba(255,255,255,0.5); }

        #omni-lista-contatos {
            position: absolute; top: 45px; left: 20px; right: 20px;
            background: rgba(4, 15, 30, 0.95); border: 1px solid rgba(0, 195, 255, 0.5);
            border-radius: 8px; max-height: 200px; overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8); display: none; z-index: 10;
            padding: 5px 0; backdrop-filter: blur(10px);
        }
        #omni-lista-contatos::-webkit-scrollbar { width: 5px; }
        #omni-lista-contatos::-webkit-scrollbar-thumb { background: rgba(0, 195, 255, 0.5); border-radius: 5px; }

        .omni-contato-item { padding: 8px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.2s; display: flex; flex-direction: column; }
        .omni-contato-item:last-child { border-bottom: none; }
        .omni-contato-item:hover { background: rgba(0, 195, 255, 0.2); }
        .omni-contato-nome { color: #fff; font-size: 13px; font-weight: bold; }

        /* Cor especial para Filas */
        .omni-contato-item.is-fila .omni-contato-nome { color: #ffc107; font-weight: 800; }

        .omni-contato-detalhes { display: flex; justify-content: space-between; font-size: 11px; color: #aaa; margin-top: 3px; }
        .omni-contato-ramal { color: #00c3ff; font-weight: bold; }

        #omni-tela-teclado { padding: 15px 20px 20px 20px; }

        .omni-visor-bg {
            background-color: rgba(0, 0, 0, 0.65); padding: 8px; border-radius: 8px; margin-bottom: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); backdrop-filter: blur(6px);
            transition: all 0.2s;
        }
        /* Efeito visual de qual visor está selecionado */
        .omni-visor-bg.ativo-azul { border-color: #00c3ff; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8), 0 0 8px rgba(0, 195, 255, 0.4); }
        .omni-visor-bg.ativo-amarelo { border-color: #ffc107; box-shadow: inset 0 2px 8px rgba(0,0,0,0.8), 0 0 8px rgba(255, 193, 7, 0.4); }

        .omni-input {
            width: 100%; height: 30px; font-size: 22px; color: #ffffff; text-align: center;
            background: transparent; border: none; outline: none; font-weight: bold; letter-spacing: 2px;
        }
        .omni-input::placeholder { color: rgba(255, 255, 255, 0.5); font-weight: normal; font-size: 14px; letter-spacing: 0px;}

        .omni-visor-bg.transfer { border: 1px solid rgba(255, 193, 7, 0.4); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
        .omni-input.transfer { color: #ffc107; font-size: 20px;}
        .omni-input.transfer::placeholder { color: rgba(255, 193, 7, 0.5); }

        #omni-btn-transferir { background: rgba(255, 193, 7, 0.15); border: 1px solid rgba(255, 193, 7, 0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; transition: all 0.2s; border-radius: 50%; outline: none;}
        #omni-btn-transferir:hover { background: rgba(255, 193, 7, 0.3); box-shadow: 0 0 10px rgba(255, 193, 7, 0.4);}
        #omni-btn-transferir:active { transform: scale(0.9); }

        .omni-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .omni-btn-num { background: rgba(0, 0, 0, 0.55); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 12px 0; font-size: 19px; font-weight: 600; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px); text-shadow: 0 1px 3px rgba(0,0,0,0.8);}
        .omni-btn-num:hover { background: rgba(0, 0, 0, 0.7); border-color: rgba(0, 195, 255, 0.5); box-shadow: 0 0 10px rgba(0, 195, 255, 0.3); }
        .omni-btn-num:active { transform: scale(0.95); background: rgba(0, 195, 255, 0.3);}

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

        #omni-tela-chamada { padding: 40px 20px; text-align: center; display: none; background: rgba(217, 83, 79, 0.2); border-radius: 0 0 12px 12px; backdrop-filter: blur(8px);}
        .omni-piscar { animation: omni-piscar-anim 1s infinite alternate; }
        @keyframes omni-piscar-anim { from { color: #ff9999; } to { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.8); } }
        #omni-titulo-chamada { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #ffcccc; letter-spacing: 1px;}
        #omni-nome-chamador { font-size: 22px; color: white; font-weight: bold; margin-bottom: 40px; word-wrap: break-word; text-shadow: 0 2px 5px rgba(0,0,0,0.9);}
        #omni-btn-atender { background-color: #3db82e; color: white; border: 1px solid rgba(61, 184, 46, 0.8); border-radius: 50px; padding: 15px 20px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.5), 0 0 20px rgba(61, 184, 46, 0.4); width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.2s;}
        #omni-btn-atender:hover { background-color: #44cc33; box-shadow: 0 0 25px rgba(61, 184, 46, 0.6);}
        #omni-btn-atender:active { transform: scale(0.95); }
    `;
    document.head.appendChild(estilo);


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

            <div class="omni-busca-container">
                <span class="omni-icone-lupa">🔍</span>
                <input type="text" id="omni-input-busca" placeholder="Buscar Fila, Setor ou Nome..." autocomplete="off"/>
                <div id="omni-lista-contatos"></div>
            </div>

            <div id="omni-tela-teclado">
                <div class="omni-visor-bg ativo-azul" id="container-visor-ligar">
                    <input type="text" id="omni-visor" class="omni-input" placeholder="Ligar para..." autocomplete="off"/>
                </div>

                <div class="omni-visor-bg transfer" id="container-visor-transfer">
                    <input type="text" id="omni-visor-transfer" class="omni-input transfer" placeholder="Transferir para..." autocomplete="off"/>
                    <button id="omni-btn-transferir" title="Executar Transferência Direta">
                        <svg fill="#ffc107" viewBox="0 0 24 24" width="22px" height="22px"><path d="M16 11l-4-4v3H8c-2.76 0-5 2.24-5 5v2h2v-2c0-1.65 1.35-3 3-3h4v3l4-4z"/></svg>
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


    const botao = document.getElementById('omni-botao');
    const painel = document.getElementById('omni-painel');
    let isDragging = false; let dragStartX, dragStartY, initialLeft, initialTop;

    botao.addEventListener('mousedown', (e) => {
        isDragging = false; dragStartX = e.clientX; dragStartY = e.clientY;
        const rect = botao.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    });
    function onMouseMove(e) {
        const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            isDragging = true; botao.style.left = (initialLeft + dx) + 'px'; botao.style.top = (initialTop + dy) + 'px';
            botao.style.bottom = 'auto'; botao.style.right = 'auto';
        }
    }
    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
        if (!isDragging) {
            painel.style.display = painel.style.display === 'block' ? 'none' : 'block';
            if(painel.style.display === 'block') document.getElementById('omni-visor').focus();
        }
    }

    const visorLigar = document.getElementById('omni-visor');
    const visorTransferir = document.getElementById('omni-visor-transfer');
    const containerLigar = document.getElementById('container-visor-ligar');
    const containerTransferir = document.getElementById('container-visor-transfer');
    let inputAtivo = visorLigar;

    // Lógica para acender a borda do visor selecionado
    visorLigar.addEventListener('focus', () => {
        inputAtivo = visorLigar;
        containerLigar.classList.add('ativo-azul');
        containerTransferir.classList.remove('ativo-amarelo');
    });
    visorTransferir.addEventListener('focus', () => {
        inputAtivo = visorTransferir;
        containerTransferir.classList.add('ativo-amarelo');
        containerLigar.classList.remove('ativo-azul');
    });

    const limparCaracteres = function(e) { this.value = this.value.replace(/[^0-9]/g, ''); };
    visorLigar.addEventListener('input', limparCaracteres); visorTransferir.addEventListener('input', limparCaracteres);

    document.querySelectorAll('.omni-btn-num').forEach(btn => {
        btn.addEventListener('click', (e) => { inputAtivo.value += e.target.innerText; inputAtivo.focus(); });
    });
    document.getElementById('omni-btn-apagar').addEventListener('click', () => { inputAtivo.value = ''; inputAtivo.focus(); });

    visorLigar.addEventListener('keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-ligar').click(); }});
    visorTransferir.addEventListener('keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); document.getElementById('omni-btn-transferir').click(); }});

    document.getElementById('omni-btn-ligar').addEventListener('click', () => {
        if(visorLigar.value.length > 0) { GM_setValue('omni_comando', { acao: 'ligar', numero: visorLigar.value, ts: Date.now() }); painel.style.display = 'none'; visorLigar.value = ''; }
    });
    document.getElementById('omni-btn-transferir').addEventListener('click', () => {
        if(visorTransferir.value.length > 0) { GM_setValue('omni_comando', { acao: 'transferir', numero: visorTransferir.value, ts: Date.now() }); painel.style.display = 'none'; visorTransferir.value = ''; }
    });
    document.getElementById('omni-btn-desligar').addEventListener('click', () => { GM_setValue('omni_comando', { acao: 'desligar', ts: Date.now() }); painel.style.display = 'none';});
    document.getElementById('omni-btn-atender').addEventListener('click', () => { GM_setValue('omni_comando', { acao: 'atender', ts: Date.now() }); painel.style.display = 'none'; });


    const inputBusca = document.getElementById('omni-input-busca');
    const dropdownLista = document.getElementById('omni-lista-contatos');

    inputBusca.addEventListener('input', function() {
        const termo = this.value.toLowerCase().trim();
        dropdownLista.innerHTML = '';
        if (termo.length === 0) { dropdownLista.style.display = 'none'; return; }

        const filtrados = LISTA_DE_RAMAIS.filter(c =>
            c.nome.toLowerCase().includes(termo) ||
            c.setor.toLowerCase().includes(termo) ||
            c.ramal.includes(termo)
        );

        if (filtrados.length > 0) {
            dropdownLista.style.display = 'block';
            filtrados.forEach(contato => {
                const div = document.createElement('div');
                div.className = 'omni-contato-item';
                // Adiciona uma classe especial se for uma Fila (para ficar amarelo)
                if(contato.setor === "Fila") div.classList.add("is-fila");

                div.innerHTML = `
                    <span class="omni-contato-nome">${contato.nome}</span>
                    <div class="omni-contato-detalhes">
                        <span>${contato.setor}</span>
                        <span class="omni-contato-ramal">${contato.ramal}</span>
                    </div>
                `;
                div.addEventListener('click', () => {
                    inputAtivo.value = contato.ramal;
                    dropdownLista.style.display = 'none';
                    inputBusca.value = '';
                    inputAtivo.focus();
                });
                dropdownLista.appendChild(div);
            });
        } else {
            dropdownLista.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!inputBusca.contains(e.target) && !dropdownLista.contains(e.target)) { dropdownLista.style.display = 'none'; }
    });


    const ramalSalvo = GM_getValue('omni_ramal', '');
    if (ramalSalvo) document.getElementById('omni-ramal-texto').innerText = "| RAMAL: " + ramalSalvo;
    GM_addValueChangeListener('omni_ramal', (nome, antigo, novo) => { if (novo) document.getElementById('omni-ramal-texto').innerText = "| RAMAL: " + novo; });

    if (isSipulseTab) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") { Notification.requestPermission(); }
        let estadoChamada = false; let notificacaoJaDisparada = false;

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
                    notif.onclick = function() { window.focus(); const btnAtenderOrig = document.querySelector('button#call'); if (btnAtenderOrig) btnAtenderOrig.click(); this.close(); };
                    setTimeout(() => { notificacaoJaDisparada = false; }, 10000);
                }
            }
            else if (!textoDaTela.includes("Recebendo chamada de") && estadoChamada) {
                estadoChamada = false; GM_setValue('omni_estado', { status: 'livre', caller: '', ts: Date.now() });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        GM_addValueChangeListener('omni_comando', (nome, antigo, novo) => {
            if (novo.acao === 'atender') {
                const btnAtender = document.querySelector('button#call'); if (btnAtender) { btnAtender.click(); }
            }
            else if (novo.acao === 'ligar') {
                const inputOriginal = document.getElementById('displaySoftPhone'); const btnOriginal = document.querySelector('button.btn-call');
                if (inputOriginal && btnOriginal) {
                    inputOriginal.value = novo.numero; inputOriginal.dispatchEvent(new Event('input', { bubbles: true }));
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
                        if (btn) { btn.click(); await new Promise(resolve => setTimeout(resolve, 150)); }
                    }
                    setTimeout(() => { const btnCallOriginal = document.querySelector('button.btn-call'); if (btnCallOriginal) btnCallOriginal.click(); }, 300);
                };
                executarTransferencia();
            }
            else if (novo.acao === 'desligar') {
                const icons = Array.from(document.querySelectorAll('mat-icon'));
                const endIcon = icons.find(i => i.innerText.trim() === 'call_end');
                if (endIcon && endIcon.closest('button')) { endIcon.closest('button').click(); }
            }
        });
    }

    GM_addValueChangeListener('omni_estado', (nome, antigo, novo) => {
        const telaTeclado = document.getElementById('omni-tela-teclado');
        const telaChamada = document.getElementById('omni-tela-chamada');
        const barraBusca = document.querySelector('.omni-busca-container');

        if (novo.status === 'tocando') {
            document.getElementById('omni-nome-chamador').innerText = novo.caller;
            telaTeclado.style.display = 'none'; barraBusca.style.display = 'none'; telaChamada.style.display = 'block'; painel.style.display = 'block';
            botao.style.borderColor = '#ff6b6b'; botao.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.8), inset 0 0 10px rgba(255, 107, 107, 0.4)'; botao.querySelector('svg').style.stroke = '#ff6b6b';
        } else {
            telaChamada.style.display = 'none'; telaTeclado.style.display = 'block'; barraBusca.style.display = 'block';
            botao.style.borderColor = '#00c3ff'; botao.style.boxShadow = '0 5px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(0, 195, 255, 0.3)'; botao.querySelector('svg').style.stroke = '#00c3ff';
        }
    });
})();
