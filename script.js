// VARIÁVEIS CANVAS

    let canvasEl = document.querySelector("#jogo");
    let ctx = canvasEl.getContext('2d');
        ctx.imageSmoothingEnabled = false;

    const LARGURA_JOGO = 750;
    const ALTURA_JOGO = 500;

    let altura = 0;
    let x = 50;
    let y = 340;

// CLASSES

    class Sprite {
        constructor (x, y, largura, altura, imagem){
            this.x = x;
            this.y = y;
            this.largura = largura;
            this.altura = altura;
            this.imagem = imagem;
        }   

        desenha(ctx) {
            if (this.imagem) {
                ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
            } 
            else {
                ctx.fillStyle = 'red';
                ctx.fillRect(this.x, this.y, this.largura, this.altura);
            }
        }

        get centro() {
            return {
                x: this.x + this.largura/2,
                y: this.y + this.altura/2,
            }
        }
        
        colideCom(outraSprite) {
            let a = Math.abs(outraSprite.centro.x - this.centro.x);
            let b = Math.abs(outraSprite.centro.y - this.centro.y);
            let d = Math.sqrt(a ** 2 + b ** 2);
            let r1 = this.altura / 2;
            let r2 = outraSprite.altura / 2;

            return d <= r1 + r2;
        }
    }

    class Meteoro extends Sprite {
        constructor() {
            super (Math.random() * (LARGURA_JOGO - meteoros.largura) + meteoros.largura/2, altura, meteoros.largura, meteoros.altura, meteoros.imagem);
            this.velocidadeY = 3;
        }

        atualiza() {
            this.y += this.velocidadeY;
            if (this.y > ALTURA_JOGO) {
                this.x = Math.random() * (LARGURA_JOGO - meteoros.largura) + meteoros.largura/2;
                this.y = -80;
                pontos -= 5;
            }
        }

        destruir() {
            this.x = Math.random() * (LARGURA_JOGO - meteoros.largura) + meteoros.largura/2;
            this.y = -80;
        }
    }

    class Tiro extends Sprite {
        constructor() {
            super(x + 40, y, tiros.largura, tiros.altura);
            this.velocidadeY = 20;
        }

        atualiza(){
            this.y -= this.velocidadeY;

            if(this.y < 0){
                this.destruir = true;
            }
        }
    }

    class Animacao {
        constructor (duracao, inicial, final) {
            this.duracao = duracao;
            this.inicial = inicial;
            this.final = final;
            this.executando = false;
        }
    
        comecar() {
            this.horarioInicio = performance.now();
            this.t = 0;
            this.executando = true;
        }
    
        atualizar() {
            if (!this.executando) {
                return;
            }
    
            const horarioAgora = performance.now();
            const tempoQueSePassou = horarioAgora - this.horarioInicio;
    
            this.t = tempoQueSePassou / this.duracao;  
    
            if (this.t > 1) {
                this.t = 0;
                this.horarioInicio = horarioAgora;
            }
        }
                    
        get valor() {
            return this.t * (this.final - this.inicial) + this.inicial;
        }
    }

// IMAGENS 

    let imagemCorazaum = new Image();
        imagemCorazaum.src = 'imgs/corazaum.png';

    let imagemDino = new Image();
        imagemDino.src = 'imgs/dino.png';

    let imagemMeteoro = new Image();
        imagemMeteoro.src = 'imgs/inimigo.png';

    let imagemDinoCorre = new Image();
        imagemDinoCorre.src = 'imgs/dinoCorre.png'; 

// SPRITES

    const animacao = new Animacao(500, 0, 2);
    animacao.comecar(); 
    
    let dino = new Object();
        dino.x = x;
        dino.y = y;
        dino.largura = 75;
        dino.altura = 75;
        dino.imagem = imagemDino;
        dino = new Sprite(dino.x, dino.y, dino.largura, dino.altura, imagemDinoCorre);

    let meteoros = [];
        meteoros.x = Math.random() * LARGURA_JOGO - 100 /*largura do meteoro*/;
        meteoros.y = 0;
        meteoros.largura = 100;
        meteoros.altura = 100;
        meteoros.imagem = imagemMeteoro;
        meteoros.push(new Meteoro());
        meteoros.push(new Meteoro());
        meteoros.push(new Meteoro());

    let corazauns = [];
        corazauns.x = 40;
        corazauns.y = 40;
        corazauns.largura = 40;
        corazauns.altura = 40;
        corazauns.imagem = imagemCorazaum;
        corazauns.push(new Sprite(corazauns.x , corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));
        corazauns.push(new Sprite(corazauns.x + 50, corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));
        corazauns.push(new Sprite(corazauns.x + 100, corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));

    let tiros = [];
        tiros.x = x + 100;
        tiros.y = y - 10;
        tiros.largura = 10;
        tiros.altura = 20;
    
    let pontos = 0;
    let vidas = 4;

// FUNÇÕES

    function desenhaJogo()  {
        ctx.clearRect(0, 0, 750, 500);

        for (let meteoro of meteoros) {
            meteoro.desenha(ctx);
        }

        for (let corazaum of corazauns){
            corazaum.desenha(ctx);
        }

        for (let tiro of tiros){
            tiro.desenha(ctx);
        }

        ctx.font = '40px monospace';
        ctx.fillStyle = 'darkblue';
        ctx.fillText(pontos, 650, 60);
    }

    function atualizaLogica(){
        atualizaInimigos();
        atualizaTiros();
        verificaColisoes();

        desenhaJogo();
        atualizaAnimacao();
    }

    function atualizaInimigos() {
        for (let meteoro of meteoros){
            meteoro.atualiza();
        }
    }

    function atualizaTiros(){
        for(let tiro of tiros){
            tiro.atualiza();
        }

        for (let i = 0; i < tiros.length; i++){
            if (tiros[i].destruir) { 
                tiros.splice(i, 1);
            }
        }
    }

    function verificaColisoes(){
        for(let meteoro of meteoros) {
            const MeteoroAtingiuDino = meteoro.colideCom(dino);
            if (MeteoroAtingiuDino) {
                meteoro.destruir();
                corazauns.pop();
                vidas--;
                if (vidas==0){
                    alert('VOCÊ FOI EXTINTO ! :(');
                    corazauns.push(new Sprite(corazauns.x , corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));
                    corazauns.push(new Sprite(corazauns.x + 50, corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));
                    corazauns.push(new Sprite(corazauns.x + 100, corazauns.y, corazauns.largura, corazauns.altura, corazauns.imagem));
                    vidas = 4;
                    pontos = 0;
                }
            }
        }

        for (let meteoro of meteoros) {
            for (let tiro of tiros) {
                const tiroAtingiuMeteoro = tiro.colideCom(meteoro);
                    if (tiroAtingiuMeteoro) {
                        tiro.destruir = true;
                        meteoro.destruir();
                        pontos += 10;
                    }
            }
        }
    }

    function desenhaQuadro(quadro, x, y) {
        ctx.drawImage(
            imagemDinoCorre,
            quadro * 14,
            0,
            14,
            18,
            dino.x, dino.y, 75, 75
        );
    }

    function atualizaAnimacao() {
        animacao.atualizar();

        let quadro = animacao.valor;
        quadro = Math.floor(quadro);

        desenhaQuadro(quadro, x, y);
    }

    setInterval(atualizaLogica, 33);

// EVENTOS

    imagemCorazaum.addEventListener('load', () =>{
        desenhaJogo();
    });

    imagemDino.addEventListener('load', () =>{
        desenhaJogo();
    });

    canvasEl.addEventListener('mousemove', (evento) =>{
        dino.x = evento.offsetX;   
    });

    canvasEl.addEventListener('click', (evento) =>{
        x = evento.offsetX;
        tiro = tiros.push(new Tiro());   
    });
