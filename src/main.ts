import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { videos } from "./videos";
import { TRANSITION_KEY } from "./transition";

console.log("main.ts carregado!");

OBR.onReady(() => {

    console.log("OBR pronto!");

    const startButton =
        document.getElementById("start");

    const stopButton =
        document.getElementById("stop");

    console.log("Botão iniciar:", startButton);
    console.log("Botão parar:", stopButton);

    startButton?.addEventListener("click", async () => {

        console.log("Botão iniciar clicado!");

        const input =
            document.getElementById("videoId");

        console.log("Input encontrado:", input);

        if (!(input instanceof HTMLInputElement)) {

            console.error("videoId não é um HTMLInputElement!");

            return;
        }

        const escolha =
            Number(input.value);

        console.log("Escolha:", escolha);

        let video;

        if (escolha === 5) {

            video =
                videos[
                    Math.floor(
                        Math.random()
                        * videos.length
                    )
                ];

            console.log("Vídeo aleatório:", video);

        } else {

            video =
                videos.find(
                    v => v.id === escolha
                );

            console.log("Vídeo selecionado:", video);

        }

        if (!video) {

            console.error("Vídeo inválido.");

            alert("Vídeo inválido.");

            return;
        }

        console.log("Tentando definir metadata...");

        try {

            await OBR.room.setMetadata({
                [TRANSITION_KEY]: {
                    ativa: true,
                    video: video.url
                }
            });

            console.log("Metadata enviada com sucesso!");

            alert("Transição iniciada!");

        } catch (error) {

            console.error(
                "Erro ao enviar metadata:",
                error
            );

            alert(
                "Erro ao iniciar transição. Veja o console."
            );
        }

    });

    stopButton?.addEventListener("click", async () => {

        console.log("Botão parar clicado!");

        try {

            await OBR.room.setMetadata({
                [TRANSITION_KEY]: {
                    ativa: false
                }
            });

            console.log("Transição encerrada!");

            alert("Transição encerrada!");

        } catch (error) {

            console.error(
                "Erro ao encerrar transição:",
                error
            );

            alert(
                "Erro ao encerrar transição. Veja o console."
            );
        }

    });

});