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
     * -----------------------------
     * Overlay para os jogadores
     * -----------------------------
     */

    const role =
        await OBR.player.getRole();

    console.log("Cargo do jogador:", role);

    if (role !== "GM") {

        console.log("Criando overlay do jogador...");

        const overlay =
            document.createElement("div");

        overlay.id =
            "transition-overlay";

        overlay.style.position =
            "fixed";

        overlay.style.top =
            "0";

        overlay.style.left =
            "0";

        overlay.style.width =
            "100vw";

        overlay.style.height =
            "100vh";

        overlay.style.background =
            "black";

        overlay.style.zIndex =
            "999999";

        overlay.style.display =
            "none";

        const overlayVideo =
            document.createElement("video");

        overlayVideo.style.width =
            "100%";

        overlayVideo.style.height =
            "100%";

        overlayVideo.style.objectFit =
            "cover";

        overlayVideo.autoplay =
            true;

        overlayVideo.loop =
            true;

        overlayVideo.playsInline =
            true;

        overlayVideo.muted =
            true;

        overlayVideo.controls =
            false;

        overlayVideo.addEventListener(
            "contextmenu",
            (event) => {
                event.preventDefault();
            }
        );

        overlay.appendChild(
            overlayVideo
        );

        document.body.appendChild(
            overlay
        );

        OBR.room.onMetadataChange(
            (metadata) => {

                const data =
                    metadata[
                        TRANSITION_KEY
                    ] as
                    | {
                        ativa: boolean;
                        video?: string;
                    }
                    | undefined;

                console.log(
                    "Metadata recebida:",
                    data
                );

                if (
                    !data?.ativa ||
                    !data.video
                ) {

                    overlay.style.display =
                        "none";

                    overlayVideo.pause();

                    overlayVideo.src =
                        "";

                    return;
                }

                overlay.style.display =
                    "block";

                if (
                    overlayVideo.src !==
                    data.video
                ) {

                    overlayVideo.src =
                        data.video;

                    overlayVideo
                        .play()
                        .catch(
                            console.error
                        );

                }

            }
        );
    }

    /*
     * -----------------------------
     * Botão iniciar
     * -----------------------------
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
                Number(
                    input.value
                );

            let video;

            if (
                escolha === 5
            ) {

                video =
                    videos[
                        Math.floor(
                            Math.random()
                            * videos.length
                        )
                    ];

            } else {

                video =
                    videos.find(
                        (v) =>
                            v.id ===
                            escolha
                    );

            }

            if (!video) {

                alert(
                    "Vídeo inválido."
                );

                return;
            }

            try {

                await OBR.room.setMetadata({
                    [TRANSITION_KEY]: {
                        ativa: true,
                        video:
                            video.url
                    }
                });

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
     * -----------------------------
     * Botão parar
     * -----------------------------
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

