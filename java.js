// CANVAS

    let canvasEl = document.querySelector("#jogo");
    let ctx = canvasEl.getContext('2d');
        ctx.imageSmoothingEnabled = false;

// SPRITE

    class Sprite{
        constructor(x, y, largura, altura, imagem){
            this.x = x;
            this.y = y;
            this.largura = largura;
            this.altura = altura;
            this.imagem = imagem;
        }   

        desenha(ctx)  {
            if (this.imagem) {
                ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
            } 
            else {
                ctx.fillRect(this.x, this.y, this.largura, this.altura);
            }
        }
    }

    
// IMAGENS 

    let imagemCorazaum = new Image();
        imagemCorazaum.src = 'imgs/corazaum.png';

    let imagemDino = new Image();
        imagemDino.src = 'imgs/dino.png';

    let imagemMeteoro = new Image();
        imagemMeteoro.src = 'imgs/inimigo.png';

// FUNÇÕES

    function desenhaJogo()  {
        ctx.clearRect(0, 0, 750, 500);

        for (let meteoro of meteoros) {
            meteoro.desenha(ctx);
        }
        
        for (let corazaum of corazauns){
            corazaum.desenha(ctx);
        }

        ctx.drawImage(imagemDino, x-40, y, 75, 75);
    }

// VARIAVEIS

    let x = 50;
    let y = 340;
    let altura = 0;
    
    let meteoros = [];
        meteoros.push(new Sprite((Math.random()+1)*window.innerHeight/2, altura, 100, 100, imagemMeteoro));
        meteoros.push(new Sprite((Math.random()+1)*window.innerHeight/2, altura, 100, 100, imagemMeteoro));

    let corazauns = [];
        corazauns.push(new Sprite(40, 40, 40, 40, imagemCorazaum));
        corazauns.push(new Sprite(90, 40, 40, 40, imagemCorazaum));
        corazauns.push(new Sprite(140, 40, 40, 40, imagemCorazaum));

// EVENTOS

    imagemCorazaum.addEventListener('load', () =>{
        desenhaJogo();
    });

    imagemDino.addEventListener('load', () =>{
        desenhaJogo();
    });

    canvasEl.addEventListener('mousemove', (evento) =>{
        x = evento.offsetX;
        desenhaJogo();    
    })

    canvasEl.addEventListener('click', (evento) =>{
        x = evento.offsetX;
        ctx.fillStyle = 'red';
        let tiro = new Sprite(x, y-50, 10, 20);
        tiro.desenha(ctx);        
    })