import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { videos } from "./videos";
import { TRANSITION_KEY } from "./transition";

console.log("main.ts carregado!");

OBR.onReady(async () => {

    console.log("OBR pronto!");

    const startButton =
        document.getElementById("start");

    const stopButton =
        document.getElementById("stop");

    console.log("Botão iniciar:", startButton);
    console.log("Botão parar:", stopButton);

    /*
     * Botão iniciar
     */

    startButton?.addEventListener(
        "click",
        async () => {

            console.log(
                "Botão iniciar clicado!"
            );

            const input =
                document.getElementById(
                    "videoId"
                );

            if (
                !(
                    input instanceof
                    HTMLInputElement
                )
            ) {

                console.error(
                    "videoId inválido."
                );

                return;
            }

            const escolha =
                Number(input.value);

            let transicao;

            /*
             * Escolha aleatória
             */

            if (
                escolha === 6
            ) {

                transicao =
                    videos[
                        Math.floor(
                            Math.random()
                            * videos.length
                        )
                    ];

            } else {

                transicao =
                    videos.find(
                        (v) =>
                            v.id ===
                            escolha
                    );

            }

            console.log(
                "Transição escolhida:",
                transicao
            );

            if (!transicao) {

                alert(
                    "Transição inválida."
                );

                return;
            }

            try {

                /*
                 * Tela preta
                 */

                if (
                    transicao.tipo ===
                    "black"
                ) {

                    await OBR.room.setMetadata({
                        [TRANSITION_KEY]: {
                            ativa: true,
                            tipo: "black"
                        }
                    });

                }

                /*
                 * Vídeo
                 */

                else {

                    await OBR.room.setMetadata({
                        [TRANSITION_KEY]: {
                            ativa: true,
                            tipo: "video",
                            video:
                                transicao.url
                        }
                    });

                }

                console.log(
                    "Transição iniciada!"
                );

                alert(
                    "Transição iniciada!"
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Erro ao iniciar a transição."
                );

            }

        }
    );

    /*
     * Botão parar
     */

    stopButton?.addEventListener(
        "click",
        async () => {

            console.log(
                "Botão parar clicado!"
            );

            try {

                await OBR.room.setMetadata({
                    [TRANSITION_KEY]: {
                        ativa: false
                    }
                });

                console.log(
                    "Transição encerrada!"
                );

                alert(
                    "Transição encerrada!"
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Erro ao encerrar a transição."
                );

            }

        }
    );

});

