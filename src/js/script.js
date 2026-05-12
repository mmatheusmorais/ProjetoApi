// DECLARAÇÕES DOS ELEMENTOS USANDO DOM

const videoElemento = document.getElementById("Video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");

// FUNÇÃO QUE HABILITA A CÂMERA

async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"},// aciona a câmera traseira
            audio: false
        })
        videoElemento.srcObject = midia;
        //garante que o vídeo comece,
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a camera",erro
    }
}
// executa a função da câmera 
configurarCamera();

// função para ler o texto que a câmera pegar

botaoScanear.onclick = async ()=>{
    botaoScanear.disable=true; // habilita a câmera
    resultado.innerText="Fazendo a leitura...aguarde";

    //preparando o canvas para criar estrutura da câmera
    const contexto = canvas.getContext("2d");

    // ajustar o tamanho do canvas
    canvas.width = videoElemento.videoWidth; //largura
    canvas.height = videoElemento.videoHeight; //altura

    // reset para garantir que a foto não saia invertida
    contexto.setTransform(1, 0, 0, 1, 0, 0)

    // filtro de contraste e escala de cinza antes de tirar a foto
    // ajuda a evitar as letras aleatórias

    contexto.filter = 'contrast(1.2) graysclae(1)';
    try{
        const { data: { text }} =await Tesseract.recognize(
            canvas, // aonde o texto vai aparecer
            'por' // idioma do texto
        );
        // Remove espaços excessivos e caracteres especiais
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possivel identificar o texto";
    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar",erro
    }
    finally{
        // desabilita a câmera para fazer uma nova captura
        botaoScanear.disable=false; 
    }
}